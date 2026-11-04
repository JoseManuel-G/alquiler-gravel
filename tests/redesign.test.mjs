import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { normalizeSelection, overlaps, madridDayBoundary } from '../src/lib/travel-selection.ts';
import { approvedUrl, sourceKey, validateCandidate, extractEvents, verifyEvent } from '../src/lib/leisure-validation.mjs';

test('Global destination sanitizes stored data, dates and inclusive overlaps', () => {
 assert.deepEqual(normalizeSelection({slug:'baqueira-beret',from:'2026-12-05',to:'2026-12-08'}),{slug:'baqueira-beret',from:'2026-12-05',to:'2026-12-08'});
 assert.equal(normalizeSelection({slug:'<script>',from:'2026-02-30'}).slug,'');
 assert.equal(normalizeSelection({from:'2026-02-30'}).from,'');
 assert.equal(normalizeSelection({to:'2026-12-05'}).from,'2026-12-05');
 assert.equal(normalizeSelection({from:'2026-12-05',to:'2026-12-01'}).to,'2026-12-05');
 assert.equal(overlaps('2026-12-08','2026-12-10','2026-12-05','2026-12-08'),true);
 assert.equal(madridDayBoundary('2026-12-05'),'2026-12-04T23:00:00.000Z');
 assert.equal(madridDayBoundary('2026-07-05'),'2026-07-04T22:00:00.000Z');
 assert.equal(madridDayBoundary('2026-12-05',true),'2026-12-05T22:59:59.999Z');
 assert.equal(overlaps('2026-12-09','2026-12-10','2026-12-05','2026-12-08'),false);
});

test('Research never publishes ungrounded text, private URLs, copied images or incomplete dates', () => {
 const domains=['example.org']; const source='https://example.org/event/1';
 assert.equal(approvedUrl('https://example.org.attacker.test/',domains),null);
 assert.equal(approvedUrl('https://127.0.0.1/',domains),null);
 assert.equal(approvedUrl('https://token@example.org/',domains),null);
 assert.equal(approvedUrl('http://example.org/',domains),null);
 assert.equal(approvedUrl('https://example.org/a?utm_source=ad#x',domains),'https://example.org/a');
 assert.equal(sourceKey('event','Après Ski',source),sourceKey('event','apres-ski',source));
 const event={category:'event',name:'Après ski',description:'Una cita musical.',source_url:source,starts_at:'2026-12-05T18:00:00+01:00',ends_at:'2026-12-05T22:00:00+01:00',image_url:'https://example.org/protected.jpg'};
 assert.equal(validateCandidate(event,{domains,citedUrls:[]}),null);
 assert.equal(validateCandidate({...event,ends_at:null},{domains,citedUrls:[source]}),null);
 assert.equal(validateCandidate({...event,starts_at:'2026-02-30T18:00:00+01:00'},{domains,citedUrls:[source]}),null);
 const item=validateCandidate(event,{domains,citedUrls:[source],now:new Date('2026-11-04')});
 assert.equal(item.status,'review'); assert.equal(item.image_url,null);
 const html='<script type="application/ld+json">'+JSON.stringify({'@graph':[{'@type':'Event',name:'Après ski',startDate:event.starts_at,endDate:event.ends_at}]})+'</script>';
 const verified=verifyEvent(item,extractEvents(html));assert.equal(verified.status,'active');
 const changed=verifyEvent(item,[{'@type':'Event',name:'Après ski',startDate:'2026-12-06T18:00:00+01:00',endDate:'2026-12-06T22:00:00+01:00'}]);
 assert.equal(changed.source_key,item.source_key);assert.match(changed.starts_at,/2026-12-06/);
 assert.equal(verifyEvent(item,[{name:'Après ski',eventStatus:'https://schema.org/EventCancelled'}]).status,'cancelled');
 assert.equal(verifyEvent(item,[{name:'Après ski',startDate:'2026-12-05',endDate:'2026-12-05'}]).status,'review');
 assert.equal(verifyEvent(item,[{name:'Some other event'}]).status,'review');
 assert.equal(verifyEvent(item,[{name:'Après ski'},{name:'Après ski'}]).status,'review');
 assert.equal(extractEvents('<script type="application/ld+json">INVALID</script>').length,0);
});

test('Discovery, leisure RLS, expiry, review isolation and persistent research budget', async () => {
 const db=new PGlite();
 try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;`);
  for(const file of ['schema.sql','redesign-update.sql','redesign-update.sql']) await db.exec(await readFile(new URL('../supabase/'+file,import.meta.url),'utf8'));
  const a='10000000-0000-0000-0000-000000000001',b='10000000-0000-0000-0000-000000000002',c='10000000-0000-0000-0000-000000000003';
  await db.query('insert into auth.users values($1,now()),($2,now()),($3,null)',[a,b,c]);
  await db.query("insert into public.profiles(id,name,birth_date,level,sport) values($1,'A','1990-01-01','Intermedio','Esquí'),($2,'B','1990-01-01','Avanzado','Snowboard')",[a,b]);
  const resort=(await db.query('select id from public.resorts limit 1')).rows[0].id;
  await db.query('insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+5,current_date+8)',[b,resort]);
  const as=async(id,role='authenticated')=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role '+role);};
  await as(a);
  let rows=(await db.query('select * from public.discover_people($1,current_date+8,current_date+9)',[resort])).rows;
  assert.equal(rows.length,1);assert.equal(rows[0].name,'B');assert.ok(!('birth_date' in rows[0]));assert.ok(!('email' in rows[0]));
  assert.equal((await db.query('select * from public.discover_people($1,current_date+9,current_date+10)',[resort])).rows.length,0);
  await as(c);assert.equal((await db.query('select * from public.discover_people()')).rows.length,0);
  await db.exec('reset role');
  for(const status of ['active','review','cancelled','expired']) await db.query("insert into public.leisure_items(resort_id,source_key,category,name,source_url,source_name,status,expires_at) values($1,$2,'restaurant',$2,'https://example.org/','Example',$3,now()+interval '1 day')",[resort,'test-'+status,status]);
  await db.query("insert into public.leisure_items(resort_id,source_key,category,name,source_url,source_name,status,expires_at) values($1,'test-stale','restaurant','stale','https://example.org/','Example','active',now()-interval '1 day')",[resort]);
  await db.query("insert into public.leisure_items(resort_id,source_key,category,name,source_url,source_name,status,starts_at,ends_at,expires_at) values($1,'test-past-event','event','Past','https://example.org/','Example','active',now()-interval '2 days',now()-interval '1 day',now()+interval '1 day')",[resort]);
  await as('', 'anon');
  assert.equal((await db.query("select name from public.leisure_items where source_key like 'test-%'")).rows.length,1);
  await assert.rejects(db.query('select * from public.leisure_jobs'));
  await assert.rejects(db.query('select public.discover_people()'));
  await assert.rejects(db.query("select public.reserve_leisure_job('x',$1,'event',0.15,20)",[resort]));
  await assert.rejects(db.query("insert into public.leisure_items(resort_id,source_key,category,name,source_url,source_name) values($1,'injection','restaurant','X','https://x.org/','X')",[resort]));
  await db.exec('reset role;set role service_role');
  const claim=async key=>(await db.query("select public.reserve_leisure_job($1,$2,'event',0.15,0.3) as id",[key,resort])).rows[0].id;
  assert.ok(await claim('1'));assert.equal(await claim('1'),null);assert.ok(await claim('2'));assert.equal(await claim('3'),null);
 } finally { await db.close(); }
});
