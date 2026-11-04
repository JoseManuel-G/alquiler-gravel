-- SKI MATCH: additive leisure storage. No social tables, rows or policies removed.
begin;
create table if not exists public.leisure_items (
 id uuid primary key default gen_random_uuid(), resort_id uuid not null references public.resorts(id) on delete cascade,
 source_key text not null, category text not null check(category in ('restaurant','apres','event','activity')),
 name text not null check(length(name) between 1 and 180), description text not null default '' check(length(description)<=800), location text not null default '',
 latitude double precision check(latitude between -90 and 90), longitude double precision check(longitude between -180 and 180),
 starts_at timestamptz, ends_at timestamptz, check(ends_at is null or (starts_at is not null and ends_at>=starts_at)),
 check(category<>'event' or (starts_at is not null and ends_at is not null)),
 source_url text not null check(source_url like 'https://%'), source_name text not null,
 booking_url text check(booking_url is null or booking_url like 'https://%'),
 image_url text check(image_url is null or image_url like 'https://%'), image_license text,
 check(image_url is null or length(coalesce(image_license,''))>0),
 subtype text, distance_km double precision check(distance_km>=0), elevation_m integer check(elevation_m>=0), difficulty text,
 winter_status text not null default 'unknown' check(winter_status in ('unknown','winter','summer')),
 status text not null default 'review' check(status in ('review','active','cancelled','expired','broken')),
 evidence jsonb not null default '[]', verified_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '7 days',
 unique(resort_id,source_key)
);
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
commit;
