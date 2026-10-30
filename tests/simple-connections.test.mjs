import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('Interest in a trip needs no requester trip and does not publish one; consent still gates chat', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth to anon,authenticated;`);
    await db.exec(await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'));
    const migration = await readFile(new URL('../supabase/simple-connections.sql', import.meta.url), 'utf8');
    await db.exec(migration); await db.exec(migration);
    const a='10000000-0000-0000-0000-000000000001', b='10000000-0000-0000-0000-000000000002', c='10000000-0000-0000-0000-000000000003';
    await db.query('insert into auth.users values($1,now()),($2,now()),($3,null)',[a,b,c]);
    await db.query("insert into public.profiles(id,name,birth_date,level,sport) values($1,'A','1990-01-01','Intermedio','Esquí'),($2,'B','1990-01-01','Intermedio','Esquí')",[a,b]);
    const resort = (await db.query('select id from public.resorts limit 1')).rows[0].id;
    const trip = (await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+2,current_date+4) returning id',[b,resort])).rows[0].id;
    const expired = (await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date-4,current_date-2) returning id',[b,resort])).rows[0].id;
    const as = async id => { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]); await db.exec('set role authenticated'); };
    await db.exec('set role anon');
    await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
    await as(c);
    await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
    await as(b);
    await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
    await as(a);
    await assert.rejects(db.query('select public.request_trip_connection($1)',[expired]));
    await assert.rejects(db.query('select public.request_trip_connection($1)',[c]));
    const connection = (await db.query('select public.request_trip_connection($1) as id',[trip])).rows[0].id;
    assert.equal((await db.query('select id from public.trips where user_id=$1',[a])).rows.length,0);
    await assert.rejects(db.query('select public.request_trip_connection($1)',[trip]));
    await assert.rejects(db.query("insert into public.messages(connection_id,sender_id,body) values($1,$2,'Hello')",[connection,a]));
    await assert.rejects(db.query("select public.respond_connection($1,'accepted')",[connection]));
    await as(b); await db.query("select public.respond_connection($1,'accepted')",[connection]);
    await as(a); await db.query("insert into public.messages(connection_id,sender_id,body) values($1,$2,'Hello')",[connection,a]);
    assert.equal((await db.query('select id from public.trips where user_id=$1',[a])).rows.length,0);
  } finally { await db.close(); }
});
