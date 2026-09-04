-- A 30-day membership is a recurring weekly schedule, not two or three
-- appointments for the whole month. The API expands the customer's first-week
-- choices every seven days and this transaction activates every occurrence.

alter table teams drop constraint if exists teams_daily_capacity_check;
alter table teams add constraint teams_daily_capacity_check
  check (daily_capacity between 1 and 40);

alter table plans drop constraint if exists plans_weekly_supported;
alter table plans add constraint plans_weekly_supported check (weekly in (2, 3));

-- Direct purchase remains the SAR 40 exterior wash. Super Wash memberships
-- use the existing full inside-and-out service, which must be active for the
-- booking transaction even though the customer app hides it from non-members.
update services set active = true where key = 'full';

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
  if not found then raise exception 'planUnavailable' using errcode = 'P0001'; end if;

  select count(*) into v_count
  from membership_signup_slots where membership_id = p_membership;
  -- Every one of the two or three weekly choices occurs four or five times in
  -- a 30-day cycle, depending on its first date.
  if v_count < v_plan.weekly * 4 or v_count > v_plan.weekly * 5 then
    raise exception 'scheduleIncomplete' using errcode = 'P0001';
  end if;
  if exists (
    select 1
    from membership_signup_slots s
    where s.membership_id = p_membership
    group by date_trunc('week', s.slot_start at time zone 'Asia/Riyadh')
    having count(*) > v_plan.weekly
  ) then
    raise exception 'weeklyCapReached' using errcode = 'P0001';
  end if;

  update memberships set payment_confirmed = true where id = p_membership;
  for v_slot in
    select * from membership_signup_slots
    where membership_id = p_membership
    order by slot_start
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
