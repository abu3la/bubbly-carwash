-- Both product levels are available at two or three washes per week. Each
-- frequency is its own catalogue row so pricing remains editable in the
-- dashboard and historical memberships keep the exact offer they bought.

update plans set active = false, best = false;

update plans
set name_ar = 'أساسي', name_en = 'Basic', price_minor = 19900,
    credits = 2, weekly = 2, roll = 0, active = true, best = false
where id = 'basic';

insert into plans (id, name_ar, name_en, price_minor, credits, weekly, roll, best, active)
values ('basic-3', 'أساسي', 'Basic', 26900, 3, 3, 0, false, true)
on conflict (id) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  price_minor = excluded.price_minor, credits = excluded.credits,
  weekly = excluded.weekly, roll = 0, best = excluded.best, active = true;

update plans
set name_ar = 'سوبر ووش', name_en = 'Super Wash', price_minor = 29900,
    credits = 2, weekly = 2, roll = 0, active = true, best = false
where id = 'plus';

insert into plans (id, name_ar, name_en, price_minor, credits, weekly, roll, best, active)
values ('plus-3', 'سوبر ووش', 'Super Wash', 39900, 3, 3, 0, true, true)
on conflict (id) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  price_minor = excluded.price_minor, credits = excluded.credits,
  weekly = excluded.weekly, roll = 0, best = excluded.best, active = true;
