import type { Env } from './env';

const BASE = 'https://api.moyasar.com/v1';

function auth(secret: string) {
  return `Basic ${btoa(`${secret}:`)}`;
}

export interface MoyasarInvoice {
  id: string;
  status: string;
  url: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  payments?: Array<{
    id: string;
    status: string;
    amount: number;
    refunded?: number;
    currency: string;
    source?: { token?: string };
  }>;
}

export function invoiceMatches(
  invoice: MoyasarInvoice,
  expected: { amount: number; profileId: string; bookingId?: string; membershipId?: string },
) {
  return invoice.status === 'paid'
    && invoice.currency === 'SAR'
    && invoice.amount === expected.amount
    && invoice.metadata?.profile_id === expected.profileId
    && (!expected.bookingId || invoice.metadata?.booking_id === expected.bookingId)
    && (!expected.membershipId || invoice.metadata?.membership_id === expected.membershipId);
}

export async function createInvoice(
  env: Env,
  input: {
    amount: number;
    description: string;
    successUrl: string;
    backUrl: string;
    callbackUrl: string;
    metadata: Record<string, string>;
  },
): Promise<MoyasarInvoice> {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const res = await fetch(`${BASE}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: auth(env.MOYASAR_SECRET_KEY),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: 'SAR',
      description: input.description,
      success_url: input.successUrl,
      back_url: input.backUrl,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as MoyasarInvoice & { message?: string };
  if (!res.ok || !body.id || !body.url) {
    throw new Error(`moyasar ${res.status}: ${body.message ?? 'invoice failed'}`);
  }
  return body;
}

export async function getInvoice(env: Env, id: string): Promise<MoyasarInvoice> {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const res = await fetch(`${BASE}/invoices/${encodeURIComponent(id)}`, {
    headers: { Authorization: auth(env.MOYASAR_SECRET_KEY) },
  });
  const body = (await res.json().catch(() => ({}))) as MoyasarInvoice & { message?: string };
  if (!res.ok || !body.id) throw new Error(`moyasar ${res.status}: ${body.message ?? 'invoice failed'}`);
  return body;
}

/** Refund the successful payment attached to a hosted invoice. */
export async function refundInvoice(env: Env, invoiceId: string, amount?: number) {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const invoice = await getInvoice(env, invoiceId);
  const payment = invoice.payments?.find((item) => item.status === 'paid' || item.status === 'captured');
  if (!payment) {
    const alreadyRefunded = invoice.payments?.find((item) => item.status === 'refunded');
    if (alreadyRefunded) {
      return {
        paymentId: alreadyRefunded.id,
        amount: Number(alreadyRefunded.refunded ?? alreadyRefunded.amount),
        status: 'refunded',
      };
    }
    throw new Error('paymentNotRefundable');
  }
  const refunded = Number(payment.refunded ?? 0);
  const refundable = payment.amount - refunded;
  // Moyasar can keep the payment status as `paid` while reporting the whole
  // amount in `refunded`. Treat a replay after that state as success instead
  // of attempting a zero-value second refund.
  if (refundable <= 0 && refunded > 0) {
    return { paymentId: payment.id, amount: refunded, status: 'refunded' };
  }
  const requested = amount ?? refundable;
  if (!Number.isInteger(requested) || requested <= 0 || requested > refundable) {
    throw new Error('badRefundAmount');
  }
  const response = await fetch(`${BASE}/payments/${encodeURIComponent(payment.id)}/refund`, {
    method: 'POST',
    headers: {
      Authorization: auth(env.MOYASAR_SECRET_KEY),
      'Content-Type': 'application/json',
    },
    body: amount === undefined ? undefined : JSON.stringify({ amount: requested }),
  });
  const body = await response.json().catch(() => ({})) as { id?: string; status?: string; refunded?: number; message?: string };
  if (!response.ok || body.status !== 'refunded') {
    throw new Error(`moyasarRefund ${response.status}: ${body.message ?? 'refund failed'}`);
  }
  return { paymentId: payment.id, amount: requested, status: body.status };
}

export interface MoyasarPayment {
  id: string; status: string; amount: number; currency: string; invoice_id?: string;
  refunded?: number; metadata?: Record<string, string>;
  source?: { token?: string; transaction_url?: string };
}
export async function getPayment(env: Env, id: string): Promise<MoyasarPayment | null> {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const res = await fetch(`${BASE}/payments/${encodeURIComponent(id)}`, { headers: { Authorization: auth(env.MOYASAR_SECRET_KEY) } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`moyasarPayment ${res.status}`);
  return await res.json() as MoyasarPayment;
}
export async function chargeRenewal(env: Env, input: { id: string; amount: number; token: string; membershipId: string; profileId: string; callbackUrl: string }) {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const existing = await getPayment(env, input.id);
  if (existing) return existing;
  const res = await fetch(`${BASE}/payments`, {
    method: 'POST', headers: { Authorization: auth(env.MOYASAR_SECRET_KEY), 'Content-Type': 'application/json' },
    body: JSON.stringify({ given_id: input.id, amount: input.amount, currency: 'SAR', description: 'Bubbles subscription renewal', callback_url: input.callbackUrl,
      metadata: { membership_id: input.membershipId, profile_id: input.profileId, renewal_id: input.id }, source: { type: 'token', token: input.token } }),
  });
  if (!res.ok) {
    // A parallel caller may have already created this exact idempotent charge.
    const replay = await getPayment(env, input.id);
    if (replay) return replay;
    throw new Error(`moyasarRenewal ${res.status}`);
  }
  return await res.json() as MoyasarPayment;
}
export async function refundPayment(env: Env, paymentId: string) {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  const payment = await getPayment(env, paymentId);
  if (!payment) throw new Error('paymentNotFound');
  if (payment.status === 'refunded' || (payment.refunded ?? 0) >= payment.amount) return;
  const response = await fetch(`${BASE}/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: 'POST', headers: { Authorization: auth(env.MOYASAR_SECRET_KEY) },
  });
  if (!response.ok) throw new Error(`moyasarRefund ${response.status}`);
  const result = await response.json() as { status: string };
  if (result.status !== 'refunded') throw new Error('refundPending');
}
