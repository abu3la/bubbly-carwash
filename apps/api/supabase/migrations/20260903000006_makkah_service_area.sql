-- Move the pilot from Riyadh to Makkah. Keep the agreed four-team model with
-- only Team 1 enabled; the inactive coordinates are staged for later rollout.
update teams
set name_ar = case id
      when 'team-1' then 'الفريق 1 - وسط مكة'
      when 'team-2' then 'الفريق 2 - شمال مكة'
      when 'team-3' then 'الفريق 3 - شرق مكة'
      when 'team-4' then 'الفريق 4 - جنوب مكة'
    end,
    name_en = case id
      when 'team-1' then 'Team 1 - Central Makkah'
      when 'team-2' then 'Team 2 - North Makkah'
      when 'team-3' then 'Team 3 - East Makkah'
      when 'team-4' then 'Team 4 - South Makkah'
    end,
    lat = case id
      when 'team-1' then 21.4225
      when 'team-2' then 21.4933
      when 'team-3' then 21.4373
      when 'team-4' then 21.3370
    end,
    lng = case id
      when 'team-1' then 39.8262
      when 'team-2' then 39.8133
      when 'team-3' then 39.9445
      when 'team-4' then 39.8172
    end,
    service_radius_km = case id when 'team-1' then 35 else 20 end,
    daily_capacity = 40,
    active = id = 'team-1'
where id in ('team-1', 'team-2', 'team-3', 'team-4');
