/* global Request, Response, URL */
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { after, before, test } from 'node:test';
import { build } from 'esbuild';

let api;
let compiledDirectory;
const originalFetch = globalThis.fetch;
const deletedKeys = [];
const env = {
  SUPABASE_URL: 'https://fixture.invalid',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  MOYASAR_SECRET_KEY: 'sk_test_fixture',
  MEDIA: { delete: async (keys) => { deletedKeys.push(...keys); } },
};
const callerId = '00000000-0000-4000-8000-000000000001';
const bookingId = '00000000-0000-4000-8000-000000000002';
const technicianId = '00000000-0000-4000-8000-000000000003';
const adminId = '00000000-0000-4000-8000-000000000004';
const calls = [];
const result = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const writes = (fragment) => calls.filter((call) => call.path.includes(fragment) && call.method && call.method !== 'GET');

before(async () => {
  const bundle = await build({ entryPoints: [new URL('../src/index.ts', import.meta.url).pathname], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent' });
  compiledDirectory = await mkdtemp(join(tmpdir(), 'bubbles-customer-flows-'));
  const compiledFile = join(compiledDirectory, 'api.mjs');
  await writeFile(compiledFile, bundle.outputFiles[0].text);
  api = (await import(pathToFileURL(compiledFile).href)).default;
});
after(async () => {
  globalThis.fetch = originalFetch;
  if (compiledDirectory) await rm(compiledDirectory, { recursive: true, force: true });
});

function setup(handler, role = 'customer') {
  calls.length = 0;
  deletedKeys.length = 0;
  globalThis.fetch = async (url, init = {}) => {
    const path = String(url).replace(env.SUPABASE_URL, '');
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ path, ...init, body });
    if (path === '/auth/v1/user') return result({ id: callerId, phone: '+966500000000' });
    if (path.includes('&select=role,active')) return result([{ role, active: true }]);
    // Notification plumbing is not what these tests are about.
    if (path.startsWith('/rest/v1/device_push_tokens') || path.includes('&select=language')) return result([]);
    if (path === '/rest/v1/notifications') return result([{ id: 'n1' }]);
    const response = await handler(path, init, body);
    assert.ok(response, `Unexpected backend call: ${init.method ?? 'GET'} ${path}`);
    return response;
  };
}
const request = (path, method = 'GET', body) => api.fetch(new Request(`https://api.test${path}`, {
  method,
  headers: { Authorization: 'Bearer test-session', 'Content-Type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
}), env, { waitUntil() {} });

const hours = (n) => new Date(Date.now() + n * 3600_000).toISOString();
const scheduled = { id: bookingId, ref: 'BK-4901', status: 'scheduled', stage: 'booked', source: 'cash', technician_id: null, total_minor: 4000, payment_confirmed: true, scheduled_at: hours(5) };
const invoiceUrl = 'https://api.moyasar.com/v1/invoices/inv_fixture';
const refundUrl = 'https://api.moyasar.com/v1/payments/pay_fixture/refund';
const moyasar = (path, init, { refundFails = false } = {}) => {
  if (path === '/rest/v1/payments?' + `booking_id=eq.${bookingId}&provider=eq.moyasar&state=in.(paid,pending)&select=id,provider_ref&order=created_at.desc&limit=1`) {
    return result([{ id: 'payment-1', provider_ref: 'inv_fixture' }]);
  }
  if (path === invoiceUrl) {
    return refundFails ? result({ message: 'unavailable' }, 503) : result({ id: 'inv_fixture', status: 'paid', amount: 4000, currency: 'SAR', payments: [{ id: 'pay_fixture', status: 'paid', amount: 4000, refunded: 0, currency: 'SAR' }] });
  }
  if (path === refundUrl) return result({ id: 'pay_fixture', status: 'refunded', refunded: 4000 });
  if (path === '/rest/v1/payment_refunds') return result([]);
  if (path.startsWith('/rest/v1/payments?id=eq.payment-1') && init.method === 'PATCH') return result([]);
  return undefined;
};
const cancelHandler = (booking, patched = [booking], options) => (path, init) => {
  if (path.startsWith('/rest/v1/bookings?') && init.method === 'GET') return result([booking]);
  if (path.startsWith('/rest/v1/bookings?') && init.method === 'PATCH') return result(patched);
  if (path === '/rest/v1/operations_incidents') return result([]);
  return moyasar(path, init, options);
};

test('cancelling a paid booking before the notice refunds it automatically', async () => {
  setup(cancelHandler(scheduled));
  const response = await request(`/bookings/${bookingId}/cancel`, 'POST');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).refund, 'sent');
  assert.equal(writes(refundUrl).length, 1);
  const [record] = writes('/payment_refunds');
  assert.deepEqual([record.body.payment_id, record.body.amount_minor, record.body.requested_by], ['payment-1', 4000, callerId]);
  assert.equal(writes('/payments?id=eq.payment-1')[0].body.state, 'refunded');
  const [alert] = writes('/rest/v1/notifications');
  assert.deepEqual([alert.body.profile_id, alert.body.kind], [callerId, 'payment_refunded']);
  assert.equal(writes('/operations_incidents').length, 0);
});

test('the money moves only after the booking is cancelled', async () => {
  setup(cancelHandler(scheduled, []));
  assert.equal((await request(`/bookings/${bookingId}/cancel`, 'POST')).status, 409);
  assert.equal(writes(refundUrl).length, 0);
});

test('a refund Moyasar refuses leaves the booking cancelled and asks a person', async () => {
  setup(cancelHandler(scheduled, [scheduled], { refundFails: true }));
  const response = await request(`/bookings/${bookingId}/cancel`, 'POST');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).refund, 'review');
  const [review] = writes('/operations_incidents');
  assert.deepEqual([review.body.category, review.body.source], ['refund_review', 'system']);
  assert.match(review.body.note, /40\.00/);
  assert.equal(writes('/payments?id=eq.payment-1').length, 0);
});

test('inside the three-hour notice a confirmed booking cannot be cancelled', async () => {
  setup(cancelHandler({ ...scheduled, scheduled_at: hours(2.9) }));
  const response = await request(`/bookings/${bookingId}/cancel`, 'POST');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'cancelWindowClosed');
  assert.equal(writes('/bookings?').length, 0);
});

test('an unpaid checkout hold is released whenever the customer leaves payment', async () => {
  setup(cancelHandler({ ...scheduled, payment_confirmed: false, scheduled_at: hours(1) }));
  const response = await request(`/bookings/${bookingId}/cancel`, 'POST');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).refund, 'none');
  assert.equal(writes(refundUrl).length, 0);
});

test('cancellation is conditional, so a wash that just started keeps going', async () => {
  setup(cancelHandler(scheduled, []));
  const response = await request(`/bookings/${bookingId}/cancel`, 'POST');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'alreadyStarted');
  const [patch] = writes('/bookings?');
  assert.match(patch.path, /status=eq\.scheduled/);
  assert.match(patch.path, /stage=eq\.booked/);
  assert.equal(writes('/operations_incidents').length, 0);
});

test('a subscription wash with nothing paid needs no refund', async () => {
  setup(cancelHandler({ ...scheduled, source: 'club', total_minor: 0 }));
  assert.equal((await request(`/bookings/${bookingId}/cancel`, 'POST')).status, 200);
  assert.equal(writes(refundUrl).length, 0);
  assert.equal(writes('/operations_incidents').length, 0);
});

test('the assigned driver hears about a cancellation', async () => {
  setup(cancelHandler({ ...scheduled, technician_id: technicianId }));
  await request(`/bookings/${bookingId}/cancel`, 'POST');
  const [alert] = writes('/rest/v1/notifications');
  assert.equal(alert.body.profile_id, technicianId);
  assert.equal(alert.body.kind, 'job_cancelled');
});

const issueHandler = (booking, created = () => result([{ id: 'issue-1' }], 201)) => (path, init) => {
  if (path.startsWith('/rest/v1/bookings?')) return result(booking ? [booking] : []);
  if (path === '/rest/v1/operations_incidents' && init.method === 'POST') return created();
  if (path.startsWith('/rest/v1/profiles?role=eq.admin')) return result([{ id: adminId }]);
  return undefined;
};
const washed = { id: bookingId, ref: 'BK-4901', status: 'done', scheduled_at: '2026-01-01T08:00:00Z' };

test('a customer report joins the operations queue and alerts administrators', async () => {
  setup(issueHandler(washed));
  const response = await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'wash_quality', note: '  Dirty wheels  ' });
  assert.equal(response.status, 201);
  const [issue] = writes('/operations_incidents');
  assert.deepEqual(
    [issue.body.source, issue.body.category, issue.body.note, issue.body.reported_by],
    ['customer', 'wash_quality', 'Dirty wheels', callerId],
  );
  const [alert] = writes('/rest/v1/notifications');
  assert.equal(alert.body.profile_id, adminId);
  assert.match(alert.body.title_ar, /BK-4901/);
});

test('a report needs a known category and a note of sensible size', async () => {
  setup(() => { throw new Error('No backend expected'); });
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'driver_rude', note: 'x' })).status, 400);
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: '   ' })).status, 400);
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: 'x'.repeat(1001) })).status, 400);
});

test('only the owner can report, and only once the service window has opened', async () => {
  setup(issueHandler(null));
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: 'x' })).status, 404);
  assert.match(calls.find((call) => call.path.includes('/bookings?')).path, new RegExp(`profile_id=eq\\.${callerId}`));

  setup(issueHandler({ ...washed, status: 'scheduled', scheduled_at: new Date(Date.now() + 3600000).toISOString() }));
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: 'x' })).status, 409);
  setup(issueHandler({ ...washed, status: 'cancelled' }));
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: 'x' })).status, 409);
});

test('a late team can be reported while the booking still reads as scheduled', async () => {
  setup(issueHandler({ ...washed, status: 'scheduled' }));
  assert.equal((await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'team_late', note: 'Nobody came' })).status, 201);
});

test('a second open report is answered, not treated as a server failure', async () => {
  setup(issueHandler(washed, () => new Response('duplicate key value violates unique constraint "operations_incidents_one_open_customer_idx"', { status: 409 })));
  const response = await request(`/bookings/${bookingId}/issues`, 'POST', { category: 'other', note: 'Again' });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'issueAlreadyOpen');
});

test('the booking list exposes customer reports without driver notes', async () => {
  setup((path) => {
    if (path === '/rest/v1/rpc/expire_missed_bookings') return result([]);
    if (path.startsWith('/rest/v1/bookings?')) return result([]);
    return undefined;
  });
  await request('/bookings');
  const list = calls.find((call) => call.path.startsWith('/rest/v1/bookings?'));
  assert.match(list.path, /customer_issues:operations_incidents\(id,category,status,created_at\)/);
  assert.match(list.path, /customer_issues\.source=eq\.customer/);
});

const finishHandler = (rpc) => (path, init) => {
  if (path === '/rest/v1/rpc/delete_customer_account') return rpc();
  if (path === `/auth/v1/admin/users/${callerId}` && init.method === 'DELETE') return result({});
  if (path.startsWith('/rest/v1/account_deletions')) return result([]);
  return moyasar(path, init);
};

test('deleting an account erases, clears evidence, removes the identity and tells the driver', async () => {
  setup(finishHandler(() => result({ jobs: [{ bookingId, ref: 'BK-4901', technicianId }], refunds: [{ bookingId, totalMinor: 4000 }], mediaKeys: ['bookings/a.jpg'] })));
  const response = await request('/me', 'DELETE');
  assert.equal(response.status, 200);
  const rpc = writes('delete_customer_account')[0].body;
  assert.equal(rpc.p_profile, callerId);
  // The cutoff is the same three-hour notice a cancellation uses.
  assert.ok(Math.abs(Date.parse(rpc.p_refund_cutoff) - Date.now() - 3 * 3600_000) < 60_000);
  assert.equal(writes(refundUrl).length, 1);
  assert.deepEqual(deletedKeys, ['bookings/a.jpg']);
  assert.equal(writes('/auth/v1/admin/users/').length, 1);
  assert.ok(writes('/account_deletions')[0].body.completed_at);
  // The driver hears about the job. The deleted customer gets no refund notice.
  assert.deepEqual(writes('/rest/v1/notifications').map((call) => call.body.profile_id), [technicianId]);
});

test('an administrator refund still records, cancels and tells the customer', async () => {
  setup((path, init) => {
    if (path.startsWith('/rest/v1/payments?id=eq.payment-1&provider=eq.moyasar')) {
      return result([{ id: 'payment-1', profile_id: callerId, booking_id: bookingId, membership_id: null, amount_minor: 4000, state: 'paid', provider_ref: 'inv_fixture' }]);
    }
    if (path.startsWith('/rest/v1/bookings?') && init.method === 'PATCH') return result([]);
    return moyasar(path, init);
  }, 'admin');
  const response = await request('/admin/payments/payment-1/refund', 'POST', { reason: 'Customer request' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).amountMinor, 4000);
  assert.equal(writes('/payment_refunds')[0].body.reason, 'Customer request');
  assert.equal(writes('/payments?id=eq.payment-1')[0].body.state, 'refunded');
  assert.equal(writes('/bookings?')[0].body.status, 'cancelled');
  assert.equal(writes('/rest/v1/notifications')[0].body.kind, 'payment_refunded');
});

test('a wash in progress is explained to the customer', async () => {
  setup(finishHandler(() => new Response('{"message":"washInProgress"}', { status: 400 })));
  const response = await request('/me', 'DELETE');
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'washInProgress');
  assert.equal(writes('/auth/v1/admin/users/').length, 0);
});

test('a driver cannot delete their account from the customer route', async () => {
  setup(() => { throw new Error('No backend expected'); }, 'driver');
  assert.equal((await request('/me', 'DELETE')).status, 409);
  assert.equal(calls.some((call) => call.path.includes('delete_customer_account')), false);
});

test('a failed identity removal stays queued instead of failing the customer', async () => {
  setup((path, init) => {
    if (path === '/rest/v1/rpc/delete_customer_account') return result({ jobs: [], refunds: [], mediaKeys: [] });
    if (path === `/auth/v1/admin/users/${callerId}` && init.method === 'DELETE') return result({}, 500);
    return undefined;
  });
  assert.equal((await request('/me', 'DELETE')).status, 200);
  assert.equal(writes('/account_deletions').length, 0);
});

test('the maintenance sweep finishes interrupted deletions', async () => {
  setup((path, init) => {
    if (path.startsWith('/rest/v1/rpc/')) return result([0]);
    if (path.startsWith('/rest/v1/account_deletions?completed_at')) return result([{ profile_id: callerId, media_keys: ['bookings/b.jpg'] }]);
    if (path.startsWith('/rest/v1/account_deletions?profile_id')) return result([]);
    if (path === `/auth/v1/admin/users/${callerId}` && init.method === 'DELETE') return result({}, 404);
    return undefined;
  });
  let sweep;
  api.scheduled({}, env, { waitUntil: (work) => { sweep = work; } });
  await sweep;
  assert.deepEqual(deletedKeys, ['bookings/b.jpg']);
  assert.ok(writes('/account_deletions?profile_id')[0].body.completed_at);
});

test('a driver stage update titles the customer notification with the event', async () => {
  setup((path, init) => {
    if (path.startsWith('/rest/v1/bookings?') && init.method === 'PATCH') return result([{ id: bookingId }]);
    if (path.startsWith('/rest/v1/bookings?')) return result([{ id: bookingId, stage: 'booked', status: 'scheduled', profile_id: callerId, ref: 'BK-4901' }]);
    if (path === '/rest/v1/booking_events') return result([]);
    return undefined;
  }, 'driver');
  assert.equal((await request(`/driver/jobs/${bookingId}/stage`, 'POST', { stage: 'arrived' })).status, 200);
  const [alert] = writes('/rest/v1/notifications');
  assert.equal(alert.body.title_ar, 'وصل الفريق');
  assert.equal(alert.body.title_en, 'Team arrived');
  assert.notEqual(alert.body.title_ar, 'BK-4901');
  assert.match(alert.body.body_ar, /BK-4901/);
});

test('resolving a customer report tells them, and a driver incident stays internal', async () => {
  const resolve = (source) => setup((path, init) => {
    if (path.startsWith('/rest/v1/operations_incidents?') && init.method === 'PATCH') {
      return result([{ id: 'i1', booking_id: bookingId, reported_by: callerId, source, bookings: { ref: 'BK-4901' } }]);
    }
    return undefined;
  }, 'admin');
  resolve('customer');
  assert.equal((await request('/admin/incidents/i1/resolve', 'PATCH')).status, 200);
  assert.equal(writes('/rest/v1/notifications')[0].body.title_ar, 'تمت معالجة البلاغ');
  resolve('driver');
  assert.equal((await request('/admin/incidents/i1/resolve', 'PATCH')).status, 200);
  assert.equal(writes('/rest/v1/notifications').length, 0);
});

test('the payment return hands a declined card back to the app as a decline', async () => {
  const text = async (query) => (await api.fetch(new Request(`https://api.test/payments/return?kind=booking&id=${bookingId}&${query}`), env, {})).text();
  assert.match(await text('result=cancel&reason=declined'), /result=declined/);
  assert.match(await text('result=cancel'), /result=cancel/);
  assert.match(await text('result=success&reason=declined'), /result=success/);
  assert.doesNotMatch(await text('result=cancel&reason=<script>'), /<script>'/);
});
