"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonGallery } from "./photo-album";
import Photo from "./photo";
import { useApp } from "./app-context";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";

type PublishedTrip = { id: string; user_id: string; resort_id: string; starts_on: string; ends_on: string; traveling_with?: string; party_size?: number; looking_for?: string; resorts: { name: string; slug: string; image: string } | null; person?: Person };
const pageSize = 12;
export function PublishedTrips({ userId, traveler, onClearTraveler, onConnections, onChat, initialMine = false }: { initialMine?: boolean; onChat: (personId: string) => void; userId: string; onManage: () => void; onConnections: () => void; traveler?: { id: string; name: string } | null; onClearTraveler?: () => void }) {
  const app = useApp();
  const station = app.resorts.find(r => r.slug === app.selection.slug)?.id || "";
  const { from, to } = app.selection;
  const [scope, setScope] = useState(initialMine ? "mine" : "all");
  const [actionMessage, setActionMessage] = useState("");
  const [page, setPage] = useState(0);

  const [trips, setTrips] = useState<PublishedTrip[]>([]);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
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
      if (scope === "mine") query = query.eq("user_id", userId);
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
  }, [userId, station, from, to, page, traveler, scope, app.revision]);
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
    <h2>{traveler ? `Viajes de ${traveler.name}` : "Viajes que se cruzan con el tuyo"}</h2>
    {traveler && <button className="text-button" onClick={() => { setPage(0); onClearTraveler?.(); }}>Ver viajes de todos los miembros →</button>}
    <p className="muted">Ve un viaje que te guste y pulsa «Me interesa». Si la otra persona acepta, podéis hablar. No necesitas publicar un viaje propio.</p>
    <div className="sm-filter-row"><div className="sm-segment"><button aria-pressed={scope === "all"} onClick={() => { setScope("all"); setPage(0); }}>Todos los viajes</button><button aria-pressed={scope === "mine"} onClick={() => { setScope("mine"); setPage(0); }}>Los míos</button></div><button className="text-button" onClick={() => app.publish()}>+ Publicar viaje</button></div>
    {actionMessage && <p className="notice" role="status">{actionMessage}</p>}
    {notice && <div className="notice" role="status"><p>{notice}</p><button className="text-button" onClick={onConnections}>Ver conexiones y solicitudes →</button></div>}
    {loading ? <p role="status">Cargando viajes publicados…</p> : error ? <p className="notice" role="alert">{error} <Link href="/cuenta">Mi perfil →</Link></p> : <>
      <div className="people-grid travel-feed">{trips.map(t => <article className="person-card travel-card" key={t.id}>
        <div className="travel-cover"><PersonGallery userId={t.user_id} avatar={t.person?.avatar_url} name={t.person?.name || "Miembro"} fallback={<>{t.resorts?.image && <Photo src={t.resorts.image} fill sizes="(max-width: 700px) 100vw, 33vw" alt={`Paisaje ilustrativo de montaña para el viaje a ${t.resorts.name}`} />}</>} /><span className="travel-destination">{t.resorts?.name || "Estación"}</span></div>
        <div className="travel-body">
          <div className="travel-person">{t.person?.avatar_url ? <Photo key={t.person.avatar_url} src={t.person.avatar_url} width={88} height={88} className="profile-photo" alt={`Foto de ${t.person.name}`} /> : <div className="photo-placeholder">{t.person?.name.charAt(0).toUpperCase() || "?"}</div>}<div><h3>{t.person?.name || "Miembro"}{t.person ? `, ${t.person.age}` : ""}</h3><span>{t.user_id === userId ? "Tu viaje" : "Busca compañía para esquiar"}</span></div></div>
          <p className="travel-dates">{new Date(t.starts_on + "T12:00:00").toLocaleDateString("es-ES")} → {new Date(t.ends_on + "T12:00:00").toLocaleDateString("es-ES")}</p>
          <div className="chips"><span>{t.traveling_with || "Solo/a"}{(t.party_size || 1) > 1 ? ` · ${t.party_size} personas` : ""}</span></div>
          {t.looking_for && <p className="trip-looking-for"><strong>Buscamos:</strong> {t.looking_for}</p>}
          {t.person && <><div className="chips"><span>{t.person.level}</span><span>{t.person.sport}</span></div><p>{t.person.bio || "Unos días de montaña, mejor en compañía."}</p><details><summary>Ver viaje y perfil de {t.person.name}</summary><p>{t.person.preferences || "Todavía no ha indicado preferencias."}</p></details></>}
          {t.user_id === userId ? <div className="inline-actions"><button className="button button-light" onClick={() => app.publish(t)}>Editar mi viaje</button><button className="text-button" onClick={async () => { if (!supabase || !window.confirm("¿Eliminar este viaje?")) return; const { error } = await supabase.from("trips").delete().eq("id", t.id).eq("user_id", userId); if (error) setActionMessage("No se pudo eliminar el viaje."); else { setTrips(rows => rows.filter(row => row.id !== t.id)); setActionMessage("Viaje eliminado."); } }}>Eliminar</button></div> : connected.includes(t.user_id) ? <button className="button button-dark" onClick={() => onChat(t.user_id)}>Abrir chat</button> : sent.includes(t.user_id) ? <button className="button button-light" onClick={onConnections}>Ver solicitud</button> : <button disabled={!!sending} className="button button-coral" onClick={() => void connect(t)}>{sending === t.id ? "Enviando…" : "Me interesa · Conectar"}</button>}
          {t.resorts && <small>Las fotos personales las sube cada miembro. Si no tiene fotos, se muestra un paisaje ilustrativo.</small>}
        </div>
      </article>)}</div>
      {!trips.length && <div className="empty-state"><h3>{page ? "No hay más viajes." : traveler ? "Esta persona todavía no tiene viajes para mostrar con estos filtros." : "Todavía no hay viajes para mostrar."}</h3><p>Prueba otras fechas o estaciones, o publica tu próxima escapada.</p><button onClick={() => app.publish()} className="button button-dark">Publicar mi viaje</button></div>}
      <div className="inline-actions" style={{ marginTop: 24 }}><button disabled={!page} className="button button-light" onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1}</span><button disabled={!more} className="button button-light" onClick={() => setPage(p => p + 1)}>Siguiente</button></div>
    </>}
  </section>;
}
