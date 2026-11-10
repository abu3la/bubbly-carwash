import type { Env } from '../env';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
async function signingKey(env: Env) {
  if (!env.MOYASAR_SECRET_KEY) throw new Error('moyasarNotConfigured');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(env.MOYASAR_SECRET_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** A short-lived invoice capability, never a Supabase/session token. */
export async function checkoutUrl(env: Env, origin: string, invoiceId: string) {
  if (!UUID.test(invoiceId)) throw new Error('invalidInvoice');
  const expires = Math.floor(Date.now() / 1000) + 15 * 60;
  const message = `bubbles-checkout:${invoiceId}:${expires}`;
  const signature = encode(new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(env), new TextEncoder().encode(message))));
  return `${origin}/payments/checkout/${invoiceId}?expires=${expires}&signature=${signature}`;
}

export async function validCheckout(env: Env, invoiceId: string, expires: string, signature: string, now = Date.now()) {
  if (!UUID.test(invoiceId) || !/^\d{10}$/.test(expires) || !/^[\w-]{43}$/.test(signature)) return false;
  if (Number(expires) * 1000 <= now || Number(expires) * 1000 > now + 16 * 60_000) return false;
  try {
    const bytes = Uint8Array.from(atob(signature.replaceAll('-', '+').replaceAll('_', '/') + '='), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify('HMAC', await signingKey(env), bytes, new TextEncoder().encode(`bubbles-checkout:${invoiceId}:${expires}`));
  } catch { return false; }
}
