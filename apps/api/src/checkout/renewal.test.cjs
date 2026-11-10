const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { PGlite } = require('@electric-sql/pglite');

test('PostgreSQL renewal: one queue entry, atomic activation, replay safety and cancellation', async () => {
  const pg = new PGlite();
  try {
    // Minimal schema boundary; scheduling/capacity itself is covered by the
    // application's existing create_booking function, not duplicated here.
    await pg.exec(`
      create role anon; create role authenticated; create role service_role;
      create table profiles(id uuid primary key);
      create table memberships(id uuid primary key,profile_id uuid,cycle_start timestamptz,cycle_end timestamptz,state text,payment_confirmed boolean);
      create table bookings(id uuid default gen_random_uuid(),membership_id uuid,scheduled_at timestamptz);
      create table membership_signup_slots(id uuid default gen_random_uuid(),membership_id uuid,vehicle_id uuid,address_id uuid,service_key text,slot_start timestamptz,add_ons text[],booking_id uuid);
      create table payments(id uuid default gen_random_uuid(),profile_id uuid,membership_id uuid,amount_minor integer,provider text,provider_ref text,state text);
      create unique index payments_provider_ref_idx on payments(provider,provider_ref) where provider_ref is not null;
      create function create_booking(uuid,uuid,uuid,text,timestamptz,text,text[],boolean) returns bookings language plpgsql as $$
      declare b bookings%rowtype; begin
        if current_setting('test.slot_full', true)='yes' then raise exception 'slotFull'; end if;
        insert into bookings(membership_id,scheduled_at) select id,$5 from memberships where profile_id=$1 returning * into b;
        return b;
      end $$;
    `);
    await pg.exec(readFileSync(path.join(__dirname, '../../supabase/migrations/20260910000020_checkout_renewal_consent.sql'), 'utf8'));
    const owner = '00000000-0000-4000-8000-000000000001';
    const member = '00000000-0000-4000-8000-000000000002';
    const invoice = '00000000-0000-4000-8000-000000000003';
    await pg.exec(`
      insert into profiles values('${owner}');
      insert into memberships values('${member}','${owner}',now()-interval '30 days',now(),'active',true);
      insert into checkout_consents(invoice_id,membership_id,profile_id,amount_minor,interval_days,terms_version) values('${invoice}','${member}','${owner}',29900,30,'test');
      insert into membership_billing(membership_id,profile_id,invoice_id,token,amount_minor,next_charge_at) values('${member}','${owner}','${invoice}','test-token',29900,now());
      update membership_billing set next_charge_at=(select cycle_end from memberships);
      insert into membership_signup_slots(membership_id,vehicle_id,address_id,service_key,slot_start,add_ons)
      values('${member}','${owner}','${owner}','full',now()-interval '2 days','{}'),('${member}','${owner}','${owner}','full',now()-interval '4 days','{}');
    `);
    await pg.query('select * from queue_membership_renewals()');
    await pg.query('select * from queue_membership_renewals()');
    let rows = (await pg.query('select * from membership_renewals')).rows;
    assert.equal(rows.length, 1);
    const job = rows[0].id;
    await assert.rejects(pg.query('select complete_membership_renewal($1)', [job]), /paymentNotConfirmed/);
    await pg.query("update membership_renewals set state='paid' where id=$1", [job]);
    await pg.exec("set test.slot_full='yes'");
    await assert.rejects(pg.query('select complete_membership_renewal($1)', [job]), /slotFull/);
    assert.equal((await pg.query('select count(*)::int n from bookings')).rows[0].n, 0);
    await pg.exec("set test.slot_full='no'");
    await pg.query('select complete_membership_renewal($1)', [job]);
    const count = (await pg.query('select count(*)::int n from bookings')).rows[0].n;
    assert.ok(count >= 8 && count <= 10);
    await pg.query('select complete_membership_renewal($1)', [job]);
    assert.equal((await pg.query('select count(*)::int n from bookings')).rows[0].n, count);
    assert.equal((await pg.query('select count(*)::int n from payments')).rows[0].n, 1);
    // The same compare-and-set used by overlapping workers cannot rewind complete.
    await pg.query("update membership_renewals set state='paid' where id=$1 and state in ('pending','paid')", [job]);
    assert.equal((await pg.query('select state from membership_renewals where id=$1', [job])).rows[0].state, 'complete');
    await pg.exec("update membership_billing set enabled=false,next_charge_at=now()-interval '1 day'");
    await pg.query('select * from queue_membership_renewals()');
    rows = (await pg.query('select * from membership_renewals')).rows;
    assert.equal(rows.length, 1);
    assert.equal((await pg.query('select count(*)::int n from bookings')).rows[0].n, count);
  } finally { await pg.close(); }
});
