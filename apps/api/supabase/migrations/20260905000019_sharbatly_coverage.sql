-- Coverage is an operator-verified polygon followed by an explicit villa
-- allowlist. A map marker or legacy team radius is never proof of coverage.
create table coverage_areas (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  city text not null,
  center_lat double precision,
  center_lng double precision,
  boundary jsonb not null default '[]',
  boundary_verified boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  check (center_lat between -90 and 90 and center_lng between -180 and 180)
);
create table coverage_blocks (
  id text primary key,
  area_id text not null references coverage_areas(id),
  code text not null,
  name_ar text not null,
  name_en text not null,
  team_id text not null references teams(id),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (area_id, code),
  unique (id, area_id)
);
create or replace function normalize_villa_number(p_number text)
returns text language sql immutable strict as $$
  select upper(regexp_replace(translate(trim(p_number), '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789'), '[[:space:]]', '', 'g'));
$$;
create table coverage_villas (
  id uuid primary key default gen_random_uuid(),
  area_id text not null references coverage_areas(id),
  block_id text not null,
  villa_number text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  foreign key (block_id, area_id) references coverage_blocks(id, area_id),
  unique (area_id, villa_number),
  check (villa_number = normalize_villa_number(villa_number) and length(villa_number) <= 24
    and villa_number ~ '^[0-9A-Z]+([/-][0-9A-Z]+)*$' and villa_number ~ '[0-9]')
);
alter table coverage_areas enable row level security;
alter table coverage_blocks enable row level security;
alter table coverage_villas enable row level security;

-- Keep the public pin for map orientation only. The actual boundary remains
-- unconfigured until operations supplies and verifies surveyed coordinates.
insert into coverage_areas(id,name_ar,name_en,city,center_lat,center_lng,active)
values ('sharbatly-village','شربتلي فيلج','Sharbatly Village','Jeddah',21.6054953,39.2002795,true);
update teams set active = false;
update teams set name_ar='الفريق 1',name_en='Team 1',lat=21.6054953,lng=39.2002795,active=true where id='team-1';
insert into coverage_blocks(id,area_id,code,name_ar,name_en,team_id,active)
values ('sharbatly-a','sharbatly-village','A','بلوك A','Block A','team-1',true);
-- Intentionally zero coverage_villas rows. No customer is covered by a guess.

alter table addresses add column villa_number text;
alter table addresses add column coverage_area_id text references coverage_areas(id);
alter table addresses add column coverage_block_id text references coverage_blocks(id);
alter table bookings add column villa_number text;
alter table bookings add column coverage_area_id text references coverage_areas(id);
alter table bookings add column coverage_block_id text references coverage_blocks(id);

-- Ray casting includes boundary segments. Input validation forbids malformed,
-- degenerate and self-intersecting polygons before they can become operative.
create or replace function point_in_coverage(p_lat double precision,p_lng double precision,p_boundary jsonb)
returns boolean language plpgsql immutable as $$
declare n integer; i integer; j integer; x1 double precision; y1 double precision; x2 double precision; y2 double precision; inside boolean := false;
begin
  if p_lat is null or p_lng is null or jsonb_typeof(p_boundary) <> 'array' then return false; end if;
  n := jsonb_array_length(p_boundary);
  if n < 3 then return false; end if;
  j := n - 1;
  for i in 0..n-1 loop
    x1 := (p_boundary->i->>'lng')::double precision; y1 := (p_boundary->i->>'lat')::double precision;
    x2 := (p_boundary->j->>'lng')::double precision; y2 := (p_boundary->j->>'lat')::double precision;
    if abs((p_lng-x1)*(y2-y1)-(p_lat-y1)*(x2-x1)) < 1e-12
      and p_lng between least(x1,x2) and greatest(x1,x2)
      and p_lat between least(y1,y2) and greatest(y1,y2) then return true; end if;
    if (y1 > p_lat) <> (y2 > p_lat) then
      if p_lng < (x2-x1)*(p_lat-y1)/(y2-y1)+x1 then inside := not inside; end if;
    end if;
    j := i;
  end loop;
  return inside;
end;
$$;

create or replace function coverage_configuration_lock()
returns trigger language plpgsql as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('coverage-configuration',0));
  if TG_OP='DELETE' then return old; end if;
  return new;
end;
$$;
create trigger coverage_areas_lock before insert or update or delete on coverage_areas for each statement execute function coverage_configuration_lock();
create trigger coverage_blocks_lock before insert or update or delete on coverage_blocks for each statement execute function coverage_configuration_lock();
create trigger coverage_villas_lock before insert or update or delete on coverage_villas for each statement execute function coverage_configuration_lock();
create trigger coverage_teams_lock before update or delete on teams for each statement execute function coverage_configuration_lock();

create or replace function validate_coverage_boundary()
returns trigger language plpgsql as $$
declare n integer; i integer; j integer; a jsonb; b jsonb; c jsonb; d jsonb; area double precision := 0; o1 double precision; o2 double precision; o3 double precision; o4 double precision;
begin
  if jsonb_typeof(new.boundary) <> 'array' then raise exception 'invalidBoundary'; end if;
  n := jsonb_array_length(new.boundary);
  if n=0 then
    if new.boundary_verified then raise exception 'boundaryRequired'; end if;
    return new;
  end if;
  -- Permit the standard GeoJSON repeated final vertex, storing an open ring.
  if n>3 and new.boundary->0 = new.boundary->(n-1) then
    new.boundary := new.boundary - (n-1); n:=n-1;
  end if;
  if n<3 or n>500 then raise exception 'invalidBoundary'; end if;
  for i in 0..n-1 loop
    a:=new.boundary->i; b:=new.boundary->((i+1)%n);
    if jsonb_typeof(a->'lat') <> 'number' or jsonb_typeof(a->'lng') <> 'number'
      or a->'lat' is null or a->'lng' is null then raise exception 'invalidBoundary'; end if;
    if not ((a->>'lat')::double precision between -90 and 90 and (a->>'lng')::double precision between -180 and 180) then raise exception 'invalidBoundary'; end if;
    if a=b then raise exception 'invalidBoundary'; end if;
    area:=area+(a->>'lng')::double precision*(b->>'lat')::double precision-(b->>'lng')::double precision*(a->>'lat')::double precision;
    for j in i+1..n-1 loop
      if j=i+1 or (i=0 and j=n-1) then continue; end if;
      c:=new.boundary->j; d:=new.boundary->((j+1)%n);
      o1:=((b->>'lng')::double precision-(a->>'lng')::double precision)*((c->>'lat')::double precision-(a->>'lat')::double precision)-((b->>'lat')::double precision-(a->>'lat')::double precision)*((c->>'lng')::double precision-(a->>'lng')::double precision);
      o2:=((b->>'lng')::double precision-(a->>'lng')::double precision)*((d->>'lat')::double precision-(a->>'lat')::double precision)-((b->>'lat')::double precision-(a->>'lat')::double precision)*((d->>'lng')::double precision-(a->>'lng')::double precision);
      o3:=((d->>'lng')::double precision-(c->>'lng')::double precision)*((a->>'lat')::double precision-(c->>'lat')::double precision)-((d->>'lat')::double precision-(c->>'lat')::double precision)*((a->>'lng')::double precision-(c->>'lng')::double precision);
      o4:=((d->>'lng')::double precision-(c->>'lng')::double precision)*((b->>'lat')::double precision-(c->>'lat')::double precision)-((d->>'lat')::double precision-(c->>'lat')::double precision)*((b->>'lng')::double precision-(c->>'lng')::double precision);
      if o1*o2<=0 and o3*o4<=0
        and greatest(least((a->>'lat')::double precision,(b->>'lat')::double precision),least((c->>'lat')::double precision,(d->>'lat')::double precision)) <= least(greatest((a->>'lat')::double precision,(b->>'lat')::double precision),greatest((c->>'lat')::double precision,(d->>'lat')::double precision))
        and greatest(least((a->>'lng')::double precision,(b->>'lng')::double precision),least((c->>'lng')::double precision,(d->>'lng')::double precision)) <= least(greatest((a->>'lng')::double precision,(b->>'lng')::double precision),greatest((c->>'lng')::double precision,(d->>'lng')::double precision)) then raise exception 'invalidBoundary'; end if;
    end loop;
  end loop;
  if abs(area)<1e-12 then raise exception 'invalidBoundary'; end if;
  return new;
end;
$$;
create trigger coverage_boundary_validate before insert or update of boundary,boundary_verified on coverage_areas for each row execute function validate_coverage_boundary();

create or replace function check_coverage(p_lat double precision,p_lng double precision,p_villa_number text default null)
returns jsonb language plpgsql stable as $$
declare a coverage_areas%rowtype; v coverage_villas%rowtype; b coverage_blocks%rowtype; t teams%rowtype; result jsonb; number text:=nullif(normalize_villa_number(p_villa_number),'');
begin
  result:=jsonb_build_object('status','outside','area',null,'block',null,'team',null,'villaNumber',number);
  if p_lat is null or p_lng is null or not(p_lat between -90 and 90 and p_lng between -180 and 180) then return result; end if;
  -- Ambiguous overlapping service areas must not grant access by guesswork.
  if (select count(*) from coverage_areas where active and boundary_verified and point_in_coverage(p_lat,p_lng,boundary))>1 then
    return result||jsonb_build_object('status','areaUnavailable');
  end if;
  select * into a from coverage_areas where active and boundary_verified and point_in_coverage(p_lat,p_lng,boundary) order by created_at limit 1;
  if not found then
    if not exists(select 1 from coverage_areas where active and boundary_verified) then
      return result||jsonb_build_object('status','areaUnavailable');
    end if;
    return result;
  end if;
  result:=result||jsonb_build_object('area',jsonb_build_object('id',a.id,'name',jsonb_build_object('ar',a.name_ar,'en',a.name_en),'city',a.city));
  if number is null then return result||jsonb_build_object('status','villaRequired'); end if;
  select * into v from coverage_villas where area_id=a.id and villa_number=number and active;
  if not found then return result||jsonb_build_object('status','villaUnavailable'); end if;
  select * into b from coverage_blocks where id=v.block_id and active;
  if not found then return result||jsonb_build_object('status','villaUnavailable'); end if;
  select * into t from teams where id=b.team_id and active;
  if not found then return result||jsonb_build_object('status','areaUnavailable'); end if;
  return result||jsonb_build_object('status','covered',
    'block',jsonb_build_object('id',b.id,'code',b.code,'name',jsonb_build_object('ar',b.name_ar,'en',b.name_en)),
    'team',jsonb_build_object('id',t.id,'name',jsonb_build_object('ar',t.name_ar,'en',t.name_en)));
end;
$$;
create or replace function require_coverage(p_lat double precision,p_lng double precision,p_villa_number text)
returns jsonb language plpgsql as $$
declare result jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended('coverage-configuration',0));
  result:=check_coverage(p_lat,p_lng,p_villa_number);
  case result->>'status'
    when 'covered' then return result;
    when 'outside' then raise exception 'outsideServiceArea';
    when 'villaRequired' then raise exception 'villaRequired';
    when 'villaUnavailable' then raise exception 'villaUnavailable';
    else raise exception 'coverageUnavailable';
  end case;
end;
$$;

create or replace function enforce_address_coverage()
returns trigger language plpgsql as $$
declare result jsonb;
begin
  result:=require_coverage(new.lat,new.lng,new.villa_number);
  new.villa_number:=result->>'villaNumber';
  new.coverage_area_id:=result->'area'->>'id';
  new.coverage_block_id:=result->'block'->>'id';
  return new;
end;
$$;
create trigger addresses_coverage before insert or update of lat,lng,villa_number,coverage_area_id,coverage_block_id on addresses for each row execute function enforce_address_coverage();

create or replace function enforce_booking_coverage()
returns trigger language plpgsql as $$
declare a addresses%rowtype; result jsonb;
begin
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
create trigger bookings_coverage before insert or update of profile_id,address_id,team_id,scheduled_at,villa_number,coverage_area_id,coverage_block_id,payment_confirmed,status on bookings for each row execute function enforce_booking_coverage();

create or replace function enforce_signup_coverage()
returns trigger language plpgsql as $$
declare a addresses%rowtype;
begin
  select ad.* into a from addresses ad join memberships m on m.id=new.membership_id and m.profile_id=ad.profile_id where ad.id=new.address_id and ad.archived_at is null;
  if not found then raise exception 'addressUnavailable'; end if;
  perform require_coverage(a.lat,a.lng,a.villa_number);
  return new;
end;
$$;
create trigger membership_signup_coverage before insert or update of address_id,slot_start on membership_signup_slots for each row execute function enforce_signup_coverage();

-- Remove the radius-only overload; old clients without a villa receive no slots.
drop function available_slots(double precision,double precision,date);
create or replace function available_slots(
  p_lat double precision,
  p_lng double precision,
  p_date date,
  p_villa_number text default null
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
      and t.id = check_coverage(p_lat,p_lng,p_villa_number)->'team'->>'id'
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
  v_coverage    jsonb;
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
  v_coverage := require_coverage(v_address.lat,v_address.lng,v_address.villa_number);
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
    and t.id = v_coverage->'team'->>'id'
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
      and t.id = v_coverage->'team'->>'id') then
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


-- These functions expose privileged mutations/data and are only called by the Worker.
revoke all on function check_coverage(double precision,double precision,text), require_coverage(double precision,double precision,text), available_slots(double precision,double precision,date,text), create_booking(uuid,uuid,uuid,text,timestamptz,pay_source,text[],boolean), activate_membership_with_slots(uuid,uuid) from public,anon,authenticated;
grant execute on function check_coverage(double precision,double precision,text), require_coverage(double precision,double precision,text), available_slots(double precision,double precision,date,text), create_booking(uuid,uuid,uuid,text,timestamptz,pay_source,text[],boolean), activate_membership_with_slots(uuid,uuid) to service_role;

-- Retain compatibility for older admin callers while changing activation to
-- independent teams. Assignments on existing bookings remain historical;
-- a block's new team receives new bookings only.
create or replace function activate_pilot_team(p_team text)
returns setof teams language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from teams where id=p_team) then raise exception 'teamNotFound'; end if;
  return query update teams set active=true where id=p_team returning *;
end;
$$;

-- Explicit grants are required on projects with automatic exposure disabled.
grant select,insert,update,delete on coverage_areas,coverage_blocks,coverage_villas to service_role;
