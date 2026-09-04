import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';
import { createInvoice, getInvoice, invoiceMatches, refundInvoice } from '../moyasar';
import { notifyTeamOfBooking } from '../dispatch';
import { notify } from '../notifications';

export const membershipsRoute = new Hono<{ Bindings: Env }>();
membershipsRoute.use('*', requireAuth());

interface SignupSlot {
  vehicleId?: string;
  addressId?: string;
  serviceKey?: string;
  slotStart?: string;
  addOns?: string[];
}

interface ValidatedSignupSlot {
  vehicleId: string;
  addressId: string;
  serviceKey: string;
  slotStart: string;
  addOns: string[];
}

const DAY_MS = 86_400_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const terminalScheduleErrors = [
  'slotFull',
  'outsideServiceArea',
  'slotInPast',
  'weeklyCapReached',
  'scheduleIncomplete',
  'vehicleNotYours',
  'addressNotYours',
  'vehicleUnavailable',
  'addressUnavailable',
  'unknownService',
  'unknownSlot',
  'fridayClosed',
  'noMembership',
] as const;

function isTerminalScheduleError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return terminalScheduleErrors.some((code) => message.includes(code));
}

/** Saudi Arabia has no DST, so shifting three hours yields stable local parts. */
function riyadhSlotParts(stamp: number) {
  const local = new Date(stamp + 3 * 60 * 60 * 1000).toISOString();
  return { date: local.slice(0, 10), time: local.slice(11, 16) };
}

interface MembershipRow {
  id: string;
  plan_id: string;
  state: string;
  cycle_start: string;
  cycle_end: string;
  payment_confirmed: boolean;
  plans: { id: string; name_ar: string; name_en: string; price_minor: number; weekly: number };
}

membershipsRoute.get('/current', async (c) => {
  const caller = c.get('caller');
  const [membership] = await db<MembershipRow>(
    c.env,
    `memberships?profile_id=eq.${caller.id}&state=eq.active&payment_confirmed=eq.true&cycle_end=gt.${encodeURIComponent(new Date().toISOString())}` +
      '&select=id,plan_id,state,cycle_start,cycle_end,payment_confirmed,plans(id,name_ar,name_en,price_minor,weekly)' +
      '&order=created_at.desc&limit=1',
  );
  if (!membership) return c.json({ membership: null });

  const [usage] = await db<number>(c.env, 'rpc/club_week_used', {
    method: 'POST',
    body: { p_membership: membership.id, at: new Date().toISOString() },
  });
  return c.json({ membership: { ...membership, usedThisWeek: Number(usage ?? 0) } });
});

membershipsRoute.post('/checkout', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<{ planId?: string; slots?: SignupSlot[] }>();
  await db(c.env, 'rpc/expire_pending_checkouts', { method: 'POST', body: {} });
  const [plan] = await db<{ id: string; name_ar: string; price_minor: number; weekly: number }>(
    c.env,
    `plans?id=eq.${encodeURIComponent(body.planId ?? '')}&active=eq.true&select=id,name_ar,price_minor,weekly`,
  );
  if (!plan) return c.json({ error: { code: 'unknownPlan' } }, 400);
  if (!Array.isArray(body.slots) || body.slots.length !== plan.weekly) {
    return c.json({ error: { code: 'scheduleIncomplete' } }, 400);
  }
  const includedService = plan.id.startsWith('plus') ? 'full' : 'exterior';

  const now = Date.now();
  const cycleEnd = new Date(now + 30 * DAY_MS);
  const firstWeekEnd = now + 7 * DAY_MS;
  const seen = new Set<string>();
  const seenDays = new Set<string>();
  const baseSlots: ValidatedSignupSlot[] = [];
  for (const slot of body.slots) {
    if (!slot.vehicleId || !slot.addressId || !slot.serviceKey || !slot.slotStart) {
      return c.json({ error: { code: 'scheduleIncomplete' } }, 400);
    }
    if (slot.serviceKey !== includedService) {
      return c.json({ error: { code: 'serviceNotInPlan' } }, 400);
    }
    if (slot.addOns?.length) {
      return c.json({ error: { code: 'addOnsNotAllowedAtSignup' } }, 400);
    }
    if (!UUID.test(slot.vehicleId) || !UUID.test(slot.addressId)) {
      return c.json({ error: { code: 'scheduleIncomplete' } }, 400);
    }
    const time = Date.parse(slot.slotStart);
    if (!Number.isFinite(time) || time <= now) return c.json({ error: { code: 'slotInPast' } }, 400);
    if (time > firstWeekEnd) return c.json({ error: { code: 'scheduleOutsideFirstWeek' } }, 400);
    const riyadh = new Date(new Date(slot.slotStart).toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
    if (riyadh.getDay() === 5) return c.json({ error: { code: 'fridayClosed' } }, 400);
    if (seen.has(slot.slotStart)) return c.json({ error: { code: 'duplicateSlot' } }, 400);
    const localDay = riyadhSlotParts(time).date;
    if (seenDays.has(localDay)) return c.json({ error: { code: 'oneWashPerDay' } }, 400);
    seen.add(slot.slotStart);
    seenDays.add(localDay);
    baseSlots.push({
      vehicleId: slot.vehicleId,
      addressId: slot.addressId,
      serviceKey: slot.serviceKey,
      slotStart: slot.slotStart,
      addOns: [],
    });
  }

  const expandedSlots: ValidatedSignupSlot[] = [];
  for (const slot of baseSlots) {
    const [[vehicle], [address]] = await Promise.all([
      db<{ id: string }>(c.env, `vehicles?id=eq.${slot.vehicleId}&profile_id=eq.${caller.id}&archived_at=is.null&select=id`),
      db<{ id: string; lat: number | null; lng: number | null }>(
        c.env,
        `addresses?id=eq.${slot.addressId}&profile_id=eq.${caller.id}&archived_at=is.null&select=id,lat,lng`,
      ),
    ]);
    if (!vehicle) return c.json({ error: { code: 'vehicleUnavailable' } }, 409);
    if (address?.lat == null || address.lng == null) {
      return c.json({ error: { code: 'addressUnavailable' } }, 409);
    }

    for (let stamp = Date.parse(slot.slotStart); stamp < cycleEnd.getTime(); stamp += 7 * DAY_MS) {
      const local = riyadhSlotParts(stamp);
      const available = await db<{ starts_at: string }>(c.env, 'rpc/available_slots', {
        method: 'POST',
        body: { p_lat: address.lat, p_lng: address.lng, p_date: local.date },
      });
      if (!available.some((row) => String(row.starts_at).slice(0, 5) === local.time)) {
        return c.json({ error: { code: 'scheduleUnavailable', date: local.date } }, 409);
      }
      expandedSlots.push({ ...slot, slotStart: new Date(stamp).toISOString() });
    }
  }

  const existing = await db<{ id: string; payment_confirmed: boolean }>(
    c.env,
    `memberships?profile_id=eq.${caller.id}&state=neq.cancelled&select=id,payment_confirmed`,
  );
  if (existing.some((row) => row.payment_confirmed)) {
    return c.json({ error: { code: 'membershipExists' } }, 409);
  }
  if (existing.length) {
    await db(c.env, `memberships?profile_id=eq.${caller.id}&payment_confirmed=eq.false`, {
      method: 'PATCH', prefer: 'return=minimal', body: { state: 'cancelled', cancelled_at: new Date().toISOString() },
    });
  }

  const [membership] = await db<{ id: string }>(c.env, 'memberships', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      profile_id: caller.id,
      plan_id: plan.id,
      state: 'active',
      cycle_end: cycleEnd.toISOString(),
      credits_left: 0,
      rolled_in: 0,
      payment_confirmed: false,
    },
  });

  try {
    await db(c.env, 'membership_signup_slots', {
      method: 'POST', prefer: 'return=minimal',
      body: expandedSlots.map((slot) => ({
        membership_id: membership.id,
        vehicle_id: slot.vehicleId,
        address_id: slot.addressId,
        service_key: slot.serviceKey,
        slot_start: slot.slotStart,
        add_ons: slot.addOns ?? [],
      })),
    });

    const origin = new URL(c.req.url).origin;
    const query = `kind=membership&id=${encodeURIComponent(membership.id)}`;
    const invoice = await createInvoice(c.env, {
      amount: plan.price_minor,
      description: `BubblesCarWash - ${plan.name_ar}`,
      successUrl: `${origin}/payments/return?${query}&result=success`,
      backUrl: `${origin}/payments/return?${query}&result=cancel`,
      callbackUrl: `${origin}/webhooks/moyasar/invoice`,
      metadata: { membership_id: membership.id, profile_id: caller.id },
    });
    await db(c.env, 'payments', {
      method: 'POST', prefer: 'return=minimal',
      body: {
        profile_id: caller.id,
        membership_id: membership.id,
        amount_minor: plan.price_minor,
        provider: 'moyasar',
        provider_ref: invoice.id,
      },
    });
    return c.json({
      membershipId: membership.id,
      checkoutUrl: invoice.url,
      occurrenceCount: expandedSlots.length,
    }, 201);
  } catch (error) {
    console.error('[memberships] checkout failed', error);
    await db(c.env, `memberships?id=eq.${membership.id}`, {
      method: 'PATCH', prefer: 'return=minimal', body: { state: 'cancelled', cancelled_at: new Date().toISOString() },
    });
    return c.json({ error: { code: 'paymentUnavailable' } }, 503);
  }
});

membershipsRoute.post('/current/cancel', async (c) => {
  const caller = c.get('caller');
  const [membership] = await db<{ id: string }>(
    c.env,
    `memberships?profile_id=eq.${caller.id}&state=eq.active&payment_confirmed=eq.true&select=id`,
  );
  if (!membership) return c.json({ error: { code: 'notFound' } }, 404);
  const [futureBookingsCancelled] = await db<number>(c.env, 'rpc/cancel_membership', {
    method: 'POST',
    body: { p_membership: membership.id, p_profile: caller.id },
  });
  return c.json({ cancelled: true, futureBookingsCancelled: Number(futureBookingsCancelled ?? 0) });
});

membershipsRoute.post('/:id/confirm', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [membership] = await db<{ id: string; payment_confirmed: boolean }>(
    c.env,
    `memberships?id=eq.${id}&profile_id=eq.${caller.id}&state=eq.active&select=id,payment_confirmed`,
  );
  if (!membership) return c.json({ error: { code: 'notFound' } }, 404);

  if (!membership.payment_confirmed) {
    const [payment] = await db<{ id: string; provider_ref: string; amount_minor: number; state: string }>(
      c.env,
      `payments?membership_id=eq.${id}&provider=eq.moyasar&select=id,provider_ref,amount_minor,state&order=created_at.desc&limit=1`,
    );
    if (!payment?.provider_ref) return c.json({ error: { code: 'paymentNotFound' } }, 409);
    const invoice = await getInvoice(c.env, payment.provider_ref);
    if (invoice.status !== 'paid') return c.json({ error: { code: 'paymentPending' } }, 409);
    if (!invoiceMatches(invoice, { amount: payment.amount_minor, profileId: caller.id, membershipId: id })) {
      return c.json({ error: { code: 'paymentMismatch' } }, 409);
    }
    try {
      await db(c.env, 'rpc/activate_membership_with_slots', {
        method: 'POST', body: { p_membership: id, p_profile: caller.id },
      });
      await db(c.env, `payments?id=eq.${payment.id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { state: 'paid', updated_at: new Date().toISOString() },
      });
    } catch (error) {
      if (isTerminalScheduleError(error)) {
        try {
          if (payment.state !== 'refunded') await refundInvoice(c.env, payment.provider_ref);
          const now = new Date().toISOString();
          await Promise.all([
            db(c.env, `payments?id=eq.${payment.id}`, {
              method: 'PATCH',
              prefer: 'return=minimal',
              body: { state: 'refunded', failure: 'scheduleUnavailable', updated_at: now },
            }),
            db(c.env, `memberships?id=eq.${id}`, {
              method: 'PATCH',
              prefer: 'return=minimal',
              body: { state: 'cancelled', cancelled_at: now },
            }),
          ]);
          await notify(c.env, {
            profileId: caller.id,
            kind: 'payment_refunded',
            titleAr: 'أُعيد مبلغ الاشتراك',
            titleEn: 'Subscription payment refunded',
            bodyAr: 'تعذر تثبيت جميع مواعيدك، لذلك أرسلنا طلب استرجاع المبلغ إلى ميسر.',
            bodyEn: 'We could not secure every appointment, so the payment was refunded through Moyasar.',
          }).catch((notifyError) => console.warn('[memberships] refund notification failed', notifyError));
          return c.json({ error: { code: 'scheduleUnavailableRefunded' } }, 409);
        } catch (refundError) {
          console.error('[memberships] activation refund failed', { error, refundError });
          return c.json({ error: { code: 'scheduleUnavailableRefundPending' } }, 503);
        }
      }
      console.error('[memberships] activation failed', error);
      return c.json({ error: { code: 'scheduleUnavailable' } }, 409);
    }
  }

  const [current] = await db(c.env, `memberships?id=eq.${id}&select=id,plan_id,state,cycle_start,cycle_end,payment_confirmed,plans(id,name_ar,name_en,price_minor,weekly)`);
  const bookings = await db(c.env, `bookings?membership_id=eq.${id}&select=*&order=scheduled_at`);
  await Promise.all(bookings.map((booking) => notifyTeamOfBooking(c.env, booking.id).catch((error) => {
    console.warn('[dispatch] membership booking team notification failed', { id: booking.id, error });
  })));
  return c.json({ membership: current, bookings });
});

membershipsRoute.post('/:id/abandon', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [membership] = await db<{ id: string; payment_confirmed: boolean }>(
    c.env,
    `memberships?id=eq.${id}&profile_id=eq.${caller.id}&select=id,payment_confirmed`,
  );
  if (!membership) return c.json({ error: { code: 'notFound' } }, 404);
  if (membership.payment_confirmed) return c.json({ error: { code: 'alreadyPaid' } }, 409);
  await db(c.env, `memberships?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: { state: 'cancelled', cancelled_at: new Date().toISOString() },
  });
  return c.json({ cancelled: true });
});
