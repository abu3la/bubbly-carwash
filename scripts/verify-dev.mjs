import assert from 'node:assert/strict';

const API = process.env.BUBBLES_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';
const DASHBOARD = process.env.BUBBLES_DASHBOARD_URL ?? 'https://sama-dashboard-dev.taz2886.workers.dev';
const TEST_PHONE = process.env.BUBBLES_TEST_PHONE ?? '+966500009911';
const TEST_OTP = process.env.BUBBLES_TEST_OTP ?? '1111';

async function request(path, init = {}, expected = 200) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  });
  const payload = await response.json().catch(() => ({}));
  assert.equal(response.status, expected, `${path}: expected ${expected}, received ${response.status}`);
  return payload;
}

function dateKey(value) {
  return value.toISOString().slice(0, 10);
}

function nextWeekday(day) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  do date.setUTCDate(date.getUTCDate() + 1); while (date.getUTCDay() !== day);
  return dateKey(date);
}

const health = await request('/health');
assert.equal(health.name, 'bubblescarwash-api');
for (const dependency of ['supabase', 'storage', 'moyasar', 'webhook', 'places']) {
  assert.equal(health[dependency], true, `${dependency} is not configured`);
}
assert.ok(['firebase', 'not-configured'].includes(health.notifications));
assert.equal(health.sms, 'development-code');

const catalogue = await request('/catalogue');
const single = catalogue.services.find((service) => service.key === 'exterior');
assert.equal(single?.priceMinor, 4_000);
assert.deepEqual(
  catalogue.plans.map(({ id, weekly, priceMinor }) => ({ id, weekly, priceMinor })),
  [
    { id: 'basic', weekly: 2, priceMinor: 19_900 },
    { id: 'basic-3', weekly: 3, priceMinor: 26_900 },
    { id: 'plus', weekly: 2, priceMinor: 29_900 },
    { id: 'plus-3', weekly: 3, priceMinor: 39_900 },
  ],
);
assert.deepEqual(catalogue.slots.map((slot) => slot.period), ['morning', 'afternoon', 'night']);

const friday = await request(`/catalogue/availability?lat=21.4225&lng=39.8262&date=${nextWeekday(5)}`);
assert.deepEqual(
  { closed: friday.closed, reason: friday.reason, covered: friday.covered, slots: friday.slots },
  { closed: true, reason: 'friday', covered: false, slots: [] },
);

const saturday = await request(`/catalogue/availability?lat=21.4225&lng=39.8262&date=${nextWeekday(6)}`);
assert.equal(saturday.closed, false);
assert.equal(saturday.covered, true);
assert.equal(saturday.team?.id, 'team-1');
assert.equal(saturday.team?.dailyCapacity, 40);
assert.deepEqual(saturday.slots.map((slot) => slot.period), ['morning', 'afternoon', 'night']);

await request('/bookings', {}, 401);
await request('/auth/verify', {
  method: 'POST',
  body: JSON.stringify({ phone: TEST_PHONE, code: '0000' }),
}, 401);
const session = await request('/auth/verify', {
  method: 'POST',
  body: JSON.stringify({ phone: TEST_PHONE, code: TEST_OTP }),
});
assert.ok(session.accessToken);
assert.ok(session.refreshToken);

const authorized = { authorization: `Bearer ${session.accessToken}` };
const me = await request('/me', { headers: authorized });
assert.equal(me.profile.role, 'customer');

const places = await request(
  `/places/autocomplete?q=${encodeURIComponent('الكعبة')}&lat=21.4225&lng=39.8262&language=ar`,
  { headers: authorized },
);
assert.ok(places.suggestions.length > 0, 'Google Places returned no suggestions');
const selected = await request(
  `/places/${encodeURIComponent(places.suggestions[0].id)}?language=ar`,
  { headers: authorized },
);
assert.ok(Number.isFinite(selected.place.lat) && Number.isFinite(selected.place.lng));

await request('/driver/jobs', { headers: authorized }, 403);
await request('/admin/bookings', { headers: authorized }, 403);

const dashboard = await fetch(DASHBOARD);
assert.equal(dashboard.status, 200);
assert.match(await dashboard.text(), /<div id="root"><\/div>/);

console.log(JSON.stringify({
  ok: true,
  api: API,
  dashboard: DASHBOARD,
  checks: {
    dependencies: true,
    catalogue: true,
    fridayClosed: true,
    makkahTeamCapacity: true,
    authAndRoleGates: true,
    googlePlaces: true,
  },
}, null, 2));
