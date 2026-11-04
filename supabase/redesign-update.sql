-- SKI MATCH ONLY. Additive redesign update; safe to repeat.
-- Never run the original schema.sql again on an existing project.
begin;
-- Included: community-update.sql
-- SKI MATCH only: applies simplified connections and group details together.
-- Run on the dedicated project after schema.sql. Safe to rerun.
-- SKI MATCH only. Run in the dedicated project, after schema.sql. Safe to rerun.
-- Connecting never publishes a trip for the requester. Consent still gates chat.
create or replace function public.request_connection(target_user uuid,station uuid,date_from date,date_to date) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if not public.is_member() or target_user=auth.uid() then raise exception 'Completa tu perfil y verifica tu email antes de conectar.'; end if;
 if date_from<current_date or date_to<date_from or date_to>date_from+90 then raise exception 'Fechas no válidas (máximo 90 días).'; end if;
 if not exists(select 1 from public.trips where user_id=target_user and resort_id=station and starts_on<=date_to and ends_on>=date_from) then raise exception 'Esta persona ya no tiene un viaje que coincida con tus fechas.'; end if;
 insert into public.connections(requester_id,recipient_id) values(auth.uid(),target_user) returning id into result;
 return result;
exception when unique_violation then raise exception 'Ya existe una solicitud entre vosotros. Consulta Comunidad.';
end; $$;
create or replace function public.request_trip_connection(trip uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare target public.trips; result uuid;
begin
 if not public.is_member() then raise exception 'Completa tu perfil y verifica tu email antes de conectar.'; end if;
 select * into target from public.trips where id=trip;
 if not found or target.ends_on<current_date then raise exception 'Este viaje ya no está disponible.'; end if;
 if target.user_id=auth.uid() then raise exception 'Este es tu propio viaje.'; end if;
 insert into public.connections(requester_id,recipient_id) values(auth.uid(),target.user_id) returning id into result;
 return result;
exception when unique_violation then raise exception 'Ya existe una solicitud entre vosotros. Consulta Conexiones.';
end; $$;
revoke all on function public.request_trip_connection(uuid) from public,anon;
grant execute on function public.request_trip_connection(uuid) to authenticated;

-- SKI MATCH only. Add group details to existing trips. Safe to rerun.
alter table public.trips add column if not exists traveling_with text not null default 'Solo/a' check(traveling_with in ('Solo/a','Con amigos','En pareja','En familia'));
alter table public.trips add column if not exists party_size integer not null default 1 check(party_size between 1 and 30);
alter table public.trips add column if not exists looking_for text not null default '' check(length(looking_for)<=160);

-- Included: discovery.sql
-- SKI MATCH only. Additive, rerunnable. No social policies or rows removed.
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

-- Included: leisure.sql
-- SKI MATCH: additive leisure storage. No social tables, rows or policies removed.
create table if not exists public.leisure_items (
 id uuid primary key default gen_random_uuid(), resort_id uuid not null references public.resorts(id) on delete cascade,
 source_key text not null, category text not null check(category in ('restaurant','apres','event','activity')),
 name text not null check(length(name) between 1 and 180), description text not null default '' check(length(description)<=800), location text not null default '',
 latitude double precision check(latitude between -90 and 90), longitude double precision check(longitude between -180 and 180),
 starts_at timestamptz, ends_at timestamptz, check(ends_at is null or (starts_at is not null and ends_at>=starts_at)),
 check(category<>'event' or (starts_at is not null and ends_at is not null)),
 source_url text not null check(source_url like 'https://%'), source_name text not null,
 website_url text check(website_url is null or website_url like 'https://%'),
 booking_url text check(booking_url is null or booking_url like 'https://%'),
 image_url text check(image_url is null or image_url like 'https://%'), image_license text,
 check(image_url is null or length(coalesce(image_license,''))>0),
 subtype text, distance_km double precision check(distance_km>=0), elevation_m integer check(elevation_m>=0), difficulty text,
 winter_status text not null default 'unknown' check(winter_status in ('unknown','winter','summer')),
 status text not null default 'review' check(status in ('review','active','cancelled','expired','broken')),
 evidence jsonb not null default '[]', verified_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '7 days',
 unique(resort_id,source_key)
);
alter table public.leisure_items add column if not exists website_url text check(website_url is null or website_url like 'https://%');
create index if not exists leisure_discovery on public.leisure_items(resort_id,category,status,starts_at);
alter table public.leisure_items enable row level security;
revoke all on public.leisure_items from anon,authenticated;
grant select on public.leisure_items to anon,authenticated;
drop policy if exists leisure_public_read on public.leisure_items;
create policy leisure_public_read on public.leisure_items for select to anon,authenticated using(status='active' and verified_at<=now() and expires_at>now() and (ends_at is null or ends_at>=now()));
create table if not exists public.leisure_jobs (
 id uuid primary key default gen_random_uuid(), job_key text not null unique, resort_id uuid references public.resorts(id), category text not null,
 status text not null default 'running' check(status in ('running','success','error')), reserved_usd numeric not null check(reserved_usd>=0),
 created_at timestamptz not null default now(), finished_at timestamptz, usage jsonb, error text
);
alter table public.leisure_jobs enable row level security;
revoke all on public.leisure_jobs from anon,authenticated;
grant all on public.leisure_items,public.leisure_jobs to service_role;
create or replace function public.reserve_leisure_job(key text,station uuid,kind text,reservation numeric,monthly_cap numeric) returns uuid
language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if reservation<=0 or monthly_cap<=0 or monthly_cap>100 or reservation>monthly_cap then raise exception 'Invalid budget'; end if;
 perform pg_advisory_xact_lock(7051832);
 if exists(select 1 from public.leisure_jobs where job_key=key) then return null; end if;
 if (select coalesce(sum(reserved_usd),0) from public.leisure_jobs where created_at>=date_trunc('month',now()))+reservation>monthly_cap then return null; end if;
 insert into public.leisure_jobs(job_key,resort_id,category,reserved_usd) values(key,station,kind,reservation) returning id into result;
 return result;
end; $$;
revoke all on function public.reserve_leisure_job(text,uuid,text,numeric,numeric) from public,anon,authenticated;
grant execute on function public.reserve_leisure_job(text,uuid,text,numeric,numeric) to service_role;

-- Included: leisure-initial.sql
-- Optional manually verified source directory: 4 November 2026.
-- No scraped photos, invented events, opening times or summer safety claims.
-- Run after leisure.sql in SKI MATCH only. Does not alter social data.
insert into public.leisure_items(resort_id,source_key,category,name,description,location,source_url,source_name,subtype,distance_km,elevation_m,difficulty,winter_status,status,verified_at,expires_at,evidence)
select r.id,v.key,v.category,v.name,v.description,v.location,v.url,v.source,v.subtype,v.distance,v.elevation,v.difficulty,v.winter,'active','2026-11-04T12:00:00Z'::timestamptz,'2026-12-04T12:00:00Z'::timestamptz,jsonb_build_array(jsonb_build_object('method','manual_official_directory','url',v.url,'reviewed_on','2026-11-04'))
from (values
 ('baqueira-beret','official-salgorda','restaurant','La Sal Gorda','Establecimiento incluido en el directorio turístico de Val d’Aran. Consulta la fuente para confirmar horarios y disponibilidad.','Arties · Carretera Baqueira, 5','https://www.visitvaldaran.com/item/restaurant-la-sal-gorda/','Turismo Val d’Aran','Restaurante',null::double precision,null::integer,null::text,'unknown'),
 ('baqueira-beret','official-wellbourne','restaurant','Wellbourne Salardú','Restaurante recogido en el directorio turístico oficial. Consulta su ficha y confirma directamente la disponibilidad.','Salardú · Carrer dera Mòla, 5','https://www.visitvaldaran.com/item/restaurant-wellbourne/','Turismo Val d’Aran','Restaurante',null,null,null,'unknown'),
 ('formigal-panticosa','official-marchica','apres','M Experience · Formigal-Panticosa','Consulta las experiencias de après-ski en la web oficial. Las sesiones y fechas dependen de la programación del operador.','Formigal-Panticosa','https://www.aramon.com/m-experience/formigal-panticosa','Aramón','Après-ski',null,null,null,'unknown'),
 ('formigal-panticosa','official-petrosos','activity','Skimo · Petrosos','Circuito de esquí de montaña incluido en la información oficial de Panticosa. Consulta apertura, requisitos y condiciones antes de salir.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',1.14,170,'Fácil según la fuente','winter'),
 ('formigal-panticosa','official-yandel','activity','Skimo · Yandel','Circuito de esquí de montaña descrito por el operador. Consulta la información actualizada de la estación y las condiciones de montaña.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',2.5,332,'Moderada según la fuente','winter'),
 ('formigal-panticosa','official-bandera','activity','Skimo · La Bandera','Itinerario de esquí de montaña descrito en la web oficial de Panticosa. Requiere valorar el nivel propio y las condiciones de la jornada.','Panticosa','https://www.aramon.com/formigal-panticosa/rutas-skimo-panticosa.html','Aramón','Esquí de montaña',6,819,'Difícil según la fuente','winter')
) as v(slug,key,category,name,description,location,url,source,subtype,distance,elevation,difficulty,winter)
join public.resorts r on r.slug=v.slug
on conflict(resort_id,source_key) do nothing;
update public.leisure_items set website_url='https://wellbourne.es/',latitude=42.70035,longitude=0.87505893863515 where source_key='official-wellbourne' and source_url='https://www.visitvaldaran.com/item/restaurant-wellbourne/';
commit;
