import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';
import { checkCoverage, coverageError, normalizeVilla, validVilla } from '../coverage';

export const meRoute = new Hono<{ Bindings: Env }>();
meRoute.use('*', requireAuth());
meRoute.onError((error, c) => {
  const code = ['outsideServiceArea', 'villaRequired', 'villaUnavailable', 'coverageUnavailable'].find((candidate) => error.message.includes(candidate));
  if (code) return c.json({ error: { code } }, 409);
  console.error('[me]', error);
  return c.json({ error: { code: 'unknown' } }, 500);
});

meRoute.get('/', async (c) => {
  const caller = c.get('caller');
  const [profile] = await db(c.env, `profiles?id=eq.${caller.id}&select=id,full_name,phone,language,role,created_at`);
  return c.json({ profile: { ...profile, phone: profile?.phone || caller.phone } });
});

meRoute.patch('/', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<{ fullName?: string; language?: 'ar' | 'en' }>();
  const fullName = body.fullName?.trim();
  if (!fullName || fullName.length < 2 || fullName.length > 80) {
    return c.json({ error: { code: 'invalidName' } }, 400);
  }
  if (body.language !== undefined && !['ar', 'en'].includes(body.language)) {
    return c.json({ error: { code: 'invalidLanguage' } }, 400);
  }
  const [profile] = await db(c.env, `profiles?id=eq.${caller.id}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: { full_name: fullName, ...(body.language ? { language: body.language } : {}) },
  });
  if (!profile) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ profile });
});

/* ------------------------------------------------------------ notifications */

meRoute.get('/notifications', async (c) => {
  const caller = c.get('caller');
  const rows = await db(
    c.env,
    `notifications?profile_id=eq.${caller.id}` +
      '&select=id,booking_id,kind,title_ar,title_en,body_ar,body_en,data,read_at,created_at' +
      '&order=created_at.desc&limit=100',
  );
  return c.json({ notifications: rows });
});

meRoute.patch('/notifications/:id/read', async (c) => {
  const caller = c.get('caller');
  const [row] = await db(
    c.env,
    `notifications?id=eq.${c.req.param('id')}&profile_id=eq.${caller.id}`,
    { method: 'PATCH', prefer: 'return=representation', body: { read_at: new Date().toISOString() } },
  );
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ notification: row });
});

meRoute.post('/push-token', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<{ token?: string; app?: string; platform?: string }>();
  // Native registration token issued by Firebase Messaging. FCM tokens are
  // opaque and their format is not a public contract, so validate size rather
  // than rejecting a future valid token by prefix.
  if (!body.token || body.token.length < 32 || body.token.length > 4096) {
    return c.json({ error: { code: 'invalidPushToken' } }, 400);
  }
  if (!['customer', 'driver'].includes(body.app ?? '') || !['ios', 'android'].includes(body.platform ?? '')) {
    return c.json({ error: { code: 'invalidPushClient' } }, 400);
  }
  const [row] = await db(c.env, 'device_push_tokens?on_conflict=token', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      profile_id: caller.id,
      token: body.token,
      app: body.app,
      platform: body.platform,
      active: true,
      updated_at: new Date().toISOString(),
    },
  });
  return c.json({ registered: Boolean(row) });
});

meRoute.delete('/push-token', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<{ token?: string }>();
  if (body.token) {
    await db(c.env, `device_push_tokens?profile_id=eq.${caller.id}&token=eq.${encodeURIComponent(body.token)}`, {
      method: 'PATCH', prefer: 'return=minimal', body: { active: false, updated_at: new Date().toISOString() },
    });
  }
  return c.json({ unregistered: true });
});

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
  villaNumber?: string;
}

meRoute.get('/addresses', async (c) => {
  const rows = await db(c.env, `addresses?profile_id=eq.${c.get('caller').id}&archived_at=is.null&order=created_at.desc`);
  return c.json({ addresses: rows });
});

meRoute.post('/addresses', async (c) => {
  const caller = c.get('caller');
  const body = await c.req.json<AddressInput>();

  if (!body.line?.trim()) return c.json({ error: { code: 'addressLineRequired' } }, 400);

  // A service address without coordinates cannot be assigned to a team or
  // opened in driver navigation. Keep it out of storage instead of letting a
  // customer discover the problem at the final booking step.
  const hasCoords = body.lat !== undefined && body.lng !== undefined;
  if (!hasCoords) {
    return c.json({ error: { code: 'locationRequired' } }, 400);
  }
  {
    const { lat, lng } = body as { lat: number; lng: number };
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return c.json({ error: { code: 'badCoordinates' } }, 400);
    }
    if (!IN_SAUDI(lat, lng)) {
      return c.json({ error: { code: 'outsideServiceArea' } }, 400);
    }
  }

  const villaNumber = typeof body.villaNumber === 'string' ? normalizeVilla(body.villaNumber) : '';
  if (villaNumber && !validVilla(villaNumber)) return c.json({ error: { code: 'invalidVillaNumber' } }, 400);
  const coverage = await checkCoverage(c.env, body.lat!, body.lng!, villaNumber);
  if (coverage.status !== 'covered') return c.json({ error: { code: coverageError(coverage.status) }, coverage }, 409);

  // A customer keeps several addresses — home, work, a relative's place. The
  // first one saved becomes the default because there is nothing to compare it
  // to; later ones only take over if asked. Anything else surprises someone who
  // adds a work address and finds their washes moved there.
  const existing = await db(c.env, `addresses?profile_id=eq.${caller.id}&archived_at=is.null&select=id`);
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
      city: coverage.area!.city,
      villa_number: villaNumber,
      coverage_area_id: coverage.area!.id,
      coverage_block_id: coverage.block!.id,
      lat: body.lat,
      lng: body.lng,
      notes: body.notes?.trim() ?? '',
      is_default: makeDefault,
    },
  });

  return c.json({ address: row }, 201);
});

meRoute.patch('/addresses/:id/default', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [owned] = await db(c.env, `addresses?id=eq.${id}&profile_id=eq.${caller.id}&archived_at=is.null&select=id`);
  if (!owned) return c.json({ error: { code: 'notFound' } }, 404);
  await db(c.env, `addresses?profile_id=eq.${caller.id}&is_default=eq.true`, {
    method: 'PATCH', prefer: 'return=minimal', body: { is_default: false },
  });
  const [address] = await db(c.env, `addresses?id=eq.${id}&profile_id=eq.${caller.id}`, {
    method: 'PATCH', prefer: 'return=representation', body: { is_default: true },
  });
  return c.json({ address });
});

meRoute.delete('/addresses/:id', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [owned] = await db<{ id: string; is_default: boolean }>(c.env, `addresses?id=eq.${id}&profile_id=eq.${caller.id}&archived_at=is.null&select=id,is_default`);
  if (!owned) return c.json({ error: { code: 'notFound' } }, 404);
  const used = await db(c.env, `bookings?address_id=eq.${id}&status=neq.cancelled&select=id&limit=1`);
  if (used.length) return c.json({ error: { code: 'addressInUse' } }, 409);
  await db(c.env, `addresses?id=eq.${id}&profile_id=eq.${caller.id}`, {
    method: 'PATCH', prefer: 'return=minimal', body: { archived_at: new Date().toISOString(), is_default: false },
  });
  if (owned.is_default) {
    const [next] = await db(c.env, `addresses?profile_id=eq.${caller.id}&archived_at=is.null&select=id&order=created_at.desc&limit=1`);
    if (next) await db(c.env, `addresses?id=eq.${next.id}`, { method: 'PATCH', prefer: 'return=minimal', body: { is_default: true } });
  }
  return c.json({ deleted: true });
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
  const rows = await db(c.env, `vehicles?profile_id=eq.${c.get('caller').id}&archived_at=is.null&order=created_at.desc`);
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

  const existing = await db(c.env, `vehicles?profile_id=eq.${caller.id}&archived_at=is.null&select=id`);
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

meRoute.patch('/vehicles/:id/default', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [owned] = await db(c.env, `vehicles?id=eq.${id}&profile_id=eq.${caller.id}&archived_at=is.null&select=id`);
  if (!owned) return c.json({ error: { code: 'notFound' } }, 404);
  await db(c.env, `vehicles?profile_id=eq.${caller.id}&is_default=eq.true`, {
    method: 'PATCH', prefer: 'return=minimal', body: { is_default: false },
  });
  const [vehicle] = await db(c.env, `vehicles?id=eq.${id}&profile_id=eq.${caller.id}`, {
    method: 'PATCH', prefer: 'return=representation', body: { is_default: true },
  });
  return c.json({ vehicle });
});

meRoute.delete('/vehicles/:id', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const [owned] = await db<{ id: string; is_default: boolean }>(c.env, `vehicles?id=eq.${id}&profile_id=eq.${caller.id}&archived_at=is.null&select=id,is_default`);
  if (!owned) return c.json({ error: { code: 'notFound' } }, 404);
  const used = await db(c.env, `bookings?vehicle_id=eq.${id}&status=neq.cancelled&select=id&limit=1`);
  if (used.length) return c.json({ error: { code: 'vehicleInUse' } }, 409);
  await db(c.env, `vehicles?id=eq.${id}&profile_id=eq.${caller.id}`, {
    method: 'PATCH', prefer: 'return=minimal', body: { archived_at: new Date().toISOString(), is_default: false },
  });
  if (owned.is_default) {
    const [next] = await db(c.env, `vehicles?profile_id=eq.${caller.id}&archived_at=is.null&select=id&order=created_at.desc&limit=1`);
    if (next) await db(c.env, `vehicles?id=eq.${next.id}`, { method: 'PATCH', prefer: 'return=minimal', body: { is_default: true } });
  }
  return c.json({ deleted: true });
});
