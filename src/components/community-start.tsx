"use client";
import Link from "next/link";
import { CalendarDays, Plus, Users, UserRound, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export function CommunityStart() {
  return <section className="container community-start">
    <p className="kicker">NOS VEMOS ARRIBA</p><h1>¿Qué te apetece hacer?</h1>
    <p className="muted">Encuentra gente para compartir la montaña.</p>
    <div className="start-grid">
      <Link href="/comunidad?view=publicados" className="start-card"><CalendarDays size={32} /><h2>Ver viajes</h2><p>Descubre escapadas y conecta si te interesan.</p><span>Explorar viajes →</span></Link>
      <Link href="/comunidad?view=publicar" className="start-card"><Plus size={32} /><h2>Publicar un viaje</h2><p>Propón una escapada y encuentra compañía.</p><span>Crear mi viaje →</span></Link>
      <Link href="/comunidad?view=personas" className="start-card"><Users size={32} /><h2>Ver personas</h2><p>Conoce a la gente de la comunidad.</p><span>Conocer personas →</span></Link>
      <Link href="/cuenta" className="start-card"><UserRound size={32} /><h2>Mi perfil</h2><p>Tu foto, tu nivel y lo que te gusta.</p><span>Ver mi perfil →</span></Link>
    </div>
    <Link className="text-button" href="/comunidad?view=conexiones"><MessagesSquare size={18} />Mis conexiones y mensajes</Link>
  </section>;
}
export function PublishDestination() {
  const [resorts, setResorts] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.from("resorts").select("id,name,slug").order("position").then(({ data, error }) => { if (active) { setResorts(data || []); setError(!!error); setLoaded(true); } });
    return () => { active = false; };
  }, []);
  return <section><h2>¿Dónde quieres ir?</h2><p className="muted">Elige estación. Después solo tendrás que indicar tus fechas y publicar.</p>{!loaded ? <p role="status">Cargando estaciones…</p> : error ? <p role="alert">No se pudieron cargar las estaciones. Recarga para intentarlo de nuevo.</p> : <div className="start-grid">{resorts.map(r => <Link key={r.id} className="start-card" href={`/estaciones/${r.slug}?action=publish#companeros`}><CalendarDays size={28} /><h3>{r.name}</h3><span>Elegir fechas →</span></Link>)}</div>}</section>;
}

export function HomeGate({ children, choosingDestination }: { children: React.ReactNode; choosingDestination: boolean }) {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(!supabase);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.auth.getUser().then(({ data }) => { if (active) { setSignedIn(!!data.user); setReady(true); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setSignedIn(!!session); setReady(true); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  if (choosingDestination) return children;
  if (!ready) return <main className="container community-start"><p role="status">Cargando…</p></main>;
  return signedIn ? <main><CommunityStart /></main> : children;
}
