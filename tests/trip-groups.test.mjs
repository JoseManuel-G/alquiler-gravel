import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('Group details migrate existing trips, enforce limits and remain owner editable', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth to anon,authenticated;`);
    await db.exec(await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'));
    await db.exec('alter table public.trips drop column traveling_with, drop column party_size, drop column looking_for');
    const a='10000000-0000-0000-0000-000000000001', b='10000000-0000-0000-0000-000000000002';
    await db.query('insert into auth.users values($1,now()),($2,now())',[a,b]);
    await db.query("insert into public.profiles(id,name,birth_date,level,sport) values($1,'A','1990-01-01','Intermedio','Esquí'),($2,'B','1990-01-01','Intermedio','Esquí')",[a,b]);
    const resort = (await db.query('select id from public.resorts limit 1')).rows[0].id;
    const trip = (await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+2,current_date+4) returning id',[a,resort])).rows[0].id;
    const migration = await readFile(new URL('../supabase/community-update.sql', import.meta.url), 'utf8');
    await db.exec(migration); await db.exec(migration);
    assert.deepEqual((await db.query('select traveling_with,party_size,looking_for from public.trips where id=$1',[trip])).rows[0],{traveling_with:'Solo/a',party_size:1,looking_for:''});
    const as = async id => { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]); await db.exec('set role authenticated'); };
    await as(a);
    await db.query("update public.trips set traveling_with='Con amigos',party_size=3,looking_for='Un grupo de amigas para esquiar' where id=$1",[trip]);
    await assert.rejects(db.query('update public.trips set party_size=31 where id=$1',[trip]));
    await assert.rejects(db.query('update public.trips set party_size=0 where id=$1',[trip]));
    await assert.rejects(db.query("update public.trips set traveling_with='Invalid' where id=$1",[trip]));
    await assert.rejects(db.query('update public.trips set looking_for=$1 where id=$2',['x'.repeat(161),trip]));
    await as(b);
    await db.query("update public.trips set looking_for='Impersonation' where id=$1",[trip]);
    assert.equal((await db.query('select looking_for from public.trips where id=$1',[trip])).rows[0].looking_for,'Un grupo de amigas para esquiar');
    await db.exec('reset role; set role anon');
    await assert.rejects(db.query('select * from public.trips'));
  } finally { await db.close(); }
});
