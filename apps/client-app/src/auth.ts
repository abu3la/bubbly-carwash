import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sign-in, through the API.
 *
 * The app holds no Supabase key and never speaks to Supabase. It asks the
 * Worker, and the Worker decides what a failure means — so the wording the
 * customer reads is chosen in one place, and a fix ships without an App Store
 * review.
 */
const API = 'https://sama-api.samacarwash.workers.dev';

const SESSION_KEY = 'sama.session';

/** The failures the interface has words for. Anything else is `unknown`. */
export type AuthErrorCode = 'wrongCode' | 'tooManyRequests' | 'invalidPhone' | 'offline' | 'unknown';

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
  }
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  phone: string;
  /** Epoch seconds. */
  expiresAt: number;
}

async function post(path: string, body: unknown): Promise<Record<string, any>> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // No response at all — aeroplane mode, dead Wi-Fi, captive portal. Worth
    // separating from a rejection, because the customer's fix is different.
    throw new AuthError('offline');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError((json?.error?.code as AuthErrorCode) ?? 'unknown');
  return json;
}

/** Sends the code. For a registered test number no SMS is sent at all. */
export async function requestOtp(phoneE164: string): Promise<void> {
  await post('/auth/otp', { phone: phoneE164 });
}

/** Exchanges the code for a session. Throws if the code is wrong or expired. */
export async function verifyOtp(phoneE164: string, code: string): Promise<Session> {
  const d = await post('/auth/verify', { phone: phoneE164, code });
  const session: Session = {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    userId: d.user?.id ?? '',
    phone: d.user?.phone ?? '',
    expiresAt: Math.floor(Date.now() / 1000) + (d.expiresIn ?? 3600),
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function loadSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

/** The API wants E.164; the field only collects the national part. */
export const toE164 = (national: string) => `+966${national.replace(/\D/g, '')}`;
