create or replace function public.cancel_membership(
  p_membership uuid,
  p_profile uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_memberships integer;
  v_bookings integer;
begin
  update public.memberships
  set state = 'cancelled', cancelled_at = v_now
  where id = p_membership
    and profile_id = p_profile
    and state = 'active'
    and payment_confirmed = true;

  get diagnostics v_memberships = row_count;
  if v_memberships = 0 then
    raise exception 'noMembership';
  end if;

  update public.bookings
  set status = 'cancelled', cancelled_at = v_now
  where membership_id = p_membership
    and profile_id = p_profile
    and status = 'scheduled'
    and stage = 'booked'
    and scheduled_at > v_now;

  get diagnostics v_bookings = row_count;
  return v_bookings;
end;
$$;

revoke all on function public.cancel_membership(uuid, uuid) from public, anon, authenticated;
grant execute on function public.cancel_membership(uuid, uuid) to service_role;
