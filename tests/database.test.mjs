import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("Database: trips, mutual connections, private chat, host approval and RLS", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
    await db.exec(
      await readFile(
        new URL("../supabase/schema.sql", import.meta.url),
        "utf8",
      ),
    );
    const ids = [
      "10000000-0000-0000-0000-000000000001",
      "10000000-0000-0000-0000-000000000002",
      "10000000-0000-0000-0000-000000000003",
      "10000000-0000-0000-0000-000000000004",
    ];
    await db.query(
      `insert into auth.users values($1,now()),($2,now()),($3,now()),($4,null)`,
      ids,
    );
    const as = async (id) => {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec("set role authenticated");
    };
    const denied = async (sql, args = []) =>
      assert.rejects(db.query(sql, args));
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select * from public.resorts")).rows.length,
      3,
    );
    await denied("select * from public.profiles");
    await denied("select * from public.public_profiles");
    for (let i = 0; i < 3; i++) {
      await as(ids[i]);
      await db.query(
        `insert into public.profiles(id,name,birth_date,level,sport) values($1,$2,'1995-01-01','Intermedio','Esquí')`,
        [ids[i], `Skier ${i}`],
      );
    }
    await as(ids[3]);
    await denied(
      `insert into public.profiles(id,name,birth_date,level,sport) values($1,'Unverified','1995-01-01','Intermedio','Esquí')`,
      [ids[3]],
    );
    assert.equal(
      (await db.query("select * from public.public_profiles")).rows.length,
      0,
    );
    await as(ids[0]);
    assert.equal(
      (await db.query("select * from public.profiles")).rows.length,
      1,
    );
    const publicData = (await db.query("select * from public.public_profiles"))
      .rows;
    assert.equal(publicData.length, 3);
    assert.ok(!("birth_date" in publicData[0]));
    assert.ok(!("email" in publicData[0]));
    await denied(
      `update public.profiles set birth_date=current_date where id=$1`,
      [ids[0]],
    );
    const station = (await db.query("select id from public.resorts limit 1"))
      .rows[0].id;
    await denied(
      `select public.request_connection($1,$2,current_date+5,current_date+7)`,
      [ids[1], station],
    );
    await as(ids[1]);
    await db.query(
      "insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+5,current_date+7)",
      [ids[1], station],
    );
    await as(ids[0]);
    await denied(
      "insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+5,current_date+7)",
      [ids[1], station],
    );
    await denied(
      "insert into public.trips(user_id,resort_id,starts_on,ends_on) values($1,$2,current_date+8,current_date+7)",
      [ids[0], station],
    );
    const connection = (
      await db.query(
        "select public.request_connection($1,$2,current_date+6,current_date+8) as id",
        [ids[1], station],
      )
    ).rows[0].id;
    assert.equal(
      (await db.query("select * from public.trips where user_id=$1", [ids[0]]))
        .rows.length,
      0,
    );
    await denied(
      "insert into public.messages(connection_id,sender_id,body) values($1,$2,$3)",
      [connection, ids[0], "Before consent"],
    );
    await denied("select public.respond_connection($1,'accepted')", [
      connection,
    ]);
    await as(ids[2]);
    assert.equal(
      (await db.query("select * from public.connections")).rows.length,
      0,
    );
    await denied("select public.respond_connection($1,'accepted')", [
      connection,
    ]);
    await as(ids[1]);
    await db.query("select public.respond_connection($1,'accepted')", [
      connection,
    ]);
    await denied(
      "select public.request_connection($1,$2,current_date+6,current_date+8)",
      [ids[0], station],
    );
    await db.query(
      "insert into public.messages(connection_id,sender_id,body) values($1,$2,$3)",
      [connection, ids[1], "Nos vemos arriba"],
    );
    await as(ids[0]);
    assert.equal(
      (await db.query("select * from public.messages")).rows.length,
      1,
    );
    await denied(
      "insert into public.messages(connection_id,sender_id,body) values($1,$2,$3)",
      [connection, ids[1], "Spoofed sender"],
    );
    await as(ids[2]);
    assert.equal(
      (await db.query("select * from public.messages")).rows.length,
      0,
    );
    await denied(
      "insert into public.messages(connection_id,sender_id,body) values($1,$2,$3)",
      [connection, ids[2], "Unrelated member"],
    );
    await as(ids[0]);
    const plan = (
      await db.query(
        `insert into public.plans(resort_id,host_id,title,description,starts_on,ends_on,level,capacity) values($1,$2,'Un buen plan','Una mañana para compartir',current_date+5,current_date+7,'Todos',2) returning id`,
        [station, ids[0]],
      )
    ).rows[0].id;
    await denied(
      "insert into public.plan_members(plan_id,user_id) values($1,$2)",
      [plan, ids[0]],
    );
    await as(ids[1]);
    await denied(
      "insert into public.plan_members(plan_id,user_id,status) values($1,$2,'accepted')",
      [plan, ids[1]],
    );
    const m1 = (
      await db.query(
        "insert into public.plan_members(plan_id,user_id) values($1,$2) returning id",
        [plan, ids[1]],
      )
    ).rows[0].id;
    await denied("select public.respond_plan($1,'accepted')", [m1]);
    await as(ids[2]);
    const m2 = (
      await db.query(
        "insert into public.plan_members(plan_id,user_id) values($1,$2) returning id",
        [plan, ids[2]],
      )
    ).rows[0].id;
    assert.equal(
      (await db.query("select * from public.plan_members")).rows.length,
      1,
    );
    await as(ids[0]);
    assert.equal(
      (await db.query("select * from public.plan_members")).rows.length,
      2,
    );
    await db.query("select public.respond_plan($1,'accepted')", [m1]);
    await denied("select public.respond_plan($1,'accepted')", [m2]);
    await db.query("select public.respond_plan($1,'declined')", [m2]);
    await as(ids[1]);
    assert.equal(
      (
        await db.query("delete from public.plans where id=$1 returning id", [
          plan,
        ])
      ).rows.length,
      0,
    );
    await as(ids[0]);
    await db.query("delete from public.connections where id=$1", [connection]);
    await as(ids[1]);
    assert.equal(
      (await db.query("select * from public.messages")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
