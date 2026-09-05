-- Integration assertions for a FRESH LOCAL database with all migrations
-- applied. All coordinates and villa numbers below are synthetic test data.
-- Run: psql "$LOCAL_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f apps/api/tests/coverage.sql
-- Never run against production. The transaction rolls every fixture back.
begin;
create function pg_temp.expect_error(statement text, expected text)
returns void language plpgsql as $$
begin
  execute statement;
  raise exception 'Expected error %, statement succeeded',expected;
exception when others then
  if position(expected in sqlerrm)=0 or sqlerrm like 'Expected error %' then raise; end if;
end;
$$;

do $$
declare
  v_boundary jsonb := '[{"lat":21.5,"lng":39.1},{"lat":21.5,"lng":39.3},{"lat":21.7,"lng":39.3},{"lat":21.7,"lng":39.1}]';
  profile_id uuid := gen_random_uuid();
  vehicle_id uuid := gen_random_uuid();
  address_id uuid := gen_random_uuid();
  membership_id uuid := gen_random_uuid();
  booking_id uuid;
  result jsonb;
  scheduled timestamptz;
  day date := (now() at time zone 'Asia/Riyadh')::date+2;
  n integer;
begin
  assert (select count(*) from coverage_villas)=0, 'Migration must not invent villa inventory';
  assert (select count(*) from teams where active)=1, 'Only one team active initially';
  assert (select active from teams where id='team-1'), 'Team 1 starts active';
  assert (select count(*) from coverage_blocks where active)=1, 'Only Block A active initially';
  assert (select team_id from coverage_blocks where id='sharbatly-a')='team-1', 'Block A assigned Team 1';
  assert check_coverage(21.6,39.2,'12')->>'status'='areaUnavailable', 'No surveyed boundary must fail closed';

  perform pg_temp.expect_error($q$update coverage_areas set boundary_verified=true where id='sharbatly-village'$q$,'boundaryRequired');
  perform pg_temp.expect_error($q$update coverage_areas set boundary='[{"lat":21,"lng":39},{"lat":22,"lng":40}]' where id='sharbatly-village'$q$,'invalidBoundary');
  perform pg_temp.expect_error($q$update coverage_areas set boundary='[{"lat":21,"lng":39},{"lat":22,"lng":40},{"lat":21,"lng":40},{"lat":22,"lng":39}]' where id='sharbatly-village'$q$,'invalidBoundary');
  perform pg_temp.expect_error($q$update coverage_areas set boundary='[{"lat":21,"lng":39},{"lat":22,"lng":40},{"lat":23,"lng":41}]' where id='sharbatly-village'$q$,'invalidBoundary');
  perform pg_temp.expect_error($q$update coverage_areas set boundary='[{"lat":21,"lng":39},{"lat":22,"lng":40},{"lat":23}]' where id='sharbatly-village'$q$,'invalidBoundary');
  update coverage_areas set boundary=v_boundary || (v_boundary->0),boundary_verified=true where id='sharbatly-village';
  assert (select jsonb_array_length(ca.boundary) from coverage_areas ca where id='sharbatly-village')=4, 'Closed rings normalized';
  assert point_in_coverage(21.6,39.2,v_boundary), 'Interior point inside';
  assert point_in_coverage(21.5,39.2,v_boundary), 'Polygon edge included';
  assert point_in_coverage(21.5,39.1,v_boundary), 'Polygon vertex included';
  assert not point_in_coverage(21.8,39.2,v_boundary), 'Outside point excluded';
  assert check_coverage(21.6,39.2)->>'status'='villaRequired', 'Inside prompts villa';
  assert check_coverage(21.6,39.2,'12')->>'status'='villaUnavailable', 'Unlisted villa rejected';
  assert check_coverage(21.8,39.2,'12')->>'status'='outside', 'Outside stays rejected';
  select count(*) into n from available_slots(21.6,39.2,day);
  assert n=0, 'Legacy availability call without villa cannot bypass inventory';

  insert into coverage_villas(area_id,block_id,villa_number) values ('sharbatly-village','sharbatly-a','12');
  result:=check_coverage(21.6,39.2,' ١٢ ');
  assert result->>'status'='covered' and result->>'villaNumber'='12', 'Arabic digits normalize';
  assert result->'team'->>'id'='team-1' and result->'block'->>'code'='A', 'Resolved team and block';
  assert check_coverage(21.6,39.2,'012')->>'status'='villaUnavailable', 'Leading zeros not guessed away';
  perform pg_temp.expect_error($q$insert into coverage_villas(area_id,block_id,villa_number) values ('sharbatly-village','sharbatly-a','12')$q$,'duplicate key');
  update coverage_villas set active=false where villa_number='12';
  assert check_coverage(21.6,39.2,'12')->>'status'='villaUnavailable', 'Inactive villa rejected';
  update coverage_villas set active=true where villa_number='12';
  update coverage_blocks set active=false where id='sharbatly-a';
  assert check_coverage(21.6,39.2,'12')->>'status'='villaUnavailable', 'Inactive block rejected';
  update coverage_blocks set active=true where id='sharbatly-a';
  update teams set active=false where id='team-1';
  assert check_coverage(21.6,39.2,'12')->>'status'='areaUnavailable', 'Inactive team rejected';
  update teams set active=true where id='team-1';
  perform activate_pilot_team('team-2');
  assert (select count(*) from teams where active)=2, 'Additional teams activate independently';
  -- A closer competing team must never steal Block A's bookings.
  update teams set lat=21.6,lng=39.2 where id='team-2';
  update teams set lat=24,lng=46,service_radius_km=1 where id='team-1';
  assert check_coverage(21.6,39.2,'12')->'team'->>'id'='team-1', 'Assigned team beats legacy radius';

  insert into auth.users(id) values (profile_id);
  insert into profiles(id,full_name,phone) values (profile_id,'Coverage Test','+966500000000');
  insert into vehicles(id,profile_id,make,model,plate) values (vehicle_id,profile_id,'Test','Fixture','123');
  perform pg_temp.expect_error(format('insert into addresses(profile_id,line,lat,lng) values (%L,%L,21.6,39.2)',profile_id,'Test'),'villaRequired');
  perform pg_temp.expect_error(format('insert into addresses(profile_id,line,lat,lng,villa_number) values (%L,%L,21.8,39.2,%L)',profile_id,'Test','12'),'outsideServiceArea');
  perform pg_temp.expect_error(format('insert into addresses(profile_id,line,lat,lng,villa_number) values (%L,%L,21.6,39.2,%L)',profile_id,'Test','999'),'villaUnavailable');
  insert into addresses(id,profile_id,line,lat,lng,villa_number) values(address_id,profile_id,'Fixture villa',21.6,39.2,'١٢');
  assert (select a.villa_number from addresses a where a.id=address_id)='12', 'Stored villa normalized by SQL';
  assert (select a.coverage_block_id from addresses a where a.id=address_id)='sharbatly-a', 'Stored block authoritative';
  perform pg_temp.expect_error(format('update addresses set villa_number=%L where id=%L','999',address_id),'villaUnavailable');
  while extract(isodow from day)=5 loop day:=day+1; end loop;
  scheduled:=(day::text||' 08:00:00+03')::timestamptz;
  select count(*) into n from available_slots(21.6,39.2,day,'12');
  assert n>0,'Covered villa gets slots even outside old team radius';
  select id into booking_id from create_booking(profile_id,vehicle_id,address_id,'exterior',scheduled,'cash','{}',true);
  assert (select b.team_id from bookings b where b.id=booking_id)='team-1', 'Booking uses Block A team';
  assert (select b.coverage_block_id from bookings b where b.id=booking_id)='sharbatly-a', 'Booking keeps coverage snapshot';
  perform pg_temp.expect_error(format('update bookings set team_id=%L where id=%L','team-2',booking_id),'coverageTeamMismatch');
  update vehicles set archived_at=now() where id=vehicle_id;
  perform pg_temp.expect_error(format('select create_booking(%L,%L,%L,%L,%L,%L)',profile_id,vehicle_id,address_id,'exterior',scheduled,'cash'),'vehicleUnavailable');
  update vehicles set archived_at=null where id=vehicle_id;

  insert into memberships(id,profile_id,plan_id,cycle_end) values(membership_id,profile_id,'basic',now()+interval '30 days');
  update coverage_villas set active=false where villa_number='12';
  perform pg_temp.expect_error(format('select create_booking(%L,%L,%L,%L,%L,%L)',profile_id,vehicle_id,address_id,'exterior',scheduled,'cash'),'villaUnavailable');
  perform pg_temp.expect_error(format('insert into membership_signup_slots(membership_id,vehicle_id,address_id,service_key,slot_start) values(%L,%L,%L,%L,%L)',membership_id,vehicle_id,address_id,'exterior',scheduled),'villaUnavailable');
  -- A started job keeps its team and can finish after its villa is disabled.
  update bookings set status='active',stage='arrived' where id=booking_id;
  update bookings set status='done',stage='verified' where id=booking_id;
  perform pg_temp.expect_error(format('update bookings set status=%L where id=%L','scheduled',booking_id),'villaUnavailable');
  assert not has_function_privilege('authenticated','create_booking(uuid,uuid,uuid,text,timestamptz,pay_source,text[],boolean)','execute'), 'Clients cannot invoke privileged booking RPC';
end;
$$;
rollback;
