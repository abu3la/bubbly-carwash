import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sign-in, through the API.
 *
 * The app holds no Supabase key and never speaks to Supabase. It asks the
 * Worker, and the Worker decides what a failure means — so the wording the
 * customer reads is chosen in one place, and a fix ships without an App Store
 * review.
 */
const API = process.env.EXPO_PUBLIC_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';

const SESSION_KEY = 'bubbles.session';
// Compatibility only: migrate existing installations without losing stored data.
const LEGACY_SESSION_KEY = 'sama.session';

async function readStoredValue(): Promise<string | null> {
  const current = await AsyncStorage.getItem(SESSION_KEY);
  if (current !== null) return current;
  const legacy = await AsyncStorage.getItem(LEGACY_SESSION_KEY);
  if (legacy !== null) {
    try {
      await AsyncStorage.setItem(SESSION_KEY, legacy);
      await AsyncStorage.removeItem(LEGACY_SESSION_KEY);
    } catch {
      // Keep using the existing value if migration cannot be persisted yet.
    }
  }
  return legacy;
}
const sessionClearedListeners = new Set<() => void>();
let refreshInFlight: { generation: number; refreshToken: string; promise: Promise<Session> } | null = null;
let sessionGeneration = 0;
let storageQueue: Promise<void> = Promise.resolve();

/** Storage changes are ordered. An old network response can never delete a newer sign-in. */
function sessionStorage<T>(operation: () => Promise<T>): Promise<T> {
  const result = storageQueue.then(operation, operation);
  storageQueue = result.then(() => undefined, () => undefined);
  return result;
}
class SessionChangedError extends Error {}
export const getSessionGeneration = () => sessionGeneration;
function assertSessionGeneration(generation: number) {
  if (generation !== sessionGeneration) throw new SessionChangedError('sessionChanged');
}

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

interface ErrorPayload { error?: { code?: AuthErrorCode } }
interface VerifyPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user?: { id?: string; phone?: string };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    res = await fetch(`${API}${path}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // No response at all — aeroplane mode, dead Wi-Fi, captive portal. Worth
    // separating from a rejection, because the customer's fix is different.
    throw new AuthError('offline');
  } finally {
    clearTimeout(timer);
  }
  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError((json as ErrorPayload).error?.code ?? 'unknown');
  return json as T;
}

function fromPayload(d: VerifyPayload, fallback?: Session): Session {
  return {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    userId: d.user?.id ?? fallback?.userId ?? '',
    phone: d.user?.phone ?? fallback?.phone ?? '',
    expiresAt: Math.floor(Date.now() / 1000) + (d.expiresIn ?? 3600),
  };
}

/** Starts sign-in. Development returns its fixed code instead of sending SMS. */
export async function requestOtp(phoneE164: string): Promise<{ developmentCode?: string }> {
  return post<{ sent: boolean; developmentCode?: string }>('/auth/otp', { phone: phoneE164 });
}

/** Exchanges the code for a session. Throws if the code is wrong or expired. */
export async function verifyOtp(phoneE164: string, code: string): Promise<Session> {
  // A newer verification or logout supersedes every older authentication attempt.
  const generation = ++sessionGeneration;
  const payload = await post<VerifyPayload>('/auth/verify', { phone: phoneE164, code });
  const session = fromPayload(payload);
  return sessionStorage(async () => {
    assertSessionGeneration(generation);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    assertSessionGeneration(generation);
    return session;
  });
}

async function readStoredSession(generation: number): Promise<Session | null> {
  return sessionStorage(async () => {
    assertSessionGeneration(generation);
    const raw = await readStoredValue();
    assertSessionGeneration(generation);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Session;
    if (!stored.accessToken || !stored.refreshToken || !stored.expiresAt) throw new AuthError('unknown');
    return stored;
  });
}

/** Concurrent requests share refreshes only within this authentication generation. */
export async function refreshSession(fallback?: Session, generation = sessionGeneration): Promise<Session> {
  assertSessionGeneration(generation);
  const stored = fallback ?? await readStoredSession(generation);
  assertSessionGeneration(generation);
  if (!stored?.refreshToken) throw new AuthError('unknown');
  if (refreshInFlight?.generation === generation && refreshInFlight.refreshToken === stored.refreshToken) {
    return refreshInFlight.promise;
  }
  const promise = (async () => {
    const refreshed = fromPayload(
      await post<VerifyPayload>('/auth/refresh', { refreshToken: stored.refreshToken }), stored,
    );
    return sessionStorage(async () => {
      assertSessionGeneration(generation);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
      assertSessionGeneration(generation);
      return refreshed;
    });
  })().finally(() => {
    if (refreshInFlight?.promise === promise) refreshInFlight = null;
  });
  refreshInFlight = { generation, refreshToken: stored.refreshToken, promise };
  return promise;
}

export async function loadSession(): Promise<Session | null> {
  const generation = sessionGeneration;
  let stored: Session | null = null;
  try {
    stored = await readStoredSession(generation);
    if (!stored) return null;
    if (stored.expiresAt > Math.floor(Date.now() / 1000) + 60) return stored;
    return await refreshSession(stored, generation);
  } catch (error) {
    if (generation !== sessionGeneration || error instanceof SessionChangedError) return null;
    // A network outage does not revoke a valid local identity. Retry refresh next time.
    if (error instanceof AuthError && error.code === 'offline') return stored;
    await clearSession(generation).catch(() => undefined);
    return null;
  }
}

/** Revoke this device session. Offline logout still clears the local credentials. */
async function revokeSession(accessToken: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    await fetch(`${API}/auth/logout`, {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // Local logout remains available when the network or identity service is down.
  } finally { clearTimeout(timeout); }
}

/** With an expected generation, clear only the failed request's own session. */
export async function clearSession(expectedGeneration?: number): Promise<void> {
  if (expectedGeneration !== undefined && expectedGeneration !== sessionGeneration) return;
  const generation = ++sessionGeneration;
  if (expectedGeneration === undefined) {
    const token = await sessionStorage(async () => {
      assertSessionGeneration(generation);
      const raw = await readStoredValue();
      assertSessionGeneration(generation);
      return raw ? (JSON.parse(raw) as Session).accessToken : undefined;
    }).catch(() => undefined);
    if (generation !== sessionGeneration) throw new SessionChangedError('sessionChanged');
    if (token) await revokeSession(token);
  }
  await sessionStorage(async () => {
    if (generation !== sessionGeneration) {
      if (expectedGeneration === undefined) throw new SessionChangedError('sessionChanged');
      return;
    }
    await AsyncStorage.multiRemove([SESSION_KEY, LEGACY_SESSION_KEY]);
    if (generation !== sessionGeneration) {
      if (expectedGeneration === undefined) throw new SessionChangedError('sessionChanged');
      return;
    }
    sessionClearedListeners.forEach((listener) => listener());
  });
}

export function onSessionCleared(listener: () => void) {
  sessionClearedListeners.add(listener);
  return () => sessionClearedListeners.delete(listener);
}

/** The API wants E.164; the field only collects the national part. */
export const toE164 = (national: string) => `+966${national.replace(/\D/g, '')}`;
