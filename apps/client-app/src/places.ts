import * as Location from 'expo-location';

/**
 * Device geocoding helpers used after the customer moves the map pin or asks
 * for their current position. Search suggestions themselves come from the
 * Worker-backed Google Places endpoint, so the restricted key never ships in
 * the JavaScript bundle.
 */
export interface Place {
  lat: number;
  lng: number;
  line: string;
  district: string;
  city: string;
}

/** Central Makkah, the pilot service area, used until the device tells us better. */
export const FALLBACK = { lat: 21.4225, lng: 39.8262 };

function toPlace(a: Location.LocationGeocodedAddress, lat: number, lng: number): Place {
  // Apple splits an address differently per country. In Saudi the street tends
  // to land in `street` or `name`, the district in `subregion` or `district`.
  const line = [a.name, a.street].filter(Boolean).join('، ') || a.formattedAddress || '';
  return {
    lat,
    lng,
    line,
    district: a.district ?? a.subregion ?? '',
    city: a.city ?? a.region ?? '',
  };
}

/** Coordinates → an address the customer recognises. */
export async function describe(lat: number, lng: number): Promise<Place> {
  try {
    const [a] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    return a ? toPlace(a, lat, lng) : { lat, lng, line: '', district: '', city: '' };
  } catch {
    // A geocode failure must not block booking: the pin is still valid, and the
    // customer can type the address themselves.
    return { lat, lng, line: '', district: '', city: '' };
  }
}

/** Last-resort typed-address lookup when the Places endpoint is unavailable. */
export async function search(query: string): Promise<Place | null> {
  const q = query.trim();
  if (q.length < 3) return null;
  try {
    const [hit] = await Location.geocodeAsync(q);
    if (!hit) return null;
    return await describe(hit.latitude, hit.longitude);
  } catch {
    return null;
  }
}

/** The device's own position, if the customer allows it. */
export async function currentPosition(): Promise<{ lat: number; lng: number } | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  try {
    const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: p.coords.latitude, lng: p.coords.longitude };
  } catch {
    return null;
  }
}
