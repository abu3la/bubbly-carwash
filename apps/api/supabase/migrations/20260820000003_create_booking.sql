-- Booking creation, as one transaction.
--
-- This exists because the API talks to Postgres over PostgREST, where every
-- statement is its own transaction. Doing this in the Worker — check the cap,
-- then spend the credit, then insert — leaves gaps between the steps, and two
-- taps a few milliseconds apart both pass the check and both spend the same
-- last credit. A function runs inside one transaction and can take row locks,
-- which closes that window.
--
-- This is the concrete cost of choosing Workers over a framework with a direct
-- database connection. Worth paying, but it has to be paid here rather than
-- hoped away.

create sequence if not exists booking_ref_seq start 4900;

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
  v_membership  memberships%rowtype;
  v_purchase    package_purchases%rowtype;
  v_booking     bookings%rowtype;
  v_extras      integer := 0;
  v_total       integer := 0;
  v_taken       integer;
  v_week_used   integer;
  v_plan        plans%rowtype;
begin
  -- The caller must own what it is booking with. Checked here rather than
  -- trusted from the Worker: this function runs with the service role, so it
  -- is the last line of defence.
  if not exists (select 1 from vehicles where id = p_vehicle and profile_id = p_profile) then
    raise exception 'vehicleNotYours' using errcode = 'P0001';
  end if;
  if not exists (select 1 from addresses where id = p_address and profile_id = p_profile) then
    raise exception 'addressNotYours' using errcode = 'P0001';
  end if;

  select * into v_service from services where key = p_service and active;
  if not found then raise exception 'unknownService' using errcode = 'P0001'; end if;

  select * into v_slot
  from slot_templates
  where starts_at = (p_slot_start at time zone 'Asia/Riyadh')::time and active;
  if not found then raise exception 'unknownSlot' using errcode = 'P0001'; end if;

  -- Lock the slot's existing bookings so two customers cannot both read
  -- "one seat left" and both take it.
  select count(*) into v_taken
  from bookings
  where scheduled_at = p_slot_start
    and status in ('scheduled', 'active')
  for update;

  if v_taken >= v_slot.capacity then
    raise exception 'slotFull' using errcode = 'P0001';
  end if;

  select coalesce(sum(price_minor), 0) into v_extras
  from add_ons where key = any(p_add_ons) and active;

  if p_source = 'club' then
    -- FOR UPDATE is the whole point: it serialises concurrent bookings for
    -- this membership, so the cap and the balance are read after any other
    -- in-flight booking has committed.
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

    -- A credit covers the wash, never the add-ons.
    v_total := v_extras;

  elsif p_source = 'package' then
    -- Oldest first, so a balance that is about to expire is spent before one
    -- that is not. Spending the newest would quietly waste the customer's
    -- money.
    select * into v_purchase
    from package_purchases
    where profile_id = p_profile
      and credits_left > 0
      and expires_at > now()
    order by expires_at asc
    limit 1
    for update;
    if not found then raise exception 'noPackageCredits' using errcode = 'P0001'; end if;

    v_total := v_extras;
  else
    v_total := v_service.price_minor + v_extras;
  end if;

  insert into bookings (
    ref, profile_id, vehicle_id, address_id, service_key,
    scheduled_at, ends_at, source, membership_id, purchase_id, total_minor
  ) values (
    'BK-' || nextval('booking_ref_seq'),
    p_profile, p_vehicle, p_address, p_service,
    p_slot_start,
    p_slot_start + make_interval(mins => v_service.minutes),
    p_source,
    case when p_source = 'club' then v_membership.id end,
    case when p_source = 'package' then v_purchase.id end,
    v_total
  )
  returning * into v_booking;

  insert into booking_add_ons (booking_id, add_on_key, price_minor)
  select v_booking.id, key, price_minor from add_ons where key = any(p_add_ons) and active;

  -- Spend the balance last, so any failure above leaves it untouched.
  if p_source = 'club' then
    update memberships set credits_left = credits_left - 1 where id = v_membership.id;
  elsif p_source = 'package' then
    update package_purchases set credits_left = credits_left - 1 where id = v_purchase.id;
  end if;

  -- The pipeline starts empty; the driver app appends to it.
  insert into booking_events (booking_id, stage, note)
  values (v_booking.id, 'booked', '');

  return v_booking;
end;
$$;
