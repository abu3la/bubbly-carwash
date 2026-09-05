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

const coverageDiscovery = await request('/catalogue/coverage');
const sharbatly = coverageDiscovery.areas.find((area) => area.id === 'sharbatly-village');
assert.ok(sharbatly, 'Sharbatly Village must be the initial active service area');
assert.equal(sharbatly.name_en, 'Sharbatly Village');
// A representative map center is not an approved boundary or a covered villa.
const pin = new URLSearchParams({
  lat: process.env.BUBBLES_COVERAGE_TEST_LAT ?? String(sharbatly.center_lat),
  lng: process.env.BUBBLES_COVERAGE_TEST_LNG ?? String(sharbatly.center_lng),
});
const withoutVilla = await request(`/catalogue/availability?${pin}&date=${nextWeekday(6)}`);
assert.equal(withoutVilla.covered, false);
assert.deepEqual(withoutVilla.slots, []);
assert.ok(['villaRequired', 'coverageUnavailable', 'outsideServiceArea'].includes(withoutVilla.reason));
const oldMakkah = await request(`/catalogue/availability?lat=21.4225&lng=39.8262&date=${nextWeekday(6)}`);
assert.equal(oldMakkah.covered, false, 'The old Makkah radius must not grant coverage');
assert.deepEqual(oldMakkah.slots, []);
await request('/catalogue/coverage?lat=&lng=', {}, 400);

let registeredVillaAndFriday = 'not tested: supply BUBBLES_COVERAGE_TEST_VILLA and coordinates inside the verified boundary';
if (process.env.BUBBLES_COVERAGE_TEST_VILLA) {
  pin.set('villaNumber', process.env.BUBBLES_COVERAGE_TEST_VILLA);
  const eligibility = await request(`/catalogue/coverage?${pin}`);
  assert.equal(eligibility.status, 'covered', 'The explicit test villa must be registered and enabled');
  assert.ok(eligibility.block?.id && eligibility.team?.id);
  const friday = await request(`/catalogue/availability?${pin}&date=${nextWeekday(5)}`);
  assert.equal(friday.closed, true);
  assert.equal(friday.reason, 'friday');
  assert.deepEqual(friday.slots, []);
  const saturday = await request(`/catalogue/availability?${pin}&date=${nextWeekday(6)}`);
  assert.equal(saturday.covered, true);
  if (saturday.team) assert.equal(saturday.team.id, eligibility.team.id);
  assert.ok(saturday.slots.every((slot) => slot.remaining > 0));
  registeredVillaAndFriday = 'passed';
}

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
  `/places/autocomplete?q=${encodeURIComponent('Sharbatly Village')}&lat=21.6054953&lng=39.2002795&language=ar`,
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
await request('/admin/coverage', { headers: authorized }, 403);

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
    sharbatlyCoverageDiscovery: true,
    missingVillaRejected: true,
    legacyMakkahRadiusRejected: true,
    registeredVillaAndFriday,
    authAndRoleGates: true,
    googlePlaces: true,
  },
}, null, 2));
