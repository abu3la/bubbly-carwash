-- Correct the Saudi mobile constraint. With standard-conforming strings,
-- a single backslash is enough to escape the leading plus for PostgreSQL's
-- regular-expression engine.

alter table driver_invites
  drop constraint if exists driver_invites_phone;

alter table driver_invites
  add constraint driver_invites_phone
  check (phone ~ '^\+9665[0-9]{8}$');
