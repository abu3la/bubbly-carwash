-- Customers report problems into the queue operations already work from, and
-- can delete their own account. Refunds a person has to look at, such as one
-- that failed or a deletion inside the cancellation notice, join the same queue.

alter table operations_incidents drop constraint operations_incidents_category_check;
alter table operations_incidents add constraint operations_incidents_category_check check (category in (
  'customer_absent', 'access', 'vehicle', 'safety', 'equipment', 'other',
  'wash_quality', 'team_late', 'team_no_show', 'vehicle_damage', 'refund_review'
));

-- Existing rows all came from the driver app.
alter table operations_incidents
  add column source text not null default 'driver'
  check (source in ('driver', 'customer', 'system'));

-- A second tap, or a retry after a dropped response, must not open a second case.
create unique index operations_incidents_one_open_customer_idx
  on operations_incidents (booking_id) where status = 'open' and source = 'customer';

-- ---------------------------------------------------------------- deletion

-- A deleted customer's bookings and payments stay for the financial record, so
-- their profile row has to outlive the sign-in identity it used to mirror. The
-- cascade from auth.users could only ever fail on the customers who matter.
alter table profiles drop constraint profiles_id_fkey;
alter table profiles add column deleted_at timestamptz;

-- Signing in upserts the phone onto the profile. Until the identity is gone a
-- returning customer could otherwise write it back onto an erased row.
create or replace function keep_deleted_profile_erased()
returns trigger
language plpgsql
as $$
begin
  if old.deleted_at is not null then return old; end if;
  return new;
end;
$$;
create trigger profiles_keep_deleted_erased
before update on profiles
for each row execute function keep_deleted_profile_erased();

-- Coverage guards what can be booked. An archived address never can be again,
-- and erasing one must not be rejected for no longer being inside coverage.
create or replace function enforce_address_coverage()
returns trigger language plpgsql as $$
declare result jsonb;
begin
  if TG_OP='UPDATE' and new.archived_at is not null then return new; end if;
  result:=require_coverage(new.lat,new.lng,new.villa_number);
  new.villa_number:=result->>'villaNumber';
  new.coverage_area_id:=result->'area'->>'id';
  new.coverage_block_id:=result->'block'->>'id';
  return new;
end;
$$;

create or replace function enforce_booking_coverage()
returns trigger language plpgsql as $$
declare a addresses%rowtype; result jsonb;
begin
  -- Erasing the villa from closed history is not a booking.
  if TG_OP='UPDATE' and new.villa_number is null
    and new.status=old.status and new.status in ('cancelled','missed','done') then
    return new;
  end if;
  -- Existing work may finish after coverage is disabled. New payment or
  -- reopening a terminal booking must pass the current rules again.
  if TG_OP='UPDATE'
    and new.address_id is not distinct from old.address_id
    and new.profile_id is not distinct from old.profile_id
    and new.team_id is not distinct from old.team_id
    and new.scheduled_at is not distinct from old.scheduled_at
    and new.villa_number is not distinct from old.villa_number
    and new.coverage_area_id is not distinct from old.coverage_area_id
    and new.coverage_block_id is not distinct from old.coverage_block_id
    and not(new.payment_confirmed and not old.payment_confirmed)
    and not(new.status in ('scheduled','active') and old.status in ('cancelled','missed','done')) then
    return new;
  end if;
  select * into a from addresses where id=new.address_id and profile_id=new.profile_id and archived_at is null;
  if not found then raise exception 'addressUnavailable'; end if;
  result:=require_coverage(a.lat,a.lng,a.villa_number);
  if new.team_id is distinct from result->'team'->>'id' then raise exception 'coverageTeamMismatch'; end if;
  new.villa_number:=a.villa_number;
  new.coverage_area_id:=result->'area'->>'id';
  new.coverage_block_id:=result->'block'->>'id';
  return new;
end;
$$;

-- What the Worker still has to do outside this database. Recording it in the
-- same transaction lets the maintenance sweep finish an interrupted deletion.
create table account_deletions (
  profile_id   uuid primary key references profiles (id),
  media_keys   text[] not null default '{}',
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table account_deletions enable row level security;
revoke all on account_deletions from anon, authenticated;

-- Erases everything that identifies the customer and keeps what the financial
-- record needs: bookings, payments and refunds, with no name, phone, plate or
-- location left on them. One transaction, so a failure leaves the account whole.
--
-- Paid bookings follow the cancellation rule. Those starting at or after
-- `p_refund_cutoff` come back for the Worker to refund through Moyasar; those
-- inside the notice go to a person, as a cancellation there is not allowed.
create or replace function delete_customer_account(p_profile uuid, p_refund_cutoff timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_jobs jsonb;
  v_refunds jsonb;
  v_keys text[];
begin
  perform 1 from profiles
  where id = p_profile and role = 'customer' and deleted_at is null
  for update;
  if not found then raise exception 'accountNotDeletable'; end if;

  -- Locked so a driver arriving now cannot start a wash on a deleted account.
  perform 1 from bookings
  where profile_id = p_profile and status in ('scheduled', 'active')
  for update;
  if exists (
    select 1 from bookings
    where profile_id = p_profile
      and (status = 'active' or (status = 'scheduled' and stage <> 'booked'))
  ) then
    raise exception 'washInProgress';
  end if;

  update memberships set state = 'cancelled', cancelled_at = v_now
  where profile_id = p_profile and state <> 'cancelled';

  -- The stored card token goes with the renewal mandate. A renewal already
  -- queued is closed by the billing job once it reads `enabled`.
  update membership_billing
  set enabled = false, cancelled_at = coalesce(cancelled_at, v_now), token = ''
  where profile_id = p_profile;
  delete from checkout_payment_tokens
  where invoice_id in (select invoice_id from checkout_consents where profile_id = p_profile);

  with cancelled as (
    update bookings set status = 'cancelled', cancelled_at = v_now
    where profile_id = p_profile and status = 'scheduled'
    returning id, ref, technician_id, total_minor, payment_confirmed, scheduled_at
  ), reviewed as (
    insert into operations_incidents (booking_id, reported_by, category, source, note)
    select id, p_profile, 'refund_review', 'system',
      format('حذف العميل حسابه خلال مهلة الإلغاء. مراجعة استرجاع %s ر.س', to_char(total_minor / 100.0, 'FM999990.00'))
    from cancelled
    where payment_confirmed and total_minor > 0 and scheduled_at < p_refund_cutoff
  )
  select
    coalesce(
      jsonb_agg(jsonb_build_object('bookingId', id, 'ref', ref, 'technicianId', technician_id))
        filter (where technician_id is not null),
      '[]'::jsonb
    ),
    coalesce(
      jsonb_agg(jsonb_build_object('bookingId', id, 'totalMinor', total_minor))
        filter (where payment_confirmed and total_minor > 0 and scheduled_at >= p_refund_cutoff),
      '[]'::jsonb
    )
  into v_jobs, v_refunds from cancelled;

  update addresses
  set line = '', district = '', notes = '', lat = null, lng = null, villa_number = null,
      is_default = false, archived_at = coalesce(archived_at, v_now)
  where profile_id = p_profile;
  update vehicles
  set make = '', model = '', color = '', plate = '',
      is_default = false, archived_at = coalesce(archived_at, v_now)
  where profile_id = p_profile;
  update bookings set villa_number = null
  where profile_id = p_profile and villa_number is not null;

  update operations_incidents set note = ''
  where reported_by = p_profile and source = 'customer';
  update ratings set comment = ''
  where booking_id in (select id from bookings where profile_id = p_profile);

  with removed as (
    delete from booking_media
    where booking_id in (select id from bookings where profile_id = p_profile)
    returning object_key
  )
  select coalesce(array_agg(object_key), '{}') into v_keys from removed;

  delete from notifications where profile_id = p_profile;
  delete from device_push_tokens where profile_id = p_profile;

  update profiles
  set full_name = '', phone = '', active = false, deleted_at = v_now
  where id = p_profile;

  insert into account_deletions (profile_id, media_keys) values (p_profile, v_keys);

  return jsonb_build_object('jobs', v_jobs, 'refunds', v_refunds, 'mediaKeys', to_jsonb(v_keys));
end;
$$;

revoke all on function delete_customer_account(uuid, timestamptz) from public, anon, authenticated;
grant execute on function delete_customer_account(uuid, timestamptz) to service_role;
