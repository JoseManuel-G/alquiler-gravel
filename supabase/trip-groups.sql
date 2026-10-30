-- SKI MATCH only. Add group details to existing trips. Safe to rerun.
begin;
alter table public.trips add column if not exists traveling_with text not null default 'Solo/a' check(traveling_with in ('Solo/a','Con amigos','En pareja','En familia'));
alter table public.trips add column if not exists party_size integer not null default 1 check(party_size between 1 and 30);
alter table public.trips add column if not exists looking_for text not null default '' check(length(looking_for)<=160);
commit;
