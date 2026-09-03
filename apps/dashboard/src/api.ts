/**
 * The dashboard talks to the same Worker the app does — there is no second
 * backend and no direct database access. What separates them is the caller's
 * role, checked server-side against `profiles.role`.
 */
const API = 'https://sama-api.samacarwash.workers.dev';
const TOKEN_KEY = 'sama.admin.token';

export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token.get();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...init.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((json as any)?.error?.code ?? 'unknown', res.status);
  return json as T;
}

export interface Package {
  id: number;
  washes: number;
  price_minor: number;
  per_minor: number;
  save_pct: number;
  valid_days: number;
  best: boolean;
  active: boolean;
}

export interface Plan {
  id: string;
  name_ar: string;
  name_en: string;
  price_minor: number;
  credits: number;
  weekly: number;
  roll: number;
  best: boolean;
  active: boolean;
}

export interface Service {
  key: string;
  name_ar: string;
  name_en: string;
  price_minor: number;
  minutes: number;
  active: boolean;
}

export const auth = {
  requestOtp: (phone: string) => call<{ sent: boolean }>('/auth/otp', {
    method: 'POST', body: JSON.stringify({ phone }),
  }),
  verify: (phone: string, code: string) =>
    call<{ accessToken: string; user: { id: string } }>('/auth/verify', {
      method: 'POST', body: JSON.stringify({ phone, code }),
    }),
};

export const admin = {
  packages: () => call<{ packages: Package[] }>('/admin/packages'),
  updatePackage: (id: number, patch: Record<string, unknown>) =>
    call<{ package: Package }>(`/admin/packages/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  plans: () => call<{ plans: Plan[] }>('/admin/plans'),
  updatePlan: (id: string, patch: Record<string, unknown>) =>
    call<{ plan: Plan }>(`/admin/plans/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  services: () => call<{ services: Service[] }>('/admin/services'),
  updateService: (key: string, patch: Record<string, unknown>) =>
    call<{ service: Service }>(`/admin/services/${key}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  bookings: () => call<{ bookings: any[] }>('/admin/bookings'),
};

/** Halalas in the database, riyals on screen. */
export const sar = (minor: number) => (minor / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
