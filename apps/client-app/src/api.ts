import { AuthError, clearSession, getSessionGeneration, loadSession, refreshSession } from './auth';

/**
 * The API, which is the only thing this app talks to.
 *
 * Every call carries the session token; the Worker decides what the caller may
 * see. The app never holds a Supabase key and never queries the database.
 */
const API = process.env.EXPO_PUBLIC_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';
export const API_ORIGIN = new URL(API).origin;

export class ApiError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

interface ErrorPayload { error?: { code?: string } }

async function authorizedFetch(path: string, init: RequestInit = {}, retry = true, generation = getSessionGeneration()): Promise<Response> {
  const session = await loadSession();
  if (generation !== getSessionGeneration()) throw new ApiError('unauthorized');
  let response: Response;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError('offline');
  } finally {
    clearTimeout(timer);
  }
  if (generation !== getSessionGeneration()) throw new ApiError('unauthorized');
  if (response.status === 401 && retry && session?.refreshToken) {
    try {
      await refreshSession(session, generation);
      return authorizedFetch(path, init, false, generation);
    } catch (error) {
      if (generation !== getSessionGeneration()) throw new ApiError('unauthorized');
      if (error instanceof AuthError && error.code === 'offline') throw new ApiError('offline');
      await clearSession(generation).catch(() => undefined);
    }
  }
  return response;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const generation = getSessionGeneration();
  const res = await authorizedFetch(path, init);
  const json = await res.json().catch(() => ({}));
  if (generation !== getSessionGeneration()) throw new ApiError('unauthorized');
  if (!res.ok) throw new ApiError((json as ErrorPayload).error?.code ?? 'unknown');
  return json as T;
}

export interface SavedAddress {
  id: string;
  label: string;
  line: string;
  district: string;
  city: string;
  lat: number | null;
  lng: number | null;
  notes: string;
  is_default: boolean;
  villa_number: string | null;
  coverage_area_id: string | null;
  coverage_block_id: string | null;
}

export function saveAddress(input: {
  label: 'home' | 'work' | 'other';
  line: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  notes: string;
  villaNumber: string;
}): Promise<{ address: SavedAddress }> {
  return call('/me/addresses', { method: 'POST', body: JSON.stringify({ ...input, isDefault: true }) });
}

export function listAddresses(): Promise<{ addresses: SavedAddress[] }> {
  return call('/me/addresses');
}

export const setDefaultAddress = (id: string): Promise<{ address: SavedAddress }> =>
  call(`/me/addresses/${id}/default`, { method: 'PATCH' });
export const deleteAddress = (id: string): Promise<{ deleted: true }> =>
  call(`/me/addresses/${id}`, { method: 'DELETE' });

export interface SavedVehicle {
  id: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  size: 'sedan' | 'suv' | 'pickup';
  is_default: boolean;
}

export function saveVehicle(input: {
  make: string;
  model: string;
  color: string;
  plate: string;
  size: 'sedan' | 'suv' | 'pickup';
}): Promise<{ vehicle: SavedVehicle }> {
  return call('/me/vehicles', { method: 'POST', body: JSON.stringify(input) });
}

export function listVehicles(): Promise<{ vehicles: SavedVehicle[] }> {
  return call('/me/vehicles');
}

export const setDefaultVehicle = (id: string): Promise<{ vehicle: SavedVehicle }> =>
  call(`/me/vehicles/${id}/default`, { method: 'PATCH' });
export const deleteVehicle = (id: string): Promise<{ deleted: true }> =>
  call(`/me/vehicles/${id}`, { method: 'DELETE' });

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  language: 'ar' | 'en';
  role: 'customer' | 'driver' | 'admin';
}
export const fetchMe = (): Promise<{ profile: Profile }> => call('/me');
export const updateProfile = (fullName: string, language: 'ar' | 'en'): Promise<{ profile: Profile }> =>
  call('/me', { method: 'PATCH', body: JSON.stringify({ fullName, language }) });

/* ---------------------------------------------------------------- catalogue */

export interface Catalogue {
  services: Array<{
    key: string;
    name: { ar: string; en: string };
    blurb: { ar: string; en: string };
    priceMinor: number;
    minutes: number;
  }>;
  addOns: Array<{ key: string; name: { ar: string; en: string }; priceMinor: number }>;
  plans: Array<{
    id: string;
    name: { ar: string; en: string };
    serviceKey: 'exterior' | 'full';
    priceMinor: number;
    credits: number;
    weekly: number;
    roll: number;
    best: boolean;
  }>;
  slots: Array<{
    period: 'morning' | 'afternoon' | 'night';
    startsAt: string;
    endsAt: string;
    priorityOnly: boolean;
  }>;
}

/** Public — no session needed, so a browsing customer sees real prices. */
export function fetchCatalogue(): Promise<Catalogue> {
  return call('/catalogue');
}

export interface CoverageArea {
  id: string;
  name_ar: string;
  name_en: string;
  city: string;
  center_lat: number;
  center_lng: number;
  boundary: Array<{ lat: number; lng: number }>;
  boundary_verified: boolean;
}
export const listCoverageAreas = (): Promise<{ areas: CoverageArea[] }> => call('/catalogue/coverage');

export interface Coverage {
  status: 'outside' | 'villaRequired' | 'villaUnavailable' | 'covered' | 'areaUnavailable';
  area: { id: string; name: { ar: string; en: string }; city: string } | null;
  block: { id: string; code: string; name: { ar: string; en: string } } | null;
  team: { id: string; name: { ar: string; en: string } } | null;
  villaNumber: string | null;
}

export function checkCoverage(lat: number, lng: number, villaNumber?: string): Promise<Coverage> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (villaNumber) query.set('villaNumber', villaNumber);
  return call(`/catalogue/coverage?${query}`);
}

export const hasVillaAddress = (address: SavedAddress | null | undefined): boolean =>
  Boolean(address?.villa_number && address.coverage_area_id && address.coverage_block_id
    && address.lat != null && address.lng != null);

export interface Availability {
  date: string;
  closed: boolean;
  reason: 'friday' | 'full' | 'outsideServiceArea' | 'villaRequired' | 'villaUnavailable' | 'areaUnavailable' | 'coverageUnavailable' | null;
  coverage?: Coverage;
  covered: boolean;
  team: null | {
    id: string;
    name: { ar: string; en: string };
    distanceKm: number;
    dailyCapacity: number;
  };
  slots: Array<{
    period: 'morning' | 'afternoon' | 'night';
    startsAt: string;
    endsAt: string;
    remaining: number;
  }>;
}

export function fetchAvailability(lat: number, lng: number, date: string, villaNumber: string): Promise<Availability> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), date, villaNumber });
  return call(`/catalogue/availability?${query}`);
}

/* ------------------------------------------------------------------- places */

export interface PlaceSuggestion {
  id: string;
  text: string;
  main: string;
  secondary: string;
}

export interface GooglePlace {
  id: string;
  lat: number;
  lng: number;
  line: string;
  district: string;
  city: string;
}

export function autocompletePlaces(
  query: string,
  near: { lat: number; lng: number },
  language: 'ar' | 'en',
): Promise<{ suggestions: PlaceSuggestion[] }> {
  const params = new URLSearchParams({
    q: query,
    lat: String(near.lat),
    lng: String(near.lng),
    language,
  });
  return call(`/places/autocomplete?${params}`);
}

export function fetchGooglePlace(id: string, language: 'ar' | 'en'): Promise<{ place: GooglePlace }> {
  const params = new URLSearchParams({ language });
  return call(`/places/${encodeURIComponent(id)}?${params}`);
}

/* ---------------------------------------------------------------- bookings */

export interface RealBooking {
  id: string;
  ref: string;
  scheduled_at: string;
  ends_at: string;
  status: 'scheduled' | 'active' | 'done' | 'cancelled' | 'missed';
  stage: 'booked' | 'arrived' | 'washed' | 'verified';
  source: 'club' | 'package' | 'cash';
  membership_id: string | null;
  total_minor: number;
  payment_confirmed: boolean;
  vehicles: Pick<SavedVehicle, 'id' | 'make' | 'model' | 'color' | 'plate' | 'size'>;
  addresses: Pick<SavedAddress, 'id' | 'label' | 'line' | 'district' | 'city' | 'lat' | 'lng' | 'notes'>;
  services: { key: string; name_ar: string; name_en: string };
  teams: { id: string; name_ar: string; name_en: string } | null;
  booking_media: Array<{ id: string; phase: 'before' | 'after'; kind: 'photo' | 'video'; angle: string }>;
}

export const listBookings = (): Promise<{ bookings: RealBooking[] }> => call('/bookings');
export const createBooking = (input: {
  vehicleId: string;
  addressId: string;
  serviceKey: string;
  slotStart: string;
  source: 'club' | 'cash';
  addOns: string[];
}): Promise<{ booking: RealBooking; checkoutUrl: string | null }> =>
  call('/bookings', { method: 'POST', body: JSON.stringify(input) });
export const confirmBooking = (id: string): Promise<{ booking: RealBooking }> =>
  call(`/bookings/${id}/confirm`, { method: 'POST' });
export const cancelBooking = (id: string): Promise<{ cancelled: true }> =>
  call(`/bookings/${id}/cancel`, { method: 'POST' });

export async function bookingMediaSource(bookingId: string, mediaId: string) {
  const session = await loadSession();
  if (!session) throw new ApiError('unauthorized');
  return {
    uri: `${API}/bookings/${bookingId}/media/${mediaId}/content`,
    headers: { Authorization: `Bearer ${session.accessToken}` },
  };
}

/* ------------------------------------------------------------ notifications */

export interface CustomerNotification {
  id: string;
  booking_id: string | null;
  kind: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  read_at: string | null;
  created_at: string;
}
export const listNotifications = (): Promise<{ notifications: CustomerNotification[] }> => call('/me/notifications');
export const markNotificationRead = (id: string) => call(`/me/notifications/${id}/read`, { method: 'PATCH' });
export const registerPushToken = (deviceToken: string, platform: 'ios' | 'android') =>
  call<{ registered: boolean }>('/me/push-token', {
    method: 'POST', body: JSON.stringify({ token: deviceToken, platform, app: 'customer' }),
  });
export const unregisterPushToken = (deviceToken: string) =>
  call<{ unregistered: boolean }>('/me/push-token', {
    method: 'DELETE', body: JSON.stringify({ token: deviceToken }),
  });

/* ------------------------------------------------------------- memberships */

export interface RealMembership {
  renewal?: { enabled: boolean; nextChargeAt: string; amountMinor: number } | null;
  id: string;
  plan_id: string;
  state: 'active' | 'paused' | 'cancelled';
  cycle_start: string;
  cycle_end: string;
  payment_confirmed: boolean;
  usedThisWeek: number;
  /** Original selected days/times in Riyadh; omitted by older API versions. */
  weeklySchedule?: Array<{ weekday: number; time: string }>;
  plans: { id: string; name_ar: string; name_en: string; price_minor: number; weekly: number };
}

export const fetchMembership = (): Promise<{ membership: RealMembership | null }> =>
  call('/memberships/current');
export const createMembershipCheckout = (input: {
  planId: string;
  slots: Array<{ vehicleId: string; addressId: string; serviceKey: string; slotStart: string; addOns: string[] }>;
}): Promise<{ membershipId: string; checkoutUrl: string; occurrenceCount: number }> =>
  call('/memberships/checkout', { method: 'POST', body: JSON.stringify(input) });
export const confirmMembership = (id: string): Promise<{ membership: RealMembership; bookings: RealBooking[] }> =>
  call(`/memberships/${id}/confirm`, { method: 'POST' });
export const abandonMembership = (id: string): Promise<{ cancelled: true }> =>
  call(`/memberships/${id}/abandon`, { method: 'POST' });
export const cancelMembership = (): Promise<{ cancelled: true }> =>
  call('/memberships/current/cancel', { method: 'POST' });

export const cancelMembershipRenewal = (): Promise<{ cancelled: boolean }> => call('/memberships/current/renewal/cancel', { method: 'POST' });
