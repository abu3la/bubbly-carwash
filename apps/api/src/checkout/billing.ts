import type { Env } from '../env';
import { db } from '../db';
import { chargeRenewal, getPayment, refundPayment, type MoyasarInvoice } from '../moyasar';
import { notify } from '../notifications';

/** Called only with a fetched, paid invoice matching our amount/owner/target. */
export async function enableConsentedRenewal(env: Env, invoice: MoyasarInvoice, membershipId: string, profileId: string) {
  if (!env.MOYASAR_PUBLISHABLE_KEY) return;
  const [consent] = await db<{ amount_minor: number }>(env,
    `checkout_consents?invoice_id=eq.${invoice.id}&membership_id=eq.${membershipId}&profile_id=eq.${profileId}&select=amount_minor`);
  // Existing hosted checkouts have no recurring mandate. Never enrol them.
  if (!consent) return;
  if (consent.amount_minor !== invoice.amount || invoice.status !== 'paid') throw new Error('renewalConsentMismatch');
  const paid = invoice.payments?.find((p) => p.status === 'paid' && p.amount === invoice.amount && p.currency === 'SAR');
  if (!paid) throw new Error('renewalPaymentMissing');
  const [saved] = await db<{ token: string }>(env,
    `checkout_payment_tokens?invoice_id=eq.${invoice.id}&payment_id=eq.${paid.id}&select=token`);
  const token = paid.source?.token ?? saved?.token ?? (await getPayment(env, paid.id))?.source?.token;
  if (!token) throw new Error('renewalTokenMissing');
  const [membership] = await db<{ state: string; cycle_end: string }>(env,
    `memberships?id=eq.${membershipId}&profile_id=eq.${profileId}&select=state,cycle_end`);
  if (!membership || membership.state !== 'active') return;
  // Ignore replays, including after the customer has disabled renewal.
  await db(env, 'membership_billing?on_conflict=membership_id', {
    method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal',
    body: { membership_id: membershipId, profile_id: profileId, invoice_id: invoice.id, token,
      amount_minor: invoice.amount, next_charge_at: membership.cycle_end },
  });
}

interface Renewal { id: string; membership_id: string; due_at: string; amount_minor: number; state: string }
interface Billing { profile_id: string; token: string; enabled: boolean }
const terminal = /slotFull|outsideServiceArea|villaRequired|villaUnavailable|coverageUnavailable|coverageTeamMismatch|slotInPast|weeklyCapReached|scheduleIncomplete|vehicleNotYours|addressNotYours|vehicleUnavailable|addressUnavailable|unknownService|unknownSlot|fridayClosed|noMembership|renewalCancelled|renewalCycleMismatch|planUnavailable/;

export async function runRenewals(env: Env) {
  if (!env.MOYASAR_PUBLISHABLE_KEY || !env.MOYASAR_RENEWAL_CALLBACK_URL) return;
  const jobs = await db<Renewal>(env, 'rpc/queue_membership_renewals', { method: 'POST', body: {} });
  for (const job of jobs) {
    try { await processRenewal(env, job); }
    catch { console.error('[renewal] will retry', { id: job.id }); }
  }
}
async function processRenewal(env: Env, job: Renewal) {
  const [billing] = await db<Billing>(env, `membership_billing?membership_id=eq.${job.membership_id}&select=profile_id,token,enabled`);
  if (!billing) throw new Error('billingMissing');
  const [membership] = await db<{ state: string }>(env, `memberships?id=eq.${job.membership_id}&select=state`);
  const update = (body: unknown) => db(env, `membership_renewals?id=eq.${job.id}`, { method: 'PATCH', prefer: 'return=minimal', body });
  const disable = () => db(env, `membership_billing?membership_id=eq.${job.membership_id}`, { method: 'PATCH', prefer: 'return=minimal', body: { enabled: false } });
  if (job.state === 'refund_pending') {
    await refundPayment(env, job.id); await update({ state: 'refunded' }); await disable(); return;
  }
  // A cancellation racing a previous timed-out attempt must still reconcile it.
  let payment = await getPayment(env, job.id);
  if (!payment && (!billing.enabled || membership?.state !== 'active')) { await update({ state: 'failed', failure: 'renewalCancelled' }); return; }
  if (!payment) payment = await chargeRenewal(env, { id: job.id, amount: job.amount_minor, token: billing.token,
    membershipId: job.membership_id, profileId: billing.profile_id, callbackUrl: env.MOYASAR_RENEWAL_CALLBACK_URL! });
  if (payment.id !== job.id || payment.amount !== job.amount_minor || payment.currency !== 'SAR'
    || payment.metadata?.membership_id !== job.membership_id || payment.metadata?.profile_id !== billing.profile_id) throw new Error('renewalPaymentMismatch');
  if (payment.status === 'failed' || payment.status === 'refunded') {
    await update({ state: payment.status, failure: 'renewalPaymentFailed' }); await disable();
    await notify(env, { profileId: billing.profile_id, kind: 'renewal_failed', titleAr: 'لم يتجدد الاشتراك', titleEn: 'Subscription not renewed',
      bodyAr: 'تعذر دفع رسوم التجديد. يمكن مراجعة الاشتراك واختيار وسيلة دفع أخرى.', bodyEn: 'The renewal payment failed. Review your subscription and choose another payment method.' });
    return;
  }
  if (payment.status !== 'paid') return; // 3DS/uncertain state is never another charge.
  await db(env, `membership_renewals?id=eq.${job.id}&state=in.(pending,paid)`, { method: 'PATCH', prefer: 'return=minimal', body: { state: 'paid' } });
  try {
    await db(env, 'rpc/complete_membership_renewal', { method: 'POST', body: { p_renewal: job.id } });

  } catch (error) {
    if (!terminal.test(error instanceof Error ? error.message : String(error))) throw error;
    await update({ state: 'refund_pending', failure: 'renewalScheduleUnavailable' });
    await refundPayment(env, job.id); await update({ state: 'refunded' }); await disable();
  }
}
