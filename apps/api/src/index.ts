import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import { db } from './db';
import { adminRoute } from './routes/admin';
import { authRoute } from './routes/auth';
import { bookingsRoute } from './routes/bookings';
import { catalogueRoute } from './routes/catalogue';
import { driverRoute } from './routes/driver';
import { hooksRoute } from './routes/hooks';
import { meRoute } from './routes/me';
import { membershipsRoute } from './routes/memberships';
import { paymentsRoute } from './routes/payments';
import { placesRoute } from './routes/places';
import { webhooksRoute } from './routes/webhooks';

/**
 * BubblesCarWash API.
 *
 * The only path to the database. It holds the Supabase service-role key, which
 * bypasses row-level security — every table has RLS on with no policies, so
 * nothing else can reach the data. Booking rules (club weekly caps, spending a
 * credit, holding a slot) therefore live here rather than being spread across
 * the app and SQL policies.
 *
 * Routes land in Phase 1. This is the deployed skeleton, which exists early so
 * the Worker has a public URL for Moyasar's webhook to point at.
 */
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) => c.json({ name: 'bubblescarwash-api', status: 'ok' }));

// Reports which secrets are present, never what they are. Enough to tell a
// misconfigured deploy from a working one without leaking anything.
app.get('/health', (c) =>
  c.json({
    name: 'bubblescarwash-api',
    supabase: Boolean(c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY),
    storage: Boolean(c.env.MEDIA),
    moyasar: Boolean(c.env.MOYASAR_SECRET_KEY),
    webhook: Boolean(c.env.MOYASAR_WEBHOOK_SECRET),
    places: Boolean(c.env.GOOGLE_PLACES_API_KEY),
    notifications: c.env.FIREBASE_PROJECT_ID && c.env.FIREBASE_CLIENT_EMAIL && c.env.FIREBASE_PRIVATE_KEY
      ? 'firebase'
      : 'not-configured',
    sms: c.env.DEV_FIXED_OTP
      ? 'development-code'
      : c.env.TAQNYAT_BEARER && c.env.TAQNYAT_SENDER
        ? 'taqnyat'
        : 'not-configured',
  }),
);

app.route('/admin', adminRoute);
app.route('/auth', authRoute);
app.route('/catalogue', catalogueRoute);
app.route('/bookings', bookingsRoute);
app.route('/driver', driverRoute);
app.route('/hooks', hooksRoute);
app.route('/me', meRoute);
app.route('/memberships', membershipsRoute);
app.route('/payments', paymentsRoute);
app.route('/places', placesRoute);
app.route('/webhooks', webhooksRoute);

async function runMaintenance(env: Env) {
  const [[pendingExpired], [bookingsMissed]] = await Promise.all([
    db<number>(env, 'rpc/expire_pending_checkouts', { method: 'POST', body: {} }),
    db<number>(env, 'rpc/expire_missed_bookings', { method: 'POST', body: {} }),
  ]);
  console.log('[maintenance] expiry sweep completed', {
    pendingExpired: Number(pendingExpired ?? 0),
    bookingsMissed: Number(bookingsMissed ?? 0),
  });
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runMaintenance(env).catch((error) => {
      console.error('[maintenance] expiry sweep failed', error);
    }));
  },
} satisfies ExportedHandler<Env>;
