-- SKI MATCH · Run once in a NEW Supabase project's SQL editor.
-- Do not install in an unrelated project's public schema.
begin;
create table public.resorts (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 name text not null, region text not null, description text not null,
 image text not null, tag text not null, official_url text not null,
 position integer not null default 0
);
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text not null check(length(trim(name)) between 1 and 60),
 birth_date date not null check(birth_date <= (current_date - interval '18 years')::date and birth_date > '1900-01-01'),
 level text not null check(level in ('Principiante','Intermedio','Avanzado','Experto')),
 sport text not null check(sport in ('Esquí','Snowboard','Ambas')),
 bio text not null default '' check(length(bio)<=500),
 preferences text not null default '' check(length(preferences)<=150),
 avatar_url text check(avatar_url is null or (avatar_url like 'https://%' and length(avatar_url)<=2048)),
 created_at timestamptz not null default now()
);
create function public.is_verified() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null);
$$;
create function public.is_member() returns boolean language sql stable security definer set search_path='' as $$
 select public.is_verified() and exists(select 1 from public.profiles where id=auth.uid() and birth_date <= (current_date-interval '18 years')::date);
$$;
-- Only safe public fields are exposed to verified members, never DOB or email.
create view public.public_profiles with (security_barrier=true) as
 select id,name,extract(year from age(current_date,birth_date))::integer as age,level,sport,bio,preferences,avatar_url
 from public.profiles where public.is_member();
create table public.trips (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 resort_id uuid not null references public.resorts(id) on delete cascade,
 traveling_with text not null default 'Solo/a' check(traveling_with in ('Solo/a','Con amigos','En pareja','En familia')),
 party_size integer not null default 1 check(party_size between 1 and 30),
 looking_for text not null default '' check(length(looking_for)<=160),
 starts_on date not null, ends_on date not null, created_at timestamptz not null default now(),
 check(ends_on>=starts_on and ends_on<=starts_on+90), unique(user_id,resort_id,starts_on,ends_on)
);
create index trips_search on public.trips(resort_id,starts_on,ends_on);
create table public.connections (
 id uuid primary key default gen_random_uuid(),
 requester_id uuid not null references public.profiles(id) on delete cascade,
 recipient_id uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','declined')),
 created_at timestamptz not null default now(), check(requester_id<>recipient_id)
);
create unique index unique_connection_pair on public.connections(least(requester_id,recipient_id),greatest(requester_id,recipient_id));
create table public.messages (
 id uuid primary key default gen_random_uuid(), connection_id uuid not null references public.connections(id) on delete cascade,
 sender_id uuid not null references public.profiles(id) on delete cascade,
 body text not null check(length(trim(body)) between 1 and 2000), created_at timestamptz not null default now()
);
create index messages_conversation on public.messages(connection_id,created_at);
create table public.plans (
 id uuid primary key default gen_random_uuid(), resort_id uuid not null references public.resorts(id) on delete cascade,
 host_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check(length(trim(title)) between 5 and 100),
 description text not null check(length(trim(description)) between 10 and 1000),
 starts_on date not null, ends_on date not null, check(ends_on>=starts_on and ends_on<=starts_on+90),
 level text not null check(level in ('Todos','Principiante','Intermedio','Avanzado','Experto')),
 capacity integer not null default 6 check(capacity between 2 and 30), created_at timestamptz not null default now()
);
create index plans_station on public.plans(resort_id,starts_on);
create table public.plan_members (
 id uuid primary key default gen_random_uuid(),plan_id uuid not null references public.plans(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','declined')),
 created_at timestamptz not null default now(),unique(plan_id,user_id)
);
create index plan_members_owner on public.plan_members(user_id);
create index connection_recipient on public.connections(recipient_id);
alter table public.resorts enable row level security;
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.connections enable row level security;
alter table public.messages enable row level security;
alter table public.plans enable row level security;
alter table public.plan_members enable row level security;
-- Explicit privileges: anonymous visitors can only read the station catalog.
revoke all on public.resorts,public.profiles,public.trips,public.connections,public.messages,public.plans,public.plan_members,public.public_profiles from anon,authenticated;
grant select on public.resorts to anon,authenticated;
grant select,insert,update,delete on public.profiles,public.trips,public.plans,public.plan_members to authenticated;
grant select,delete on public.connections to authenticated;
grant select,insert on public.messages to authenticated;
grant select on public.public_profiles to authenticated;
create policy resorts_read on public.resorts for select using(true);
create policy profile_read_own on public.profiles for select to authenticated using(id=auth.uid());
create policy profile_insert_own on public.profiles for insert to authenticated with check(id=auth.uid() and public.is_verified());
create policy profile_update_own on public.profiles for update to authenticated using(id=auth.uid() and public.is_verified()) with check(id=auth.uid() and public.is_verified());
create policy profile_delete_own on public.profiles for delete to authenticated using(id=auth.uid());
create policy trips_read on public.trips for select to authenticated using(public.is_member());
create policy trips_insert on public.trips for insert to authenticated with check(user_id=auth.uid() and public.is_member() and starts_on>=current_date);
create policy trips_update on public.trips for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and public.is_member() and starts_on>=current_date);
create policy trips_delete on public.trips for delete to authenticated using(user_id=auth.uid());
create policy connection_read on public.connections for select to authenticated using(auth.uid() in(requester_id,recipient_id) and public.is_member());
create policy connection_delete on public.connections for delete to authenticated using(auth.uid() in(requester_id,recipient_id));
create policy messages_read on public.messages for select to authenticated using(public.is_member() and exists(select 1 from public.connections c where c.id=connection_id and c.status='accepted' and auth.uid() in(c.requester_id,c.recipient_id)));
create policy messages_insert on public.messages for insert to authenticated with check(sender_id=auth.uid() and public.is_member() and exists(select 1 from public.connections c where c.id=connection_id and c.status='accepted' and auth.uid() in(c.requester_id,c.recipient_id)));
create policy plans_read on public.plans for select to authenticated using(public.is_member());
create policy plans_insert on public.plans for insert to authenticated with check(host_id=auth.uid() and public.is_member() and starts_on>=current_date);
-- Changes to ownership and capacity are deliberately not exposed.
create policy plans_delete on public.plans for delete to authenticated using(host_id=auth.uid());
create policy member_read on public.plan_members for select to authenticated using(public.is_member() and (user_id=auth.uid() or exists(select 1 from public.plans p where p.id=plan_id and p.host_id=auth.uid())));
create policy member_insert on public.plan_members for insert to authenticated with check(user_id=auth.uid() and status='pending' and public.is_member() and exists(select 1 from public.plans p where p.id=plan_id and p.host_id<>auth.uid() and p.starts_on>=current_date));
create policy member_delete on public.plan_members for delete to authenticated using(user_id=auth.uid());
create function public.request_connection(target_user uuid,station uuid,date_from date,date_to date) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if not public.is_member() or target_user=auth.uid() then raise exception 'Completa tu perfil y verifica tu email antes de conectar.'; end if;
 if date_from<current_date or date_to<date_from or date_to>date_from+90 then raise exception 'Fechas no válidas (máximo 90 días).'; end if;
 if not exists(select 1 from public.trips where user_id=target_user and resort_id=station and starts_on<=date_to and ends_on>=date_from) then raise exception 'Esta persona ya no tiene un viaje que coincida con tus fechas.'; end if;
 if to_regprocedure('public.request_person_connection(uuid,uuid)') is not null then return public.request_person_connection(target_user,null); end if;
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
 if to_regprocedure('public.request_person_connection(uuid,uuid)') is not null then return public.request_person_connection(target.user_id,trip); end if;
 insert into public.connections(requester_id,recipient_id) values(auth.uid(),target.user_id) returning id into result;
 return result;
exception when unique_violation then raise exception 'Ya existe una solicitud entre vosotros. Consulta Conexiones.';
end; $$;
revoke all on function public.request_trip_connection(uuid) from public,anon;
grant execute on function public.request_trip_connection(uuid) to authenticated;
create function public.respond_connection(connection uuid,decision text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_member() or decision not in('accepted','declined') then raise exception 'Acción no permitida.'; end if;
 update public.connections set status=decision where id=connection and recipient_id=auth.uid() and status='pending';
 if not found then raise exception 'Solicitud no disponible.'; end if;
end; $$;
create function public.respond_plan(membership uuid,decision text) returns void language plpgsql security definer set search_path='' as $$
declare target_plan uuid; maximum integer;
begin
 if not public.is_member() or decision not in('accepted','declined') then raise exception 'Acción no permitida.'; end if;
 select p.id,p.capacity into target_plan,maximum from public.plans p join public.plan_members m on m.plan_id=p.id where m.id=membership and p.host_id=auth.uid() and m.status='pending' for update of p;
 if target_plan is null then raise exception 'Solicitud no disponible.'; end if;
 if decision='accepted' and (select count(*) from public.plan_members where plan_id=target_plan and status='accepted')>=maximum-1 then raise exception 'El plan ya está completo.'; end if;
 update public.plan_members set status=decision where id=membership;
end; $$;
revoke all on function public.is_verified(),public.is_member(),public.request_connection(uuid,uuid,date,date),public.respond_connection(uuid,text),public.respond_plan(uuid,text) from public,anon;
grant execute on function public.is_verified(),public.is_member(),public.request_connection(uuid,uuid,date,date),public.respond_connection(uuid,text),public.respond_plan(uuid,text) to authenticated;
insert into public.resorts(slug,name,region,description,image,tag,official_url,position) values
('baqueira-beret','Baqueira Beret','Val d’Aran · Lleida','Entre bosques de abetos y cumbres del Pirineo. Descubre el carácter del valle y encuentra con quién compartir tu próxima bajada.','https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1200&q=85','ESPÍRITU PIRENAICO','https://www.baqueira.es',1),
('formigal-panticosa','Formigal-Panticosa','Valle de Tena · Huesca','Dos destinos, un mismo espíritu. Grandes paisajes, nuevos amigos y un plan que empieza en las pistas del valle de Tena.','https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&w=1200&q=85','AVENTURA SIN LÍMITES','https://www.formigal-panticosa.com',2),
('sierra-nevada','Sierra Nevada','Sierra Nevada · Granada','Nieve, luz del sur y horizontes que sorprenden. Vive la montaña a tu ritmo, con gente que comparte tus ganas de explorar.','https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&q=85','NIEVE CON ACENTO DEL SUR','https://sierranevada.es',3);
commit;
