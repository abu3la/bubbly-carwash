import { Hono } from 'hono';
import type { Env } from '../env';

export const paymentsRoute = new Hono<{ Bindings: Env }>();

/** Moyasar returns to HTTPS; this short page hands control back to the app. */
paymentsRoute.get('/return', (c) => {
  const kind = c.req.query('kind') === 'membership' ? 'membership' : 'booking';
  const id = c.req.query('id') ?? '';
  const result = c.req.query('result') === 'success' ? 'success' : 'cancel';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.text('Invalid return link', 400);
  const target = `bubblescarwash://${kind === 'membership' ? 'club' : 'book'}/processing?id=${encodeURIComponent(id)}&result=${result}`;
  return c.html(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>BubblesCarWash</title></head><body style="font-family:system-ui;padding:32px;background:#fff;color:#151515"><p>جارٍ العودة إلى تطبيق BubblesCarWash…</p><p><a href="${target}">العودة إلى التطبيق</a></p><script>location.replace(${JSON.stringify(target)})</script></body></html>`);
});
