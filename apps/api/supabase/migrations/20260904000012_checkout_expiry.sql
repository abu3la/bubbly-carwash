-- A hosted checkout reserves capacity, but it must not reserve it forever if
-- the app is killed before Moyasar returns. A late successful payment is safe:
-- the verified callback sees the cancelled target and refunds it.
create or replace function expire_pending_checkouts()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz := now() - interval '15 minutes';
begin
  update bookings
  set status = 'cancelled', cancelled_at = now()
  where payment_confirmed = false
    and status = 'scheduled'
    and created_at < v_cutoff;

  update memberships
  set state = 'cancelled', cancelled_at = now()
  where payment_confirmed = false
    and state = 'active'
    and created_at < v_cutoff;

  update payments
  set state = 'failed', failure = 'checkoutExpired', updated_at = now()
  where state = 'pending'
    and created_at < v_cutoff
    and (
      booking_id in (select id from bookings where status = 'cancelled' and payment_confirmed = false)
      or membership_id in (select id from memberships where state = 'cancelled' and payment_confirmed = false)
    );
end;
$$;

-- Only the Worker service role should run this cross-customer cleanup. The
-- app never receives the service-role key and cannot invoke it directly.
revoke all on function expire_pending_checkouts() from public, anon, authenticated;
grant execute on function expire_pending_checkouts() to service_role;
