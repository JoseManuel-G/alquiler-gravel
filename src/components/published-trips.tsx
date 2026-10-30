"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonGallery } from "./photo-album";
import Photo from "./photo";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";

type PublishedTrip = { id: string; user_id: string; resort_id: string; starts_on: string; ends_on: string; traveling_with?: string; party_size?: number; looking_for?: string; resorts: { name: string; slug: string; image: string } | null; person?: Person };
const pageSize = 12;
export function PublishedTrips({ userId, traveler, onClearTraveler, onManage, onConnections, onChat }: { onChat: (personId: string) => void; userId: string; onManage: () => void; onConnections: () => void; traveler?: { id: string; name: string } | null; onClearTraveler?: () => void }) {
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
  const [connected, setConnected] = useState<string[]>([]);
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
      let query = supabase.from("trips").select("*,resorts(name,slug,image)").gte("ends_on", new Date().toLocaleDateString("en-CA")).order("starts_on").order("id").range(page * pageSize, (page + 1) * pageSize);
      if (traveler) query = query.eq("user_id", traveler.id);
      if (station) query = query.eq("resort_id", station);
      if (from) query = query.gte("ends_on", from);
      if (to) query = query.lte("starts_on", to);
      const { data, error } = await query;
      if (!active) return;
      if (error) { setError("No se pudieron cargar los viajes. Vuelve a intentarlo."); setLoading(false); return; }
      const connections = await supabase.from("connections").select("requester_id,recipient_id,status").or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
      if (!active) return;
      setSent((connections.data || []).filter(c => c.status !== "accepted").map(c => c.requester_id === userId ? c.recipient_id : c.requester_id));
      setConnected((connections.data || []).filter(c => c.status === "accepted").map(c => c.requester_id === userId ? c.recipient_id : c.requester_id));
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
  }, [userId, station, from, to, page, traveler]);
  async function connect(t: PublishedTrip) {
    if (!supabase) return;
    setSending(t.id); setNotice("");
    try {
      const result = await supabase.rpc("request_trip_connection", { trip: t.id });
      if (result.error) {
        setNotice(result.error.code === "PGRST202" ? "Falta activar las conexiones simplificadas en Supabase. Ejecuta simple-connections.sql en el proyecto de SKI MATCH." : result.error.message);
      } else {
        setNotice("¡Solicitud enviada! Cuando acepte, podréis hablar por chat. No se ha publicado ningún viaje en tu nombre.");
        setSent(s => [...s, t.user_id]);
      }
    } catch { setNotice("No se pudo enviar la solicitud. Vuelve a intentarlo."); }
    setSending("");
  }
  return <section>
    <h2>{traveler ? `Viajes de ${traveler.name}` : "Encuentra tu próxima escapada"}</h2>
    {traveler && <button className="text-button" onClick={() => { setPage(0); onClearTraveler?.(); }}>Ver viajes de todos los miembros →</button>}
    <p className="muted">Ve un viaje que te guste y pulsa «Me interesa». Si la otra persona acepta, podéis hablar. No necesitas publicar un viaje propio.</p>
    <details className="trip-filter-panel"><summary>Filtrar por estación o fechas</summary><div className="filters">
      <label className="field">Estación<select value={station} onChange={e => { setStation(e.target.value); setPage(0); }}><option value="">Todas las estaciones</option>{resorts.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className="field">Desde · opcional<input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(0); }} /></label>
      <label className="field">Hasta · opcional<input type="date" min={from} value={to} onChange={e => { setTo(e.target.value); setPage(0); }} /></label>
      <button className="button button-light" onClick={() => { setStation(""); setFrom(""); setTo(""); setPage(0); onClearTraveler?.(); }}>Quitar filtros</button>
    </div></details>
    {notice && <div className="notice" role="status"><p>{notice}</p><button className="text-button" onClick={onConnections}>Ver conexiones y solicitudes →</button></div>}
    {loading ? <p role="status">Cargando viajes publicados…</p> : error ? <p className="notice" role="alert">{error} <Link href="/cuenta">Mi perfil →</Link></p> : <>
      <div className="people-grid travel-feed">{trips.map(t => <article className="person-card travel-card" key={t.id}>
        <div className="travel-cover"><PersonGallery userId={t.user_id} avatar={t.person?.avatar_url} name={t.person?.name || "Miembro"} fallback={<>{t.resorts?.image && <Photo src={t.resorts.image} fill sizes="(max-width: 700px) 100vw, 33vw" alt={`Paisaje ilustrativo de montaña para el viaje a ${t.resorts.name}`} />}</>} /><span className="travel-destination">{t.resorts?.name || "Estación"}</span></div>
        <div className="travel-body">
          <div className="travel-person">{t.person?.avatar_url ? <Photo key={t.person.avatar_url} src={t.person.avatar_url} width={88} height={88} className="profile-photo" alt={`Foto de ${t.person.name}`} /> : <div className="photo-placeholder">{t.person?.name.charAt(0).toUpperCase() || "?"}</div>}<div><h3>{t.person?.name || "Miembro"}{t.person ? `, ${t.person.age}` : ""}</h3><span>{t.user_id === userId ? "Tu viaje" : "Busca compañía para esquiar"}</span></div></div>
          <p className="travel-dates">{new Date(t.starts_on + "T12:00:00").toLocaleDateString("es-ES")} → {new Date(t.ends_on + "T12:00:00").toLocaleDateString("es-ES")}</p>
          <div className="chips"><span>{t.traveling_with || "Solo/a"}{(t.party_size || 1) > 1 ? ` · ${t.party_size} personas` : ""}</span></div>
          {t.looking_for && <p className="trip-looking-for"><strong>Buscamos:</strong> {t.looking_for}</p>}
          {t.person && <><div className="chips"><span>{t.person.level}</span><span>{t.person.sport}</span></div><p>{t.person.bio || "Unos días de montaña, mejor en compañía."}</p><details><summary>Más sobre {t.person.name}</summary><p>{t.person.preferences || "Todavía no ha indicado preferencias."}</p></details></>}
          {t.user_id === userId ? <button className="button button-light" onClick={onManage}>Gestionar mi viaje</button> : connected.includes(t.user_id) ? <button className="button button-dark" onClick={() => onChat(t.user_id)}>Abrir chat</button> : sent.includes(t.user_id) ? <button className="button button-light" onClick={onConnections}>Ver solicitud</button> : <button disabled={!!sending} className="button button-coral" onClick={() => void connect(t)}>{sending === t.id ? "Enviando…" : "Me interesa · Conectar"}</button>}
          {t.resorts && <small>Las fotos personales las sube cada miembro. Si no tiene fotos, se muestra un paisaje ilustrativo.</small>}
        </div>
      </article>)}</div>
      {!trips.length && <div className="empty-state"><h3>{page ? "No hay más viajes." : traveler ? "Esta persona todavía no tiene viajes para mostrar con estos filtros." : "Todavía no hay viajes para mostrar."}</h3><p>Prueba otras fechas o estaciones, o publica tu próxima escapada.</p><Link href="/?action=publish#estaciones" className="button button-dark">Publicar mi viaje</Link></div>}
      <div className="inline-actions" style={{ marginTop: 24 }}><button disabled={!page} className="button button-light" onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1}</span><button disabled={!more} className="button button-light" onClick={() => setPage(p => p + 1)}>Siguiente</button></div>
    </>}
  </section>;
}
