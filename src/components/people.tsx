"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonGallery } from "./photo-album";
import { useApp } from "./app-context";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";

type TravelingPerson = Person & { trip_id?: string; resort_name?: string; resort_slug?: string; starts_on?: string; ends_on?: string };
const pageSize = 12;
export function People({ userId, onTrips }: { userId: string; onTrips: (person: Person) => void }) {
  const app = useApp();
  const [connecting, setConnecting] = useState("");
  const [notice, setNotice] = useState("");
  const [level, setLevel] = useState("");
  const [sport, setSport] = useState("");
  const [page, setPage] = useState(0);
  const [people, setPeople] = useState<TravelingPerson[]>([]);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      setLoading(true); setError("");
      try {
        const member = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
        if (member.error) throw new Error("No se pudo comprobar tu perfil. Vuelve a intentarlo.");
        if (!member.data) throw new Error("Completa y guarda tu perfil para conocer a los demás miembros.");
        let { data, error } = await supabase.rpc("discover_people", { station: app.resorts.find(r => r.slug === app.selection.slug)?.id || null, date_from: app.selection.from || null, date_to: app.selection.to || null, skill: level || null, discipline: sport || null, page_offset: page * pageSize, page_size: pageSize + 1 });
        if (error?.code === "PGRST202") {
          // Backward-compatible read path until the additive discovery migration is applied.
          const stationId = app.resorts.find(r => r.slug === app.selection.slug)?.id;
          const matching: { user_id: string; id: string; starts_on: string; ends_on: string; resort_id: string }[] = [];
          if (stationId || app.selection.from || app.selection.to) {
            for (let offset = 0; ; offset += 500) {
              let tq = supabase.from("trips").select("id,user_id,starts_on,ends_on,resort_id").gte("ends_on", new Date().toLocaleDateString("en-CA")).order("id").range(offset, offset + 499);
              if (stationId) tq = tq.eq("resort_id", stationId);
              if (app.selection.from) tq = tq.gte("ends_on", app.selection.from);
              if (app.selection.to) tq = tq.lte("starts_on", app.selection.to);
              const result = await tq;
              if (result.error) throw result.error;
              matching.push(...(result.data || []));
              if ((result.data || []).length < 500) break;
            }
          }
          if ((stationId || app.selection.from || app.selection.to) && !matching.length) { data = []; error = null; }
          else {
            let pq = supabase.from("public_profiles").select("*").neq("id", userId).order("name").order("id").range(page * pageSize, (page + 1) * pageSize);
            if (matching.length) pq = pq.in("id", [...new Set(matching.map(t => t.user_id))]);
            if (level) pq = pq.eq("level", level);
            if (sport) pq = pq.eq("sport", sport);
            const result = await pq;
            error = result.error;
            data = (result.data || []).map(p => { const t = matching.find(t => t.user_id === p.id); const r = app.resorts.find(r => r.id === t?.resort_id); return { ...p, trip_id: t?.id, starts_on: t?.starts_on, ends_on: t?.ends_on, resort_name: r?.name }; });
          }
        }
        if (error) throw new Error(error.code === "PGRST202" ? "Falta activar el filtro por destino en Supabase (discovery.sql)." : "No se pudieron cargar los miembros. Vuelve a intentarlo.");
        if (active) { setPeople((data || []).slice(0, pageSize) as TravelingPerson[]); setMore((data || []).length > pageSize); }
      } catch (error) { if (active) setError(error instanceof Error ? error.message : "No se pudieron cargar los miembros."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [userId, level, sport, page, retry, app.selection, app.resorts]);
  return <section>
    <h2>Personas de la comunidad</h2>
    <p className="muted">Descubre quién estará en tu destino. Usamos la estación y las fechas que ya has elegido.</p>
    <div className="filters">
      <label className="field">Nivel<select value={level} onChange={e => { setLevel(e.target.value); setPage(0); }}><option value="">Todos los niveles</option>{["Principiante", "Intermedio", "Avanzado", "Experto"].map(l => <option key={l}>{l}</option>)}</select></label>
      <label className="field">Modalidad<select value={sport} onChange={e => { setSport(e.target.value); setPage(0); }}><option value="">Todas las modalidades</option>{["Esquí", "Snowboard", "Ambas"].map(s => <option key={s}>{s}</option>)}</select></label>
      <button className="button button-light" onClick={() => { setLevel(""); setSport(""); setPage(0); }}>Quitar filtros</button>
    </div>
    {notice && <p className="notice" role="status">{notice} <button className="text-button" onClick={() => app.social("conexiones")}>Ver solicitudes →</button></p>}
    {loading ? <p role="status">Cargando personas…</p> : error ? <div className="notice" role="alert"><p>{error}</p><Link href="/cuenta" className="text-button">Ir a mi perfil</Link><button className="text-button" onClick={() => setRetry(r => r + 1)}>Reintentar</button></div> : <>
      <div className="people-grid">{people.map(p => <article className="person-card" key={p.id}>
        <PersonGallery userId={p.id} avatar={p.avatar_url} name={p.name} />
        <h3>{p.name}, {p.age}</h3><div className="chips"><span>{p.level}</span><span>{p.sport}</span></div>
        <p>{p.bio || "Todavía no ha añadido una presentación."}</p>{p.preferences && <p><strong>Le gusta:</strong> {p.preferences}</p>}
        {p.resort_name && <p><strong>{p.resort_name}</strong><br/>{p.starts_on} → {p.ends_on}</p>}
        <div className="inline-actions">{p.trip_id && <button className="button button-coral" disabled={!!connecting} onClick={async () => { if (!supabase) return; setConnecting(p.id); const result = await supabase.rpc("request_trip_connection", { trip: p.trip_id }); setNotice(result.error ? result.error.message : "Solicitud enviada. Si acepta, podréis hablar."); setConnecting(""); }}>{connecting === p.id ? "Enviando…" : "Conectar"}</button>}<button className="button button-light" onClick={() => onTrips(p)}>Ver sus viajes</button></div>
      </article>)}</div>
      {!people.length && <div className="empty-state"><h3>{page ? "No hay más personas." : "No hay otros miembros que mostrar."}</h3><p>{level || sport ? "Prueba a quitar los filtros." : "Los demás aparecerán cuando completen y guarden su perfil, sin necesidad de publicar un viaje."}</p></div>}
      <div className="inline-actions" style={{ marginTop: 24 }}><button className="button button-light" disabled={!page} onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1}</span><button className="button button-light" disabled={!more} onClick={() => setPage(p => p + 1)}>Siguiente</button></div>
    </>}
    <p className="muted">Abre sus viajes y pulsa «Me interesa». No necesitas publicar un viaje propio. El chat se habilita cuando la otra persona acepta.</p>
  </section>;
}
