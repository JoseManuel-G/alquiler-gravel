import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('Avatar policies isolate uploads/deletes and require membership to read other photos', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth to anon,authenticated;`);
    await db.exec(await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'));
    // Minimal Storage contract; actual MIME/size enforcement belongs to Supabase Storage.
    await db.exec(`create schema storage;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(bucket_id text,name text);
      create function storage.foldername(text) returns text[] language sql immutable as $$select (string_to_array($1,'/'))[1:array_length(string_to_array($1,'/'),1)-1]$$;
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon,authenticated;
      grant select,insert,delete on storage.objects to authenticated;`);
    const sql = await readFile(new URL('../supabase/avatars.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    await db.exec(sql);
    const a='10000000-0000-0000-0000-000000000001', b='10000000-0000-0000-0000-000000000002', c='10000000-0000-0000-0000-000000000003';
    await db.query('insert into auth.users values($1,now()),($2,now()),($3,null)',[a,b,c]);
    const as = async id => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
      await db.exec('set role authenticated');
    };
    await as(a);
    await db.query("insert into storage.objects values('avatars',$1)",[`${a}/photo.jpg`]);
    await assert.rejects(db.query("insert into storage.objects values('avatars',$1)",[`${b}/photo.jpg`]));
    assert.equal((await db.query('select * from storage.objects')).rows.length,1);
    await as(b);
    assert.equal((await db.query('select * from storage.objects')).rows.length,0);
    await db.query("insert into public.profiles(id,name,birth_date,level,sport) values($1,'Skier','1990-01-01','Intermedio','Esquí')",[b]);
    assert.equal((await db.query('select * from storage.objects')).rows.length,1);
    await db.query('delete from storage.objects');
    assert.equal((await db.query('select * from storage.objects')).rows.length,1);
    await as(c);
    await assert.rejects(db.query("insert into storage.objects values('avatars',$1)",[`${c}/photo.jpg`]));
    assert.equal((await db.query('select * from storage.objects')).rows.length,0);
    await db.exec('reset role; set role anon');
    await assert.rejects(db.query('select * from storage.objects'));
    await as(a);
    await db.query('delete from storage.objects');
    assert.equal((await db.query('select * from storage.objects')).rows.length,0);
  } finally { await db.close(); }
});
