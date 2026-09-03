import { Hono } from 'hono';
import type { Env } from '../env';
import { resolveSmsProvider } from '../sms/provider';

/**
 * Supabase auth hooks.
 *
 * Supabase signs these with the standard-webhooks scheme: a `webhook-id`, a
 * `webhook-timestamp` and a `webhook-signature` over `id.timestamp.body`, keyed
 * by a secret that is base64 behind a `v1,whsec_` prefix.
 */
export const hooksRoute = new Hono<{ Bindings: Env }>();

/** Rejects a replayed request even when its signature is still valid. */
const TOLERANCE_SECONDS = 300;

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Compares in constant time.
 *
 * `===` on a signature leaks: it returns at the first differing byte, so how
 * long it takes reveals how much of a guess was right, and a forger can recover
 * the value byte by byte. This always reads both fully.
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verify(secret: string, id: string, timestamp: string, body: string, header: string) {
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const raw = secret.replace(/^v1,whsec_/, '').replace(/^whsec_/, '');
  const key = await crypto.subtle.importKey(
    'raw',
    base64ToBytes(raw),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${timestamp}.${body}`)),
  );

  // The header carries a space-separated list, so a secret can be rotated
  // without dropping requests still signed by the old one.
  return header
    .split(' ')
    .map((p) => (p.startsWith('v1,') ? p.slice(3) : p))
    .some((sig) => {
      try {
        return timingSafeEqual(mac, base64ToBytes(sig));
      } catch {
        return false;
      }
    });
}

interface SendSmsPayload {
  user: { phone: string };
  sms: { otp: string };
}

/**
 * Send SMS Hook. Supabase generates the code; delivering it is our problem.
 *
 * The status matters: a non-2xx tells Supabase the send failed and the customer
 * sees an error, so a provider outage has to surface here rather than be
 * swallowed into a silent success.
 */
hooksRoute.post('/sms', async (c) => {
  const secret = c.env.SUPABASE_AUTH_HOOK_SECRET;
  if (!secret) return c.json({ error: 'hook secret not configured' }, 500);

  const body = await c.req.text();
  const id = c.req.header('webhook-id') ?? '';
  const ts = c.req.header('webhook-timestamp') ?? '';
  const sig = c.req.header('webhook-signature') ?? '';

  if (!(await verify(secret, id, ts, body, sig))) {
    // Anyone can POST here. Without this, a forged call would hand an attacker
    // the OTP for any phone number they cared to name.
    return c.json({ error: 'bad signature' }, 401);
  }

  const payload = JSON.parse(body) as SendSmsPayload;
  const provider = resolveSmsProvider(c.env);

  try {
    await provider.send({ to: payload.user.phone, body: `رمز BubblesCarWash: ${payload.sms.otp}` });
  } catch (err) {
    console.error('[sms] send failed', err);
    return c.json({ error: { http_code: 502, message: 'sms delivery failed' } }, 502);
  }

  return c.json({});
});
