/* global Request, Response, URL */
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, before, after } from 'node:test';
import { build } from 'esbuild';

let membershipsRoute;
let membershipWeeklySchedule;
let compiledDirectory;
const originalFetch = globalThis.fetch;
const env = { SUPABASE_URL: 'https://fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key' };
const callerId = '00000000-0000-4000-8000-000000000001';
const membershipId = '00000000-0000-4000-8000-000000000002';
const calls = [];
const result = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

before(async () => {
  const bundle = await build({
    stdin: {
      contents: "export { membershipsRoute } from './routes/memberships'; export { membershipWeeklySchedule } from './membershipSchedule';",
      resolveDir: new URL('../src/', import.meta.url).pathname,
    },
    bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  });
  compiledDirectory = await mkdtemp(join(tmpdir(), 'bubbles-membership-schedule-'));
  const compiledFile = join(compiledDirectory, 'schedule.mjs');
  await writeFile(compiledFile, bundle.outputFiles[0].text);
  ({ membershipsRoute, membershipWeeklySchedule } = await import(pathToFileURL(compiledFile).href));
});
after(async () => {
  globalThis.fetch = originalFetch;
  if (compiledDirectory) await rm(compiledDirectory, { recursive: true, force: true });
});

function setup(handler) {
  calls.length = 0;
  globalThis.fetch = async (url, init = {}) => {
    const path = String(url).replace(env.SUPABASE_URL, '');
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ path, ...init, body });
    if (path === '/auth/v1/user') return result({ id: callerId, phone: '+966500000000' });
    if (path === `/rest/v1/profiles?id=eq.${callerId}&select=role,active`) return result([{ role: 'customer', active: true }]);
    const response = await handler(path, init, body);
    assert.ok(response, `Unexpected backend call: ${path}`);
    return response;
  };
}
const request = (authorized = true) => membershipsRoute.fetch(new Request('https://api.test/current', {
  headers: authorized ? { Authorization: 'Bearer test-session' } : {},
}), env, { waitUntil() {} });

test('recurring occurrences dedupe to selected days in Riyadh across UTC midnight', () => {
  const actual = membershipWeeklySchedule([
    { slot_start: '2026-09-09T16:30:00Z' },
    { slot_start: '2026-09-05T22:15:00Z' },
    { slot_start: '2026-09-12T22:15:00Z' },
    { slot_start: '2026-09-16T19:30:00+03:00' },
  ]);
  assert.deepEqual(actual, [{ weekday: 0, time: '01:15' }, { weekday: 3, time: '19:30' }]);
});

test('empty and malformed source rows do not fabricate selected days', () => {
  assert.deepEqual(membershipWeeklySchedule([]), []);
  assert.deepEqual(membershipWeeklySchedule([
    { slot_start: 'not-a-dateZ' },
    { slot_start: '2026-09-06T08:00:00' },
    { slot_start: '2026-99-06T08:00:00Z' },
  ]), []);
});

test('same day with distinct source times is retained rather than silently discarded', () => {
  assert.deepEqual(membershipWeeklySchedule([
    { slot_start: '2026-09-09T16:30:00Z' },
    { slot_start: '2026-09-09T05:00:00Z' },
  ]), [{ weekday: 3, time: '08:00' }, { weekday: 3, time: '19:30' }]);
});

test('current membership exposes persisted schedule scoped to authenticated selected membership', async () => {
  setup((path, init, body) => {
    if (path.startsWith('/rest/v1/memberships?')) {
      assert.ok(path.includes(`profile_id=eq.${callerId}`));
      assert.ok(path.includes('state=eq.active&payment_confirmed=eq.true&cycle_end=gt.'));
      assert.ok(path.endsWith('&order=created_at.desc&limit=1'));
      return result([{ id: membershipId, plans: { weekly: 2 } }]);
    }
    if (path === '/rest/v1/rpc/club_week_used') {
      assert.equal(init.method, 'POST');
      assert.equal(body.p_membership, membershipId);
      return result(1);
    }
    if (path === `/rest/v1/membership_signup_slots?membership_id=eq.${membershipId}&select=slot_start&order=slot_start`) {
      assert.equal(init.method, 'GET');
      return result([
        { slot_start: '2026-09-06T05:00:00Z' },
        { slot_start: '2026-09-09T05:00:00Z' },
        { slot_start: '2026-09-13T05:00:00Z' },
      ]);
    }
  });
  const response = await request();
  assert.equal(response.status, 200);
  const { membership } = await response.json();
  assert.deepEqual(membership.weeklySchedule, [{ weekday: 0, time: '08:00' }, { weekday: 3, time: '08:00' }]);
  assert.equal(membership.usedThisWeek, 1);
  assert.ok(!calls.some(({ path }) => path.startsWith('/rest/v1/bookings?')));
});

test('legacy membership with no signup rows returns empty selected schedule', async () => {
  setup((path) => {
    if (path.startsWith('/rest/v1/memberships?')) return result([{ id: membershipId }]);
    if (path === '/rest/v1/rpc/club_week_used') return result(0);
    if (path.startsWith('/rest/v1/membership_signup_slots?')) return result([]);
  });
  const { membership } = await (await request()).json();
  assert.deepEqual(membership.weeklySchedule, []);
});

test('without a current membership no schedule or usage is queried', async () => {
  setup((path) => path.startsWith('/rest/v1/memberships?') ? result([]) : undefined);
  assert.deepEqual(await (await request()).json(), { membership: null });
  assert.ok(!calls.some(({ path }) => path.includes('membership_signup_slots') || path.includes('club_week_used')));
});

test('unauthenticated request cannot read membership or schedule', async () => {
  setup(() => { throw new Error('No backend call expected'); });
  assert.equal((await request(false)).status, 401);
  assert.deepEqual(calls, []);
});
