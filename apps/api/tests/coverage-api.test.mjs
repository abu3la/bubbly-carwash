/* global Request, Response, URL */
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { build } from 'esbuild';

// Exercise the actual Hono routes with a controlled PostgREST/Auth boundary.
// SQL enforcement is separately covered by coverage.sql against a local DB.
let api;
let compiledDirectory;
const originalFetch = globalThis.fetch;
const env = { SUPABASE_URL: 'https://fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key' };
const calls = [];
let role = 'customer';
let respond;
const result = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const unavailable = { status: 'areaUnavailable', area: null, block: null, team: null, villaNumber: null };
const covered = { status: 'covered', area: { id: 'a', name: { ar: 'اختبار', en: 'Test' }, city: 'Jeddah' }, block: { id: 'b', code: 'A', name: { ar: 'أ', en: 'A' } }, team: { id: 'team-1', name: { ar: 'فريق', en: 'Team' } }, villaNumber: '12' };

before(async () => {
  const bundle = await build({ entryPoints: [new URL('../src/index.ts', import.meta.url).pathname], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent' });
  compiledDirectory = await mkdtemp(join(tmpdir(), 'bubbles-coverage-api-'));
  const compiledFile = join(compiledDirectory, 'api.mjs');
  await writeFile(compiledFile, bundle.outputFiles[0].text);
  api = (await import(pathToFileURL(compiledFile).href)).default;
});
after(async () => { globalThis.fetch = originalFetch; if (compiledDirectory) await rm(compiledDirectory, { recursive: true, force: true }); });
function setup(handler, activeRole = 'customer') {
  role = activeRole; calls.length = 0; respond = handler;
  globalThis.fetch = async (url, init = {}) => {
    const path = String(url).replace(env.SUPABASE_URL, '');
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ path, ...init, body });
    if (path === '/auth/v1/user') return result({ id: '00000000-0000-4000-8000-000000000001', phone: '+966500000000' });
    if (path.includes('&select=role,active')) return result([{ role, active: true }]);
    const response = await respond(path, init, body);
    assert.ok(response, `Unexpected backend call: ${path}`);
    return response;
  };
}
const request = (path, method = 'GET', body, authorized = true) => api.fetch(new Request(`https://api.test${path}`, {
  method, headers: { ...(authorized ? { Authorization: 'Bearer test-session' } : {}), 'Content-Type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
}), env, { waitUntil() {} });

test('missing or partial coordinates are rejected without asking database', async () => {
  setup(() => { throw new Error('No backend expected'); });
  assert.equal((await request('/catalogue/coverage?lat=21')).status, 400);
  assert.equal((await request('/catalogue/availability?date=2026-09-06')).status, 400);
  assert.equal(calls.length, 0);
});
test('coverage discovery exposes area geometry without the villa registry', async () => {
  setup((path) => path.startsWith('/rest/v1/coverage_areas?') ? result([{ id: 'sharbatly-village', boundary: [], boundary_verified: false }]) : undefined);
  const response = await request('/catalogue/coverage');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).areas[0].id, 'sharbatly-village');
  assert.ok(!calls[0].path.includes('coverage_villas'));
});
test('coverage query canonicalizes Arabic villa digits before database lookup', async () => {
  setup((path, _init, body) => {
    if (path === '/rest/v1/rpc/check_coverage') { assert.equal(body.p_villa_number, '12/A'); return result(covered); }
  });
  const response = await request(`/catalogue/coverage?lat=21.6&lng=39.2&villaNumber=${encodeURIComponent(' ١٢ / a ')}`);
  assert.equal((await response.json()).status, 'covered');
});
test('unconfigured coverage fails closed, even when Friday and legacy radius could match', async () => {
  setup((path) => path === '/rest/v1/rpc/check_coverage' ? result(unavailable) : undefined);
  const body = await (await request('/catalogue/availability?lat=21.6&lng=39.2&date=2099-09-06&villaNumber=12')).json();
  assert.equal(body.covered, false); assert.equal(body.reason, 'coverageUnavailable'); assert.deepEqual(body.slots, []);
  assert.equal(calls.length, 1);
});
test('covered availability passes the villa to SQL instead of using team radius', async () => {
  setup((path, _init, body) => {
    if (path === '/rest/v1/rpc/check_coverage') return result(covered);
    if (path === '/rest/v1/rpc/expire_pending_checkouts' || path === '/rest/v1/rpc/expire_missed_bookings') return result(0);
    if (path === '/rest/v1/rpc/available_slots') { assert.equal(body.p_villa_number, '12'); return result([]); }
  });
  const response = await request('/catalogue/availability?lat=21.6&lng=39.2&date=2099-09-07&villaNumber=12');
  assert.equal(response.status, 200); assert.equal((await response.json()).covered, true);
});
test('unavailable villa cannot save an address or demote the current default', async () => {
  setup((path) => path === '/rest/v1/rpc/check_coverage' ? result({ ...unavailable, status: 'villaUnavailable' }) : undefined);
  const response = await request('/me/addresses', 'POST', { line: 'Villa 12', lat: 21.6, lng: 39.2, villaNumber: '12', isDefault: true });
  assert.equal(response.status, 409); assert.equal((await response.json()).error.code, 'villaUnavailable');
  assert.ok(!calls.some((call) => call.path.startsWith('/rest/v1/addresses')));
});
test('non-admin cannot access coverage inventory or create villas', async () => {
  setup(() => undefined);
  assert.equal((await request('/admin/coverage')).status, 403);
  assert.equal((await request('/admin/coverage/villas', 'POST', { blockId: 'a', villaNumbers: ['1'] })).status, 403);
  assert.ok(!calls.some((call) => call.path.includes('coverage_')));
});
test('bulk villa duplicate detects canonical collisions before writing', async () => {
  setup(() => undefined, 'admin');
  const response = await request('/admin/coverage/villas', 'POST', { blockId: 'a', villaNumbers: ['12', '١٢'] });
  assert.equal(response.status, 409); assert.equal((await response.json()).error.code, 'duplicateCoverageEntry');
  assert.ok(!calls.some((call) => call.path.includes('coverage_villas')));
});
test('database duplicate rejects entire villa batch with actionable error', async () => {
  setup((path) => {
    if (path.startsWith('/rest/v1/coverage_blocks?')) return result([{ id: 'b', area_id: 'a' }]);
    if (path === '/rest/v1/coverage_villas') return result({ code: '23505' }, 409);
  }, 'admin');
  const response = await request('/admin/coverage/villas', 'POST', { blockId: 'b', villaNumbers: ['12'] });
  assert.equal(response.status, 409); assert.equal((await response.json()).error.code, 'duplicateCoverageEntry');
});
test('team activation changes only selected team', async () => {
  setup((path, init, body) => {
    if (path === '/rest/v1/teams?id=eq.team-2&select=id,active') return result([{ id: 'team-2', active: false }]);
    if (path === '/rest/v1/teams?id=eq.team-2' && init.method === 'PATCH') { assert.deepEqual(body, { active: true }); return result([{ id: 'team-2', active: true }]); }
  }, 'admin');
  assert.equal((await request('/admin/teams/team-2', 'PATCH', { active: true })).status, 200);
  assert.ok(!calls.some((call) => call.path.includes('activate_pilot_team')));
});
test('terminal jobs reject stage mutations', async () => {
  setup((path) => path.startsWith('/rest/v1/bookings?') ? result([{ id: 'job', stage: 'booked', status: 'missed' }]) : undefined, 'driver');
  const response = await request('/driver/jobs/job/stage', 'POST', { stage: 'arrived' });
  assert.equal(response.status, 409); assert.equal((await response.json()).error.code, 'jobClosed');
  assert.ok(!calls.some((call) => call.method === 'PATCH'));
});
test('logout revokes only current session and forwards customer token', async () => {
  setup((path, init) => {
    assert.equal(path, '/auth/v1/logout?scope=local');
    assert.equal(init.headers.Authorization, 'Bearer test-session');
    return new Response(null, { status: 204 });
  });
  assert.equal((await request('/auth/logout', 'POST')).status, 200);
  assert.equal((await request('/auth/logout', 'POST', undefined, false)).status, 401);
});

test('coverage lost during payment confirmation refunds rather than marking payment paid', async () => {
  env.MOYASAR_SECRET_KEY = 'test-only-key';
  const invoice = { id: 'invoice', status: 'paid', currency: 'SAR', amount: 4000, metadata: { profile_id: '00000000-0000-4000-8000-000000000001', booking_id: 'job' }, payments: [{ id: 'charge', status: 'paid', amount: 4000, currency: 'SAR' }] };
  setup((path, init, body) => {
    if (path.startsWith('/rest/v1/bookings?') && init.method === 'GET') return result([{ id: 'job', payment_confirmed: false, status: 'scheduled' }]);
    if (path.startsWith('/rest/v1/payments?') && init.method === 'GET') return result([{ id: 'payment', provider_ref: 'invoice', amount_minor: 4000 }]);
    if (path === 'https://api.moyasar.com/v1/invoices/invoice') return result(invoice);
    if (path === '/rest/v1/bookings?id=eq.job' && body.payment_confirmed) return result({ code: 'P0001', message: 'villaUnavailable' }, 400);
    if (path === 'https://api.moyasar.com/v1/payments/charge/refund') return result({ status: 'refunded' });
    if (path === '/rest/v1/payments?id=eq.payment') { assert.equal(body.state, 'refunded'); return result([]); }
    if (path === '/rest/v1/bookings?id=eq.job') { assert.equal(body.status, 'cancelled'); return result([]); }
  });
  const response = await request('/bookings/job/confirm', 'POST');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'scheduleUnavailableRefunded');
  assert.ok(!calls.some((call) => call.body?.state === 'paid'));
  delete env.MOYASAR_SECRET_KEY;
});

test('driver receives real assigned blocks even with no jobs', async () => {
  setup((path) => {
    if (path === '/rest/v1/rpc/expire_missed_bookings') return result(0);
    if (path.startsWith('/rest/v1/team_members?')) return result([{ team_id: 'team-1', shift_start: '08:00', shift_end: '22:00', teams: { id: 'team-1', name_ar: 'الفريق 1', name_en: 'Team 1' } }]);
    if (path.startsWith('/rest/v1/coverage_blocks?')) return result([{ id: 'sharbatly-a', code: 'A', name_ar: 'بلوك A', coverage_areas: { name_ar: 'شربتلي فيلج' } }]);
    if (path.startsWith('/rest/v1/bookings?')) return result([]);
  }, 'driver');
  const body = await (await request('/driver/jobs')).json();
  assert.deepEqual(body.jobs, []);
  assert.equal(body.team.coverage_blocks[0].code, 'A');
});
