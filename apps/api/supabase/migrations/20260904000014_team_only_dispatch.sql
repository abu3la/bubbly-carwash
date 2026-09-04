-- Dispatch belongs to a team. Individual drivers claim work from their own
-- team queue; neither the dashboard nor another service-role caller may assign
-- a booking directly to a named driver.
drop function if exists public.assign_booking_to_technician(uuid, uuid, uuid);
