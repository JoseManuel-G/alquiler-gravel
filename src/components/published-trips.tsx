"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Photo from "./photo";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";

type PublishedTrip = { id: string; user_id: string; resort_id: string; starts_on: string; ends_on: string; resorts: { name: string; slug: string } | null; person?: Person };
const pageSize = 12;
export function PublishedTrips({ userId }: { userId: string }) {
  const [station, setStation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [resorts, setResorts] = useState<{ id: string; name: string }[]>([]);
  const [trips, setTrips] = useState<PublishedTrip[]>([]);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  useEffect(() => {
    if (!supabase) return;
    void supabase.from("resorts").select("id,name").order("position").then(({ data }) => setResorts(data || []));
  }, []);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      setLoading(true); setError(""); setNotice("");
      if (from && to && to < from) { setError("La fecha final debe ser igual o posterior a la inicial."); setLoading(false); return; }
      const member = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
      if (!active) return;
      if (member.error || !member.data) { setError("Completa y guarda tu perfil para ver los viajes de otros miembros."); setLoading(false); return; }
      let query = supabase.from("trips").select("id,user_id,resort_id,starts_on,ends_on,resorts(name,slug)").neq("user_id", userId).gte("ends_on", new Date().toLocaleDateString("en-CA")).order("starts_on").order("id").range(page * pageSize, (page + 1) * pageSize);
      if (station) query = query.eq("resort_id", station);
      if (from) query = query.gte("ends_on", from);
      if (to) query = query.lte("starts_on", to);
      const { data, error } = await query;
      if (!active) return;
      if (error) { setError("No se pudieron cargar los viajes. Vuelve a intentarlo."); setLoading(false); return; }
      const rows = (data || []) as unknown as PublishedTrip[];
      const visible = rows.slice(0, pageSize);
      const ids = [...new Set(visible.map(t => t.user_id))];
      const profiles = ids.length ? await supabase.from("public_profiles").select("*").in("id", ids) : { data: [], error: null };
      if (!active) return;
      if (profiles.error) setError("No se pudieron cargar los perfiles de los viajeros.");
      else { setTrips(visible.map(t => ({ ...t, person: profiles.data?.find(p => p.id === t.user_id) as Person | undefined }))); setMore(rows.length > pageSize); }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [userId, station, from, to, page]);
  async function connect(t: PublishedTrip) {
    if (!supabase) return;
    setSending(t.id); setNotice("");
    const { data, error } = await supabase.from("trips").select("starts_on,ends_on").eq("user_id", userId).eq("resort_id", t.resort_id).lte("starts_on", t.ends_on).gte("ends_on", t.starts_on).limit(1);
    if (error || !data?.length) { setNotice("Para conectar, publica primero tu propio viaje a esa estación en fechas que coincidan. Usa «Voy en estas fechas» en la tarjeta."); setSending(""); return; }
    const result = await supabase.rpc("request_connection", { target_user: t.user_id, station: t.resort_id, date_from: [t.starts_on, data[0].starts_on, new Date().toLocaleDateString("en-CA")].sort().at(-1), date_to: [t.ends_on, data[0].ends_on].sort()[0] });
    setNotice(result.error ? result.error.message : "Solicitud enviada. Podréis conversar cuando la otra persona acepte en Comunidad → Conexiones.");
    if (!result.error) setSent(s => [...s, t.user_id]);
    setSending("");
  }
  return <section>
    <h2>Viajes publicados</h2>
    <p className="muted">Descubre próximas escapadas de otros miembros. No necesitas elegir fechas para explorar. Tus viajes están en «Mis viajes».</p>
    <div className="filters">
      <label className="field">Estación<select value={station} onChange={e => { setStation(e.target.value); setPage(0); }}><option value="">Todas las estaciones</option>{resorts.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className="field">Desde · opcional<input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(0); }} /></label>
      <label className="field">Hasta · opcional<input type="date" min={from} value={to} onChange={e => { setTo(e.target.value); setPage(0); }} /></label>
      <button className="button button-light" onClick={() => { setStation(""); setFrom(""); setTo(""); setPage(0); }}>Quitar filtros</button>
    </div>
    {notice && <p className="notice" role="status">{notice}</p>}
    {loading ? <p role="status">Cargando viajes publicados…</p> : error ? <p className="notice" role="alert">{error} <Link href="/cuenta">Mi perfil →</Link></p> : <>
      <div className="people-grid">{trips.map(t => <article className="person-card" key={t.id}>
        {t.person?.avatar_url && <Photo src={t.person.avatar_url} width={64} height={64} className="profile-photo" alt={`Foto de ${t.person.name}`} />}
        <h3>{t.resorts?.name || "Estación"}</h3>
        <p><strong>{t.person?.name || "Miembro"}{t.person ? `, ${t.person.age}` : ""}</strong></p>
        <p>{new Date(t.starts_on + "T12:00:00").toLocaleDateString("es-ES")} → {new Date(t.ends_on + "T12:00:00").toLocaleDateString("es-ES")}</p>
        {t.person && <><div className="chips"><span>{t.person.level}</span><span>{t.person.sport}</span></div><details><summary>Ver perfil</summary><p>{t.person.bio || "Sin biografía todavía."}</p><p>{t.person.preferences}</p></details></>}
        <div className="inline-actions"><button disabled={!!sending || sent.includes(t.user_id)} className="button button-coral" onClick={() => void connect(t)}>{sent.includes(t.user_id) ? "Solicitud enviada" : sending === t.id ? "Enviando…" : "Solicitar conexión"}</button>{t.resorts && <Link className="button button-light" href={`/estaciones/${t.resorts.slug}?action=publish&from=${t.starts_on}&to=${t.ends_on}#companeros`}>Voy en estas fechas</Link>}</div>
      </article>)}</div>
      {!trips.length && <div className="empty-state"><h3>{page ? "No hay más viajes." : "Todavía no hay viajes para mostrar."}</h3><p>Prueba otras fechas o estaciones, o publica tu próxima escapada.</p><Link href="/?action=publish#estaciones" className="button button-dark">Publicar mi viaje</Link></div>}
      <div className="inline-actions" style={{ marginTop: 24 }}><button disabled={!page} className="button button-light" onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1}</span><button disabled={!more} className="button button-light" onClick={() => setPage(p => p + 1)}>Siguiente</button></div>
    </>}
  </section>;
}
