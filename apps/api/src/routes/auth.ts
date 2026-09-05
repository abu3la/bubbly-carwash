import { Hono } from 'hono';
import type { Env } from '../env';
import { db } from '../db';

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

function classify(status: number, body: unknown): Code {
  const errorCode = body && typeof body === 'object' && 'error_code' in body
    ? (body as { error_code?: string }).error_code
    : undefined;
  switch (errorCode) {
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

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
}

/**
 * The temporary fixed code still has to produce a real Supabase session:
 * every protected route validates that access token with Supabase. We create
 * or update an internal development identity, then sign in. The identity uses
 * an email because the hosted development
 * project intentionally has its phone provider disabled until SMS is ready.
 * Nothing special is accepted by the API after this step.
 */
async function createDevelopmentSession(env: Env, phone: string) {
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  const digits = phone.replace(/\D/g, '');
  const email = `dev.${digits}@auth.bubblescarwash.local`;
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${env.SUPABASE_SERVICE_ROLE_KEY}:${phone}:bubbles-dev-otp`),
  );
  const password = `${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')}aA1!`;
  const listed = await fetch(
    `${env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000&filter=${encodeURIComponent(email)}`,
    { headers },
  );
  const listBody = (await listed.json().catch(() => ({}))) as { users?: AuthUser[] };
  if (!listed.ok) return { ok: false as const, status: listed.status, body: listBody };

  let user = listBody.users?.find((candidate) => candidate.email === email);

  const signIn = async () => {
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: response.ok, status: response.status, body };
  };

  if (user) {
    // Once migrated to the stable development password, repeated logins reuse
    // it and no longer revoke sessions on other simulators or devices.
    const existingSession = await signIn();
    if (existingSession.ok) return existingSession;
    const updated = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ password, user_metadata: { phone } }),
    });
    if (!updated.ok) {
      const body = (await updated.json().catch(() => ({}))) as Record<string, unknown>;
      return { ok: false as const, status: updated.status, body };
    }
  } else {
    const created = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { phone } }),
    });
    const body = (await created.json().catch(() => ({}))) as AuthUser | { user?: AuthUser };
    if (!created.ok) return { ok: false as const, status: created.status, body };
    user = 'user' in body ? body.user : 'id' in body ? body : undefined;
  }

  return signIn();
}

async function ensureProfile(env: Env, userId: string, phone: string) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: userId, phone }),
  });

  const [invite] = await db<{
    phone: string; full_name: string; team_id: string; available: boolean; is_lead: boolean;
    shift_start: string; shift_end: string;
  }>(env, `driver_invites?phone=eq.${encodeURIComponent(phone)}&active=eq.true&accepted_at=is.null&select=phone,full_name,team_id,available,is_lead,shift_start,shift_end&limit=1`);
  if (invite) {
    await Promise.all([
      db(env, `profiles?id=eq.${userId}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { role: 'driver', full_name: invite.full_name, active: true },
      }),
      db(env, 'team_members?on_conflict=profile_id', {
        method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: {
          team_id: invite.team_id,
          profile_id: userId,
          active: true,
          available: invite.available,
          is_lead: invite.is_lead,
          shift_start: invite.shift_start,
          shift_end: invite.shift_end,
          updated_at: new Date().toISOString(),
        },
      }),
      db(env, `driver_invites?phone=eq.${encodeURIComponent(phone)}`, {
        method: 'PATCH', prefer: 'return=minimal', body: {
          active: false, accepted_by: userId, accepted_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        },
      }),
    ]);
  }
}

authRoute.post('/otp', async (c) => {
  const { phone } = await c.req.json<{ phone?: string }>();
  // Checked here rather than trusted from the app: the client is the one thing
  // an attacker fully controls.
  if (!phone || !SAUDI_MOBILE.test(phone)) {
    return c.json({ error: { code: 'invalidPhone' satisfies Code } }, 400);
  }

  if (c.env.DEV_FIXED_OTP) {
    return c.json({ sent: true, developmentCode: c.env.DEV_FIXED_OTP });
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

  const r = c.env.DEV_FIXED_OTP
    ? code === c.env.DEV_FIXED_OTP
      ? await createDevelopmentSession(c.env, phone)
      : { ok: false as const, status: 401, body: { error_code: 'otp_expired' } }
    : await callAuth(c.env, 'verify', { phone, token: code, type: 'sms' });
  if (!r.ok) {
    console.warn('[auth] verify failed', r.status, r.body);
    return c.json({ error: { code: classify(r.status, r.body) } }, 401);
  }

  const user = r.body.user as { id: string; phone: string } | undefined;
  if (!user?.id) return c.json({ error: { code: 'unknown' satisfies Code } }, 500);

  // A verified phone means a customer exists. Creating the profile here — not
  // on some later screen — means every authenticated request downstream can
  // assume the row is there.
  // Idempotent: signing in again must not fail on the primary key.
  await ensureProfile(c.env, user.id, user.phone || phone);

  return c.json({
    accessToken: r.body.access_token,
    refreshToken: r.body.refresh_token,
    expiresIn: r.body.expires_in ?? 3600,
    user: { id: user.id, phone: user.phone || phone },
  });
});

authRoute.post('/refresh', async (c) => {
  const { refreshToken } = await c.req.json<{ refreshToken?: string }>();
  if (!refreshToken) return c.json({ error: { code: 'unauthorized' } }, 401);
  const r = await callAuth(c.env, 'token?grant_type=refresh_token', { refresh_token: refreshToken });
  if (!r.ok) return c.json({ error: { code: 'unauthorized' } }, 401);
  const user = r.body.user as { id?: string; phone?: string; user_metadata?: { phone?: string } } | undefined;
  if (!user?.id) return c.json({ error: { code: 'unknown' } }, 500);
  const phone = user.phone || user.user_metadata?.phone || '';
  await ensureProfile(c.env, user.id, phone);
  return c.json({
    accessToken: r.body.access_token,
    refreshToken: r.body.refresh_token,
    expiresIn: r.body.expires_in ?? 3600,
    user: { id: user.id, phone },
  });
});

/** Revoke this device's refresh session. Other signed-in devices stay active. */
authRoute.post('/logout', async (c) => {
  const authorization = c.req.header('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ') || authorization.length <= 7) {
    return c.json({ error: { code: 'unauthorized' } }, 401);
  }
  const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/logout?scope=local`, {
    method: 'POST',
    headers: { apikey: c.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: authorization },
  });
  // A session already expired/revoked is also signed out. The native client
  // always clears local credentials, including while offline.
  if (!response.ok && ![401,403,404].includes(response.status)) {
    return c.json({ error: { code: 'logoutUnavailable' } }, 503);
  }
  return c.json({ signedOut: true });
});
