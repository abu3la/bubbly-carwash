import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';

export const meRoute = new Hono<{ Bindings: Env }>();
meRoute.use('*', requireAuth());

/** Saudi Arabia's bounding box, give or take. */
const IN_SAUDI = (lat: number, lng: number) =>
  lat >= 15.5 && lat <= 32.5 && lng >= 34.0 && lng <= 56.0;

interface AddressInput {
  label?: 'home' | 'work' | 'other';
  line?: string;
  district?: string;
  city?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  isDefault?: boolean;
}

meRoute.get('/addresses', async (c) => {
  const rows = await db(c.env, `addresses?profile_id=eq.${c.get('caller').id}&order=created_at.desc`);
  return c.json({ addresses: rows });
});

meRoute.post('/addresses', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<AddressInput>();

  if (!body.line?.trim()) return c.json({ error: { code: 'addressLineRequired' } }, 400);

  // Coordinates are optional, but a coordinate that IS sent has to be real.
  // Rejecting (0,0) matters: it is what a broken location permission produces,
  // and it is in the Gulf of Guinea — a technician would be dispatched to the
  // middle of the Atlantic.
  const hasCoords = body.lat !== undefined && body.lng !== undefined;
  if (hasCoords) {
    const { lat, lng } = body as { lat: number; lng: number };
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return c.json({ error: { code: 'badCoordinates' } }, 400);
    }
    if (!IN_SAUDI(lat, lng)) {
      return c.json({ error: { code: 'outsideServiceArea' } }, 400);
    }
  }

  // A customer keeps several addresses — home, work, a relative's place. The
  // first one saved becomes the default because there is nothing to compare it
  // to; later ones only take over if asked. Anything else surprises someone who
  // adds a work address and finds their washes moved there.
  const existing = await db(c.env, `addresses?profile_id=eq.${caller.id}&select=id`);
  const makeDefault = body.isDefault ?? existing.length === 0;

  // The table has a partial unique index on (profile_id) where is_default, so
  // the old default must be demoted first or the insert violates it.
  if (makeDefault && existing.length > 0) {
    await db(c.env, `addresses?profile_id=eq.${caller.id}&is_default=eq.true`, {
      method: 'PATCH',
      body: { is_default: false },
    });
  }

  const [row] = await db(c.env, 'addresses', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      profile_id: caller.id,
      label: body.label ?? 'home',
      line: body.line.trim(),
      district: body.district?.trim() ?? '',
      city: body.city?.trim() ?? '',
      lat: hasCoords ? body.lat : null,
      lng: hasCoords ? body.lng : null,
      notes: body.notes?.trim() ?? '',
      is_default: makeDefault,
    },
  });

  return c.json({ address: row }, 201);
});

/* ------------------------------------------------------------------ vehicles */

interface VehicleInput {
  make?: string;
  model?: string;
  color?: string;
  plate?: string;
  size?: 'sedan' | 'suv' | 'pickup';
  isDefault?: boolean;
}

const SIZES = ['sedan', 'suv', 'pickup'] as const;

meRoute.get('/vehicles', async (c) => {
  const rows = await db(c.env, `vehicles?profile_id=eq.${c.get('caller').id}&order=created_at.desc`);
  return c.json({ vehicles: rows });
});

meRoute.post('/vehicles', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<VehicleInput>();

  if (!body.make?.trim()) return c.json({ error: { code: 'makeRequired' } }, 400);
  if (!body.model?.trim()) return c.json({ error: { code: 'modelRequired' } }, 400);

  // The plate is how the technician identifies the car at the gate, so it is
  // the one field that genuinely cannot be blank.
  const plate = body.plate?.trim() ?? '';
  if (plate.length < 3) return c.json({ error: { code: 'plateRequired' } }, 400);

  const size = SIZES.includes(body.size as never) ? body.size! : 'sedan';

  const existing = await db(c.env, `vehicles?profile_id=eq.${caller.id}&select=id`);
  const makeDefault = body.isDefault ?? existing.length === 0;
  if (makeDefault && existing.length > 0) {
    await db(c.env, `vehicles?profile_id=eq.${caller.id}&is_default=eq.true`, {
      method: 'PATCH',
      body: { is_default: false },
    });
  }

  const [row] = await db(c.env, 'vehicles', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      profile_id: caller.id,
      make: body.make.trim(),
      model: body.model.trim(),
      color: body.color?.trim() ?? '',
      plate,
      size,
      is_default: makeDefault,
    },
  });

  return c.json({ vehicle: row }, 201);
});
