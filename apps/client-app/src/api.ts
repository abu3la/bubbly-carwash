import { loadSession } from './auth';

/**
 * The API, which is the only thing this app talks to.
 *
 * Every call carries the session token; the Worker decides what the caller may
 * see. The app never holds a Supabase key and never queries the database.
 */
const API = process.env.EXPO_PUBLIC_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';

export class ApiError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

interface ErrorPayload { error?: { code?: string } }

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
    throw new ApiError('offline');
  }
  const json = await res.json().catch(() => ({}));
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
}

export function saveAddress(input: {
  label: 'home' | 'work' | 'other';
  line: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  notes: string;
}): Promise<{ address: SavedAddress }> {
  return call('/me/addresses', { method: 'POST', body: JSON.stringify({ ...input, isDefault: true }) });
}

export function listAddresses(): Promise<{ addresses: SavedAddress[] }> {
  return call('/me/addresses');
}

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

/* ---------------------------------------------------------------- catalogue */

export interface CataloguePackage {
  id: number;
  washes: number;
  priceMinor: number;
  perMinor: number;
  savePct: number;
  validDays: number;
  best: boolean;
}

export interface Catalogue {
  services: Array<{
    key: string;
    name: { ar: string; en: string };
    blurb: { ar: string; en: string };
    priceMinor: number;
    minutes: number;
  }>;
  addOns: Array<{ key: string; name: { ar: string; en: string }; priceMinor: number }>;
  packages: CataloguePackage[];
  plans: Array<{
    id: string;
    name: { ar: string; en: string };
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

export interface Availability {
  date: string;
  closed: boolean;
  reason: 'friday' | 'full' | 'outsideServiceArea' | null;
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

export function fetchAvailability(lat: number, lng: number, date: string): Promise<Availability> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), date });
  return call(`/catalogue/availability?${query}`);
}
