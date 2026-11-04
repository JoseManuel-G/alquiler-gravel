-- SKI MATCH: one-time snapshot of accounts already registered.
-- Future signups keep the two-photo requirement; reruns never move the boundary.
-- SKI MATCH only. Run after schema.sql and avatars.sql in the dedicated project.
-- Additive and repeatable: existing profiles, trips and conversations are kept.
begin;
-- The first application fixes the boundary once. Reapplying never grants an exemption to later signups.
create table if not exists public.profile_photo_policy (
 singleton boolean primary key check(singleton),
 required_from timestamptz not null default clock_timestamp()
);
create table if not exists public.legacy_photo_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.profile_photo_policy enable row level security;
alter table public.legacy_photo_accounts enable row level security;
revoke all on public.profile_photo_policy,public.legacy_photo_accounts from public,anon,authenticated;
with first_application as (
 insert into public.profile_photo_policy(singleton) values(true) on conflict(singleton) do nothing returning singleton
)
insert into public.legacy_photo_accounts(user_id) select u.id from auth.users u where exists(select 1 from first_application) on conflict(user_id) do nothing;
create or replace function public.minimum_profile_photos(person uuid default auth.uid()) returns integer
language sql stable security definer set search_path='' as $$
 select case when exists(select 1 from public.legacy_photo_accounts where user_id=person) then 0 else 2 end;
$$;
revoke all on function public.minimum_profile_photos(uuid) from public,anon;
grant execute on function public.minimum_profile_photos(uuid) to authenticated;
create or replace function public.profile_photo_count(person uuid,portrait text default null) returns integer
language sql volatile security definer set search_path='' as $$
 select count(distinct o.name)::integer from storage.objects o
 where o.bucket_id='avatars' and array_length(string_to_array(o.name,'/'),1)=2 and split_part(o.name,'/',1)=person::text
 and (auth.uid()=person or public.is_member() or auth.uid() is null)
 and o.metadata->>'mimetype' in ('image/jpeg','image/png','image/webp')
 and (case when o.metadata->>'size' ~ '^[0-9]+$' then (o.metadata->>'size')::numeric>0 else false end)
 and (o.name like person::text||'/gallery-%' or (portrait like 'https://%/storage/v1/object/authenticated/avatars/%' and right(portrait,length('/avatars/'||o.name))='/avatars/'||o.name));
$$;
revoke all on function public.profile_photo_count(uuid,text) from public,anon;
grant execute on function public.profile_photo_count(uuid,text) to authenticated;

create or replace function public.require_profile_photos() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(new.id::text,4901));
 if public.profile_photo_count(new.id,new.avatar_url)<public.minimum_profile_photos(new.id) then raise exception 'Sube al menos dos fotos antes de guardar tu perfil.'; end if;
 return new;
end; $$;
drop trigger if exists ski_profile_min_photos on public.profiles;
create trigger ski_profile_min_photos before insert or update on public.profiles for each row execute function public.require_profile_photos();

create or replace function public.connection_readiness() returns jsonb
language sql volatile security definer set search_path='' as $$
 select jsonb_build_object('photo_count',public.profile_photo_count(auth.uid(),(select avatar_url from public.profiles where id=auth.uid())),'has_trip',exists(select 1 from public.trips where user_id=auth.uid() and ends_on>=current_date),'has_profile',public.is_member(),'minimum_photos',public.minimum_profile_photos(auth.uid()));
$$;
create or replace function public.require_connection_ready() returns void
language plpgsql security definer set search_path='' as $$
begin
 if not public.is_member() then raise exception 'Completa tu perfil y verifica tu email antes de conectar.'; end if;
 if public.profile_photo_count(auth.uid(),(select avatar_url from public.profiles where id=auth.uid()))<public.minimum_profile_photos(auth.uid()) then raise exception 'Sube al menos dos fotos a tu perfil para conectar.'; end if;
end; $$;
create or replace function public.request_person_connection(target_user uuid,target_trip uuid default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare result uuid; portrait text;
begin
 perform public.require_connection_ready();
 if target_user=auth.uid() then raise exception 'No puedes conectar contigo mismo.'; end if;
 select p.avatar_url into portrait from public.profiles p join auth.users u on u.id=p.id where p.id=target_user and u.email_confirmed_at is not null and p.birth_date<=(current_date-interval '18 years')::date;
 if not found or public.profile_photo_count(target_user,portrait)<public.minimum_profile_photos(target_user) then raise exception 'Esta persona todavía no tiene el perfil completo.'; end if;
 if not exists(select 1 from public.trips where user_id=target_user and ends_on>=current_date and (target_trip is null or id=target_trip)) then raise exception 'Esta persona ya no tiene viajes vigentes publicados.'; end if;
 insert into public.connections(requester_id,recipient_id) values(auth.uid(),target_user) returning id into result;
 return result;
exception when unique_violation then raise exception 'Ya existe una solicitud entre vosotros. Consulta tus conexiones.';
end; $$;
create or replace function public.request_trip_connection(trip uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare target uuid;
begin
 select user_id into target from public.trips where id=trip;
 if target is null then raise exception 'Este viaje ya no está disponible.'; end if;
 return public.request_person_connection(target,trip);
end; $$;
create or replace function public.request_connection(target_user uuid,station uuid,date_from date,date_to date) returns uuid
language plpgsql security definer set search_path='' as $$
declare trip uuid;
begin
 if date_from<current_date or date_to<date_from or date_to>date_from+90 then raise exception 'Fechas no válidas.'; end if;
 select id into trip from public.trips where user_id=target_user and resort_id=station and starts_on<=date_to and ends_on>=date_from order by starts_on limit 1;
 if trip is null then raise exception 'No hay un viaje coincidente.'; end if;
 return public.request_person_connection(target_user,trip);
end; $$;
create or replace function public.discover_person_cards(page_offset integer default 0,page_size integer default 13)
returns table(id uuid,name text,age integer,level text,sport text,bio text,avatar_url text,preferences text,trip_id uuid,resort_name text,resort_slug text,starts_on date,ends_on date)
language sql volatile security invoker set search_path='' as $$
 select p.id,p.name,p.age::integer,p.level,p.sport,p.bio,p.avatar_url,p.preferences,t.id,r.name,r.slug,t.starts_on,t.ends_on
 from public.public_profiles p
 join lateral(select tr.* from public.trips tr where tr.user_id=p.id and tr.ends_on>=current_date order by tr.starts_on,tr.id limit 1)t on true
 join public.resorts r on r.id=t.resort_id
 where public.is_member() and p.id<>auth.uid() and public.profile_photo_count(p.id,p.avatar_url)>=public.minimum_profile_photos(p.id)
 order by t.starts_on,p.name,p.id offset greatest(0,page_offset) limit least(30,greatest(1,page_size));
$$;
revoke all on function public.require_profile_photos(),public.require_connection_ready(),public.connection_readiness(),public.request_person_connection(uuid,uuid),public.discover_person_cards(integer,integer) from public,anon;
revoke all on function public.require_profile_photos(),public.require_connection_ready() from authenticated;
revoke all on function public.request_connection(uuid,uuid,date,date),public.request_trip_connection(uuid) from public,anon;
grant execute on function public.request_connection(uuid,uuid,date,date),public.request_trip_connection(uuid) to authenticated;
grant execute on function public.connection_readiness(),public.request_person_connection(uuid,uuid),public.discover_person_cards(integer,integer) to authenticated;
commit;
