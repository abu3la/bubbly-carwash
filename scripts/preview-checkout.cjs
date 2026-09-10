/* global URL, fetch, console, TextEncoder, setTimeout */
// Read-only design preview. Catalogue comes from the API; synthetic payment
// configuration is deliberately rejected before any request to Moyasar.
const ts = require('typescript');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'apps/api/public');
const port = Number(process.env.CHECKOUT_PREVIEW_PORT ?? 4189);
const catalogueUrl = (process.env.CHECKOUT_CATALOGUE_API ?? 'https://sama-api-dev.taz2886.workers.dev') + '/catalogue';
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname.startsWith('/checkout/')) {
    const file = path.resolve(assetRoot, '.' + url.pathname);
    if (!file.startsWith(assetRoot + '/checkout/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.svg') ? 'image/svg+xml' : 'font/ttf');
    res.end(fs.readFileSync(file)); return;
  }
  try {
    const response = await fetch(catalogueUrl);
    if (!response.ok) throw new Error('Catalogue unavailable');
    const catalogue = await response.json();
    const moduleValue = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, 'apps/api/src/checkout/page.ts'), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, { exports: moduleValue.exports, module: moduleValue });
    const language = url.searchParams.get('lang') === 'en' ? 'en' : 'ar';
    const once = url.searchParams.get('mode') === 'booking';
    const item = once ? catalogue.services.find(s => s.key === 'exterior') : catalogue.plans.find(p => p.id === (url.searchParams.get('plan') || 'plus'));
    if (!item) { res.writeHead(404); res.end('Plan not found'); return; }
    const ar = language === 'ar'; const amount = item.priceMinor;
    const next = new Date(Date.now() + 30 * 86400000);
    const renewalDate = new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh' }).format(next);
    const state = url.searchParams.get('state') || 'form';
    const html = moduleValue.exports.checkoutPage({ language, mode: once ? 'booking' : 'membership', title: item.name[language],
      description: once ? item.blurb[language] : (ar ? `${item.weekly === 2 ? 'غسلتان' : `${item.weekly} غسلات`} أسبوعيًا` : `${item.weekly} washes per week`),
      amount, lines: [{ label: item.name[language], amount }], schedule: [], reference: 'PREVIEW', preview: true,
      renewal: once ? undefined : { date: renewalDate, amount }, status: state,
      returnUrl: '/',
      sdk: state === 'loading-error' ? undefined : { publishable_api_key: 'pk_test_' + '0'.repeat(40), invoice_id: '00000000-0000-4000-8000-000000000001', amount, currency: 'SAR', description: 'Design preview',
        callback_url: `http://localhost:${port}`, methods: ['creditcard'], supported_networks: ['mada', 'visa', 'mastercard'], credit_card: { save_card: !once } },
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html);
  } catch { res.writeHead(503); res.end('Catalogue unavailable. No sample prices are used. Reload to retry.'); }
}).listen(port, '127.0.0.1', () => console.log(`Checkout preview: http://localhost:${port}`));
