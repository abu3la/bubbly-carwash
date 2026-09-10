import { Hono } from 'hono';
import type { Env } from '../env';
import { getPayment } from '../moyasar';
import { webhooksRoute } from './webhooks';
import { db } from '../db';
import { validCheckout } from '../checkout/session';
import { checkoutData } from '../checkout/data';
import { checkoutPage, checkoutErrorPage } from '../checkout/page';

export const checkoutRoute = new Hono<{ Bindings: Env }>();
checkoutRoute.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store');
  c.header('Referrer-Policy', 'no-referrer');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdn.moyasar.com; style-src 'self' 'unsafe-inline' https://cdn.moyasar.com; img-src 'self' data: https://cdn.moyasar.com; font-src 'self'; connect-src 'self' https://api.moyasar.com; frame-src https:; base-uri 'none'; frame-ancestors 'self'; form-action 'self' https://api.moyasar.com");
  await next();
});
checkoutRoute.use('/:invoice/*', async (c, next) => {
  if (!await validCheckout(c.env, c.req.param('invoice') ?? '', c.req.query('expires') ?? '', c.req.query('signature') ?? '')) {
    return c.html(checkoutErrorPage(), 410);
  }
  await next();
});
const configKey = (value?: string) => value && /^pk_(test|live)_[A-Za-z0-9]+$/.test(value) ? value : undefined;

checkoutRoute.get('/:invoice', async (c) => {
  const invoiceId = c.req.param('invoice');
  // Hono wildcard middleware is not assumed to match the bare segment.
  if (!await validCheckout(c.env, invoiceId, c.req.query('expires') ?? '', c.req.query('signature') ?? '')) return c.html(checkoutErrorPage(c.req.query('lang') === 'en' ? 'en' : 'ar'), 410);
  try {
    const language = c.req.query('lang') === 'en' ? 'en' : 'ar';
    let data = await checkoutData(c.env, invoiceId, language);
    if (data?.paid && data.page.status === 'pending') {
      await webhooksRoute.fetch(new Request(`${new URL(c.req.url).origin}/moyasar/invoice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: invoiceId }) }), c.env);
      data = await checkoutData(c.env, invoiceId, language);
    }
    if (!data) return c.html(checkoutErrorPage(language), 404);
    const base = new URL(c.req.url); base.searchParams.delete('id'); base.searchParams.delete('status'); base.searchParams.delete('message');
    const callback = new URL(base); callback.searchParams.set('verify', '1');
    const action = (part: string) => { const url = new URL(base); url.pathname += `/${part}`; return url.toString(); };
    const origin = base.origin;
    const { payment, page, invoice } = data;
    const kind = payment.membership_id ? 'membership' : 'booking';
    const target = payment.membership_id ?? payment.booking_id!;
    // App explicitly opts in; the same URL otherwise stays a normal web page.
    page.returnUrl = base.searchParams.get('app') === '1'
      ? `${origin}/payments/return?kind=${kind}&id=${target}&result=${page.status === 'paid' ? 'success' : 'cancel'}`
      : undefined;
    page.statusUrl = action('status'); page.consentUrl = action('prepare');
    page.fallbackUrl = invoice.url;
    if (c.req.query('verify') === '1' && page.status === 'form') page.status = 'pending';
    const key = (!page.renewal || c.env.MOYASAR_RENEWAL_CALLBACK_URL) ? configKey(c.env.MOYASAR_PUBLISHABLE_KEY) : undefined;
    if (key) {
      page.sdk = {
        publishable_api_key: key, invoice_id: invoice.id, amount: payment.amount_minor,
        currency: 'SAR', description: page.title, callback_url: callback.toString(),
        methods: ['creditcard'], supported_networks: ['mada', 'visa', 'mastercard'],
        credit_card: { save_card: Boolean(page.renewal) },
      };
      // Wallet availability is determined by the SDK and a configured merchant.
      // Recurring wallet support needs an independently verified reusable token.
      if (c.env.MOYASAR_APPLE_PAY_VALIDATION_URL && !page.renewal) {
        const validation = new URL(c.env.MOYASAR_APPLE_PAY_VALIDATION_URL);
        if (validation.origin === origin && validation.protocol === 'https:') {
          page.sdk.methods = ['creditcard', 'applepay'];
          page.sdk.apple_pay = { country: 'SA', label: 'Bubbles', validate_merchant_url: validation.toString() };
        }
      }
    }
    return c.html(checkoutPage(page));
  } catch {
    return c.html(checkoutErrorPage(c.req.query('lang') === 'en' ? 'en' : 'ar', true), 503);
  }
});

checkoutRoute.post('/:invoice/prepare', async (c) => {
  const origin = c.req.header('origin');
  if (origin && origin !== new URL(c.req.url).origin) return c.json({ error: 'invalidOrigin' }, 403);
  const data = await checkoutData(c.env, c.req.param('invoice'), 'ar');
  if (!data || data.page.status !== 'form' || data.invoice.status === 'paid') return c.json({ error: 'checkoutUnavailable' }, 409);
  if (data.payment.membership_id) {
    if (!c.env.MOYASAR_RENEWAL_CALLBACK_URL) return c.json({ error: 'renewalNotConfigured' }, 503);
    const body = await c.req.json<{ renewalConsent?: boolean }>().catch(() => ({} as { renewalConsent?: boolean }));
    if (body.renewalConsent !== true) return c.json({ error: 'renewalConsentRequired' }, 400);
    await db(c.env, 'checkout_consents?on_conflict=invoice_id', {
      method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal',
      body: { invoice_id: data.invoice.id, membership_id: data.payment.membership_id, profile_id: data.payment.profile_id, amount_minor: data.payment.amount_minor, interval_days: 30, terms_version: '2026-09-10' },
    });
  }
  return c.json({ ready: true });
});

checkoutRoute.get('/:invoice/status', async (c) => {
  let data = await checkoutData(c.env, c.req.param('invoice'), 'ar');
  if (data?.paid && data.page.status === 'pending') {
    await webhooksRoute.fetch(new Request(`${new URL(c.req.url).origin}/moyasar/invoice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: data.invoice.id }) }), c.env);
    data = await checkoutData(c.env, c.req.param('invoice'), 'ar');
  }
  if (!data) return c.json({ error: 'notFound' }, 404);
  const url = new URL(c.req.url); url.pathname = url.pathname.replace(/\/status$/, ''); url.searchParams.delete('verify');
  const failed = !data.paid && data.invoice.payments?.length && data.invoice.payments.every((p) => p.status === 'failed');
  return c.json({ status: data.page.status === 'form' ? (failed ? 'failed' : 'pending') : data.page.status, url: url.toString() });
});

checkoutRoute.post('/:invoice/capture', async (c) => {
  const invoiceId = c.req.param('invoice');
  const body = await c.req.json<{ id?: string }>().catch(() => ({} as { id?: string }));
  if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) return c.json({ error: 'invalidPayment' }, 400);
  const data = await checkoutData(c.env, invoiceId, 'ar');
  if (!data?.payment.membership_id) return c.json({ saved: false });
  const payment = await getPayment(c.env, body.id);
  if (!payment || payment.invoice_id !== invoiceId || payment.amount !== data.payment.amount_minor || payment.currency !== 'SAR') return c.json({ error: 'paymentMismatch' }, 409);
  const [consent] = await db(c.env, `checkout_consents?invoice_id=eq.${invoiceId}&select=invoice_id`);
  if (!consent || !payment.source?.token) return c.json({ error: 'tokenUnavailable' }, 409);
  await db(c.env, 'checkout_payment_tokens?on_conflict=payment_id', { method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal',
    body: { payment_id: payment.id, invoice_id: invoiceId, token: payment.source.token } });
  return c.json({ saved: true });
});
