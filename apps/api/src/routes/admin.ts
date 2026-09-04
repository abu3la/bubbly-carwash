import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth, requireRole } from '../middleware/auth';
import { db } from '../db';
import { assignBooking, assignmentFailure } from '../dispatch';
import { refundInvoice } from '../moyasar';
import { notify } from '../notifications';

/**
 * The back office.
 *
 * Everything here changes what customers are offered and charged, so it is
 * gated on the `admin` role — which lives in our `profiles` table, not in the
 * token. Reads are deliberately unfiltered: an administrator is meant to see
 * every customer's bookings, which is exactly what a customer must never do.
 */
export const adminRoute = new Hono<{ Bindings: Env }>();
adminRoute.use('*', requireAuth(), requireRole('admin'));

/** Money arrives as SAR from a form; the database stores halalas. */
const toMinor = (sar: unknown) =>
  typeof sar === 'number' && Number.isFinite(sar) ? Math.round(sar * 100) : undefined;

/* ------------------------------------------------------------------ packages */

adminRoute.get('/packages', async (c) => {
  // Inactive ones included: the dashboard needs to see what it has retired.
  const rows = await db(c.env, 'packages?order=id');
  return c.json({ packages: rows });
});

adminRoute.patch('/packages/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id)) return c.json({ error: { code: 'badId' } }, 400);

  const b = await c.req.json<{
    priceSar?: number;
    perSar?: number;
    savePct?: number;
    validDays?: number;
    best?: boolean;
    active?: boolean;
  }>();

  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  const per = toMinor(b.perSar);
  if (price !== undefined) patch.price_minor = price;
  if (per !== undefined) patch.per_minor = per;
  if (typeof b.savePct === 'number') patch.save_pct = Math.round(b.savePct);
  if (typeof b.validDays === 'number') patch.valid_days = Math.round(b.validDays);
  if (typeof b.active === 'boolean') patch.active = b.active;

  if (typeof b.best === 'boolean') {
    patch.best = b.best;
    // Only one package can wear the "best value" badge. Clearing the others
    // first stops the dashboard from producing two highlighted cards, which
    // reads as a bug to a customer.
    if (b.best) {
      await db(c.env, 'packages?best=eq.true', {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: { best: false },
      });
    }
  }

  if (Object.keys(patch).length === 0) {
    return c.json({ error: { code: 'nothingToUpdate' } }, 400);
  }

  const [row] = await db(c.env, `packages?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ package: row });
});

adminRoute.post('/packages', async (c) => {
  const b = await c.req.json<{
    id?: number;
    washes?: number;
    priceSar?: number;
    perSar?: number;
    savePct?: number;
    validDays?: number;
  }>();

  const price = toMinor(b.priceSar);
  if (!b.washes || b.washes < 1) return c.json({ error: { code: 'washesRequired' } }, 400);
  if (price === undefined) return c.json({ error: { code: 'priceRequired' } }, 400);

  const [row] = await db(c.env, 'packages', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      // The id doubles as the wash count in the seeded data, which keeps the
      // URL readable. Explicit id wins when given.
      id: b.id ?? b.washes,
      washes: b.washes,
      price_minor: price,
      per_minor: toMinor(b.perSar) ?? Math.round(price / b.washes),
      save_pct: b.savePct ?? 0,
      valid_days: b.validDays ?? 90,
    },
  });
  return c.json({ package: row }, 201);
});

/* ------------------------------------------------------ services and plans */

adminRoute.get('/services', async (c) => c.json({ services: await db(c.env, 'services?order=sort') }));

adminRoute.patch('/services/:key', async (c) => {
  const b = await c.req.json<{ priceSar?: number; minutes?: number; active?: boolean }>();
  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  if (price !== undefined) patch.price_minor = price;
  if (typeof b.minutes === 'number') patch.minutes = Math.round(b.minutes);
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `services?key=eq.${c.req.param('key')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ service: row });
});

adminRoute.get('/plans', async (c) => c.json({ plans: await db(c.env, 'plans?order=price_minor') }));

adminRoute.patch('/plans/:id', async (c) => {
  const b = await c.req.json<{
    priceSar?: number;
    weekly?: number;
    active?: boolean;
  }>();
  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  if (price !== undefined) patch.price_minor = price;
  if (typeof b.weekly === 'number') {
    if (![2, 3].includes(Math.round(b.weekly))) {
      return c.json({ error: { code: 'weeklyMustBeTwoOrThree' } }, 400);
    }
    patch.weekly = Math.round(b.weekly);
    patch.credits = Math.round(b.weekly);
    patch.roll = 0;
  }
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `plans?id=eq.${c.req.param('id')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ plan: row });
});

/* ------------------------------------------------------------------ bookings */

adminRoute.get('/bookings', async (c) => {
  const rows = await db(
    c.env,
    'bookings?payment_confirmed=eq.true&select=*,teams(id,name_ar),' +
      'profiles!bookings_profile_id_fkey(full_name,phone),' +
      'technician:profiles!bookings_technician_id_fkey(id,full_name,phone),' +
      'vehicles(make,model,color,plate,size),addresses(label,line,district,city,lat,lng,notes),' +
      'services(name_ar,name_en),booking_add_ons(add_on_key,price_minor),' +
      'booking_media(id,phase,kind,angle,content_type,byte_size,created_at),' +
      'payments(id,state,provider,provider_ref,amount_minor,created_at)' +
      '&order=scheduled_at.desc&limit=200',
  );
  return c.json({ bookings: rows });
});

/* --------------------------------------------------------------------- teams */

adminRoute.get('/teams', async (c) => {
  const [rows, members] = await Promise.all([
    db<{ id: string } & Record<string, unknown>>(c.env, 'teams?order=sort'),
    db<{ team_id: string; profile_id: string; active: boolean; available: boolean; is_lead: boolean; shift_start: string; shift_end: string; profiles: unknown }>(
      c.env,
      'team_members?select=team_id,profile_id,active,available,is_lead,shift_start,shift_end,profiles!inner(id,full_name,phone,active)&order=is_lead.desc,updated_at',
    ),
  ]);
  return c.json({ teams: rows.map((team) => ({
    ...team,
    members: members.filter((member) => member.team_id === team.id),
  })) });
});

adminRoute.patch('/teams/:id', async (c) => {
  const teamId = c.req.param('id');
  const [existing] = await db(c.env, `teams?id=eq.${teamId}&select=id`);
  if (!existing) return c.json({ error: { code: 'notFound' } }, 404);

  const b = await c.req.json<{
    lat?: number;
    lng?: number;
    serviceRadiusKm?: number;
    dailyCapacity?: number;
    active?: boolean;
  }>();
  const patch: Record<string, unknown> = {};
  if (typeof b.lat === 'number' && Number.isFinite(b.lat) && b.lat >= -90 && b.lat <= 90) patch.lat = b.lat;
  if (typeof b.lng === 'number' && Number.isFinite(b.lng) && b.lng >= -180 && b.lng <= 180) patch.lng = b.lng;
  if (typeof b.serviceRadiusKm === 'number' && b.serviceRadiusKm > 0) {
    patch.service_radius_km = b.serviceRadiusKm;
  }
  if (typeof b.dailyCapacity === 'number'
    && Number.isFinite(b.dailyCapacity)
    && b.dailyCapacity >= 1
    && b.dailyCapacity <= 40) {
    patch.daily_capacity = Math.round(b.dailyCapacity);
  } else if (b.dailyCapacity !== undefined) {
    return c.json({ error: { code: 'dailyCapacityOutOfRange' } }, 400);
  }
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  // The trial deliberately runs one team. Activating another team hands the
  // pilot to it instead of accidentally leaving two teams live.
  if (b.active) {
    await db(c.env, `teams?id=neq.${teamId}&active=eq.true`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: { active: false },
    });
  }

  const [row] = await db(c.env, `teams?id=eq.${teamId}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  return c.json({ team: row });
});

/* -------------------------------------------------------------- technicians */

/**
 * The people doing the washes.
 *
 * A technician is created here rather than signing themselves up: a stranger
 * must not be able to become staff by entering a phone number. The admin
 * creates the auth user, and the technician then signs in with the ordinary OTP
 * flow — same login as everyone, different role.
 */
adminRoute.get('/technicians', async (c) => {
  const [rows, invites] = await Promise.all([
    db(c.env,
      'profiles?role=eq.driver&select=id,full_name,phone,active,created_at,' +
        'team_members(team_id,active,available,is_lead,shift_start,shift_end,teams(id,name_ar,active))' +
        '&order=created_at'),
    db<{ phone: string; full_name: string; team_id: string; available: boolean; is_lead: boolean; shift_start: string; shift_end: string; created_at: string; teams: unknown }>(
      c.env,
      'driver_invites?active=eq.true&accepted_at=is.null&select=phone,full_name,team_id,available,is_lead,shift_start,shift_end,created_at,teams(id,name_ar,active)&order=created_at',
    ),
  ]);
  return c.json({ technicians: [
    ...rows,
    ...invites.map((invite) => ({
      id: `invite:${invite.phone}`,
      full_name: invite.full_name,
      phone: invite.phone,
      active: true,
      pending: true,
      created_at: invite.created_at,
      team_members: [{
        team_id: invite.team_id,
        active: true,
        available: invite.available,
        is_lead: invite.is_lead,
        shift_start: invite.shift_start,
        shift_end: invite.shift_end,
        teams: invite.teams,
      }],
    })),
  ] });
});

const SAUDI_MOBILE = /^\+9665\d{8}$/;

adminRoute.post('/technicians', async (c) => {
  const b = await c.req.json<{ phone?: string; name?: string; teamId?: string }>();
  if (!b.phone || !SAUDI_MOBILE.test(b.phone)) {
    return c.json({ error: { code: 'invalidPhone' } }, 400);
  }
  if (!b.name?.trim()) return c.json({ error: { code: 'nameRequired' } }, 400);
  if (!b.teamId) return c.json({ error: { code: 'teamRequired' } }, 400);
  const [team] = await db(c.env, `teams?id=eq.${encodeURIComponent(b.teamId)}&select=id`);
  if (!team) return c.json({ error: { code: 'teamNotFound' } }, 404);

  // Existing customers are promoted deliberately. This also avoids asking
  // Supabase Auth to create a duplicate identity for the same phone number.
  const [knownProfile] = await db<{ id: string }>(
    c.env,
    `profiles?phone=eq.${encodeURIComponent(b.phone)}&select=id&limit=1`,
  );
  if (knownProfile) {
    const [row] = await db(c.env, `profiles?id=eq.${knownProfile.id}`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: { role: 'driver', full_name: b.name.trim(), active: true },
    });
    await db(c.env, 'team_members?on_conflict=profile_id', {
      method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: {
        team_id: b.teamId, profile_id: knownProfile.id, active: true, available: true,
        is_lead: false, shift_start: '08:00', shift_end: '22:00', updated_at: new Date().toISOString(),
      },
    });
    return c.json({ technician: row }, 200);
  }

  // The identity is created by the ordinary OTP flow. The signed invite is
  // consumed on first login and promotes exactly this phone into the team.
  const [invite] = await db(c.env, 'driver_invites?on_conflict=phone', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      phone: b.phone,
      full_name: b.name.trim(),
      team_id: b.teamId,
      created_by: c.get('caller').id,
      active: true,
      accepted_by: null,
      accepted_at: null,
      updated_at: new Date().toISOString(),
    },
  });
  return c.json({ technician: { id: `invite:${b.phone}`, full_name: b.name.trim(), phone: b.phone, pending: true, team_id: b.teamId, ...invite } }, 201);
});

adminRoute.put('/technicians/:id/team', async (c) => {
  const technicianId = c.req.param('id');
  const body = await c.req.json<{
    teamId?: string | null;
    available?: boolean;
    isLead?: boolean;
    shiftStart?: string;
    shiftEnd?: string;
  }>();
  const [technician] = await db(
    c.env,
    `profiles?id=eq.${technicianId}&role=eq.driver&select=id`,
  );
  if (!technician) return c.json({ error: { code: 'notFound' } }, 404);

  if (body.teamId === null) {
    await db(c.env, `team_members?profile_id=eq.${technicianId}`, {
      method: 'DELETE', prefer: 'return=minimal',
    });
    return c.json({ membership: null });
  }
  if (!body.teamId) return c.json({ error: { code: 'teamRequired' } }, 400);
  const [team] = await db(c.env, `teams?id=eq.${encodeURIComponent(body.teamId)}&select=id`);
  if (!team) return c.json({ error: { code: 'teamNotFound' } }, 404);
  const clock = /^([01]\d|2[0-3]):[0-5]\d$/;
  if ((body.shiftStart && !clock.test(body.shiftStart)) || (body.shiftEnd && !clock.test(body.shiftEnd))) {
    return c.json({ error: { code: 'badShift' } }, 400);
  }

  const [membership] = await db(c.env, 'team_members?on_conflict=profile_id', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      team_id: body.teamId,
      profile_id: technicianId,
      active: true,
      available: body.available ?? true,
      is_lead: body.isLead ?? false,
      shift_start: body.shiftStart ?? '08:00',
      shift_end: body.shiftEnd ?? '22:00',
      updated_at: new Date().toISOString(),
    },
  });
  return c.json({ membership });
});

adminRoute.patch('/technicians/:id', async (c) => {
  const b = await c.req.json<{ active?: boolean; name?: string }>();
  const patch: Record<string, unknown> = {};
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (b.name?.trim()) patch.full_name = b.name.trim();
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `profiles?id=eq.${c.req.param('id')}&role=eq.driver`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ technician: row });
});

/** Dispatch: put a booking in a technician's list. */
adminRoute.patch('/bookings/:id/assign', async (c) => {
  const b = await c.req.json<{ technicianId?: string | null }>();
  if (!b.technicianId) {
    const [row] = await db(c.env, `bookings?id=eq.${c.req.param('id')}&status=in.(scheduled,active)`, {
      method: 'PATCH',
      prefer: 'return=representation',
      body: { technician_id: null },
    });
    if (!row) return c.json({ error: { code: 'notFound' } }, 404);
    return c.json({ booking: row });
  }
  try {
    return c.json({ booking: await assignBooking(c.env, c.req.param('id'), b.technicianId, c.get('caller').id) });
  } catch (error) {
    const code = assignmentFailure(error);
    if (code) return c.json({ error: { code } }, code === 'bookingNotFound' ? 404 : 409);
    throw error;
  }
});

adminRoute.get('/bookings/:id/media/:mediaId/content', async (c) => {
  if (!c.env.MEDIA) return c.json({ error: { code: 'storageUnavailable' } }, 503);
  const [media] = await db<{ object_key: string; content_type: string }>(
    c.env,
    `booking_media?id=eq.${c.req.param('mediaId')}&booking_id=eq.${c.req.param('id')}&select=object_key,content_type`,
  );
  if (!media) return c.json({ error: { code: 'notFound' } }, 404);
  const object = await c.env.MEDIA.get(media.object_key);
  if (!object) return c.json({ error: { code: 'notFound' } }, 404);
  return new Response(object.body, {
    headers: { 'Content-Type': media.content_type, 'Cache-Control': 'private, max-age=300', ETag: object.httpEtag },
  });
});

adminRoute.get('/incidents', async (c) => {
  const rows = await db(
    c.env,
    'operations_incidents?select=id,booking_id,category,note,status,created_at,resolved_at,' +
      'bookings(ref,team_id),profiles!operations_incidents_reported_by_fkey(full_name,phone)' +
      '&order=created_at.desc&limit=200',
  );
  return c.json({ incidents: rows });
});

adminRoute.patch('/incidents/:id/resolve', async (c) => {
  const caller = c.get('caller');
  const [row] = await db(c.env, `operations_incidents?id=eq.${c.req.param('id')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: { status: 'resolved', resolved_by: caller.id, resolved_at: new Date().toISOString() },
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ incident: row });
});

adminRoute.get('/operations', async (c) => {
  const now = new Date().toISOString();
  const stale = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const [unassigned, active, incidents, failedPayments, disabledTokens] = await Promise.all([
    db(c.env, `bookings?payment_confirmed=eq.true&status=eq.scheduled&technician_id=is.null&scheduled_at=gte.${encodeURIComponent(now)}&select=id`),
    db(c.env, `bookings?status=eq.active&scheduled_at=lt.${encodeURIComponent(stale)}&select=id`),
    db(c.env, 'operations_incidents?status=eq.open&select=id'),
    db(c.env, 'payments?state=eq.failed&select=id'),
    db(c.env, 'device_push_tokens?active=eq.false&select=id'),
  ]);
  return c.json({
    checkedAt: now,
    unassignedBookings: unassigned.length,
    staleActiveBookings: active.length,
    openIncidents: incidents.length,
    failedPayments: failedPayments.length,
    invalidPushTokens: disabledTokens.length,
    firebaseConfigured: Boolean(c.env.FIREBASE_PROJECT_ID && c.env.FIREBASE_CLIENT_EMAIL && c.env.FIREBASE_PRIVATE_KEY),
    smsMode: c.env.DEV_FIXED_OTP ? 'development-code' : c.env.TAQNYAT_BEARER && c.env.TAQNYAT_SENDER ? 'taqnyat' : 'not-configured',
    paymentMode: c.env.MOYASAR_SECRET_KEY?.startsWith('sk_live_') ? 'live' : c.env.MOYASAR_SECRET_KEY ? 'test' : 'not-configured',
  });
});

adminRoute.post('/payments/:id/refund', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<{ reason?: string }>();
  if (!body.reason?.trim() || body.reason.trim().length < 4) {
    return c.json({ error: { code: 'refundReasonRequired' } }, 400);
  }
  const [payment] = await db<{
    id: string; profile_id: string; booking_id: string | null; membership_id: string | null;
    amount_minor: number; state: string; provider_ref: string;
  }>(c.env, `payments?id=eq.${c.req.param('id')}&provider=eq.moyasar&select=id,profile_id,booking_id,membership_id,amount_minor,state,provider_ref`);
  if (!payment) return c.json({ error: { code: 'notFound' } }, 404);
  if (payment.state !== 'paid') return c.json({ error: { code: 'paymentNotRefundable' } }, 409);

  try {
    const refunded = await refundInvoice(c.env, payment.provider_ref);
    await db(c.env, 'payment_refunds', {
      method: 'POST', prefer: 'return=minimal', body: {
        payment_id: payment.id,
        provider_payment_ref: refunded.paymentId,
        amount_minor: refunded.amount,
        reason: body.reason.trim(),
        requested_by: caller.id,
      },
    });
    await db(c.env, `payments?id=eq.${payment.id}`, {
      method: 'PATCH', prefer: 'return=minimal', body: { state: 'refunded', updated_at: new Date().toISOString() },
    });
    if (payment.booking_id) {
      await db(c.env, `bookings?id=eq.${payment.booking_id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { status: 'cancelled', cancelled_at: new Date().toISOString() },
      });
    }
    if (payment.membership_id) {
      await Promise.all([
        db(c.env, `memberships?id=eq.${payment.membership_id}`, {
          method: 'PATCH', prefer: 'return=minimal', body: { state: 'cancelled', cancelled_at: new Date().toISOString() },
        }),
        db(c.env, `bookings?membership_id=eq.${payment.membership_id}&status=eq.scheduled&stage=eq.booked`, {
          method: 'PATCH', prefer: 'return=minimal', body: { status: 'cancelled', cancelled_at: new Date().toISOString() },
        }),
      ]);
    }
    await notify(c.env, {
      profileId: payment.profile_id,
      bookingId: payment.booking_id,
      kind: 'payment_refunded',
      titleAr: 'تم استرجاع المبلغ',
      titleEn: 'Payment refunded',
      bodyAr: `تمت إعادة ${(refunded.amount / 100).toFixed(2)} ر.س إلى وسيلة الدفع.`,
      bodyEn: `${(refunded.amount / 100).toFixed(2)} SAR was returned to your payment method.`,
    });
    return c.json({ refunded: true, amountMinor: refunded.amount });
  } catch (error) {
    console.error('[admin] refund failed', error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('paymentNotRefundable')) return c.json({ error: { code: 'paymentNotRefundable' } }, 409);
    return c.json({ error: { code: 'refundFailed' } }, 502);
  }
});
