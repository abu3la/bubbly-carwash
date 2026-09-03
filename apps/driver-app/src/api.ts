import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The technician's app talks to the same Worker as everything else. What it may
 * see is decided server-side by `profiles.role`, not by which app is asking —
 * so a customer signing in here reaches nothing.
 */
const API = 'https://sama-api.samacarwash.workers.dev';
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
  | 'offline'
  | 'unknown';

export class ApiError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code);
  }
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
    throw new ApiError(((json as any)?.error?.code as ErrorCode) ?? 'unknown');
  }
  return json as T;
}

export const toE164 = (national: string) => `+966${national.replace(/\D/g, '')}`;

export async function requestOtp(phone: string) {
  await call('/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) });
}

export async function verifyOtp(phone: string, code: string): Promise<Session> {
  const d = await call<any>('/auth/verify', {
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

export const jobs = () => call<{ jobs: Job[] }>('/driver/jobs');
export const doneJobs = () => call<{ jobs: Job[] }>('/driver/jobs/done');

export const advance = (id: string, stage: Stage, note?: string) =>
  call<{ booking: { ref: string; stage: Stage; status: string } }>(`/driver/jobs/${id}/stage`, {
    method: 'POST',
    body: JSON.stringify({ stage, note }),
  });

/** The beat after this one. `null` when the job is finished. */
export function nextStage(current: Stage): Stage | null {
  return { booked: 'arrived', arrived: 'washed', washed: 'verified', verified: null }[current] as Stage | null;
}
