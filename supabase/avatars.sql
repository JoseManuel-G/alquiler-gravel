-- SKI MATCH only: run after schema.sql in the dedicated project's SQL Editor.
-- Safe to rerun. Private bucket: no anonymous/public image access.
begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists ski_avatars_read on storage.objects;
create policy ski_avatars_read on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (public.is_member() or (storage.foldername(name))[1] = (select auth.uid())::text));
drop policy if exists ski_avatars_insert on storage.objects;
create policy ski_avatars_insert on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and public.is_verified() and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists ski_avatars_delete on storage.objects;
create policy ski_avatars_delete on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
commit;
