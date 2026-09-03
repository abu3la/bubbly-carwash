import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import { adminRoute } from './routes/admin';
import { authRoute } from './routes/auth';
import { bookingsRoute } from './routes/bookings';
import { catalogueRoute } from './routes/catalogue';
import { driverRoute } from './routes/driver';
import { hooksRoute } from './routes/hooks';
import { meRoute } from './routes/me';
import { webhooksRoute } from './routes/webhooks';

/**
 * Sama Car Wash API.
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

app.get('/', (c) => c.json({ name: 'sama-api', status: 'ok' }));

// Reports which secrets are present, never what they are. Enough to tell a
// misconfigured deploy from a working one without leaking anything.
app.get('/health', (c) =>
  c.json({
    name: 'sama-api',
    supabase: Boolean(c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY),
    moyasar: Boolean(c.env.MOYASAR_SECRET_KEY),
    webhook: Boolean(c.env.MOYASAR_WEBHOOK_SECRET),
  }),
);

app.route('/admin', adminRoute);
app.route('/auth', authRoute);
app.route('/catalogue', catalogueRoute);
app.route('/bookings', bookingsRoute);
app.route('/driver', driverRoute);
app.route('/hooks', hooksRoute);
app.route('/me', meRoute);
app.route('/webhooks', webhooksRoute);

export default app;
