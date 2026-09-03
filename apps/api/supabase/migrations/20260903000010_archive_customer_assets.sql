-- Keep historical bookings intact when a customer removes a saved car or
-- address. The app hides archived rows, while old receipts and operations data
-- retain their foreign-key references.
alter table addresses add column if not exists archived_at timestamptz;
alter table vehicles add column if not exists archived_at timestamptz;

create index if not exists addresses_active_profile_idx
  on addresses (profile_id, created_at desc) where archived_at is null;
create index if not exists vehicles_active_profile_idx
  on vehicles (profile_id, created_at desc) where archived_at is null;

create or replace function reject_archived_booking_resources()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (select 1 from vehicles where id = new.vehicle_id and archived_at is not null) then
    raise exception 'vehicleUnavailable';
  end if;
  if exists (select 1 from addresses where id = new.address_id and archived_at is not null) then
    raise exception 'addressUnavailable';
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_reject_archived_resources on bookings;
create trigger bookings_reject_archived_resources
before insert or update of vehicle_id, address_id on bookings
for each row execute function reject_archived_booking_resources();
