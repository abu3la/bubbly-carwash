import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth } from '../middleware/auth';

export const placesRoute = new Hono<{ Bindings: Env }>();
placesRoute.use('*', requireAuth());

const GOOGLE_PLACES = 'https://places.googleapis.com/v1';
const PLACE_ID = /^[A-Za-z0-9_-]{5,256}$/;

interface Prediction {
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
}

interface AddressComponent {
  longText?: string;
  types?: string[];
}

function googleHeaders(env: Env, fields: string) {
  return {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY!,
    'X-Goog-FieldMask': fields,
  };
}

function component(components: AddressComponent[] | undefined, ...types: string[]) {
  return components?.find((item) => types.some((type) => item.types?.includes(type)))?.longText ?? '';
}

/** Saudi-only address suggestions, biased towards the customer's current map centre. */
placesRoute.get('/autocomplete', async (c) => {
  if (!c.env.GOOGLE_PLACES_API_KEY) {
    return c.json({ error: { code: 'placesUnavailable' } }, 503);
  }

  const input = (c.req.query('q') ?? '').trim().slice(0, 160);
  if (input.length < 3) return c.json({ suggestions: [] });

  const lat = Number(c.req.query('lat'));
  const lng = Number(c.req.query('lng'));
  const language = c.req.query('language') === 'en' ? 'en' : 'ar';
  const hasBias = Number.isFinite(lat) && lat >= -90 && lat <= 90
    && Number.isFinite(lng) && lng >= -180 && lng <= 180;

  const response = await fetch(`${GOOGLE_PLACES}/places:autocomplete`, {
    method: 'POST',
    headers: googleHeaders(
      c.env,
      'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
    ),
    body: JSON.stringify({
      input,
      includedRegionCodes: ['sa'],
      languageCode: language,
      regionCode: 'SA',
      ...(hasBias
        ? {
            locationBias: {
              circle: { center: { latitude: lat, longitude: lng }, radius: 50_000 },
            },
          }
        : {}),
    }),
  });

  if (!response.ok) return c.json({ error: { code: 'placesUpstream' } }, 502);
  const payload = await response.json() as { suggestions?: Array<{ placePrediction?: Prediction }> };
  c.header('Cache-Control', 'private, max-age=30');
  return c.json({
    suggestions: (payload.suggestions ?? []).flatMap(({ placePrediction }) => {
      if (!placePrediction?.placeId) return [];
      return [{
        id: placePrediction.placeId,
        text: placePrediction.text?.text ?? '',
        main: placePrediction.structuredFormat?.mainText?.text ?? placePrediction.text?.text ?? '',
        secondary: placePrediction.structuredFormat?.secondaryText?.text ?? '',
      }];
    }),
  });
});

/** Coordinates and a compact address for one selected Google Place ID. */
placesRoute.get('/:id', async (c) => {
  if (!c.env.GOOGLE_PLACES_API_KEY) {
    return c.json({ error: { code: 'placesUnavailable' } }, 503);
  }

  const id = c.req.param('id');
  if (!PLACE_ID.test(id)) return c.json({ error: { code: 'badPlaceId' } }, 400);
  const language = c.req.query('language') === 'en' ? 'en' : 'ar';
  const url = new URL(`${GOOGLE_PLACES}/places/${encodeURIComponent(id)}`);
  url.searchParams.set('languageCode', language);
  url.searchParams.set('regionCode', 'SA');

  const response = await fetch(url, {
    headers: googleHeaders(c.env, 'id,formattedAddress,shortFormattedAddress,location,addressComponents'),
  });
  if (!response.ok) return c.json({ error: { code: 'placesUpstream' } }, 502);

  const place = await response.json() as {
    id?: string;
    formattedAddress?: string;
    shortFormattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    addressComponents?: AddressComponent[];
  };
  const lat = Number(place.location?.latitude);
  const lng = Number(place.location?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return c.json({ error: { code: 'placeWithoutLocation' } }, 502);
  }

  c.header('Cache-Control', 'private, max-age=86400');
  return c.json({
    place: {
      id: place.id ?? id,
      lat,
      lng,
      line: place.shortFormattedAddress ?? place.formattedAddress ?? '',
      district: component(
        place.addressComponents,
        'sublocality_level_1',
        'sublocality',
        'administrative_area_level_2',
      ),
      city: component(place.addressComponents, 'locality', 'administrative_area_level_1'),
    },
  });
});
