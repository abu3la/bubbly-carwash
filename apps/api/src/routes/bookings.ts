import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';
import { createInvoice, getInvoice, invoiceMatches } from '../moyasar';
import { notifyTeamOfBooking } from '../dispatch';
import { notify } from '../notifications';

/**
 * Bookings.
 *
 * Creation is a single call to the `create_booking` Postgres function rather
 * than a sequence of statements here. Over PostgREST every statement is its own
 * transaction, so checking the club's weekly cap and then spending a credit
 * from the Worker leaves a gap where two taps both pass the check and both
 * spend the same last credit. The function runs in one transaction and takes
 * row locks, which closes it.
 */
export const bookingsRoute = new Hono<{ Bindings: Env }>();
bookingsRoute.use('*', requireAuth());

/** Errors the function raises, mapped to what the app is allowed to know. */
const KNOWN_FAILURES = new Set([
  'vehicleNotYours',
  'addressNotYours',
  'vehicleUnavailable',
  'addressUnavailable',
  'locationRequired',
  'outsideServiceArea',
  'fridayClosed',
  'unknownService',
  'unknownSlot',
  'slotInPast',
  'slotFull',
  'noMembership',
  'noClubCredits',
  'weeklyCapReached',
  'noPackageCredits',
]);

interface CreateBody {
  vehicleId?: string;
  addressId?: string;
  serviceKey?: string;
  /** ISO-8601 with offset, e.g. 2026-08-25T08:00:00+03:00. */
  slotStart?: string;
  source?: 'club' | 'cash';
  addOns?: string[];
}

bookingsRoute.get('/', async (c) => {
  const rows = await db(
    c.env,
    `bookings?profile_id=eq.${c.get('caller').id}` +
      '&select=*,vehicles(id,make,model,color,plate,size),addresses(id,label,line,district,city,lat,lng,notes),' +
      'services(key,name_ar,name_en),teams(id,name_ar,name_en),booking_add_ons(add_on_key,price_minor),' +
      'booking_media(id,phase,kind,angle,content_type,byte_size,created_at)' +
      '&order=scheduled_at.desc',
  );
  return c.json({ bookings: rows });
});

/** Metadata for the private before/after evidence attached to one booking. */
bookingsRoute.get('/:id/media', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [booking] = await db(
    c.env,
    `bookings?id=eq.${id}&profile_id=eq.${caller.id}&select=id`,
  );
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);

  const media = await db(
    c.env,
    `booking_media?booking_id=eq.${id}` +
      '&select=id,phase,kind,angle,content_type,byte_size,created_at' +
      '&order=phase,created_at',
  );
  return c.json({ media });
});

/** Stream one authorised customer's evidence from the private R2 bucket. */
bookingsRoute.get('/:id/media/:mediaId/content', async (c) => {
  if (!c.env.MEDIA) return c.json({ error: { code: 'storageUnavailable' } }, 503);
  const caller = c.get('caller');
  const id = c.req.param('id');
  const mediaId = c.req.param('mediaId');
  const [media] = await db<{ object_key: string; content_type: string }>(
    c.env,
    `booking_media?id=eq.${mediaId}&booking_id=eq.${id}` +
      `&bookings.profile_id=eq.${caller.id}` +
      '&select=object_key,content_type,bookings!inner(profile_id)',
  );
  if (!media) return c.json({ error: { code: 'notFound' } }, 404);

  const object = await c.env.MEDIA.get(media.object_key);
  if (!object) return c.json({ error: { code: 'notFound' } }, 404);

  const headers = new Headers({
    'Content-Type': media.content_type,
    'Cache-Control': 'private, max-age=300',
    ETag: object.httpEtag,
  });
  return new Response(object.body, { headers });
});

bookingsRoute.post('/', async (c) => {
  const caller = c.get('caller');
  const b = await c.req.json<CreateBody>();

  if (!b.vehicleId) return c.json({ error: { code: 'vehicleRequired' } }, 400);
  if (!b.addressId) return c.json({ error: { code: 'addressRequired' } }, 400);
  if (!b.serviceKey) return c.json({ error: { code: 'unknownService' } }, 400);
  if (!b.slotStart || Number.isNaN(Date.parse(b.slotStart))) {
    return c.json({ error: { code: 'unknownSlot' } }, 400);
  }
  // A booking in the past is always a client bug, and it would sit in the
  // technician's list forever.
  if (Date.parse(b.slotStart) < Date.now()) {
    return c.json({ error: { code: 'slotInPast' } }, 400);
  }

  const source = b.source ?? 'cash';
  if (!['club', 'cash'].includes(source)) {
    return c.json({ error: { code: 'badSource' } }, 400);
  }
  if (source === 'cash' && b.serviceKey !== 'exterior') {
    return c.json({ error: { code: 'serviceNotAvailableForSingleWash' } }, 409);
  }

  if (source === 'club') {
    const [membership] = await db<{ plan_id: string }>(
      c.env,
      `memberships?profile_id=eq.${caller.id}&state=eq.active&payment_confirmed=eq.true` +
        `&cycle_start=lte.${encodeURIComponent(b.slotStart)}&cycle_end=gt.${encodeURIComponent(b.slotStart)}` +
        '&select=plan_id&limit=1',
    );
    if (!membership) return c.json({ error: { code: 'noMembership' } }, 409);
    const includedService = membership.plan_id.startsWith('plus') ? 'full' : 'exterior';
    if (b.serviceKey !== includedService) {
      return c.json({ error: { code: 'serviceNotInPlan' } }, 409);
    }
  }

  try {
    await db(c.env, 'rpc/expire_pending_checkouts', { method: 'POST', body: {} });
    // The profile comes from the verified token, never from the body —
    // otherwise anyone could book against someone else's membership.
    const [booking] = await db(c.env, 'rpc/create_booking', {
      method: 'POST',
      body: {
        p_profile: caller.id,
        p_vehicle: b.vehicleId,
        p_address: b.addressId,
        p_service: b.serviceKey,
        p_slot_start: b.slotStart,
        p_source: source,
        p_add_ons: b.addOns ?? [],
        p_payment_confirmed: false,
      },
    });
    if (Number(booking.total_minor) === 0) {
      await db(c.env, `bookings?id=eq.${booking.id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { payment_confirmed: true },
      });
      booking.payment_confirmed = true;
      await notifyTeamOfBooking(c.env, booking.id).catch((error) => {
        console.warn('[dispatch] team notification failed after booking', error);
      });
      return c.json({ booking, checkoutUrl: null }, 201);
    }

    const origin = new URL(c.req.url).origin;
    const query = `kind=booking&id=${encodeURIComponent(booking.id)}`;
    try {
      const invoice = await createInvoice(c.env, {
        amount: Number(booking.total_minor),
        description: `BubblesCarWash - ${booking.ref}`,
        successUrl: `${origin}/payments/return?${query}&result=success`,
        backUrl: `${origin}/payments/return?${query}&result=cancel`,
        callbackUrl: `${origin}/webhooks/moyasar/invoice`,
        metadata: { booking_id: booking.id, profile_id: caller.id },
      });
      await db(c.env, 'payments', {
        method: 'POST', prefer: 'return=minimal',
        body: {
          profile_id: caller.id,
          booking_id: booking.id,
          amount_minor: Number(booking.total_minor),
          provider: 'moyasar',
          provider_ref: invoice.id,
        },
      });
      return c.json({ booking, checkoutUrl: invoice.url }, 201);
    } catch (error) {
      console.error('[bookings] payment checkout failed', error);
      await db(c.env, `bookings?id=eq.${booking.id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { status: 'cancelled', cancelled_at: new Date().toISOString() },
      });
      return c.json({ error: { code: 'paymentUnavailable' } }, 503);
    }
  } catch (err) {
    const text = err instanceof Error ? err.message : String(err);
    // The function raises named exceptions; anything else is ours, not the
    // customer's, and must not leak a Postgres message to the app.
    const known = [...KNOWN_FAILURES].find((code) => text.includes(code));
    if (known) return c.json({ error: { code: known } }, 409);
    console.error('[bookings] create failed', text);
    return c.json({ error: { code: 'unknown' } }, 500);
  }
});

bookingsRoute.post('/:id/confirm', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [booking] = await db<{ id: string; payment_confirmed: boolean; status: string }>(
    c.env,
    `bookings?id=eq.${id}&profile_id=eq.${caller.id}&select=id,payment_confirmed,status`,
  );
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ error: { code: 'cancelled' } }, 409);
  if (!booking.payment_confirmed) {
    const [payment] = await db<{ id: string; provider_ref: string; amount_minor: number }>(
      c.env,
      `payments?booking_id=eq.${id}&provider=eq.moyasar&select=id,provider_ref,amount_minor&order=created_at.desc&limit=1`,
    );
    if (!payment?.provider_ref) return c.json({ error: { code: 'paymentNotFound' } }, 409);
    const invoice = await getInvoice(c.env, payment.provider_ref);
    if (invoice.status !== 'paid') return c.json({ error: { code: 'paymentPending' } }, 409);
    if (!invoiceMatches(invoice, { amount: payment.amount_minor, profileId: caller.id, bookingId: id })) {
      return c.json({ error: { code: 'paymentMismatch' } }, 409);
    }
    await Promise.all([
      db(c.env, `bookings?id=eq.${id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { payment_confirmed: true },
      }),
      db(c.env, `payments?id=eq.${payment.id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { state: 'paid', updated_at: new Date().toISOString() },
      }),
    ]);
  }
  const [confirmed] = await db(
    c.env,
    `bookings?id=eq.${id}&select=*,vehicles(id,make,model,color,plate,size),addresses(id,label,line,district,city,lat,lng,notes),services(key,name_ar,name_en),teams(id,name_ar,name_en)`,
  );
  await notifyTeamOfBooking(c.env, id).catch((error) => {
    console.warn('[dispatch] team notification failed after payment', error);
  });
  return c.json({ booking: confirmed });
});

bookingsRoute.post('/:id/cancel', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');

  const [booking] = await db(
    c.env,
    `bookings?id=eq.${id}&profile_id=eq.${caller.id}&select=id,ref,status,stage,source,membership_id,purchase_id,technician_id`,
  );
  // Scoped to the caller, so a stranger's booking id reads as "not found"
  // rather than confirming it exists.
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ booking });
  // Once a technician has arrived the wash is under way; cancelling then is a
  // support conversation, not a button.
  if (booking.stage !== 'booked') {
    return c.json({ error: { code: 'alreadyStarted' } }, 409);
  }

  await db(c.env, `bookings?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: { status: 'cancelled', cancelled_at: new Date().toISOString() },
  });

  if (booking.technician_id) {
    await notify(c.env, {
      profileId: booking.technician_id,
      bookingId: id,
      kind: 'job_cancelled',
      titleAr: 'أُلغيت المهمة',
      titleEn: 'Job cancelled',
      bodyAr: `أُلغي الحجز ${booking.ref}`,
      bodyEn: `${booking.ref} was cancelled`,
      data: { route: '/jobs' },
    }).catch((error) => console.warn('[bookings] cancellation notification failed', error));
  }

  // Club usage is derived from non-cancelled appointments, so cancellation
  // frees that week's place without manufacturing a transferable credit.
  if (booking.source === 'package' && booking.purchase_id) {
    const [p] = await db(c.env, `package_purchases?id=eq.${booking.purchase_id}&select=credits_left`);
    if (p) {
      await db(c.env, `package_purchases?id=eq.${booking.purchase_id}`, {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: { credits_left: p.credits_left + 1 },
      });
    }
  }

  return c.json({ cancelled: true });
});
