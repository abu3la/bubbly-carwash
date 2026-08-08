import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import { servicesRoute } from './routes/services';
import { bookingsRoute } from './routes/bookings';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) =>
  c.json({
    name: 'bubbly-api',
    endpoints: ['/services', '/bookings', '/bookings/:id', '/bookings/:id/status'],
  }),
);

app.route('/services', servicesRoute);
app.route('/bookings', bookingsRoute);

export default app;
