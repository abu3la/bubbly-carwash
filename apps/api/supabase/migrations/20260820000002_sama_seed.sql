-- Sama Car Wash — catalogue seed.
--
-- These rows are the same catalogue the app is built against
-- (apps/client-app/src/content.ts and the two i18n catalogues). Prices are in
-- halalas: 49.00 SAR is 4900.
--
-- Idempotent, so re-running the migration against an existing project updates
-- the catalogue instead of failing on a duplicate key.

insert into services (key, name_ar, name_en, blurb_ar, blurb_en, price_minor, minutes, sort) values
  ('exterior',
   'غسلة خارجية كاملة', 'Full exterior wash',
   'عند بابك، بدون خرطوم ولا فوضى — ماء معالج ومناشف مايكروفايبر.',
   'At your door, no hose and no mess — treated water and microfibre towels.',
   4900, 45, 0),
  ('full',
   'غسلة كاملة داخلية وخارجية', 'Full inside and out',
   'كل ما في الخارجية، مع تنظيف المقصورة وتلميع التابلوه.',
   'Everything in the exterior wash, plus cabin clean and dashboard polish.',
   6900, 70, 1)
on conflict (key) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  blurb_ar = excluded.blurb_ar, blurb_en = excluded.blurb_en,
  price_minor = excluded.price_minor, minutes = excluded.minutes, sort = excluded.sort;

insert into add_ons (key, name_ar, name_en, price_minor, sort) values
  ('wax',   'طبقة واكس حماية', 'Protective wax layer', 2000, 0),
  ('tires', 'لمعة إطارات',     'Tyre shine',           1000, 1)
on conflict (key) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  price_minor = excluded.price_minor, sort = excluded.sort;

insert into packages (id, washes, price_minor, per_minor, save_pct, valid_days, best) values
  (3,  3,  13900, 4600,  5, 90, false),
  (5,  5,  21900, 4400, 12, 90, true),
  (10, 10, 39900, 4000, 18, 90, false)
on conflict (id) do update set
  washes = excluded.washes, price_minor = excluded.price_minor,
  per_minor = excluded.per_minor, save_pct = excluded.save_pct,
  valid_days = excluded.valid_days, best = excluded.best;

insert into plans (id, name_ar, name_en, price_minor, credits, weekly, roll, best) values
  ('basic', 'أساسي', 'Basic', 14900,  4, 1, 1, false),
  ('plus',  'بلس',   'Plus',  19900,  8, 2, 2, true),
  ('max',   'ماكس',  'Max',   27900, 12, 3, 2, false)
on conflict (id) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  price_minor = excluded.price_minor, credits = excluded.credits,
  weekly = excluded.weekly, roll = excluded.roll, best = excluded.best;

-- The bookable grid. 10:00 is held for club members, which is the perk the
-- membership actually sells.
insert into slot_templates (starts_at, ends_at, capacity, priority_only) values
  ('08:00', '08:30', 2, false),
  ('08:30', '09:00', 2, false),
  ('09:00', '09:30', 2, false),
  ('10:00', '10:30', 2, true),
  ('10:30', '11:00', 2, false),
  ('11:00', '11:30', 2, false),
  ('15:30', '16:00', 2, false),
  ('16:00', '16:30', 2, false),
  ('16:30', '17:00', 2, false)
on conflict (starts_at, ends_at) do update set
  capacity = excluded.capacity, priority_only = excluded.priority_only;
