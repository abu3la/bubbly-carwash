-- Bubbles Car Wash — initial schema.
--
-- Money is stored in minor units (halalas) as integers. Never floats: 49.00 SAR
-- is 4900, and a price is only ever divided for display.
--
-- Catalogue rows carry both languages. The product is written in Arabic first
-- and the app runs in either, so a name is data with two columns, not a key
-- the client has to translate.
--
-- RLS is enabled and left with NO policies on every table. The API is a
-- Cloudflare Worker holding the service-role key, which bypasses RLS; anon and
-- authenticated keys therefore reach nothing. Policies get added only if a
-- client is ever pointed straight at Postgres.

-- ---------------------------------------------------------------- enums

create type address_label   as enum ('home', 'work', 'other');
create type vehicle_size    as enum ('sedan', 'suv', 'pickup');
create type pay_source      as enum ('club', 'package', 'cash');
create type booking_status  as enum ('scheduled', 'active', 'done', 'cancelled');
-- The three beats the customer is shown, plus the state before any of them.
create type booking_stage   as enum ('booked', 'arrived', 'washed', 'verified');
create type membership_state as enum ('active', 'paused', 'cancelled');
create type payment_state   as enum ('pending', 'paid', 'failed', 'refunded');
create type language        as enum ('ar', 'en');
-- One API serves the customer app, the driver app and the admin dashboard.
-- The role is what separates them, so it belongs on the profile from the
-- start — retrofitting it once there are live rows is far more painful.
create type user_role       as enum ('customer', 'driver', 'admin');

-- ---------------------------------------------------------------- people

-- Mirrors auth.users, which owns identity and the phone number. Everything the
-- product knows about a customer hangs off this row rather than off auth.
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       user_role not null default 'customer',
  full_name  text not null default '',
  language   language not null default 'ar',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
-- Every /driver and /admin request filters on this, and staff are a tiny
-- fraction of rows, so the index only covers them.
create index profiles_staff_idx on profiles (role) where role <> 'customer';

create table addresses (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  label      address_label not null default 'home',
  line       text not null,
  district   text not null default '',
  city       text not null default '',
  lat        double precision,
  lng        double precision,
  -- "البوابة الزرقاء، بجوار المسجد" — how the technician finds the car.
  notes      text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_profile_idx on addresses (profile_id);
-- At most one default per customer, enforced rather than hoped for.
create unique index addresses_one_default_idx
  on addresses (profile_id) where is_default;

create table vehicles (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  make       text not null,
  model      text not null,
  color      text not null default '',
  plate      text not null,
  size       vehicle_size not null default 'sedan',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index vehicles_profile_idx on vehicles (profile_id);
create unique index vehicles_one_default_idx
  on vehicles (profile_id) where is_default;

-- ---------------------------------------------------------------- catalogue

create table services (
  key         text primary key,
  name_ar     text not null,
  name_en     text not null,
  blurb_ar    text not null default '',
  blurb_en    text not null default '',
  price_minor integer not null check (price_minor >= 0),
  minutes     integer not null check (minutes > 0),
  active      boolean not null default true,
  sort        integer not null default 0
);

create table add_ons (
  key         text primary key,
  name_ar     text not null,
  name_en     text not null,
  price_minor integer not null check (price_minor >= 0),
  active      boolean not null default true,
  sort        integer not null default 0
);

-- Pre-paid wash credits. `per_minor` and `save_pct` are shown to the customer,
-- so they are stored rather than recomputed and allowed to drift from the copy.
create table packages (
  id          integer primary key,
  washes      integer not null check (washes > 0),
  price_minor integer not null check (price_minor >= 0),
  per_minor   integer not null check (per_minor >= 0),
  save_pct    integer not null default 0,
  valid_days  integer not null default 90,
  best        boolean not null default false,
  active      boolean not null default true
);

create table plans (
  id          text primary key,             -- 'basic' | 'plus' | 'max'
  name_ar     text not null,
  name_en     text not null,
  price_minor integer not null check (price_minor >= 0),
  credits     integer not null check (credits > 0),   -- washes per cycle
  weekly      integer not null check (weekly > 0),    -- ceiling per week
  roll        integer not null default 0,             -- max carried forward
  best        boolean not null default false,
  active      boolean not null default true
);

-- ---------------------------------------------------------------- balances

-- One row per purchase, not one running total: credits expire per purchase, so
-- a customer can hold two batches with different expiry dates and the older one
-- has to be spent first.
create table package_purchases (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles (id) on delete cascade,
  package_id   integer not null references packages (id),
  credits_total integer not null check (credits_total > 0),
  credits_left integer not null check (credits_left >= 0),
  price_minor  integer not null,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now(),
  constraint credits_left_within_total check (credits_left <= credits_total)
);
create index package_purchases_profile_idx on package_purchases (profile_id);
-- The only rows a booking may draw from.
create index package_purchases_spendable_idx
  on package_purchases (profile_id, expires_at)
  where credits_left > 0;

create table memberships (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles (id) on delete cascade,
  plan_id     text not null references plans (id),
  state       membership_state not null default 'active',
  -- Cycle state. `credits_left` is what remains this cycle including anything
  -- carried in; `rolled_in` is how much of that came from last cycle, which the
  -- dashboard shows separately.
  cycle_start timestamptz not null default now(),
  cycle_end   timestamptz not null,
  credits_left integer not null check (credits_left >= 0),
  rolled_in   integer not null default 0,
  created_at  timestamptz not null default now(),
  cancelled_at timestamptz
);
create index memberships_profile_idx on memberships (profile_id);
-- A customer holds at most one live membership at a time.
create unique index memberships_one_active_idx
  on memberships (profile_id) where state <> 'cancelled';

-- ---------------------------------------------------------------- scheduling

-- The bookable grid, as templates rather than materialised rows: a slot exists
-- for every day unless a booking has filled its capacity.
create table slot_templates (
  id            uuid primary key default gen_random_uuid(),
  starts_at     time not null,
  ends_at       time not null,
  capacity      integer not null default 1 check (capacity > 0),
  -- Held for club members, who are promised priority on the peak slots.
  priority_only boolean not null default false,
  active        boolean not null default true,
  constraint slot_ends_after_start check (ends_at > starts_at)
);
create unique index slot_templates_time_idx on slot_templates (starts_at, ends_at);

-- ---------------------------------------------------------------- bookings

create table bookings (
  id          uuid primary key default gen_random_uuid(),
  ref         text not null unique,          -- 'BK-4901', shown to the customer
  profile_id  uuid not null references profiles (id),
  vehicle_id  uuid not null references vehicles (id),
  address_id  uuid not null references addresses (id),
  service_key text not null references services (key),

  scheduled_at timestamptz not null,
  ends_at      timestamptz not null,

  status booking_status not null default 'scheduled',
  stage  booking_stage  not null default 'booked',

  -- The technician doing the wash. Null until dispatch assigns one, which is
  -- why it is nullable rather than defaulted.
  technician_id uuid references profiles (id),

  -- Which balance paid for the wash itself. Add-ons are always cash, which is
  -- why they are priced on their own rows below.
  source pay_source not null,
  -- Set when source is 'club' or 'package', so a cancellation knows exactly
  -- what to give back rather than guessing.
  membership_id uuid references memberships (id),
  purchase_id   uuid references package_purchases (id),

  -- What was actually charged, add-ons included. Zero when a credit covered the
  -- wash and nothing was added.
  total_minor integer not null check (total_minor >= 0),

  created_at   timestamptz not null default now(),
  cancelled_at timestamptz,

  -- A credit-backed booking must say which balance it drew from.
  constraint club_booking_has_membership
    check (source <> 'club' or membership_id is not null),
  constraint package_booking_has_purchase
    check (source <> 'package' or purchase_id is not null)
);
create index bookings_profile_idx on bookings (profile_id, scheduled_at desc);
-- The driver app's only real query: my jobs, today, in order.
create index bookings_technician_idx
  on bookings (technician_id, scheduled_at)
  where status in ('scheduled', 'active');
create index bookings_schedule_idx on bookings (scheduled_at) where status = 'scheduled';
-- Drives the weekly club ceiling and the capacity check; both ask "what is
-- still live in this window", so the partial index matches the question.
create index bookings_live_idx
  on bookings (membership_id, scheduled_at)
  where status in ('scheduled', 'active');

create table booking_add_ons (
  booking_id  uuid not null references bookings (id) on delete cascade,
  add_on_key  text not null references add_ons (key),
  -- Priced at booking time: changing the catalogue must not rewrite history.
  price_minor integer not null check (price_minor >= 0),
  primary key (booking_id, add_on_key)
);

-- The pipeline, as an append-only log rather than a mutable column. `stage` on
-- the booking is the latest of these; this is how it got there.
create table booking_events (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  stage      booking_stage not null,
  -- Who moved it. The customer sees the beat; an audit needs the hand.
  actor_id   uuid references profiles (id),
  note       text not null default '',
  photo_url  text,
  at         timestamptz not null default now()
);
create index booking_events_booking_idx on booking_events (booking_id, at);

create table ratings (
  booking_id uuid primary key references bookings (id) on delete cascade,
  stars      integer not null check (stars between 1 and 5),
  comment    text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- payments

-- Every charge, whatever it bought. Exactly one of the three targets is set.
create table payments (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles (id),
  booking_id    uuid references bookings (id),
  purchase_id   uuid references package_purchases (id),
  membership_id uuid references memberships (id),

  amount_minor integer not null check (amount_minor >= 0),
  currency     char(3) not null default 'SAR',
  state        payment_state not null default 'pending',

  provider     text not null default 'moyasar',
  -- Moyasar's payment id. Unique so a replayed webhook cannot charge twice.
  provider_ref text,
  failure      text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint payment_has_one_target check (
    (booking_id is not null)::int
  + (purchase_id is not null)::int
  + (membership_id is not null)::int = 1
  )
);
create unique index payments_provider_ref_idx
  on payments (provider, provider_ref) where provider_ref is not null;
create index payments_profile_idx on payments (profile_id, created_at desc);

-- ---------------------------------------------------------------- rules in SQL

-- How many club washes are live in the ISO week containing `at`.
--
-- Derived from bookings rather than cached on the membership: a counter drifts
-- the moment a booking is cancelled or moved, and the ceiling is the one rule a
-- member will notice being wrong.
create or replace function club_week_used(p_membership uuid, at timestamptz)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from bookings b
  where b.membership_id = p_membership
    and b.status in ('scheduled', 'active')
    and b.scheduled_at >= date_trunc('week', at)
    and b.scheduled_at <  date_trunc('week', at) + interval '7 days';
$$;

-- ---------------------------------------------------------------- lockdown

alter table profiles          enable row level security;
alter table addresses         enable row level security;
alter table vehicles          enable row level security;
alter table services          enable row level security;
alter table add_ons           enable row level security;
alter table packages          enable row level security;
alter table plans             enable row level security;
alter table package_purchases enable row level security;
alter table memberships       enable row level security;
alter table slot_templates    enable row level security;
alter table bookings          enable row level security;
alter table booking_add_ons   enable row level security;
alter table booking_events    enable row level security;
alter table ratings           enable row level security;
alter table payments          enable row level security;
