-- SKI MATCH only. Run in the dedicated project, after schema.sql. Safe to rerun.
-- Connecting never publishes a trip for the requester. Consent still gates chat.
begin;
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
commit;
