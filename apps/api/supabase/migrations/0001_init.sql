-- Bubbly Carwash — initial schema.
-- Run in the Supabase SQL editor, or via `supabase db push`.

create type user_role as enum ('client', 'driver', 'admin');
create type vehicle_size as enum ('sedan', 'suv', 'pickup', 'motorcycle');
create type booking_status as enum ('pending', 'assigned', 'en_route', 'washing', 'done', 'cancelled');

create table users (
  id         uuid primary key default gen_random_uuid(),
  role       user_role not null,
  name       text not null,
  phone      text not null unique,
  email      text,
  created_at timestamptz not null default now()
);

create table vehicles (
  id       uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users (id) on delete cascade,
  make     text not null,
  model    text not null,
  color    text not null,
  plate    text not null,
  size     vehicle_size not null default 'sedan'
);

create table services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text not null default '',
  price_minor      integer not null check (price_minor >= 0),
  currency         char(3) not null default 'SAR',
  duration_minutes integer not null check (duration_minutes > 0),
  active           boolean not null default true
);

create table bookings (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references users (id),
  driver_id    uuid references users (id),
  vehicle_id   uuid not null references vehicles (id),
  service_id   uuid not null references services (id),
  status       booking_status not null default 'pending',
  address      text not null,
  lat          double precision not null,
  lng          double precision not null,
  scheduled_at timestamptz not null,
  price_minor  integer not null,
  currency     char(3) not null default 'SAR',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index bookings_status_idx on bookings (status);
create index bookings_client_idx on bookings (client_id);
create index bookings_driver_idx on bookings (driver_id);

create table driver_locations (
  driver_id   uuid primary key references users (id) on delete cascade,
  lat         double precision not null,
  lng         double precision not null,
  recorded_at timestamptz not null default now()
);

-- The API talks to Postgres with the service-role key; row-level security stays
-- on so anon/authenticated keys can't touch these tables until policies exist.
alter table users enable row level security;
alter table vehicles enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table driver_locations enable row level security;

-- Seed wash packages.
insert into services (name, description, price_minor, currency, duration_minutes) values
  ('Exterior wash', 'Foam wash, rinse, and hand dry — outside only.', 4500, 'SAR', 30),
  ('Full wash', 'Exterior wash plus interior vacuum and dashboard wipe.', 7500, 'SAR', 55),
  ('Deep detail', 'Clay bar, polish, interior shampoo, and wax.', 24000, 'SAR', 150);
