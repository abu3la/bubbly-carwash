-- The Makkah pilot always has exactly one active team. Switching the pilot to
-- another team must be atomic so availability never observes two teams, or no
-- team, between separate updates.

create or replace function activate_pilot_team(p_team text)
returns setof teams
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from teams where id = p_team) then
    raise exception 'teamNotFound' using errcode = 'P0001';
  end if;

  update teams set active = (id = p_team);
  return query select * from teams where id = p_team;
end;
$$;

revoke all on function activate_pilot_team(text) from public, anon, authenticated;
grant execute on function activate_pilot_team(text) to service_role;
