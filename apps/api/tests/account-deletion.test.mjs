/* global URL */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test, before, after } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

// Runs against every real migration, because the risk here is the triggers and
// constraints a hand-written schema would quietly leave out.
const migrations = new URL('../supabase/migrations/', import.meta.url);
const customer = '00000000-0000-4000-8000-000000000001';
const technician = '00000000-0000-4000-8000-000000000002';
const membership = '00000000-0000-4000-8000-000000000003';
const invoice = '00000000-0000-4000-8000-000000000004';
const address = '00000000-0000-4000-8000-000000000005';
const vehicle = '00000000-0000-4000-8000-000000000006';
const paidBooking = '00000000-0000-4000-8000-000000000007';
const clubBooking = '00000000-0000-4000-8000-000000000008';
const doneBooking = '00000000-0000-4000-8000-000000000009';
const unpaidBooking = '00000000-0000-4000-8000-00000000000a';
const payment = '00000000-0000-4000-8000-00000000000b';
const soonBooking = '00000000-0000-4000-8000-00000000000c';
const boundary = '[{"lat":21.5,"lng":39.1},{"lat":21.5,"lng":39.3},{"lat":21.7,"lng":39.3},{"lat":21.7,"lng":39.1}]';

let pg;
// The Worker passes now plus the cancellation notice.
const deletion = "select delete_customer_account($1, now() + interval '3 hours')";
const one = async (sql, params) => (await pg.query(sql, params)).rows[0];
const count = async (sql, params) => (await one(`select count(*)::int n from ${sql}`, params)).n;

before(async () => {
  pg = new PGlite();
  await pg.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users (id uuid primary key);
  `);
  for (const file of readdirSync(migrations).sort()) {
    await pg.exec(readFileSync(new URL(file, migrations), 'utf8'));
  }
  await pg.exec(`
    insert into auth.users values ('${customer}'), ('${technician}');
    insert into profiles (id, role, full_name, phone) values
      ('${customer}', 'customer', 'Synthetic Customer', '+966500000001'),
      ('${technician}', 'driver', 'Synthetic Driver', '+966500000002');
    update coverage_areas set boundary = '${boundary}', boundary_verified = true where id = 'sharbatly-village';
    insert into coverage_villas (area_id, block_id, villa_number) values ('sharbatly-village', 'sharbatly-a', '12');
    insert into addresses (id, profile_id, line, district, city, lat, lng, notes, villa_number, is_default)
      values ('${address}', '${customer}', 'Synthetic street', 'Synthetic', 'Jeddah', 21.6, 39.2, 'Blue gate', '12', true);
    insert into vehicles (id, profile_id, make, model, color, plate, is_default)
      values ('${vehicle}', '${customer}', 'Lexus', 'LX', 'White', 'ABC 123', true);
    insert into memberships (id, profile_id, plan_id, state, cycle_end, credits_left, rolled_in, payment_confirmed)
      values ('${membership}', '${customer}', 'basic', 'active', now() + interval '20 days', 0, 0, true);
    insert into checkout_consents (invoice_id, membership_id, profile_id, amount_minor, interval_days, terms_version)
      values ('${invoice}', '${membership}', '${customer}', 19900, 30, 'test');
    insert into membership_billing (membership_id, profile_id, invoice_id, token, amount_minor, next_charge_at)
      values ('${membership}', '${customer}', '${invoice}', 'token_synthetic', 19900, now() + interval '20 days');
    insert into checkout_payment_tokens (payment_id, invoice_id, token)
      values (gen_random_uuid(), '${invoice}', 'token_synthetic');
    insert into bookings (id, ref, profile_id, vehicle_id, address_id, service_key, scheduled_at, ends_at, status, stage, source, membership_id, total_minor, payment_confirmed, technician_id, team_id)
    values
      ('${paidBooking}', 'BK-T1', '${customer}', '${vehicle}', '${address}', 'exterior', now() + interval '2 days', now() + interval '2 days 4 hours', 'scheduled', 'booked', 'cash', null, 4000, true, '${technician}', 'team-1'),
      ('${clubBooking}', 'BK-T2', '${customer}', '${vehicle}', '${address}', 'exterior', now() + interval '3 days', now() + interval '3 days 4 hours', 'scheduled', 'booked', 'club', '${membership}', 0, true, null, 'team-1'),
      ('${doneBooking}', 'BK-T3', '${customer}', '${vehicle}', '${address}', 'exterior', now() - interval '3 days', now() - interval '3 days' + interval '4 hours', 'scheduled', 'booked', 'cash', null, 4000, true, '${technician}', 'team-1'),
      ('${unpaidBooking}', 'BK-T4', '${customer}', '${vehicle}', '${address}', 'exterior', now() + interval '4 days', now() + interval '4 days 4 hours', 'scheduled', 'booked', 'cash', null, 4000, false, null, 'team-1'),
      ('${soonBooking}', 'BK-T5', '${customer}', '${vehicle}', '${address}', 'exterior', now() + interval '1 hour', now() + interval '5 hours', 'scheduled', 'booked', 'cash', null, 6000, true, null, 'team-1');
    update bookings set status = 'done', stage = 'verified' where id = '${doneBooking}';
    insert into payments (id, profile_id, booking_id, amount_minor, state, provider_ref)
      values ('${payment}', '${customer}', '${doneBooking}', 4000, 'paid', 'inv_synthetic');
    insert into booking_media (booking_id, phase, kind, angle, object_key, content_type, byte_size, uploaded_by)
      values ('${doneBooking}', 'after', 'photo', 'front', 'bookings/synthetic/after/1.jpg', 'image/jpeg', 10, '${technician}');
    insert into notifications (profile_id, booking_id, kind, title_ar, title_en, body_ar, body_en)
      values ('${customer}', '${doneBooking}', 'booking_verified', 't', 't', 'b', 'b');
    insert into device_push_tokens (profile_id, token, app, platform) values ('${customer}', 'synthetic-device-token', 'customer', 'ios');
    insert into operations_incidents (booking_id, reported_by, category, source, note)
      values ('${doneBooking}', '${customer}', 'wash_quality', 'customer', 'Personal detail');
  `);
});
after(async () => { await pg?.close(); });

test('a second open customer report on one booking is refused', async () => {
  await assert.rejects(pg.query(`
    insert into operations_incidents (booking_id, reported_by, category, source, note)
    values ('${doneBooking}', '${customer}', 'other', 'customer', 'Again')
  `), /operations_incidents_one_open_customer_idx/);
});

test('a wash in progress blocks deletion and changes nothing', async () => {
  await pg.exec(`update bookings set stage = 'arrived', status = 'active' where id = '${clubBooking}'`);
  await assert.rejects(pg.query(deletion, [customer]), /washInProgress/);
  assert.equal((await one('select full_name from profiles where id = $1', [customer])).full_name, 'Synthetic Customer');
  assert.equal(await count('account_deletions'), 0);
  await pg.exec(`update bookings set stage = 'booked', status = 'scheduled' where id = '${clubBooking}'`);
});

test('staff accounts cannot be deleted from the customer flow', async () => {
  await assert.rejects(pg.query(deletion, [technician]), /accountNotDeletable/);
});

test('deletion erases identity, stops billing and keeps the financial record', async () => {
  const { result } = await one(`${deletion} result`, [customer]);
  assert.deepEqual(result.mediaKeys, ['bookings/synthetic/after/1.jpg']);
  assert.deepEqual(result.jobs, [{ bookingId: paidBooking, ref: 'BK-T1', technicianId: technician }]);
  // Outside the notice the Worker refunds automatically, as for a cancellation.
  assert.deepEqual(result.refunds, [{ bookingId: paidBooking, totalMinor: 4000 }]);

  const profile = await one('select full_name, phone, active, deleted_at from profiles where id = $1', [customer]);
  assert.equal(profile.full_name, '');
  assert.equal(profile.phone, '');
  assert.equal(profile.active, false);
  assert.ok(profile.deleted_at);

  const place = await one('select line, notes, lat, lng, villa_number, archived_at from addresses where id = $1', [address]);
  assert.deepEqual([place.line, place.notes, place.lat, place.lng, place.villa_number], ['', '', null, null, null]);
  assert.ok(place.archived_at);
  const car = await one('select make, plate, archived_at from vehicles where id = $1', [vehicle]);
  assert.deepEqual([car.make, car.plate], ['', '']);
  assert.ok(car.archived_at);

  assert.equal((await one('select state from memberships where id = $1', [membership])).state, 'cancelled');
  const billing = await one('select enabled, token from membership_billing where membership_id = $1', [membership]);
  assert.deepEqual([billing.enabled, billing.token], [false, '']);
  assert.equal(await count('checkout_payment_tokens'), 0);

  const statuses = (await pg.query('select id, status, villa_number from bookings order by ref')).rows;
  assert.deepEqual(statuses.map((row) => row.status), ['cancelled', 'cancelled', 'done', 'cancelled', 'cancelled']);
  assert.ok(statuses.every((row) => row.villa_number === null));
  assert.equal((await one('select state from payments where id = $1', [payment])).state, 'paid');

  // Only the paid wash inside the notice needs a person to review its refund.
  const reviews = (await pg.query("select booking_id, note, source from operations_incidents where category = 'refund_review'")).rows;
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].booking_id, soonBooking);
  assert.equal(reviews[0].source, 'system');
  assert.match(reviews[0].note, /60\.00/);

  assert.equal((await one("select note from operations_incidents where source = 'customer'")).note, '');
  assert.equal(await count('booking_media'), 0);
  assert.equal(await count('notifications'), 0);
  assert.equal(await count('device_push_tokens'), 0);
  const pending = await one('select media_keys, completed_at from account_deletions where profile_id = $1', [customer]);
  assert.deepEqual(pending.media_keys, ['bookings/synthetic/after/1.jpg']);
  assert.equal(pending.completed_at, null);
});

test('signing in again before the identity is gone cannot restore erased data', async () => {
  await pg.exec(`
    insert into profiles (id, phone) values ('${customer}', '+966500000001')
    on conflict (id) do update set phone = excluded.phone
  `);
  assert.equal((await one('select phone from profiles where id = $1', [customer])).phone, '');
});

test('the sign-in identity can be removed while the financial record stays', async () => {
  await pg.exec(`delete from auth.users where id = '${customer}'`);
  assert.equal(await count('profiles where id = $1', [customer]), 1);
  assert.equal(await count('payments where profile_id = $1', [customer]), 1);
});

test('deleting twice is refused', async () => {
  await assert.rejects(pg.query(deletion, [customer]), /accountNotDeletable/);
});

test('the customer app cannot call the function directly', async () => {
  const granted = await one(`
    select has_function_privilege('authenticated', 'delete_customer_account(uuid, timestamptz)', 'execute') authenticated,
           has_function_privilege('anon', 'delete_customer_account(uuid, timestamptz)', 'execute') anon,
           has_function_privilege('service_role', 'delete_customer_account(uuid, timestamptz)', 'execute') service_role
  `);
  assert.deepEqual([granted.authenticated, granted.anon, granted.service_role], [false, false, true]);
});
