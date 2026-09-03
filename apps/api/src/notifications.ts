import { db } from './db';
import type { Env } from './env';

interface NotificationInput {
  profileId: string;
  bookingId?: string | null;
  kind: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  data?: Record<string, string>;
}

const base64Url = (value: string | Uint8Array) => {
  const binary = typeof value === 'string'
    ? unescape(encodeURIComponent(value))
    : Array.from(value, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

function pemBytes(pem: string) {
  const body = pem.replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  return Uint8Array.from(atob(body), (char) => char.charCodeAt(0));
}

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

/** Service-account OAuth token for Firebase Cloud Messaging HTTP v1. */
async function firebaseAccessToken(env: Env) {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.value;
  }
  if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error('firebaseNotConfigured');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(JSON.stringify({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemBytes(env.FIREBASE_PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64Url(new Uint8Array(signature))}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const result = await response.json() as { access_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !result.access_token) {
    throw new Error(`firebaseAuth ${response.status}: ${result.error ?? 'missing token'}`);
  }
  cachedAccessToken = {
    value: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
  };
  return result.access_token;
}

async function sendFcm(env: Env, token: string, input: NotificationInput, notificationId: string) {
  if (!env.FIREBASE_PROJECT_ID) throw new Error('firebaseNotConfigured');
  const accessToken = await firebaseAccessToken(env);
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title: input.titleAr, body: input.bodyAr },
          data: {
            notificationId,
            bookingId: input.bookingId ?? '',
            kind: input.kind,
            ...input.data,
          },
          android: { priority: 'high', notification: { channel_id: 'operations' } },
          apns: { payload: { aps: { sound: 'default' } } },
        },
      }),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    if (response.status === 400 || response.status === 404) {
      await db(env, `device_push_tokens?token=eq.${encodeURIComponent(token)}`, {
        method: 'PATCH', prefer: 'return=minimal', body: { active: false, updated_at: new Date().toISOString() },
      });
    }
    throw new Error(`fcm ${response.status}: ${detail.slice(0, 200)}`);
  }
}

/** Persist first, then deliver through Firebase. The inbox survives push loss. */
export async function notify(env: Env, input: NotificationInput) {
  const [row] = await db<{ id: string }>(env, 'notifications', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      profile_id: input.profileId,
      booking_id: input.bookingId ?? null,
      kind: input.kind,
      title_ar: input.titleAr,
      title_en: input.titleEn,
      body_ar: input.bodyAr,
      body_en: input.bodyEn,
      data: input.data ?? {},
    },
  });

  const tokens = await db<{ token: string }>(
    env,
    `device_push_tokens?profile_id=eq.${input.profileId}&active=eq.true&select=token`,
  );
  await Promise.all(tokens.map(({ token }) =>
    sendFcm(env, token, input, row.id).catch((error) => console.warn('[fcm] delivery failed', error)),
  ));
  return row;
}
