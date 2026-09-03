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
      'booking_add_ons(add_on_key),' +
      'booking_media(id,phase,kind,angle,content_type,byte_size,created_at)' +
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

  // Evidence is part of completing the work, not an optional attachment. A
  // wash cannot be marked complete without a before record, or verified
  // without an after record.
  const requiredPhase = stage === 'washed' ? 'before' : stage === 'verified' ? 'after' : null;
  if (requiredPhase) {
    const evidence = await db(
      c.env,
      `booking_media?booking_id=eq.${id}&phase=eq.${requiredPhase}&select=id&limit=1`,
    );
    if (!evidence.length) {
      return c.json({ error: { code: `${requiredPhase}MediaRequired` } }, 409);
    }
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

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
]);
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};
const ANGLES = new Set(['general', 'front', 'rear', 'left', 'right', '360']);
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

/** Upload private before/after evidence directly into the bound R2 bucket. */
driverRoute.post('/jobs/:id/media', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const phase = c.req.query('phase');
  const angle = c.req.query('angle') ?? 'general';
  const contentType = (c.req.header('content-type') ?? '').split(';')[0].toLowerCase();
  const byteSize = Number(c.req.header('content-length') ?? c.req.header('x-file-size'));

  if (!c.env.MEDIA) return c.json({ error: { code: 'storageUnavailable' } }, 503);
  if (phase !== 'before' && phase !== 'after') {
    return c.json({ error: { code: 'badMediaPhase' } }, 400);
  }
  if (!ANGLES.has(angle)) return c.json({ error: { code: 'badMediaAngle' } }, 400);
  if (!ALLOWED_TYPES.has(contentType)) return c.json({ error: { code: 'badMediaType' } }, 415);
  if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_MEDIA_BYTES) {
    return c.json({ error: { code: 'badMediaSize' } }, 413);
  }

  const [booking] = await db<{ id: string; stage: Stage; status: string }>(
    c.env,
    `bookings?id=eq.${id}&technician_id=eq.${caller.id}&select=id,stage,status`,
  );
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ error: { code: 'cancelled' } }, 409);
  if ((phase === 'before' && booking.stage !== 'arrived') || (phase === 'after' && booking.stage !== 'washed')) {
    return c.json({ error: { code: 'mediaWrongStage' } }, 409);
  }

  const body = c.req.raw.body;
  if (!body) return c.json({ error: { code: 'badMediaSize' } }, 400);

  const mediaId = crypto.randomUUID();
  const objectKey = `bookings/${id}/${phase}/${mediaId}.${EXTENSIONS[contentType]}`;
  await c.env.MEDIA.put(objectKey, body, {
    httpMetadata: { contentType },
    customMetadata: { bookingId: id, phase, angle, uploadedBy: caller.id },
  });

  try {
    const [media] = await db(c.env, 'booking_media', {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        id: mediaId,
        booking_id: id,
        phase,
        kind: contentType.startsWith('image/') ? 'photo' : 'video',
        angle,
        object_key: objectKey,
        content_type: contentType,
        byte_size: byteSize,
        uploaded_by: caller.id,
      },
    });
    return c.json({ media }, 201);
  } catch (error) {
    // Do not leave an unowned object in R2 if its database record fails.
    await c.env.MEDIA.delete(objectKey);
    throw error;
  }
});
