import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth, requireRole } from '../middleware/auth';
import { db } from '../db';

/**
 * The technician's app.
 *
 * Every query is scoped to the caller's own `technician_id`. A technician sees
 * the customer's address and phone — which they need to do the job and must not
 * have for anyone else's job.
 */
export const driverRoute = new Hono<{ Bindings: Env }>();
driverRoute.use('*', requireAuth(), requireRole('driver'));

/**
 * The pipeline the customer watches, in order.
 *
 * Held here rather than in the app so a technician cannot skip a beat by
 * sending whichever value they like — the customer's tracking screen is
 * driven by exactly this.
 */
const ORDER = ['booked', 'arrived', 'washed', 'verified'] as const;
type Stage = (typeof ORDER)[number];

driverRoute.get('/jobs', async (c) => {
  const rows = await db(
    c.env,
    `bookings?technician_id=eq.${c.get('caller').id}` +
      '&status=in.(scheduled,active)' +
      '&select=id,ref,scheduled_at,ends_at,status,stage,service_key,total_minor,source,' +
      'vehicles(make,model,color,plate,size),' +
      'addresses(label,line,district,city,lat,lng,notes),' +
      'booking_add_ons(add_on_key)' +
      '&order=scheduled_at',
  );
  return c.json({ jobs: rows });
});

driverRoute.get('/jobs/done', async (c) => {
  const rows = await db(
    c.env,
    `bookings?technician_id=eq.${c.get('caller').id}&status=eq.done` +
      '&select=id,ref,scheduled_at,service_key,total_minor&order=scheduled_at.desc&limit=50',
  );
  return c.json({ jobs: rows });
});

driverRoute.post('/jobs/:id/stage', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const { stage, note } = await c.req.json<{ stage?: Stage; note?: string }>();

  if (!stage || !ORDER.includes(stage)) {
    return c.json({ error: { code: 'badStage' } }, 400);
  }

  const [booking] = await db(c.env, `bookings?id=eq.${id}&technician_id=eq.${caller.id}&select=id,stage,status`);
  // Scoped to this technician, so another's job reads as "not found" rather
  // than confirming it exists.
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ error: { code: 'cancelled' } }, 409);

  // Forward only, one beat at a time. Without this a mis-tap could mark a wash
  // verified before the technician has arrived, and the customer would be told
  // their car was finished.
  const from = ORDER.indexOf(booking.stage as Stage);
  const to = ORDER.indexOf(stage);
  if (to !== from + 1) {
    return c.json({ error: { code: to <= from ? 'alreadyPast' : 'skippedStage' } }, 409);
  }

  await db(c.env, `bookings?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: {
      stage,
      // The wash is under way from the moment someone arrives, and finished
      // when it is verified. Status follows the beat rather than being set by
      // hand, so the two can never disagree.
      status: stage === 'verified' ? 'done' : 'active',
    },
  });

  // Append-only: the booking holds the latest beat, this holds how it got
  // there — and who moved it, which an audit needs.
  await db(c.env, 'booking_events', {
    method: 'POST',
    prefer: 'return=minimal',
    body: { booking_id: id, stage, actor_id: caller.id, note: note?.trim() ?? '' },
  });

  const [updated] = await db(c.env, `bookings?id=eq.${id}&select=id,ref,stage,status`);
  return c.json({ booking: updated });
});
