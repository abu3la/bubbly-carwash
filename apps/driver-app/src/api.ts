import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The technician's app talks to the same Worker as everything else. What it may
 * see is decided server-side by `profiles.role` and team membership, not by
 * which app is asking. Unclaimed team jobs are intentionally redacted until a
 * technician claims one; a customer signing in here reaches nothing.
 */
const API = process.env.EXPO_PUBLIC_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';
const SESSION_KEY = 'bubbles.driver.session';
// Compatibility only: migrate existing installations without losing stored data.
const LEGACY_SESSION_KEY = 'sama.driver.session';

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

export type ErrorCode =
  | 'wrongCode'
  | 'tooManyRequests'
  | 'invalidPhone'
  | 'notATechnician'
  | 'skippedStage'
  | 'alreadyPast'
  | 'cancelled'
  | 'notFound'
  | 'beforeMediaRequired'
  | 'afterMediaRequired'
  | 'mediaWrongStage'
  | 'badMediaType'
  | 'badMediaSize'
  | 'storageUnavailable'
  | 'jobClaimed'
  | 'jobClosed'
  | 'jobChanged'
  | 'technicianNotInTeam'
  | 'outsideDriverShift'
  | 'technicianBusy'
  | 'badIncidentCategory'
  | 'incidentNoteRequired'
  | 'offline'
  | 'unknown';

export class ApiError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code);
  }
}

interface ErrorPayload { error?: { code?: ErrorCode } }
interface VerifyPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user?: { id?: string; phone?: string };
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  phone: string;
  /** Epoch seconds. */
  expiresAt: number;
}

export type Stage = 'booked' | 'arrived' | 'washed' | 'verified';

export interface Job {
  id: string;
  ref: string;
  scheduled_at: string;
  ends_at: string;
  status: string;
  stage: Stage;
  service_key: string;
  total_minor: number;
  source: string;
  technician_id: string | null;
  team_id: string;
  customers: { full_name: string; phone: string } | null;
  vehicles: { make: string; model: string; color: string; plate: string | null; size: string } | null;
  addresses: {
    label: string | null;
    line: string;
    district: string;
    city: string;
    lat: number | null;
    lng: number | null;
    notes: string | null;
    villa_number?: string | null;
    coverage_area_id?: string | null;
    coverage_block_id?: string | null;
    coverage_blocks?: { code: string; name_ar: string; name_en: string } | null;
    coverage_areas?: { name_ar: string; name_en: string } | null;
  } | null;
  booking_add_ons: Array<{ add_on_key: string }>;
  booking_media: Array<{
    id: string;
    phase: 'before' | 'after';
    kind: 'photo' | 'video';
    angle: string;
    content_type: string;
    byte_size: number;
    created_at: string;
  }>;
}

async function authPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    res = await fetch(`${API}${path}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('offline');
  } finally {
    clearTimeout(timeout);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown');
  }
  return json as T;
}

function fromPayload(payload: VerifyPayload, fallback?: Session): Session {
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    userId: payload.user?.id ?? fallback?.userId ?? '',
    phone: payload.user?.phone ?? fallback?.phone ?? '',
    expiresAt: Math.floor(Date.now() / 1000) + (payload.expiresIn ?? 3600),
  };
}

async function readStoredSession(generation: number): Promise<Session | null> {
  return sessionStorage(async () => {
    assertSessionGeneration(generation);
    const raw = await readStoredValue();
    assertSessionGeneration(generation);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Session;
    if (!stored.accessToken || !stored.refreshToken || !stored.expiresAt) throw new ApiError('unknown');
    return stored;
  });
}

/** Concurrent requests share refreshes only within this authentication generation. */
async function refreshSession(fallback?: Session, generation = sessionGeneration): Promise<Session> {
  assertSessionGeneration(generation);
  const stored = fallback ?? await readStoredSession(generation);
  assertSessionGeneration(generation);
  if (!stored?.refreshToken) throw new ApiError('unknown');
  if (refreshInFlight?.generation === generation && refreshInFlight.refreshToken === stored.refreshToken) {
    return refreshInFlight.promise;
  }
  const promise = (async () => {
    const refreshed = fromPayload(
      await authPost<VerifyPayload>('/auth/refresh', { refreshToken: stored.refreshToken }), stored,
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

async function authorizedFetch(path: string, init: RequestInit = {}, retry = true, generation = sessionGeneration): Promise<Response> {
  const session = await loadSession();
  if (generation !== sessionGeneration) throw new ApiError('unknown');
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), path.includes('/media?') ? 90000 : 20000);
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    // A technician is often on mobile data in a compound basement. Offline is
    // a normal condition here, not an exceptional crash.
    throw new ApiError('offline');
  } finally {
    clearTimeout(timeout);
  }
  if (generation !== sessionGeneration) throw new ApiError('unknown');
  if (response.status === 401 && retry && session?.refreshToken) {
    try {
      await refreshSession(session, generation);
      return authorizedFetch(path, init, false, generation);
    } catch (error) {
      if (generation !== sessionGeneration) throw new ApiError('unknown');
      if (error instanceof ApiError && error.code === 'offline') throw new ApiError('offline');
      await clearSession(generation).catch(() => undefined);
    }
  }
  return response;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const generation = sessionGeneration;
  const response = await authorizedFetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  const json = await response.json().catch(() => ({}));
  if (generation !== sessionGeneration) throw new ApiError('unknown');
  if (!response.ok) {
    // 403 means signed in but not staff. The fix is using the right app, not
    // repeatedly entering the same code.
    if (response.status === 403) throw new ApiError('notATechnician');
    throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown');
  }
  return json as T;
}

export const normalizePhoneDigits = (value: string) => value
  .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
  .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0))
  .replace(/\D/g, '');
export const toE164 = (national: string) => {
  const digits = normalizePhoneDigits(national).replace(/^(00966|966)/, '').replace(/^0/, '');
  return `+966${digits}`;
};

export async function requestOtp(phone: string) {
  return authPost<{ sent: true; developmentCode?: string }>('/auth/otp', { phone });
}

export async function verifyOtp(phone: string, code: string): Promise<Session> {
  // A newer verification or logout supersedes every older authentication attempt.
  const generation = ++sessionGeneration;
  const payload = await authPost<VerifyPayload>('/auth/verify', { phone: phone, code });
  const session = fromPayload(payload);
  return sessionStorage(async () => {
    assertSessionGeneration(generation);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    assertSessionGeneration(generation);
    return session;
  });
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
    if (error instanceof ApiError && error.code === 'offline') return stored;
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

export const signOut = clearSession;

export interface DriverProfile { id: string; full_name: string; phone: string; role: string }
export const driverProfile = () => call<{ profile: DriverProfile }>('/me');

export interface DriverTeam {
  id: string;
  name_ar: string;
  coverage_blocks: Array<{
    id: string;
    code: string;
    name_ar: string;
    name_en: string;
    coverage_areas: { id: string; name_ar: string; name_en: string } | null;
  }>;
}
export const jobs = () => call<{ team: DriverTeam | null; jobs: Job[] }>('/driver/jobs');
export const doneJobs = () => call<{ jobs: Job[] }>('/driver/jobs/done');

export const claimJob = (id: string) =>
  call<{ booking: { id: string; technician_id: string } }>(`/driver/jobs/${id}/claim`, { method: 'POST' });

export const advance = (id: string, stage: Stage, note?: string) =>
  call<{ booking: { ref: string; stage: Stage; status: string } }>(`/driver/jobs/${id}/stage`, {
    method: 'POST',
    body: JSON.stringify({ stage, note }),
  });

export interface EvidenceAsset {
  uri: string;
  mimeType?: string | null;
  type?: string | null;
  fileSize?: number;
}

/** Uploads one private photo or 360 video. The object never receives a public URL. */
export async function uploadEvidence(
  id: string,
  phase: 'before' | 'after',
  angle: 'front' | 'right' | 'rear' | 'left' | '360',
  asset: EvidenceAsset,
) {
  const generation = sessionGeneration;
  const session = await loadSession();
  if (generation !== sessionGeneration) throw new ApiError('unknown');
  if (!session) throw new ApiError('notATechnician');

  let blob: Blob;
  try {
    blob = await (await fetch(asset.uri)).blob();
  } catch {
    throw new ApiError('offline');
  }

  const contentType = asset.mimeType ?? (asset.type === 'video' ? 'video/mp4' : 'image/jpeg');
  const res = await authorizedFetch(`/driver/jobs/${id}/media?phase=${phase}&angle=${angle}`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'X-File-Size': String(asset.fileSize ?? blob.size),
    },
    body: blob,
  }, true, generation);

  const json = await res.json().catch(() => ({}));
  if (generation !== sessionGeneration) throw new ApiError('unknown');
  if (!res.ok) throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown');
  return json as { media: Job['booking_media'][number] };
}

/** The beat after this one. `null` when the job is finished. */
export function nextStage(current: Stage): Stage | null {
  return { booked: 'arrived', arrived: 'washed', washed: 'verified', verified: null }[current] as Stage | null;
}

export interface DriverNotification {
  id: string;
  booking_id: string | null;
  kind: string;
  title_ar: string;
  body_ar: string;
  read_at: string | null;
  created_at: string;
}
export const notifications = () => call<{ notifications: DriverNotification[] }>('/me/notifications');
export const readNotification = (id: string) => call(`/me/notifications/${id}/read`, { method: 'PATCH' });
export const registerPushToken = (token: string, platform: 'ios' | 'android') =>
  call<{ registered: boolean }>('/me/push-token', { method: 'POST', body: JSON.stringify({ token, platform, app: 'driver' }) });
export const unregisterPushToken = (token: string) =>
  call<{ unregistered: boolean }>('/me/push-token', { method: 'DELETE', body: JSON.stringify({ token }) });

export interface DriverIncident {
  id: string;
  booking_id: string;
  category: string;
  note: string;
  status: 'open' | 'resolved';
  created_at: string;
}
export const incidents = () => call<{ incidents: DriverIncident[] }>('/driver/incidents');
export const reportIncident = (bookingId: string, category: string, note: string) =>
  call<{ incident: DriverIncident }>(`/driver/jobs/${bookingId}/incidents`, {
    method: 'POST', body: JSON.stringify({ category, note }),
  });
