import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth, requireRole } from '../middleware/auth';
import { db } from '../db';

/**
 * The back office.
 *
 * Everything here changes what customers are offered and charged, so it is
 * gated on the `admin` role — which lives in our `profiles` table, not in the
 * token. Reads are deliberately unfiltered: an administrator is meant to see
 * every customer's bookings, which is exactly what a customer must never do.
 */
export const adminRoute = new Hono<{ Bindings: Env }>();
adminRoute.use('*', requireAuth(), requireRole('admin'));

/** Money arrives as SAR from a form; the database stores halalas. */
const toMinor = (sar: unknown) =>
  typeof sar === 'number' && Number.isFinite(sar) ? Math.round(sar * 100) : undefined;

/* ------------------------------------------------------------------ packages */

adminRoute.get('/packages', async (c) => {
  // Inactive ones included: the dashboard needs to see what it has retired.
  const rows = await db(c.env, 'packages?order=id');
  return c.json({ packages: rows });
});

adminRoute.patch('/packages/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id)) return c.json({ error: { code: 'badId' } }, 400);

  const b = await c.req.json<{
    priceSar?: number;
    perSar?: number;
    savePct?: number;
    validDays?: number;
    best?: boolean;
    active?: boolean;
  }>();

  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  const per = toMinor(b.perSar);
  if (price !== undefined) patch.price_minor = price;
  if (per !== undefined) patch.per_minor = per;
  if (typeof b.savePct === 'number') patch.save_pct = Math.round(b.savePct);
  if (typeof b.validDays === 'number') patch.valid_days = Math.round(b.validDays);
  if (typeof b.active === 'boolean') patch.active = b.active;

  if (typeof b.best === 'boolean') {
    patch.best = b.best;
    // Only one package can wear the "best value" badge. Clearing the others
    // first stops the dashboard from producing two highlighted cards, which
    // reads as a bug to a customer.
    if (b.best) {
      await db(c.env, 'packages?best=eq.true', {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: { best: false },
      });
    }
  }

  if (Object.keys(patch).length === 0) {
    return c.json({ error: { code: 'nothingToUpdate' } }, 400);
  }

  const [row] = await db(c.env, `packages?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ package: row });
});

adminRoute.post('/packages', async (c) => {
  const b = await c.req.json<{
    id?: number;
    washes?: number;
    priceSar?: number;
    perSar?: number;
    savePct?: number;
    validDays?: number;
  }>();

  const price = toMinor(b.priceSar);
  if (!b.washes || b.washes < 1) return c.json({ error: { code: 'washesRequired' } }, 400);
  if (price === undefined) return c.json({ error: { code: 'priceRequired' } }, 400);

  const [row] = await db(c.env, 'packages', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      // The id doubles as the wash count in the seeded data, which keeps the
      // URL readable. Explicit id wins when given.
      id: b.id ?? b.washes,
      washes: b.washes,
      price_minor: price,
      per_minor: toMinor(b.perSar) ?? Math.round(price / b.washes),
      save_pct: b.savePct ?? 0,
      valid_days: b.validDays ?? 90,
    },
  });
  return c.json({ package: row }, 201);
});

/* ------------------------------------------------------ services and plans */

adminRoute.get('/services', async (c) => c.json({ services: await db(c.env, 'services?order=sort') }));

adminRoute.patch('/services/:key', async (c) => {
  const b = await c.req.json<{ priceSar?: number; minutes?: number; active?: boolean }>();
  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  if (price !== undefined) patch.price_minor = price;
  if (typeof b.minutes === 'number') patch.minutes = Math.round(b.minutes);
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `services?key=eq.${c.req.param('key')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ service: row });
});

adminRoute.get('/plans', async (c) => c.json({ plans: await db(c.env, 'plans?order=price_minor') }));

adminRoute.patch('/plans/:id', async (c) => {
  const b = await c.req.json<{
    priceSar?: number;
    credits?: number;
    weekly?: number;
    roll?: number;
    active?: boolean;
  }>();
  const patch: Record<string, unknown> = {};
  const price = toMinor(b.priceSar);
  if (price !== undefined) patch.price_minor = price;
  for (const k of ['credits', 'weekly', 'roll'] as const) {
    if (typeof b[k] === 'number') patch[k] = Math.round(b[k]!);
  }
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `plans?id=eq.${c.req.param('id')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ plan: row });
});

/* ------------------------------------------------------------------ bookings */

adminRoute.get('/bookings', async (c) => {
  const rows = await db(
    c.env,
    'bookings?select=*,booking_add_ons(add_on_key,price_minor)&order=scheduled_at.desc&limit=200',
  );
  return c.json({ bookings: rows });
});

/* -------------------------------------------------------------- technicians */

/**
 * The people doing the washes.
 *
 * A technician is created here rather than signing themselves up: a stranger
 * must not be able to become staff by entering a phone number. The admin
 * creates the auth user, and the technician then signs in with the ordinary OTP
 * flow — same login as everyone, different role.
 */
adminRoute.get('/technicians', async (c) => {
  const rows = await db(
    c.env,
    "profiles?role=eq.driver&select=id,full_name,active,created_at&order=created_at",
  );
  return c.json({ technicians: rows });
});

const SAUDI_MOBILE = /^\+9665\d{8}$/;

adminRoute.post('/technicians', async (c) => {
  const b = await c.req.json<{ phone?: string; name?: string }>();
  if (!b.phone || !SAUDI_MOBILE.test(b.phone)) {
    return c.json({ error: { code: 'invalidPhone' } }, 400);
  }
  if (!b.name?.trim()) return c.json({ error: { code: 'nameRequired' } }, 400);

  // Created already confirmed: the admin vouching for the number is the
  // verification, and a technician should not be blocked on an SMS that Sama
  // cannot yet send.
  const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: c.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: b.phone.replace(/^\+/, ''), phone_confirm: true }),
  });
  const created = (await res.json().catch(() => ({}))) as { id?: string; msg?: string };

  let id = created.id;
  if (!res.ok || !id) {
    // Already a customer, most likely. Promote the existing person rather than
    // refusing — someone who books washes can also work here.
    const existing = await db<{ id: string }>(
      c.env,
      `profiles?select=id&limit=1&id=not.is.null&order=created_at`,
    );
    if (!created.id) {
      console.warn('[admin] technician create', res.status, created.msg);
      return c.json({ error: { code: 'couldNotCreate' } }, 409);
    }
    id = existing[0]?.id;
  }

  // The trigger-free path: our own profile row, with the role that matters.
  await db(c.env, 'profiles?on_conflict=id', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=minimal',
    body: { id, role: 'driver', full_name: b.name.trim() },
  });

  const [row] = await db(c.env, `profiles?id=eq.${id}&select=id,full_name,role,active`);
  return c.json({ technician: row }, 201);
});

adminRoute.patch('/technicians/:id', async (c) => {
  const b = await c.req.json<{ active?: boolean; name?: string }>();
  const patch: Record<string, unknown> = {};
  if (typeof b.active === 'boolean') patch.active = b.active;
  if (b.name?.trim()) patch.full_name = b.name.trim();
  if (!Object.keys(patch).length) return c.json({ error: { code: 'nothingToUpdate' } }, 400);

  const [row] = await db(c.env, `profiles?id=eq.${c.req.param('id')}&role=eq.driver`, {
    method: 'PATCH',
    prefer: 'return=representation',
    body: patch,
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ technician: row });
});

/** Dispatch: put a booking in a technician's list. */
adminRoute.patch('/bookings/:id/assign', async (c) => {
  const b = await c.req.json<{ technicianId?: string | null }>();

  if (b.technicianId) {
    const [tech] = await db(
      c.env,
      `profiles?id=eq.${b.technicianId}&role=eq.driver&active=eq.true&select=id`,
    );
    if (!tech) return c.json({ error: { code: 'notATechnician' } }, 400);
  }

  const [row] = await db(c.env, `bookings?id=eq.${c.req.param('id')}`, {
    method: 'PATCH',
    prefer: 'return=representation',
    // Null unassigns, which dispatch needs when someone calls in sick.
    body: { technician_id: b.technicianId ?? null },
  });
  if (!row) return c.json({ error: { code: 'notFound' } }, 404);
  return c.json({ booking: row });
});
