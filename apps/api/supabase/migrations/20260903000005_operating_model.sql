-- Trial operating model: location-aware teams, three daily periods, private
-- wash evidence, and the simplified price list approved for the pilot.

create type wash_period as enum ('morning', 'afternoon', 'night');
create type media_phase as enum ('before', 'after');
create type media_kind as enum ('photo', 'video');

create table teams (
  id                text primary key,
  name_ar           text not null,
  name_en           text not null,
  lat               double precision not null,
  lng               double precision not null,
  service_radius_km double precision not null default 35 check (service_radius_km > 0),
  daily_capacity    integer not null default 40 check (daily_capacity > 0),
  active            boolean not null default false,
  sort              integer not null default 0,
  created_at        timestamptz not null default now()
);

create table team_members (
  team_id    text not null references teams (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  active     boolean not null default true,
  primary key (team_id, profile_id),
  unique (profile_id)
);

alter table slot_templates add column period wash_period;
update slot_templates
set period = case
  when starts_at < '12:00' then 'morning'::wash_period
  when starts_at < '18:00' then 'afternoon'::wash_period
  else 'night'::wash_period
end;
alter table slot_templates alter column period set not null;

alter table bookings add column team_id text references teams (id);
create index bookings_team_schedule_idx
  on bookings (team_id, scheduled_at)
  where status in ('scheduled', 'active');

create table booking_media (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings (id) on delete cascade,
  phase        media_phase not null,
  kind         media_kind not null,
  angle        text not null default 'general'
               check (angle in ('general', 'front', 'rear', 'left', 'right', '360')),
  object_key   text not null unique,
  content_type text not null,
  byte_size    bigint not null check (byte_size > 0),
  uploaded_by  uuid not null references profiles (id),
  created_at   timestamptz not null default now()
);
create index booking_media_booking_idx on booking_media (booking_id, phase, created_at);

alter table teams         enable row level security;
alter table team_members  enable row level security;
alter table booking_media enable row level security;

-- Four Riyadh pilot teams. Only Team 1 is enabled until operations signs off
-- on the trial; the other coordinates are ready for a one-click activation.
insert into teams (
  id, name_ar, name_en, lat, lng, service_radius_km, daily_capacity, active, sort
) values
  ('team-1', 'الفريق 1 — وسط الرياض',  'Team 1 — Central Riyadh', 24.7136, 46.6753, 35, 40, true,  1),
  ('team-2', 'الفريق 2 — شمال الرياض', 'Team 2 — North Riyadh',   24.8430, 46.6530, 25, 40, false, 2),
  ('team-3', 'الفريق 3 — شرق الرياض',  'Team 3 — East Riyadh',    24.7510, 46.8460, 25, 40, false, 3),
  ('team-4', 'الفريق 4 — جنوب الرياض', 'Team 4 — South Riyadh',   24.5480, 46.6880, 25, 40, false, 4);

-- One clear product for the pilot: a SAR 40 single wash. Retired rows remain
-- in place for history, but are never returned by the public catalogue.
update services set active = false;
update services
set name_ar = 'غسلة مفردة',
    name_en = 'Single wash',
    blurb_ar = 'غسيل خارجي موثّق قبل وبعد، عند موقع سيارتك.',
    blurb_en = 'An exterior wash at your car, documented before and after.',
    price_minor = 4000,
    minutes = 45,
    active = true,
    sort = 0
where key = 'exterior';

-- The pilot has subscriptions, not prepaid packages.
update packages set active = false;
update plans set active = false, best = false;
update plans
set name_ar = 'أساسي', name_en = 'Basic', price_minor = 19900,
    credits = 2, weekly = 1, roll = 0, active = true
where id = 'basic';
update plans
set name_ar = 'سوبر ووش', name_en = 'Super Wash', price_minor = 29900,
    credits = 3, weekly = 2, roll = 0, best = true, active = true
where id = 'plus';

-- Each period carries a portion of the team's 40-booking daily ceiling.
update slot_templates set active = false;
insert into slot_templates (starts_at, ends_at, capacity, priority_only, active, period) values
  ('08:00', '12:00', 14, false, true, 'morning'),
  ('13:00', '17:00', 14, false, true, 'afternoon'),
  ('18:00', '22:00', 12, false, true, 'night')
on conflict (starts_at, ends_at) do update set
  capacity = excluded.capacity,
  priority_only = excluded.priority_only,
  active = excluded.active,
  period = excluded.period;

-- Haversine distance without requiring PostGIS for a four-team pilot.
create or replace function geo_distance_km(
  p_lat_a double precision,
  p_lng_a double precision,
  p_lat_b double precision,
  p_lng_b double precision
)
returns double precision
language sql
immutable
strict
as $$
  select 6371 * 2 * asin(sqrt(
    power(sin(radians(p_lat_b - p_lat_a) / 2), 2) +
    cos(radians(p_lat_a)) * cos(radians(p_lat_b)) *
    power(sin(radians(p_lng_b - p_lng_a) / 2), 2)
  ));
$$;

-- Availability is derived from the customer's coordinates. Raw team
-- coordinates stay private; the client receives only the selected team's name
-- and distance. Friday (ISO day 5) returns no rows.
create or replace function available_slots(
  p_lat double precision,
  p_lng double precision,
  p_date date
)
returns table (
  period wash_period,
  starts_at time,
  ends_at time,
  team_id text,
  team_name_ar text,
  team_name_en text,
  distance_km double precision,
  daily_capacity integer,
  remaining integer
)
language sql
stable
as $$
  select
    s.period,
    s.starts_at,
    s.ends_at,
    picked.id,
    picked.name_ar,
    picked.name_en,
    picked.distance_km,
    picked.daily_capacity,
    least(picked.team_remaining, s.capacity - picked.slot_used)::integer
  from slot_templates s
  cross join lateral (
    select
      t.id,
      t.name_ar,
      t.name_en,
      t.daily_capacity,
      geo_distance_km(p_lat, p_lng, t.lat, t.lng) as distance_km,
      t.daily_capacity - (
        select count(*)::integer from bookings b
        where b.team_id = t.id
          and b.status in ('scheduled', 'active')
          and (b.scheduled_at at time zone 'Asia/Riyadh')::date = p_date
      ) as team_remaining,
      (
        select count(*)::integer from bookings b
        where b.team_id = t.id
          and b.status in ('scheduled', 'active')
          and (b.scheduled_at at time zone 'Asia/Riyadh')::date = p_date
          and (b.scheduled_at at time zone 'Asia/Riyadh')::time = s.starts_at
      ) as slot_used
    from teams t
    where t.active
      and geo_distance_km(p_lat, p_lng, t.lat, t.lng) <= t.service_radius_km
      and (
        select count(*) from bookings b
        where b.team_id = t.id
          and b.status in ('scheduled', 'active')
          and (b.scheduled_at at time zone 'Asia/Riyadh')::date = p_date
      ) < t.daily_capacity
      and (
        select count(*) from bookings b
        where b.team_id = t.id
          and b.status in ('scheduled', 'active')
          and (b.scheduled_at at time zone 'Asia/Riyadh')::date = p_date
          and (b.scheduled_at at time zone 'Asia/Riyadh')::time = s.starts_at
      ) < s.capacity
    order by geo_distance_km(p_lat, p_lng, t.lat, t.lng), t.sort
    limit 1
  ) picked
  where s.active
    and extract(isodow from p_date) <> 5
    and picked.team_remaining > 0
    and picked.slot_used < s.capacity
  order by s.starts_at;
$$;

create or replace function create_booking(
  p_profile     uuid,
  p_vehicle     uuid,
  p_address     uuid,
  p_service     text,
  p_slot_start  timestamptz,
  p_source      pay_source,
  p_add_ons     text[] default '{}'
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
  if not exists (select 1 from vehicles where id = p_vehicle and profile_id = p_profile) then
    raise exception 'vehicleNotYours' using errcode = 'P0001';
  end if;

  select * into v_address
  from addresses where id = p_address and profile_id = p_profile;
  if not found then raise exception 'addressNotYours' using errcode = 'P0001'; end if;
  if v_address.lat is null or v_address.lng is null then
    raise exception 'locationRequired' using errcode = 'P0001';
  end if;

  if extract(isodow from v_day) = 5 then
    raise exception 'fridayClosed' using errcode = 'P0001';
  end if;

  select * into v_service from services where key = p_service and active;
  if not found then raise exception 'unknownService' using errcode = 'P0001'; end if;

  select * into v_slot
  from slot_templates
  where starts_at = (p_slot_start at time zone 'Asia/Riyadh')::time and active;
  if not found then raise exception 'unknownSlot' using errcode = 'P0001'; end if;

  -- Serialising a single service day keeps both the 40-per-team ceiling and
  -- each period's capacity correct even when two customers confirm together.
  perform pg_advisory_xact_lock(hashtextextended('booking-day:' || v_day::text, 0));

  select t.* into v_team
  from teams t
  where t.active
    and geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng) <= t.service_radius_km
    and (
      select count(*) from bookings b
      where b.team_id = t.id
        and b.status in ('scheduled', 'active')
        and (b.scheduled_at at time zone 'Asia/Riyadh')::date = v_day
    ) < t.daily_capacity
    and (
      select count(*) from bookings b
      where b.team_id = t.id
        and b.status in ('scheduled', 'active')
        and (b.scheduled_at at time zone 'Asia/Riyadh')::date = v_day
        and (b.scheduled_at at time zone 'Asia/Riyadh')::time = v_slot.starts_at
    ) < v_slot.capacity
  order by geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng), t.sort
  limit 1;

  if not found then
    if exists (
      select 1 from teams t where t.active
        and geo_distance_km(v_address.lat, v_address.lng, t.lat, t.lng) <= t.service_radius_km
    ) then
      raise exception 'slotFull' using errcode = 'P0001';
    end if;
    raise exception 'outsideServiceArea' using errcode = 'P0001';
  end if;

  select coalesce(sum(price_minor), 0) into v_extras
  from add_ons where key = any(p_add_ons) and active;

  if p_source = 'club' then
    select * into v_membership
    from memberships
    where profile_id = p_profile and state = 'active'
    for update;
    if not found then raise exception 'noMembership' using errcode = 'P0001'; end if;
    if v_membership.credits_left <= 0 then
      raise exception 'noClubCredits' using errcode = 'P0001';
    end if;
    select * into v_plan from plans where id = v_membership.plan_id;
    v_week_used := club_week_used(v_membership.id, p_slot_start);
    if v_week_used >= v_plan.weekly then
      raise exception 'weeklyCapReached' using errcode = 'P0001';
    end if;
    v_total := v_extras;
  elsif p_source = 'package' then
    select * into v_purchase
    from package_purchases
    where profile_id = p_profile and credits_left > 0 and expires_at > now()
    order by expires_at asc limit 1 for update;
    if not found then raise exception 'noPackageCredits' using errcode = 'P0001'; end if;
    v_total := v_extras;
  else
    v_total := v_service.price_minor + v_extras;
  end if;

  insert into bookings (
    ref, profile_id, vehicle_id, address_id, service_key, team_id,
    scheduled_at, ends_at, source, membership_id, purchase_id, total_minor
  ) values (
    'BK-' || nextval('booking_ref_seq'),
    p_profile, p_vehicle, p_address, p_service, v_team.id,
    p_slot_start,
    p_slot_start + make_interval(mins => v_service.minutes),
    p_source,
    case when p_source = 'club' then v_membership.id end,
    case when p_source = 'package' then v_purchase.id end,
    v_total
  ) returning * into v_booking;

  insert into booking_add_ons (booking_id, add_on_key, price_minor)
  select v_booking.id, key, price_minor from add_ons where key = any(p_add_ons) and active;

  if p_source = 'club' then
    update memberships set credits_left = credits_left - 1 where id = v_membership.id;
  elsif p_source = 'package' then
    update package_purchases set credits_left = credits_left - 1 where id = v_purchase.id;
  end if;

  insert into booking_events (booking_id, stage, note) values (v_booking.id, 'booked', '');
  return v_booking;
end;
$$;
