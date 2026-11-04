-- SKI MATCH only. Additive, rerunnable. No social policies or rows removed.
begin;
create or replace function public.discover_people(station uuid default null,date_from date default null,date_to date default null,skill text default null,discipline text default null,page_offset integer default 0,page_size integer default 13)
returns table(id uuid,name text,age integer,level text,sport text,bio text,avatar_url text,preferences text,trip_id uuid,resort_name text,resort_slug text,starts_on date,ends_on date)
language sql stable security invoker set search_path='' as $$
 select p.id,p.name,p.age::integer,p.level,p.sport,p.bio,p.avatar_url,p.preferences,t.id,r.name,r.slug,t.starts_on,t.ends_on
 from public.public_profiles p
 left join lateral (select tr.* from public.trips tr where tr.user_id=p.id and tr.ends_on>=current_date and (station is null or tr.resort_id=station) and (date_from is null or tr.ends_on>=date_from) and (date_to is null or tr.starts_on<=date_to) order by tr.starts_on,tr.id limit 1) t on true
 left join public.resorts r on r.id=t.resort_id
 where public.is_member() and p.id<>auth.uid() and (station is null or t.id is not null) and ((date_from is null and date_to is null) or t.id is not null) and (skill is null or p.level=skill) and (discipline is null or p.sport=discipline)
 order by t.starts_on nulls last,p.name,p.id offset greatest(0,page_offset) limit least(50,greatest(1,page_size));
$$;
revoke all on function public.discover_people(uuid,date,date,text,text,integer,integer) from public,anon;
grant execute on function public.discover_people(uuid,date,date,text,text,integer,integer) to authenticated;
commit;
