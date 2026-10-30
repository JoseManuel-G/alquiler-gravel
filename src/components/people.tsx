"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Photo from "./photo";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";

const pageSize = 12;
export function People({ userId, onTrips }: { userId: string; onTrips: (person: Person) => void }) {
  const [level, setLevel] = useState("");
  const [sport, setSport] = useState("");
  const [page, setPage] = useState(0);
  const [people, setPeople] = useState<Person[]>([]);
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
        let query = supabase.from("public_profiles").select("*").neq("id", userId).order("name").order("id").range(page * pageSize, (page + 1) * pageSize);
        if (level) query = query.eq("level", level);
        if (sport) query = query.eq("sport", sport);
        const { data, error } = await query;
        if (error) throw new Error("No se pudieron cargar los miembros. Vuelve a intentarlo.");
        if (active) { setPeople((data || []).slice(0, pageSize) as Person[]); setMore((data || []).length > pageSize); }
      } catch (error) { if (active) setError(error instanceof Error ? error.message : "No se pudieron cargar los miembros."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [userId, level, sport, page, retry]);
  return <section>
    <h2>Personas de la comunidad</h2>
    <p className="muted">Conoce a otros miembros aunque todavía no tengan un viaje publicado. Para aparecer aquí, basta con completar y guardar el perfil.</p>
    <div className="filters">
      <label className="field">Nivel<select value={level} onChange={e => { setLevel(e.target.value); setPage(0); }}><option value="">Todos los niveles</option>{["Principiante", "Intermedio", "Avanzado", "Experto"].map(l => <option key={l}>{l}</option>)}</select></label>
      <label className="field">Modalidad<select value={sport} onChange={e => { setSport(e.target.value); setPage(0); }}><option value="">Todas las modalidades</option>{["Esquí", "Snowboard", "Ambas"].map(s => <option key={s}>{s}</option>)}</select></label>
      <button className="button button-light" onClick={() => { setLevel(""); setSport(""); setPage(0); }}>Quitar filtros</button>
    </div>
    {loading ? <p role="status">Cargando personas…</p> : error ? <div className="notice" role="alert"><p>{error}</p><Link href="/cuenta" className="text-button">Ir a mi perfil</Link><button className="text-button" onClick={() => setRetry(r => r + 1)}>Reintentar</button></div> : <>
      <div className="people-grid">{people.map(p => <article className="person-card" key={p.id}>
        {p.avatar_url ? <Photo key={p.avatar_url} src={p.avatar_url} width={96} height={96} alt={`Foto de ${p.name}`} className="member-portrait" /> : <div className="photo-placeholder" aria-label="Sin foto">{p.name.charAt(0).toUpperCase()}</div>}
        <h3>{p.name}, {p.age}</h3><div className="chips"><span>{p.level}</span><span>{p.sport}</span></div>
        <p>{p.bio || "Todavía no ha añadido una presentación."}</p>{p.preferences && <p><strong>Le gusta:</strong> {p.preferences}</p>}
        <button className="button button-dark" onClick={() => onTrips(p)}>Ver sus viajes</button>
      </article>)}</div>
      {!people.length && <div className="empty-state"><h3>{page ? "No hay más personas." : "No hay otros miembros que mostrar."}</h3><p>{level || sport ? "Prueba a quitar los filtros." : "Los demás aparecerán cuando completen y guarden su perfil, sin necesidad de publicar un viaje."}</p></div>}
      <div className="inline-actions" style={{ marginTop: 24 }}><button className="button button-light" disabled={!page} onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1}</span><button className="button button-light" disabled={!more} onClick={() => setPage(p => p + 1)}>Siguiente</button></div>
    </>}
    <p className="muted">Abre sus viajes y pulsa «Me interesa». No necesitas publicar un viaje propio. El chat se habilita cuando la otra persona acepta.</p>
  </section>;
}
