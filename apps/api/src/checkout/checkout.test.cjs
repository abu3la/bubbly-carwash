/* global TextEncoder, btoa, atob, URL, Request, Response, console, setTimeout, clearTimeout */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const ts = require('typescript');
function load(file, mocks = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(path.join(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { exports, require: (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('.')) return load(path.relative(__dirname, path.resolve(__dirname, path.dirname(file), name)) + '.ts', mocks);
    return require(name);
  }, crypto: webcrypto, TextEncoder, Date, btoa, atob, URL, Request, Response, console, setTimeout, clearTimeout });
  return exports;
}
const id = 'a1168bd1-47a4-4b97-8a50-dd5caaccacf2';
test('checkout capability rejects changed invoice, signature, expiry and expired links', async () => {
  const { checkoutUrl, validCheckout } = load('session.ts');
  const env = { MOYASAR_SECRET_KEY: 'test-only-signing-secret' };
  const url = new URL(await checkoutUrl(env, 'https://api.example', id));
  const exp = url.searchParams.get('expires'); const sig = url.searchParams.get('signature');
  assert.equal(await validCheckout(env, id, exp, sig), true);
  assert.equal(await validCheckout(env, 'b1168bd1-47a4-4b97-8a50-dd5caaccacf2', exp, sig), false);
  assert.equal(await validCheckout(env, id, String(+exp + 1), sig), false);
  assert.equal(await validCheckout(env, id, exp, 'x'.repeat(43)), false);
  assert.equal(await validCheckout(env, id, exp, sig, +exp * 1000 + 1), false);
});
test('checkout HTML escapes customer/plan data and script-closing input', () => {
  const { checkoutPage } = load('page.ts');
  const html = checkoutPage({ language: 'ar', mode: 'membership', title: '<img src=x onerror=alert(1)>', description: '" & <', amount: 29900,
    reference: '<script>', lines: [], schedule: [], sdk: { description: '</script><script>alert(1)</script>' } });
  assert.ok(!html.includes('<img src=x')); assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('\\u003c/script>')); assert.ok(!html.includes('<script>alert(1)'));
});
test('server uses saved invoice amount and database plan name, without handoff placeholders', async () => {
  const calls = [];
  const db = async (_env, query) => {
    calls.push(query);
    if (query.startsWith('payments?')) return [{ id, profile_id: 'owner', membership_id: 'member', booking_id: null, amount_minor: 29900, state: 'pending', created_at: new Date().toISOString(), provider_ref: id }];
    if (query.startsWith('memberships?')) return [{ state: 'active', payment_confirmed: false, cycle_end: '2026-10-10T10:00:00Z', plans: { name_ar: 'سوبر ووش', name_en: 'Super Wash', weekly: 2 } }];
    if (query.startsWith('membership_signup_slots?')) return [];
    throw new Error('Unexpected query: ' + query);
  };
  const { checkoutData } = load('data.ts', { '../db': { db }, '../moyasar': { getInvoice: async () => ({ id, status: 'initiated', amount: 29900 }), invoiceMatches: () => false } });
  const result = await checkoutData({}, id, 'ar');
  assert.equal(result.page.title, 'سوبر ووش'); assert.equal(result.page.amount, 29900);
  assert.equal(result.page.renewal.amount, 29900); assert.equal(result.page.status, 'form');
  assert.ok(calls.some(q => q.includes('profile_id=eq.owner')));
});
test('paid invoice is not a success screen until the order is activated', async () => {
  const db = async (_env, q) => q.startsWith('payments?')
    ? [{ id, profile_id: 'owner', membership_id: 'member', amount_minor: 29900, state: 'pending', created_at: new Date().toISOString() }]
    : q.startsWith('memberships?')
      ? [{ state: 'active', payment_confirmed: false, cycle_end: '2026-10-10T10:00:00Z', plans: { name_ar: 'أساسي', name_en: 'Basic', weekly: 2 } }]
      : [];
  const { checkoutData } = load('data.ts', { '../db': { db }, '../moyasar': { getInvoice: async () => ({ id, status: 'paid' }), invoiceMatches: () => true } });
  assert.equal((await checkoutData({}, id, 'ar')).page.status, 'pending');
});
test('a token without server-recorded consent never enables renewal', async () => {
  const queries = [];
  const { enableConsentedRenewal } = load('billing.ts', { '../db': { db: async (_env, q) => { queries.push(q); return []; } }, '../moyasar': {}, '../notifications': {} });
  await enableConsentedRenewal({ MOYASAR_PUBLISHABLE_KEY: 'test' }, { id, amount: 29900, status: 'paid', payments: [{ id, source: { token: 'private' } }] }, 'member', 'owner');
  assert.equal(queries.length, 1); assert.ok(queries[0].startsWith('checkout_consents?'));
});
test('successful renewal callbacks cannot turn a cancelled mandate back on', async () => {
  const writes = [];
  const db = async (_env, q, options) => {
    if (q.startsWith('checkout_consents?')) return [{ amount_minor: 29900 }];
    if (q.startsWith('checkout_payment_tokens?')) return [{ token: 'saved-token' }];
    if (q.startsWith('memberships?')) return [{ state: 'active', cycle_end: '2026-10-10T10:00:00Z' }];
    writes.push(options); return [];
  };
  const { enableConsentedRenewal } = load('billing.ts', { '../db': { db }, '../moyasar': {}, '../notifications': {} });
  await enableConsentedRenewal({ MOYASAR_PUBLISHABLE_KEY: 'test' }, { id, amount: 29900, status: 'paid', payments: [{ id, status: 'paid', amount: 29900, currency: 'SAR' }] }, 'member', 'owner');
  assert.equal(writes.length, 1); assert.ok(writes[0].prefer.includes('ignore-duplicates'));
  assert.equal(writes[0].body.amount_minor, 29900);
});
