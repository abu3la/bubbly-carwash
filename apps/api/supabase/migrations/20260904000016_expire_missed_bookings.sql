create or replace function public.expire_missed_bookings()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update bookings
  set status = 'missed'
  where status = 'scheduled'
    and stage = 'booked'
    and payment_confirmed = true
    and ends_at < now();

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.expire_missed_bookings() from public, anon, authenticated;
grant execute on function public.expire_missed_bookings() to service_role;
