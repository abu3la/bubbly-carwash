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
  if (!payment) throw new Error('paymentNotRefundable');
  const refundable = payment.amount - Number(payment.refunded ?? 0);
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
