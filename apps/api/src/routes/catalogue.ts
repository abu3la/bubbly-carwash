import { Hono } from 'hono';
import type { Env } from '../env';
import { db } from '../db';

/**
 * What Sama sells: services, add-ons, packages, club plans, and the bookable
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

interface Named {
  name_ar: string;
  name_en: string;
}

/** Rows carry both languages; the shape the app wants is `{ ar, en }`. */
const bilingual = <T extends Named>(row: T) => ({
  ar: row.name_ar,
  en: row.name_en,
});

catalogueRoute.get('/', async (c) => {
  const [services, addOns, packages, plans, slots] = await Promise.all([
    db(c.env, 'services?active=eq.true&order=sort'),
    db(c.env, 'add_ons?active=eq.true&order=sort'),
    db(c.env, 'packages?active=eq.true&order=id'),
    db(c.env, 'plans?active=eq.true&order=price_minor'),
    db(c.env, 'slot_templates?active=eq.true&order=starts_at'),
  ]);

  const body = {
    services: services.map((s: any) => ({
      key: s.key,
      name: bilingual(s),
      blurb: { ar: s.blurb_ar, en: s.blurb_en },
      priceMinor: s.price_minor,
      minutes: s.minutes,
    })),
    addOns: addOns.map((a: any) => ({
      key: a.key,
      name: bilingual(a),
      priceMinor: a.price_minor,
    })),
    packages: packages.map((p: any) => ({
      id: p.id,
      washes: p.washes,
      priceMinor: p.price_minor,
      perMinor: p.per_minor,
      savePct: p.save_pct,
      validDays: p.valid_days,
      best: p.best,
    })),
    plans: plans.map((p: any) => ({
      id: p.id,
      name: bilingual(p),
      priceMinor: p.price_minor,
      credits: p.credits,
      weekly: p.weekly,
      roll: p.roll,
      best: p.best,
    })),
    slots: slots.map((s: any) => ({
      // "08:00:00" from Postgres; the app shows "08:00".
      startsAt: String(s.starts_at).slice(0, 5),
      endsAt: String(s.ends_at).slice(0, 5),
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
