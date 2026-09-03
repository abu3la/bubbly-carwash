/**
 * The dashboard talks to the same Worker the app does — there is no second
 * backend and no direct database access. What separates them is the caller's
 * role, checked server-side against `profiles.role`.
 */
const API = import.meta.env.VITE_API_URL ?? 'https://sama-api.samacarwash.workers.dev';
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

interface ErrorPayload { error?: { code?: string } }

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
  if (!res.ok) throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown', res.status);
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

export interface Team {
  id: string;
  name_ar: string;
  name_en: string;
  lat: number;
  lng: number;
  service_radius_km: number;
  daily_capacity: number;
  active: boolean;
  sort: number;
  members: TeamMember[];
}

export interface TeamMember {
  team_id: string;
  profile_id: string;
  active: boolean;
  available: boolean;
  is_lead: boolean;
  shift_start: string;
  shift_end: string;
  profiles: { id: string; full_name: string; phone: string; active: boolean };
}

export interface Technician {
  id: string;
  full_name: string;
  phone: string;
  active: boolean;
  pending?: boolean;
  created_at: string;
  team_members: Array<{
    team_id: string;
    active: boolean;
    available: boolean;
    is_lead: boolean;
    shift_start: string;
    shift_end: string;
    teams: { id: string; name_ar: string; active: boolean };
  }>;
}

export interface AdminBooking {
  id: string;
  ref: string;
  scheduled_at: string;
  service_key: string;
  source: string;
  total_minor: number;
  status: string;
  stage: string;
  teams: { id: string; name_ar: string } | null;
  technician: { id: string; full_name: string; phone: string } | null;
  profiles: { full_name: string; phone: string } | null;
  vehicles: { make: string; model: string; color: string; plate: string; size: string };
  addresses: { label: string; line: string; district: string; city: string; lat: number | null; lng: number | null; notes: string };
  services: { name_ar: string; name_en: string };
  booking_media: Array<{ id: string; phase: 'before' | 'after'; kind: 'photo' | 'video'; angle: string; content_type: string; byte_size: number }>;
  payments: Array<{ id: string; state: string; provider: string; provider_ref: string; amount_minor: number; created_at: string }>;
}

export interface Incident {
  id: string;
  booking_id: string;
  category: string;
  note: string;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  bookings: { ref: string; team_id: string };
  profiles: { full_name: string; phone: string };
}

export interface OperationsSnapshot {
  checkedAt: string;
  unassignedBookings: number;
  staleActiveBookings: number;
  openIncidents: number;
  failedPayments: number;
  invalidPushTokens: number;
  firebaseConfigured: boolean;
  smsMode: 'development-code' | 'taqnyat' | 'not-configured';
  paymentMode: 'live' | 'test' | 'not-configured';
}

export const auth = {
  requestOtp: (phone: string) => call<{ sent: boolean; developmentCode?: string }>('/auth/otp', {
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
  bookings: () => call<{ bookings: AdminBooking[] }>('/admin/bookings'),
  teams: () => call<{ teams: Team[] }>('/admin/teams'),
  updateTeam: (id: string, patch: Record<string, unknown>) =>
    call<{ team: Team }>(`/admin/teams/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  technicians: () => call<{ technicians: Technician[] }>('/admin/technicians'),
  createTechnician: (phone: string, name: string, teamId: string) =>
    call<{ technician: Technician }>('/admin/technicians', { method: 'POST', body: JSON.stringify({ phone, name, teamId }) }),
  updateTechnician: (id: string, patch: { active?: boolean; name?: string }) =>
    call<{ technician: Technician }>(`/admin/technicians/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  setTechnicianTeam: (id: string, patch: { teamId: string | null; available?: boolean; isLead?: boolean; shiftStart?: string; shiftEnd?: string }) =>
    call<{ membership: TeamMember | null }>(`/admin/technicians/${id}/team`, { method: 'PUT', body: JSON.stringify(patch) }),
  assignBooking: (id: string, technicianId: string | null) =>
    call<{ booking: AdminBooking }>(`/admin/bookings/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ technicianId }) }),
  incidents: () => call<{ incidents: Incident[] }>('/admin/incidents'),
  resolveIncident: (id: string) =>
    call<{ incident: Incident }>(`/admin/incidents/${id}/resolve`, { method: 'PATCH' }),
  operations: () => call<OperationsSnapshot>('/admin/operations'),
  refundPayment: (id: string, reason: string) =>
    call<{ refunded: true; amountMinor: number }>(`/admin/payments/${id}/refund`, { method: 'POST', body: JSON.stringify({ reason }) }),
  mediaBlob: async (bookingId: string, mediaId: string) => {
    const t = token.get();
    const response = await fetch(`${API}/admin/bookings/${bookingId}/media/${mediaId}/content`, {
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    });
    if (!response.ok) throw new ApiError('mediaUnavailable', response.status);
    return response.blob();
  },
};

/** Halalas in the database, riyals on screen. */
export const sar = (minor: number) => (minor / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
