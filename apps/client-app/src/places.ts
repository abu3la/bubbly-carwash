import * as Location from 'expo-location';

/**
 * Places, through the operating system.
 *
 * No Google key: iOS answers these from Apple's geocoder, which costs nothing
 * and needs no billing account. What it does not give is autocomplete — there
 * is no suggestion list, so the customer types an address and we resolve it.
 * Google Places would add that, and knows Saudi districts better; this is the
 * version that works today.
 */
export interface Place {
  lat: number;
  lng: number;
  line: string;
  district: string;
  city: string;
}

/** Makkah, used until the device tells us better. */
export const FALLBACK = { lat: 21.3891, lng: 39.8579 };

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

/** Typed address → coordinates. This is the free stand-in for autocomplete. */
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
