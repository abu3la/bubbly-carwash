import { Hono } from 'hono';
import type { Env } from '../env';
import { db } from '../db';
import { getInvoice, invoiceMatches, refundInvoice } from '../moyasar';
import { notifyTeamOfBooking } from '../dispatch';
import { notify } from '../notifications';

/**
 * Moyasar payment webhooks.
 *
 * Two separate problems, both of which have to be solved or money goes wrong:
 *
 *  - **Who sent this.** The URL is public, so anyone can POST a "payment_paid"
 *    and claim a free wash or a free membership. Moyasar's answer is a shared
 *    secret token that it sends with every call.
 *  - **Have I seen this already.** Providers retry, so the same event arrives
 *    more than once legitimately. Authentication does not help here; only
 *    recording what has been processed does. `payments` has a unique index on
 *    (provider, provider_ref), so a replay collides instead of granting a
 *    second membership.
 */
export const webhooksRoute = new Hono<{ Bindings: Env }>();

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

/**
 * Hosted-invoice callback. The incoming body is never trusted: its id is used
 * only to fetch the invoice back from Moyasar with our secret key. Granting
 * happens from that verified response, so a forged public POST buys nothing.
 */
webhooksRoute.post('/moyasar/invoice', async (c) => {
  const body: { id?: string; data?: { id?: string } } = await c.req.json().catch(() => ({}));
  const ref = body.id ?? body.data?.id;
  if (!ref) return c.json({ error: 'no invoice id' }, 400);
  let invoice;
  try {
    invoice = await getInvoice(c.env, ref);
  } catch (error) {
    console.error('[moyasar] invoice verification failed', error);
    return c.json({ error: 'could not verify invoice' }, 502);
  }
  if (invoice.status !== 'paid') return c.json({ received: true, paid: false });

  const [payment] = await db<{
    id: string; profile_id: string; booking_id: string | null; membership_id: string | null; state: string; amount_minor: number;
  }>(c.env, `payments?provider=eq.moyasar&provider_ref=eq.${encodeURIComponent(ref)}&select=id,profile_id,booking_id,membership_id,state,amount_minor`);
  if (!payment) return c.json({ received: true, known: false });
  if (!invoiceMatches(invoice, {
    amount: payment.amount_minor,
    profileId: payment.profile_id,
    ...(payment.booking_id ? { bookingId: payment.booking_id } : {}),
    ...(payment.membership_id ? { membershipId: payment.membership_id } : {}),
  })) {
    console.error('[moyasar] verified invoice did not match local payment', { ref });
    return c.json({ error: 'invoice mismatch' }, 409);
  }

  let alreadyActivated = false;
  let targetCancelled = false;
  if (payment.booking_id) {
    const [target] = await db<{ payment_confirmed: boolean; status: string }>(
      c.env,
      `bookings?id=eq.${payment.booking_id}&select=payment_confirmed,status`,
    );
    alreadyActivated = Boolean(target?.payment_confirmed);
    targetCancelled = target?.status === 'cancelled';
  } else if (payment.membership_id) {
    const [target] = await db<{ payment_confirmed: boolean; state: string }>(
      c.env,
      `memberships?id=eq.${payment.membership_id}&select=payment_confirmed,state`,
    );
    alreadyActivated = Boolean(target?.payment_confirmed);
    targetCancelled = target?.state === 'cancelled';
  }

  if (targetCancelled) {
    try {
      await refundInvoice(c.env, ref);
      await db(c.env, `payments?id=eq.${payment.id}`, {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: { state: 'refunded', updated_at: new Date().toISOString() },
      });
      await notify(c.env, {
        profileId: payment.profile_id,
        bookingId: payment.booking_id,
        kind: 'payment_refunded',
        titleAr: 'تم إرجاع الدفع',
        titleEn: 'Payment refunded',
        bodyAr: 'وصل الدفع بعد إلغاء العملية، لذلك أرسلنا طلب الإرجاع إلى ميسر.',
        bodyEn: 'Payment arrived after cancellation, so it was refunded through Moyasar.',
      }).catch((error) => console.warn('[moyasar] refund notification failed', error));
      return c.json({ received: true, known: true, paid: true, refunded: true });
    } catch (error) {
      console.error('[moyasar] cancelled target refund failed', error);
      return c.json({ error: 'refund failed' }, 500);
    }
  }

  if (alreadyActivated && payment.state === 'paid') {
    return c.json({ received: true, known: true, paid: true });
  }

  try {
    if (payment.booking_id) {
      await db(c.env, `bookings?id=eq.${payment.booking_id}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { payment_confirmed: true },
      });
      await notifyTeamOfBooking(c.env, payment.booking_id).catch((error) => {
        console.warn('[dispatch] paid booking team notification failed', error);
      });
    } else if (payment.membership_id) {
      await db(c.env, 'rpc/activate_membership_with_slots', {
        method: 'POST', body: { p_membership: payment.membership_id, p_profile: payment.profile_id },
      });
      const created = await db<{ id: string }>(
        c.env,
        `bookings?membership_id=eq.${payment.membership_id}&payment_confirmed=eq.true&select=id`,
      );
      await Promise.all(created.map(({ id }) => notifyTeamOfBooking(c.env, id).catch((error) => {
        console.warn('[dispatch] membership booking team notification failed', { id, error });
      })));
    }
    await db(c.env, `payments?id=eq.${payment.id}`, {
      method: 'PATCH', prefer: 'return=minimal', body: { state: 'paid', updated_at: new Date().toISOString() },
    });
  } catch (error) {
    const membershipId = payment.membership_id;
    if (membershipId && isTerminalScheduleError(error)) {
      try {
        await refundInvoice(c.env, ref);
        const now = new Date().toISOString();
        await Promise.all([
          db(c.env, `payments?id=eq.${payment.id}`, {
            method: 'PATCH',
            prefer: 'return=minimal',
            body: { state: 'refunded', failure: 'scheduleUnavailable', updated_at: now },
          }),
          db(c.env, `memberships?id=eq.${membershipId}`, {
            method: 'PATCH',
            prefer: 'return=minimal',
            body: { state: 'cancelled', cancelled_at: now },
          }),
        ]);
        await notify(c.env, {
          profileId: payment.profile_id,
          kind: 'payment_refunded',
          titleAr: 'أُعيد مبلغ الاشتراك',
          titleEn: 'Subscription payment refunded',
          bodyAr: 'تعذر تثبيت جميع مواعيدك، لذلك أرسلنا طلب استرجاع المبلغ إلى ميسر.',
          bodyEn: 'We could not secure every appointment, so the payment was refunded through Moyasar.',
        }).catch((notifyError) => console.warn('[moyasar] schedule refund notification failed', notifyError));
        return c.json({ received: true, known: true, paid: true, refunded: true });
      } catch (refundError) {
        console.error('[moyasar] schedule refund failed', { error, refundError });
        return c.json({ error: 'activation and refund failed' }, 500);
      }
    }
    console.error('[moyasar] paid invoice activation failed', error);
    return c.json({ error: 'activation failed' }, 500);
  }
  return c.json({ received: true, known: true, paid: true });
});

/**
 * Compares in constant time.
 *
 * `===` exits at the first differing byte, so how long it takes reveals how
 * much of a guess was right and the token can be recovered byte by byte.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

interface MoyasarEvent {
  id?: string;
  type?: string;
  /** Moyasar puts the shared token in the body rather than a header. */
  secret_token?: string;
  data?: {
    id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, string>;
  };
}

webhooksRoute.post('/moyasar', async (c) => {
  const expected = c.env.MOYASAR_WEBHOOK_SECRET;
  if (!expected) return c.json({ error: 'webhook secret not configured' }, 500);

  const raw = await c.req.text();
  let event: MoyasarEvent;
  try {
    event = JSON.parse(raw) as MoyasarEvent;
  } catch {
    return c.json({ error: 'bad json' }, 400);
  }

  // Moyasar documents the token in the body. Headers are checked too, so a
  // change on their side surfaces as a log line rather than silent rejection
  // of every real payment.
  const fromBody = event.secret_token;
  const fromHeader =
    c.req.header('x-moyasar-token') ?? c.req.header('x-webhook-token') ?? undefined;
  const presented = fromBody ?? fromHeader;

  if (!presented || !timingSafeEqual(presented, expected)) {
    // Never log the token itself — only where it was (not) found, which is
    // what actually helps diagnose a format change.
    console.warn('[moyasar] rejected', {
      type: event.type,
      tokenInBody: fromBody !== undefined,
      tokenInHeader: fromHeader !== undefined,
      headers: [...c.req.raw.headers.keys()],
    });
    return c.json({ error: 'bad token' }, 401);
  }

  const payment = event.data;
  if (!payment?.id) return c.json({ error: 'no payment id' }, 400);

  // Only paid matters for granting anything. The others are recorded for
  // support, not acted on.
  const state =
    payment.status === 'paid'
      ? 'paid'
      : payment.status === 'failed'
        ? 'failed'
        : payment.status === 'refunded'
          ? 'refunded'
          : 'pending';

  // A webhook confirms a payment we already created; it never invents one.
  // `payments` requires a profile and exactly one target (booking, purchase or
  // membership), and a webhook payload knows none of that — only the charge we
  // opened does. So look up our own row and update its state.
  let existing: Array<{ id: string; state: string }>;
  try {
    existing = await db(
      c.env,
      `payments?provider=eq.moyasar&provider_ref=eq.${encodeURIComponent(payment.id)}&select=id,state`,
    );
  } catch (err) {
    // The database is briefly unreachable. A 500 makes Moyasar retry, which is
    // what we want — better a duplicate delivery than a lost payment.
    console.error('[moyasar] lookup failed', err);
    return c.json({ error: 'could not read payment' }, 500);
  }

  if (existing.length === 0) {
    // Not a charge we opened — a payment made in the Moyasar dashboard, or an
    // event for another integration. Acknowledge it: a non-2xx here would make
    // Moyasar retry forever for something we will never recognise.
    console.warn('[moyasar] unknown payment, acknowledged and ignored', {
      ref: payment.id,
      type: event.type,
    });
    return c.json({ received: true, known: false });
  }

  // A late or replayed paid event must never undo a refund recorded after a
  // failed booking activation.
  if (existing[0].state === 'refunded' && state === 'paid') {
    return c.json({ received: true, known: true, state: 'refunded' });
  }

  // Idempotent by construction: a replayed event writes the same state to the
  // same row, so the second delivery is a no-op rather than a second grant.
  try {
    await db(c.env, `payments?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: {
        state,
        failure: state === 'failed' ? (event.type ?? 'failed') : null,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[moyasar] update failed', err);
    return c.json({ error: 'could not record payment' }, 500);
  }

  return c.json({ received: true });
});
