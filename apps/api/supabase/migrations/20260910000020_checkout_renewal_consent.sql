-- Checkout consent is server-recorded before tokenization. Tokens never reach
-- catalogue/profile APIs and remain service-role-only under RLS.
create table checkout_consents (
  invoice_id uuid primary key,
  membership_id uuid not null references memberships(id),
  profile_id uuid not null references profiles(id),
  amount_minor integer not null check (amount_minor > 0),
  interval_days integer not null check (interval_days = 30),
  terms_version text not null,
  consented_at timestamptz not null default now()
);
create table membership_billing (
  membership_id uuid primary key references memberships(id),
  profile_id uuid not null references profiles(id),
  invoice_id uuid not null unique references checkout_consents(invoice_id),
  token text not null,
  amount_minor integer not null check (amount_minor > 0),
  next_charge_at timestamptz not null,
  enabled boolean not null default true,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);
create table membership_renewals (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id),
  due_at timestamptz not null,
  amount_minor integer not null,
  state text not null default 'pending' check (state in ('pending','paid','complete','failed','refund_pending','refunded')),
  failure text,
  created_at timestamptz not null default now(),
  unique(membership_id,due_at)
);
alter table checkout_consents enable row level security;
alter table membership_billing enable row level security;
alter table membership_renewals enable row level security;
revoke all on checkout_consents,membership_billing,membership_renewals from anon,authenticated;

-- Replays use the same renewal UUID as Moyasar's given_id. Queue creation and
-- price snapshot are atomic; overlapping cron runs cannot create another charge.
create function queue_membership_renewals() returns setof membership_renewals
language plpgsql security definer set search_path=public as $$
begin
  insert into membership_renewals(membership_id,due_at,amount_minor)
  select b.membership_id,b.next_charge_at,b.amount_minor
  from membership_billing b join memberships m on m.id=b.membership_id
  where b.enabled and m.state='active' and m.payment_confirmed
    and b.next_charge_at <= now()
  on conflict(membership_id,due_at) do nothing;
  return query select r.* from membership_renewals r
    where r.state in ('pending','paid','refund_pending') order by r.created_at limit 20;
end $$;

-- Grant a paid renewal and its weekly appointments in one transaction. Any
-- unavailable slot rolls everything back, so the Worker can refund the charge.
create function complete_membership_renewal(p_renewal uuid) returns void
language plpgsql security definer set search_path=public as $$
declare
  r membership_renewals%rowtype;
  m memberships%rowtype;
  b membership_billing%rowtype;
  s record;
  stamp timestamptz;
  cycle_end_at timestamptz;
  booking_row bookings%rowtype;
begin
  select * into r from membership_renewals where id=p_renewal for update;
  if not found then raise exception 'renewalNotFound'; end if;
  if r.state='complete' then return; end if;
  if r.state <> 'paid' then raise exception 'paymentNotConfirmed'; end if;
  select * into m from memberships where id=r.membership_id for update;
  select * into b from membership_billing where membership_id=m.id for update;
  if m.state <> 'active' or not b.enabled then raise exception 'renewalCancelled'; end if;
  if m.cycle_end <> r.due_at then raise exception 'renewalCycleMismatch'; end if;
  if not exists(select 1 from membership_signup_slots where membership_id=m.id) then
    raise exception 'scheduleIncomplete';
  end if;
  cycle_end_at := r.due_at + interval '30 days';
  update memberships set cycle_start=r.due_at,cycle_end=cycle_end_at where id=m.id;
  -- Preserve actual weekday/time selections, taking the most recent occurrence
  -- for each weekly position. Older rows remain an auditable schedule history.
  for s in
    select distinct on (extract(isodow from slot_start at time zone 'Asia/Riyadh'),(slot_start at time zone 'Asia/Riyadh')::time)
      * from membership_signup_slots where membership_id=m.id
    order by extract(isodow from slot_start at time zone 'Asia/Riyadh'),(slot_start at time zone 'Asia/Riyadh')::time,slot_start desc
  loop
    stamp := s.slot_start + interval '7 days';
    while stamp < r.due_at loop stamp := stamp + interval '7 days'; end loop;
    while stamp < cycle_end_at loop
      select * into booking_row from create_booking(m.profile_id,s.vehicle_id,s.address_id,s.service_key,stamp,'club',s.add_ons,true);
      insert into membership_signup_slots(membership_id,vehicle_id,address_id,service_key,slot_start,add_ons,booking_id)
      values(m.id,s.vehicle_id,s.address_id,s.service_key,stamp,s.add_ons,booking_row.id);
      stamp := stamp + interval '7 days';
    end loop;
  end loop;
  update membership_billing set next_charge_at=cycle_end_at where membership_id=m.id;
  insert into payments(profile_id,membership_id,amount_minor,provider,provider_ref,state)
  values(m.profile_id,m.id,r.amount_minor,'moyasar-recurring',r.id::text,'paid')
  on conflict(provider,provider_ref) where provider_ref is not null do nothing;
  update membership_renewals set state='complete' where id=r.id;
end $$;
revoke all on function queue_membership_renewals(),complete_membership_renewal(uuid) from public,anon,authenticated;
grant execute on function queue_membership_renewals(),complete_membership_renewal(uuid) to service_role;

create table checkout_payment_tokens (
  payment_id uuid primary key,
  invoice_id uuid not null references checkout_consents(invoice_id),
  token text not null,
  created_at timestamptz not null default now()
);
alter table checkout_payment_tokens enable row level security;
revoke all on checkout_payment_tokens from anon,authenticated;
