/**
 * The dashboard talks to the same Worker the app does — there is no second
 * backend and no direct database access. What separates them is the caller's
 * role, checked server-side against `profiles.role`.
 */
const API = import.meta.env.VITE_API_URL ?? 'https://sama-api.samacarwash.workers.dev';
const TOKEN_KEY = 'bubbles.admin.session';
const LEGACY_TOKEN_KEY = 'sama.admin.token';

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: { id: string };
}

export const token = {
  session: (): AdminSession | null => {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as AdminSession; } catch { return null; }
  },
  get: () => token.session()?.accessToken ?? localStorage.getItem(LEGACY_TOKEN_KEY),
  set: (session: AdminSession) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

interface ErrorPayload { error?: { code?: string } }

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAdminSession() {
  if (refreshInFlight) return refreshInFlight;
  const session = token.session();
  if (!session?.refreshToken) return false;
  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      const body = await response.json().catch(() => ({})) as AdminSession;
      if (!response.ok || !body.accessToken || !body.refreshToken) return false;
      token.set(body);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function request(path: string, init: RequestInit = {}, retry = true) {
  const t = token.get();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401 && retry && !path.startsWith('/auth/') && await refreshAdminSession()) {
    return request(path, init, false);
  }
  return res;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await request(path, init);
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    token.clear();
    window.dispatchEvent(new Event('bubbles:session-expired'));
  }
  if (!res.ok) throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown', res.status);
  return json as T;
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
  bookingsWithoutTeam: number;
  teamJobsAwaitingDriver: number;
  staleActiveBookings: number;
  openIncidents: number;
  failedPayments: number;
  invalidPushTokens: number;
  firebaseConfigured: boolean;
  smsMode: 'development-code' | 'taqnyat' | 'not-configured';
  paymentMode: 'live' | 'test' | 'not-configured';
}

export interface CoveragePoint { lat: number; lng: number }
export interface CoverageVilla {
  id: string;
  area_id: string;
  block_id: string;
  villa_number: string;
  active: boolean;
  created_at: string;
}
export interface CoverageBlock {
  id: string;
  area_id: string;
  code: string;
  name_ar: string;
  name_en: string;
  team_id: string;
  active: boolean;
  created_at: string;
  villas: CoverageVilla[];
}
export interface CoverageArea {
  id: string;
  name_ar: string;
  name_en: string;
  city: string;
  boundary: CoveragePoint[];
  boundary_verified: boolean;
  center_lat: number | null;
  center_lng: number | null;
  active: boolean;
  created_at: string;
  blocks: CoverageBlock[];
}
export interface CoverageSnapshot {
  areas: CoverageArea[];
  teams: Array<Pick<Team, 'id' | 'name_ar' | 'name_en' | 'active'>>;
}
export interface CoverageAreaInput {
  nameAr: string;
  nameEn: string;
  city: string;
  boundary: CoveragePoint[];
  boundaryVerified: boolean;
  active: boolean;
}
export interface CoverageBlockInput {
  areaId: string;
  code: string;
  nameAr: string;
  nameEn: string;
  teamId: string;
  active: boolean;
}

export const auth = {
  requestOtp: (phone: string) => call<{ sent: boolean; developmentCode?: string }>('/auth/otp', {
    method: 'POST', body: JSON.stringify({ phone }),
  }),
  verify: (phone: string, code: string) =>
    call<AdminSession>('/auth/verify', {
      method: 'POST', body: JSON.stringify({ phone, code }),
    }),
};

export const admin = {
  coverage: () => call<CoverageSnapshot>('/admin/coverage'),
  createCoverageArea: (body: CoverageAreaInput) =>
    call<{ area: CoverageArea }>('/admin/coverage/areas', { method: 'POST', body: JSON.stringify(body) }),
  updateCoverageArea: (id: string, body: Partial<CoverageAreaInput>) =>
    call<{ area: CoverageArea }>(`/admin/coverage/areas/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createCoverageBlock: (body: CoverageBlockInput) =>
    call<{ block: CoverageBlock }>('/admin/coverage/blocks', { method: 'POST', body: JSON.stringify(body) }),
  updateCoverageBlock: (id: string, body: Partial<CoverageBlockInput>) =>
    call<{ block: CoverageBlock }>(`/admin/coverage/blocks/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  addCoverageVillas: (blockId: string, villaNumbers: string[]) =>
    call<{ villas: CoverageVilla[] }>('/admin/coverage/villas', { method: 'POST', body: JSON.stringify({ blockId, villaNumbers, active: true }) }),
  updateCoverageVilla: (id: string, active: boolean) =>
    call<{ villa: CoverageVilla }>(`/admin/coverage/villas/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ active }) }),
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
  incidents: () => call<{ incidents: Incident[] }>('/admin/incidents'),
  resolveIncident: (id: string) =>
    call<{ incident: Incident }>(`/admin/incidents/${id}/resolve`, { method: 'PATCH' }),
  operations: () => call<OperationsSnapshot>('/admin/operations'),
  refundPayment: (id: string, reason: string) =>
    call<{ refunded: true; amountMinor: number }>(`/admin/payments/${id}/refund`, { method: 'POST', body: JSON.stringify({ reason }) }),
  mediaBlob: async (bookingId: string, mediaId: string) => {
    const response = await request(`/admin/bookings/${bookingId}/media/${mediaId}/content`);
    if (!response.ok) throw new ApiError('mediaUnavailable', response.status);
    return response.blob();
  },
};

/** Halalas in the database, riyals on screen. */
export const sar = (minor: number) => (minor / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
