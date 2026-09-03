-- Operational dispatch: team rosters, driver shifts, safe assignment,
-- notifications and field incidents.

alter table team_members
  add column if not exists is_lead boolean not null default false,
  add column if not exists available boolean not null default true,
  add column if not exists shift_start time not null default '08:00',
  add column if not exists shift_end time not null default '22:00',
  add column if not exists updated_at timestamptz not null default now();

alter table team_members
  drop constraint if exists team_members_shift_order;
alter table team_members
  add constraint team_members_shift_order check (shift_end > shift_start);

create index if not exists team_members_dispatch_idx
  on team_members (team_id, active, available);

create table if not exists driver_invites (
  phone       text primary key,
  full_name   text not null,
  team_id     text not null references teams (id),
  available   boolean not null default true,
  is_lead     boolean not null default false,
  shift_start time not null default '08:00',
  shift_end   time not null default '22:00',
  created_by  uuid not null references profiles (id),
  accepted_by uuid references profiles (id),
  accepted_at timestamptz,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint driver_invites_phone check (phone ~ '^\\+9665[0-9]{8}$'),
  constraint driver_invites_shift_order check (shift_end > shift_start)
);

create table if not exists device_push_tokens (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles (id) on delete cascade,
  token       text not null unique,
  app         text not null check (app in ('customer', 'driver')),
  platform    text not null check (platform in ('ios', 'android')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists device_push_tokens_profile_idx
  on device_push_tokens (profile_id) where active;

create table if not exists notifications (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles (id) on delete cascade,
  booking_id   uuid references bookings (id) on delete cascade,
  kind         text not null,
  title_ar     text not null,
  title_en     text not null,
  body_ar      text not null,
  body_en      text not null,
  data         jsonb not null default '{}'::jsonb,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists notifications_profile_idx
  on notifications (profile_id, created_at desc);
create index if not exists notifications_unread_idx
  on notifications (profile_id, created_at desc) where read_at is null;

create table if not exists operations_incidents (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings (id) on delete cascade,
  reported_by  uuid not null references profiles (id),
  category     text not null check (category in ('customer_absent', 'access', 'vehicle', 'safety', 'equipment', 'other')),
  note         text not null default '',
  status       text not null default 'open' check (status in ('open', 'resolved')),
  resolved_by  uuid references profiles (id),
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists operations_incidents_open_idx
  on operations_incidents (status, created_at desc);

create table if not exists payment_refunds (
  id                   uuid primary key default gen_random_uuid(),
  payment_id           uuid not null references payments (id),
  provider_payment_ref text not null,
  amount_minor         integer not null check (amount_minor > 0),
  reason               text not null,
  requested_by         uuid not null references profiles (id),
  created_at           timestamptz not null default now()
);
create index if not exists payment_refunds_payment_idx on payment_refunds (payment_id, created_at desc);

alter table device_push_tokens   enable row level security;
alter table notifications        enable row level security;
alter table operations_incidents enable row level security;
alter table payment_refunds      enable row level security;
alter table driver_invites       enable row level security;

-- Assignment is serialised per technician. It validates team membership,
-- working hours and overlapping jobs in the same transaction, so two dispatch
-- clicks cannot double-book one driver.
create or replace function assign_booking_to_technician(
  p_booking uuid,
  p_technician uuid,
  p_actor uuid
)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking bookings%rowtype;
  v_member team_members%rowtype;
  v_driver profiles%rowtype;
  v_local_start time;
  v_result bookings%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext(p_technician::text));

  select * into v_booking from bookings where id = p_booking for update;
  if not found then raise exception 'bookingNotFound' using errcode = 'P0001'; end if;
  if v_booking.status not in ('scheduled', 'active') then
    raise exception 'bookingNotAssignable' using errcode = 'P0001';
  end if;
  if v_booking.team_id is null then
    raise exception 'bookingHasNoTeam' using errcode = 'P0001';
  end if;

  select * into v_driver from profiles
  where id = p_technician and role = 'driver' and active;
  if not found then raise exception 'notATechnician' using errcode = 'P0001'; end if;

  select * into v_member from team_members
  where team_id = v_booking.team_id
    and profile_id = p_technician
    and active
    and available;
  if not found then raise exception 'technicianNotInTeam' using errcode = 'P0001'; end if;

  v_local_start := (v_booking.scheduled_at at time zone 'Asia/Riyadh')::time;
  if v_local_start < v_member.shift_start or v_local_start >= v_member.shift_end then
    raise exception 'outsideDriverShift' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from bookings b
    where b.technician_id = p_technician
      and b.id <> p_booking
      and b.status in ('scheduled', 'active')
      and b.scheduled_at < v_booking.ends_at
      and b.ends_at > v_booking.scheduled_at
  ) then
    raise exception 'technicianBusy' using errcode = 'P0001';
  end if;

  update bookings set technician_id = p_technician
  where id = p_booking returning * into v_result;

  insert into booking_events (booking_id, stage, actor_id, note)
  values (p_booking, v_booking.stage, p_actor, 'technician_assigned:' || p_technician::text);

  return v_result;
end;
$$;

revoke all on function assign_booking_to_technician(uuid, uuid, uuid) from public;
grant execute on function assign_booking_to_technician(uuid, uuid, uuid) to service_role;

-- A paid booking already belongs to a team by coverage and capacity. Team
-- members may see it, and the first available driver to accept it owns the
-- execution. The row lock makes two simultaneous claims resolve to one owner.
create or replace function claim_team_booking(
  p_booking uuid,
  p_technician uuid
)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking bookings%rowtype;
  v_member team_members%rowtype;
  v_local_start time;
  v_result bookings%rowtype;
begin
  select * into v_booking from bookings where id = p_booking for update;
  if not found then raise exception 'bookingNotFound' using errcode = 'P0001'; end if;
  if v_booking.status not in ('scheduled', 'active') or not v_booking.payment_confirmed then
    raise exception 'bookingNotClaimable' using errcode = 'P0001';
  end if;
  if v_booking.technician_id is not null and v_booking.technician_id <> p_technician then
    raise exception 'jobClaimed' using errcode = 'P0001';
  end if;
  if v_booking.technician_id = p_technician then return v_booking; end if;

  select tm.* into v_member
  from team_members tm join profiles p on p.id = tm.profile_id
  where tm.team_id = v_booking.team_id
    and tm.profile_id = p_technician
    and tm.active and tm.available
    and p.role = 'driver' and p.active;
  if not found then raise exception 'technicianNotInTeam' using errcode = 'P0001'; end if;

  v_local_start := (v_booking.scheduled_at at time zone 'Asia/Riyadh')::time;
  if v_local_start < v_member.shift_start or v_local_start >= v_member.shift_end then
    raise exception 'outsideDriverShift' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from bookings b
    where b.technician_id = p_technician
      and b.id <> p_booking
      and b.status in ('scheduled', 'active')
      and b.scheduled_at < v_booking.ends_at
      and b.ends_at > v_booking.scheduled_at
  ) then
    raise exception 'technicianBusy' using errcode = 'P0001';
  end if;

  update bookings set technician_id = p_technician where id = p_booking returning * into v_result;
  insert into booking_events (booking_id, stage, actor_id, note)
  values (p_booking, v_booking.stage, p_technician, 'job_claimed');
  return v_result;
end;
$$;

revoke all on function claim_team_booking(uuid, uuid) from public;
grant execute on function claim_team_booking(uuid, uuid) to service_role;
