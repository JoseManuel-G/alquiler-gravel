import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { profilePhotoCount } from '../src/lib/profile-photo-rules.ts';

test('Photo counter includes owned portrait once and a pending replacement',()=>{
 const prefix='https://project.example/storage/v1/object/authenticated/avatars/owner/';
 const photos=[prefix+'gallery-a.jpg',prefix+'gallery-b.jpg'];
 assert.equal(profilePhotoCount(photos,photos[0],prefix),2);
 assert.equal(profilePhotoCount([],prefix+'portrait.jpg',prefix),1);
 assert.equal(profilePhotoCount([], 'https://another.example/photo.jpg',prefix),0);
 assert.equal(profilePhotoCount([photos[0]],prefix+'old.jpg',prefix,true),2);
});

test('Two uploaded photos are mandatory; only the recipient needs a published trip; chat still needs consent',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;`);
  await db.exec(await readFile(new URL('../supabase/schema.sql',import.meta.url),'utf8'));
  await db.exec(`create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(bucket_id text,name text,metadata jsonb,primary key(bucket_id,name));create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;alter table storage.objects enable row level security;grant usage on schema storage to anon,authenticated;grant select,insert,delete on storage.objects to authenticated;`);
  await db.exec(await readFile(new URL('../supabase/avatars.sql',import.meta.url),'utf8'));
  // This fixture exercises registrations after the photo policy was initialized.
  await db.exec("create table public.profile_photo_policy(singleton boolean primary key check(singleton),required_from timestamptz not null default clock_timestamp());insert into public.profile_photo_policy(singleton) values(true)");
  const ids=['10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000005'];
  for(const id of ids)await db.query('insert into auth.users values($1,now())',[id]);
  const profile=async id=>db.query("insert into public.profiles(id,name,birth_date,level,sport) values($1,$2,'1990-01-01','Intermedio','Esquí')",[id,'Skier '+id.slice(-1)]);
  await profile(ids[2]); // Existing account with no photos is preserved by the migration.
  const sql=await readFile(new URL('../supabase/people-cards.sql',import.meta.url),'utf8');await db.exec(sql);await db.exec(sql);
  const as=async(id,role='authenticated')=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role '+role);};
  const photo=async(id,name,metadata={mimetype:'image/jpeg',size:120})=>db.query("insert into storage.objects values('avatars',$1,$2)",[`${id}/${name}`,JSON.stringify(metadata)]);
  await as(ids[0]);
  await assert.rejects(profile(ids[0]));
  await photo(ids[0],'gallery-one.jpg');await assert.rejects(profile(ids[0]));
  await photo(ids[0],'unreferenced.jpg');await photo(ids[0],'gallery-empty.jpg',{mimetype:'image/jpeg',size:0});
  await assert.rejects(profile(ids[0]));
  await photo(ids[0],'gallery-two.jpg');await profile(ids[0]);
  const ready=(await db.query('select public.connection_readiness() as data')).rows[0].data;
  assert.equal(ready.photo_count,2);assert.equal(ready.has_trip,false);assert.equal(ready.has_profile,true);
  await db.query("delete from storage.objects where name=$1",[`${ids[0]}/gallery-one.jpg`]);
  await assert.rejects(db.query("update public.profiles set bio='Updated' where id=$1",[ids[0]]),{message:/dos fotos/});
  await assert.rejects(db.query('select public.request_person_connection($1)',[ids[1]]),{message:/dos fotos/});
  await photo(ids[0],'gallery-three.jpg');await db.query('delete from storage.objects where name=$1',[`${ids[0]}/gallery-one.jpg`]);
  await as(ids[1]);await photo(ids[1],'gallery-one.jpg');await photo(ids[1],'gallery-two.jpg');await profile(ids[1]);
  await as(ids[3]);await photo(ids[3],'gallery-one.jpg');await photo(ids[3],'gallery-two.jpg');await profile(ids[3]);
  await as(ids[4]);await photo(ids[4],'portrait.jpg');await photo(ids[4],'gallery-one.jpg');
  await assert.rejects(profile(ids[4]));
  await db.query("insert into public.profiles(id,name,birth_date,level,sport,avatar_url) values($1,'Portrait','1990-01-01','Intermedio','Esquí',$2)",[ids[4],`https://project.example/storage/v1/object/authenticated/avatars/${ids[4]}/portrait.jpg`]);
  await db.exec('reset role');
  const resort=(await db.query('select id from public.resorts limit 1')).rows[0].id;
  const trip=(await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+3,current_date+5) returning id',[ids[1],resort])).rows[0].id;
  await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+3,current_date+5)',[ids[2],resort]);
  assert.equal((await db.query('select id from public.profiles')).rows.length,5);
  // Reapplying an earlier supported migration must not bypass the new guards.
  await db.exec(await readFile(new URL('../supabase/simple-connections.sql',import.meta.url),'utf8'));
  await as(ids[2]);await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
  await assert.rejects(db.query('select public.request_connection($1,$2,current_date+3,current_date+5)',[ids[1],resort]));
  await as(ids[0]);
  const cards=(await db.query('select * from public.discover_person_cards()')).rows;
  assert.equal(cards.length,1);assert.equal(cards[0].id,ids[1]);assert.ok(!('birth_date'in cards[0]));assert.ok(!('email'in cards[0]));
  await assert.rejects(db.query('select public.request_person_connection($1)',[ids[0]]));
  await assert.rejects(db.query('select public.request_person_connection($1)',[ids[2]]));
  await assert.rejects(db.query('select public.request_person_connection($1)',[ids[3]])); // no recipient trip
  const connection=(await db.query('select public.request_person_connection($1,$2) as id',[ids[1],trip])).rows[0].id;
  assert.equal((await db.query('select id from public.trips where user_id=$1',[ids[0]])).rows.length,0);
  await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
  await assert.rejects(db.query("insert into public.messages(connection_id,sender_id,body) values($1,$2,'Hello')",[connection,ids[0]]));
  await assert.rejects(db.query("select public.respond_connection($1,'accepted')",[connection]));
  await as(ids[1]);await db.query("select public.respond_connection($1,'accepted')",[connection]);
  await as(ids[0]);await db.query("insert into public.messages(connection_id,sender_id,body) values($1,$2,'Hello')",[connection,ids[0]]);
  await as('', 'anon');await assert.rejects(db.query('select * from public.discover_person_cards()'));await assert.rejects(db.query('select public.request_person_connection($1)',[ids[1]]));
  await db.exec('reset role');await db.query("update auth.users set email_confirmed_at=null where id=$1",[ids[4]]);await as(ids[4]);await assert.rejects(db.query('select public.request_person_connection($1)',[ids[1]]));
  // Deleting/invalidating files via another client cannot bypass connection/profile validation.
  await db.exec('reset role');await db.query("update storage.objects set metadata='{}' where name=$1",[`${ids[0]}/gallery-two.jpg`]);
  await as(ids[0]);assert.equal((await db.query('select public.connection_readiness() as data')).rows[0].data.photo_count,1);
  await assert.rejects(db.query('select public.request_person_connection($1)',[ids[3]]),{message:/dos fotos/});
 }finally{await db.close();}
});
