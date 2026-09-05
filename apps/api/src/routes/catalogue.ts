import { Hono } from 'hono';
import type { Env } from '../env';
import { db } from '../db';
import { checkCoverage, coverageError, normalizeVilla, validVilla } from '../coverage';

/**
 * What BubblesCarWash sells: services, add-ons, monthly plans, and the bookable
 * grid.
 *
 * Public — a price list is not a secret, and requiring a session to see one
 * would stop a browsing customer before they ever signed up.
 *
 * Both languages are returned in one payload rather than the caller's chosen
 * one. The response is cached at the edge and shared between every customer,
 * so it cannot vary per request without either fragmenting the cache or
 * serving Arabic to an English reader.
 */
export const catalogueRoute = new Hono<{ Bindings: Env }>();

const DATE = /^\d{4}-\d{2}-\d{2}$/;

interface Named {
  name_ar: string;
  name_en: string;
}

interface ServiceRow extends Named {
  key: string;
  blurb_ar: string;
  blurb_en: string;
  price_minor: number;
  minutes: number;
}
interface AddOnRow extends Named { key: string; price_minor: number }
interface PlanRow extends Named {
  id: string; price_minor: number; credits: number; weekly: number; roll: number; best: boolean;
}
interface SlotRow {
  period: 'morning' | 'afternoon' | 'night';
  starts_at: string;
  ends_at: string;
  priority_only: boolean;
}
interface AvailabilityRow {
  period: 'morning' | 'afternoon' | 'night';
  starts_at: string;
  ends_at: string;
  team_id: string;
  team_name_ar: string;
  team_name_en: string;
  distance_km: number | string;
  daily_capacity: number;
  remaining: number;
}

/** Rows carry both languages; the shape the app wants is `{ ar, en }`. */
const bilingual = <T extends Named>(row: T) => ({
  ar: row.name_ar,
  en: row.name_en,
});

catalogueRoute.get('/', async (c) => {
  const [services, addOns, plans, slots] = await Promise.all([
    db<ServiceRow>(c.env, 'services?active=eq.true&order=sort'),
    db<AddOnRow>(c.env, 'add_ons?active=eq.true&order=sort'),
    db<PlanRow>(c.env, 'plans?active=eq.true&order=price_minor'),
    db<SlotRow>(c.env, 'slot_templates?active=eq.true&order=starts_at'),
  ]);

  const body = {
    services: services.map((s) => ({
      key: s.key,
      name: bilingual(s),
      blurb: { ar: s.blurb_ar, en: s.blurb_en },
      priceMinor: s.price_minor,
      minutes: s.minutes,
    })),
    addOns: addOns.map((a) => ({
      key: a.key,
      name: bilingual(a),
      priceMinor: a.price_minor,
    })),
    plans: plans.map((p) => ({
      id: p.id,
      name: bilingual(p),
      serviceKey: p.id.startsWith('plus') ? 'full' : 'exterior',
      priceMinor: p.price_minor,
      credits: p.credits,
      weekly: p.weekly,
      roll: p.roll,
      best: p.best,
    })),
    slots: slots.map((s) => ({
      // "08:00:00" from Postgres; the app shows "08:00".
      startsAt: String(s.starts_at).slice(0, 5),
      endsAt: String(s.ends_at).slice(0, 5),
      period: s.period,
      // Held for club members. The app needs to know so it can show *why* a
      // slot is unavailable rather than silently hiding it.
      priorityOnly: s.priority_only,
    })),
  };

  // A price list changes a few times a year, so it is worth caching hard. Five
  // minutes at the edge with a day of stale-while-revalidate means a price
  // change propagates quickly, and an outage still serves the last known list
  // rather than an empty app.
  c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
  return c.json(body);
});

/** Public discovery carries map geometry, never the private villa registry. */
catalogueRoute.get('/coverage', async (c) => {
  c.header('Cache-Control', 'no-store');
  const latInput = c.req.query('lat');
  const lngInput = c.req.query('lng');
  if (latInput === undefined && lngInput === undefined) {
    const areas = await db(c.env, 'coverage_areas?active=eq.true&select=id,name_ar,name_en,city,center_lat,center_lng,boundary,boundary_verified&order=created_at');
    return c.json({ areas });
  }
  const lat = Number(latInput);
  const lng = Number(lngInput);
  if (!latInput?.trim() || !lngInput?.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return c.json({ error: { code: 'badCoordinates' } }, 400);
  }
  const villa = normalizeVilla(c.req.query('villaNumber') ?? '');
  if (villa && !validVilla(villa)) return c.json({ error: { code: 'invalidVillaNumber' } }, 400);
  return c.json(await checkCoverage(c.env, lat, lng, villa));
});

/**
 * Live availability for one car location and service day.
 *
 * The generic catalogue says which periods exist; this endpoint says whether
 * an active team can actually reach the customer's pin and still has room.
 * Team coordinates themselves never leave the API.
 */
catalogueRoute.get('/availability', async (c) => {
  const latInput = c.req.query('lat');
  const lngInput = c.req.query('lng');
  const lat = Number(latInput);
  const lng = Number(lngInput);
  const date = c.req.query('date') ?? '';

  if (!latInput?.trim() || !lngInput?.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return c.json({ error: { code: 'badCoordinates' } }, 400);
  }
  if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00+03:00`))) {
    return c.json({ error: { code: 'badDate' } }, 400);
  }

  const villa = normalizeVilla(c.req.query('villaNumber') ?? '');
  if (villa && !validVilla(villa)) return c.json({ error: { code: 'invalidVillaNumber' } }, 400);
  const coverage = await checkCoverage(c.env, lat, lng, villa);
  c.header('Cache-Control', 'no-store');
  if (coverage.status !== 'covered') {
    return c.json({ date, closed: false, reason: coverageError(coverage.status), covered: false, coverage, team: null, slots: [] });
  }
  if (new Date(`${date}T12:00:00+03:00`).getUTCDay() === 5) {
    return c.json({ date, closed: true, reason: 'friday', covered: true, coverage, team: null, slots: [] });
  }
  await db(c.env, 'rpc/expire_pending_checkouts', { method: 'POST', body: {} });
  await db(c.env, 'rpc/expire_missed_bookings', { method: 'POST', body: {} });
  const rows = await db<AvailabilityRow>(c.env, 'rpc/available_slots', {
    method: 'POST', body: { p_lat: lat, p_lng: lng, p_date: date, p_villa_number: villa },
  });
  const covered = true;
  // `available_slots` protects capacity, while this edge check keeps today's
  // already-started periods out of every client. Booking creation repeats the
  // past-time guard, so this is UX correctness rather than a security boundary.
  const now = Date.now();
  const futureRows = rows.filter((row) => {
    const startsAt = String(row.starts_at).slice(0, 8);
    return Date.parse(`${date}T${startsAt}+03:00`) > now;
  });
  const first = futureRows[0];

  c.header('Cache-Control', 'no-store');
  return c.json({
    date,
    closed: false,
    reason: covered ? (futureRows.length ? null : 'full') : 'outsideServiceArea',
    covered,
    coverage,
    team: first
      ? {
          id: first.team_id,
          name: { ar: first.team_name_ar, en: first.team_name_en },
          distanceKm: Math.round(Number(first.distance_km) * 10) / 10,
          dailyCapacity: first.daily_capacity,
        }
      : null,
    slots: futureRows.map((row) => ({
      period: row.period,
      startsAt: String(row.starts_at).slice(0, 5),
      endsAt: String(row.ends_at).slice(0, 5),
      remaining: row.remaining,
    })),
  });
});
