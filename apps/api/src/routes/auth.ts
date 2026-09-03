import { Hono } from 'hono';
import type { Env } from '../env';

/**
 * Sign-in, owned by the API.
 *
 * The app used to call Supabase Auth directly, which put three things in the
 * wrong place: the decision about what a failure *means*, the wording the
 * customer reads, and the moment a profile row should exist. All three belong
 * on one side of the boundary, and this is that side.
 *
 * The app therefore ships no Supabase key at all and never learns the shape of
 * Supabase's errors.
 */
export const authRoute = new Hono<{ Bindings: Env }>();

/** What the app is allowed to know about a failure. */
type Code = 'wrongCode' | 'tooManyRequests' | 'invalidPhone' | 'unknown';

/** Saudi mobile numbers in E.164: +9665 followed by eight digits. */
const SAUDI_MOBILE = /^\+9665\d{8}$/;

function classify(status: number, body: { error_code?: string }): Code {
  switch (body.error_code) {
    case 'otp_expired':
    case 'otp_disabled':
      return 'wrongCode';
    case 'over_sms_send_rate_limit':
    case 'over_request_rate_limit':
      return 'tooManyRequests';
    case 'validation_failed':
      return 'invalidPhone';
  }
  if (status === 429) return 'tooManyRequests';
  if (status === 401 || status === 403) return 'wrongCode';
  return 'unknown';
}

async function callAuth(env: Env, path: string, payload: unknown) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, body };
}

authRoute.post('/otp', async (c) => {
  const { phone } = await c.req.json<{ phone?: string }>();
  // Checked here rather than trusted from the app: the client is the one thing
  // an attacker fully controls.
  if (!phone || !SAUDI_MOBILE.test(phone)) {
    return c.json({ error: { code: 'invalidPhone' satisfies Code } }, 400);
  }

  const r = await callAuth(c.env, 'otp', { phone });
  if (!r.ok) {
    console.warn('[auth] otp failed', r.status, r.body);
    return c.json({ error: { code: classify(r.status, r.body) } }, 400);
  }
  return c.json({ sent: true });
});

authRoute.post('/verify', async (c) => {
  const { phone, code } = await c.req.json<{ phone?: string; code?: string }>();
  if (!phone || !SAUDI_MOBILE.test(phone)) {
    return c.json({ error: { code: 'invalidPhone' satisfies Code } }, 400);
  }
  if (!code || !/^\d{4,8}$/.test(code)) {
    return c.json({ error: { code: 'wrongCode' satisfies Code } }, 400);
  }

  const r = await callAuth(c.env, 'verify', { phone, token: code, type: 'sms' });
  if (!r.ok) {
    return c.json({ error: { code: classify(r.status, r.body) } }, 401);
  }

  const user = r.body.user as { id: string; phone: string } | undefined;
  if (!user?.id) return c.json({ error: { code: 'unknown' satisfies Code } }, 500);

  // A verified phone means a customer exists. Creating the profile here — not
  // on some later screen — means every authenticated request downstream can
  // assume the row is there.
  await fetch(`${c.env.SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      apikey: c.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      // Idempotent: signing in again must not fail on the primary key.
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: user.id }),
  });

  return c.json({
    accessToken: r.body.access_token,
    refreshToken: r.body.refresh_token,
    expiresIn: r.body.expires_in ?? 3600,
    user: { id: user.id, phone: user.phone },
  });
});
