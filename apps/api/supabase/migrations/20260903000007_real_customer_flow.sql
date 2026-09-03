-- Real customer flow: persistent identities, paid memberships and bookings,
-- and weekly subscription entitlements that never turn into banked credits.

alter table profiles add column if not exists phone text not null default '';

alter table memberships
  add column if not exists payment_confirmed boolean not null default false;

alter table bookings
  add column if not exists payment_confirmed boolean not null default true;

-- A subscription starts with the exact two or three appointments selected by
-- the customer. They are held here while Moyasar is open, then converted into
-- ordinary bookings in one database transaction after payment is verified.
create table if not exists membership_signup_slots (
  id            uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships (id) on delete cascade,
  vehicle_id    uuid not null references vehicles (id),
  address_id    uuid not null references addresses (id),
  service_key   text not null references services (key),
  slot_start    timestamptz not null,
  add_ons       text[] not null default '{}',
  booking_id    uuid references bookings (id),
  created_at    timestamptz not null default now(),
  unique (membership_id, slot_start)
);
alter table membership_signup_slots enable row level security;

-- The approved products are weekly entitlements. `credits` remains for old
-- rows and catalogue compatibility, but is no longer spent or rolled over.
update plans set active = false, best = false;
update plans
set name_ar = 'أساسي', name_en = 'Basic', price_minor = 19900,
    credits = 2, weekly = 2, roll = 0, active = true, best = false
where id = 'basic';
update plans
set name_ar = 'سوبر ووش', name_en = 'Super Wash', price_minor = 29900,
    credits = 3, weekly = 3, roll = 0, active = true, best = true
where id = 'plus';

-- A used week is derived from every non-cancelled appointment, including a
-- completed or simply missed appointment. Nothing is carried to another week.
create or replace function club_week_used(p_membership uuid, at timestamptz)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from bookings b
  where b.membership_id = p_membership
    and b.status <> 'cancelled'
    and b.scheduled_at >= date_trunc('week', at at time zone 'Asia/Riyadh') at time zone 'Asia/Riyadh'
    and b.scheduled_at < (date_trunc('week', at at time zone 'Asia/Riyadh') + interval '7 days') at time zone 'Asia/Riyadh';
$$;

drop function if exists create_booking(uuid, uuid, uuid, text, timestamptz, pay_source, text[]);

create or replace function create_booking(
  p_profile           uuid,
  p_vehicle           uuid,
  p_address           uuid,
  p_service           text,
  p_slot_start        timestamptz,
  p_source            pay_source,
  p_add_ons           text[] default '{}',
  p_payment_confirmed boolean default true
)
returns bookings
language plpgsql
as $$
declare
  v_service     services%rowtype;
  v_slot        slot_templates%rowtype;
  v_address     addresses%rowtype;
  v_team        teams%rowtype;
  v_membership  memberships%rowtype;
  v_purchase    package_purchases%rowtype;
  v_booking     bookings%rowtype;
  v_plan        plans%rowtype;
  v_day         date := (p_slot_start at time zone 'Asia/Riyadh')::date;
  v_extras      integer := 0;
  v_total       integer := 0;
  v_week_used   integer;
begin
  if p_slot_start <= now() then
    raise exception 'slotInPast' using errcode = 'P0001';
  end if;
  if not exists (select 1 from vehicles where id = p_vehicle and profile_id = p_profile) then
    raise exception 'vehicleNotYours' using errcode = 'P0001';
  end if;

  select * into v_address from addresses where id = p_address and profile_id = p_profile;
  if not found then raise exception 'addressNotYours' using errcode = 'P0001'; end if;
  if v_address.lat is null or v_address.lng is null then
    raise exception 'locationRequired' using errcode = 'P0001';
  end if;
  if extract(isodow from v_day) = 5 then
    raise exception 'fridayClosed' using errcode = 'P0001';
  end if;

  select * into v_service from services where key = p_service and active;
  if not found then raise exception 'unknownService' using errcode = 'P0001'; end if;

  select * into v_slot from slot_templates
  where starts_at = (p_slot_start at time zone 'Asia/Riyadh')::time and active;
  if not found then raise exception 'unknownSlot' using errcode = 'P0001'; end if;

  perform pg_advisory_xact_lock(hashtextextended('booking-day:' || v_day::text, 0));

  select t.* into v_team from teams t
  where t.active
    and geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng) <= t.service_radius_km
    and (select count(*) from bookings b where b.team_id = t.id
      and b.status in ('scheduled', 'active')
      and (b.scheduled_at at time zone 'Asia/Riyadh')::date = v_day) < t.daily_capacity
    and (select count(*) from bookings b where b.team_id = t.id
      and b.status in ('scheduled', 'active')
      and (b.scheduled_at at time zone 'Asia/Riyadh')::date = v_day
      and (b.scheduled_at at time zone 'Asia/Riyadh')::time = v_slot.starts_at) < v_slot.capacity
  order by geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng), t.sort
  limit 1;

  if not found then
    if exists (select 1 from teams t where t.active
      and geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng) <= t.service_radius_km) then
      raise exception 'slotFull' using errcode = 'P0001';
    end if;
    raise exception 'outsideServiceArea' using errcode = 'P0001';
  end if;

  select coalesce(sum(price_minor), 0) into v_extras
  from add_ons where key = any(p_add_ons) and active;

  if p_source = 'club' then
    select * into v_membership from memberships
    where profile_id = p_profile and state = 'active' and payment_confirmed
      and cycle_start <= p_slot_start and cycle_end > p_slot_start
    for update;
    if not found then raise exception 'noMembership' using errcode = 'P0001'; end if;
    select * into v_plan from plans where id = v_membership.plan_id and active;
    v_week_used := club_week_used(v_membership.id, p_slot_start);
    if v_week_used >= v_plan.weekly then
      raise exception 'weeklyCapReached' using errcode = 'P0001';
    end if;
    v_total := v_extras;
  elsif p_source = 'package' then
    select * into v_purchase from package_purchases
    where profile_id = p_profile and credits_left > 0 and expires_at > now()
    order by expires_at asc limit 1 for update;
    if not found then raise exception 'noPackageCredits' using errcode = 'P0001'; end if;
    v_total := v_extras;
  else
    v_total := v_service.price_minor + v_extras;
  end if;

  insert into bookings (
    ref, profile_id, vehicle_id, address_id, service_key, team_id,
    scheduled_at, ends_at, source, membership_id, purchase_id,
    total_minor, payment_confirmed
  ) values (
    'BK-' || nextval('booking_ref_seq'), p_profile, p_vehicle, p_address,
    p_service, v_team.id, p_slot_start,
    p_slot_start + make_interval(mins => v_service.minutes), p_source,
    case when p_source = 'club' then v_membership.id end,
    case when p_source = 'package' then v_purchase.id end,
    v_total, p_payment_confirmed
  ) returning * into v_booking;

  insert into booking_add_ons (booking_id, add_on_key, price_minor)
  select v_booking.id, key, price_minor from add_ons where key = any(p_add_ons) and active;

  if p_source = 'package' then
    update package_purchases set credits_left = credits_left - 1 where id = v_purchase.id;
  end if;

  insert into booking_events (booking_id, stage, note) values (v_booking.id, 'booked', '');
  return v_booking;
end;
$$;

create or replace function activate_membership_with_slots(p_membership uuid, p_profile uuid)
returns setof bookings
language plpgsql
as $$
declare
  v_membership memberships%rowtype;
  v_plan plans%rowtype;
  v_slot membership_signup_slots%rowtype;
  v_booking bookings%rowtype;
  v_count integer;
begin
  select * into v_membership from memberships
  where id = p_membership and profile_id = p_profile for update;
  if not found then raise exception 'membershipNotFound' using errcode = 'P0001'; end if;
  if v_membership.payment_confirmed then
    return query select b.* from bookings b where b.membership_id = p_membership order by b.scheduled_at;
    return;
  end if;

  select * into v_plan from plans where id = v_membership.plan_id and active;
  select count(*) into v_count from membership_signup_slots where membership_id = p_membership;
  if v_count <> v_plan.weekly then
    raise exception 'scheduleIncomplete' using errcode = 'P0001';
  end if;

  update memberships set payment_confirmed = true where id = p_membership;
  for v_slot in select * from membership_signup_slots where membership_id = p_membership order by slot_start
  loop
    select * into v_booking from create_booking(
      p_profile, v_slot.vehicle_id, v_slot.address_id, v_slot.service_key,
      v_slot.slot_start, 'club', v_slot.add_ons, true
    );
    update membership_signup_slots set booking_id = v_booking.id where id = v_slot.id;
    return next v_booking;
  end loop;
end;
$$;
