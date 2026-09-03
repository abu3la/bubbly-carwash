import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The technician's app talks to the same Worker as everything else. What it may
 * see is decided server-side by `profiles.role`, not by which app is asking —
 * so a customer signing in here reaches nothing.
 */
const API = process.env.EXPO_PUBLIC_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';
const SESSION_KEY = 'sama.driver.session';

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
  user?: { id?: string; phone?: string };
}

export interface Session {
  accessToken: string;
  userId: string;
  phone: string;
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
  vehicles: { make: string; model: string; color: string; plate: string; size: string } | null;
  addresses: {
    label: string;
    line: string;
    district: string;
    city: string;
    lat: number | null;
    lng: number | null;
    notes: string;
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

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await loadSession();
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    // A technician is often on mobile data in a compound basement. Offline is a
    // normal condition here, not an exception.
    throw new ApiError('offline');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // 403 means signed in but not staff — worth its own message, since the
    // fix is "you have the wrong app", not "try again".
    if (res.status === 403) throw new ApiError('notATechnician');
    throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown');
  }
  return json as T;
}

export const toE164 = (national: string) => `+966${national.replace(/\D/g, '')}`;

export async function requestOtp(phone: string) {
  await call('/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) });
}

export async function verifyOtp(phone: string, code: string): Promise<Session> {
  const d = await call<VerifyPayload>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
  const session: Session = {
    accessToken: d.accessToken,
    userId: d.user?.id ?? '',
    phone: d.user?.phone ?? '',
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

export const signOut = () => AsyncStorage.removeItem(SESSION_KEY);

export const jobs = () => call<{ team: { id: string; name_ar: string } | null; jobs: Job[] }>('/driver/jobs');
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
  angle: 'general' | '360',
  asset: EvidenceAsset,
) {
  const session = await loadSession();
  if (!session) throw new ApiError('notATechnician');

  let blob: Blob;
  try {
    blob = await (await fetch(asset.uri)).blob();
  } catch {
    throw new ApiError('offline');
  }

  const contentType = asset.mimeType ?? (asset.type === 'video' ? 'video/mp4' : 'image/jpeg');
  let res: Response;
  try {
    res = await fetch(`${API}/driver/jobs/${id}/media?phase=${phase}&angle=${angle}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': contentType,
        'X-File-Size': String(asset.fileSize ?? blob.size),
      },
      body: blob,
    });
  } catch {
    throw new ApiError('offline');
  }

  const json = await res.json().catch(() => ({}));
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
