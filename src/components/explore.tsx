"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowLeft, CalendarDays, MountainSnow, Utensils, Music2, Footprints } from "lucide-react";
import { useApp } from "./app-context";
import { DestinationSelector } from "./destination-selector";
import Photo from "./photo";
import { destinationImage } from "@/lib/resorts";
import { madridDayBoundary } from "@/lib/travel-selection";
import { supabase } from "@/lib/supabase";
import { LEISURE_CATEGORIES, OFFICIAL_SOURCES, type LeisureCategory, type LeisureItem } from "@/lib/leisure-sources";
const icons = { restaurant: Utensils, apres: Music2, event: CalendarDays, activity: Footprints };
export function Explore() {
 const app = useApp(); const resort = app.resorts.find(r => r.slug === app.selection.slug);
 const source = resort && OFFICIAL_SOURCES[resort.slug];
 function chooseStation(slug: string) {
  app.select({...app.selection,slug});
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set("destino",slug); else url.searchParams.delete("destino");
  window.history.pushState({...window.history.state,skimatchDestination:true},"",url);
  setCategory("restaurant");
 }
 function backToStations() {
  app.select({...app.selection,slug:""});
  const url = new URL(window.location.href); url.searchParams.delete("destino");
  window.history.replaceState({...window.history.state},"",url);
  setCategory("restaurant");
  window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
 }
 useEffect(() => {
  const restore = () => {
   if (window.location.pathname !== "/") return;
   const slug = new URLSearchParams(window.location.search).get("destino") || "";
   if (!slug || app.resorts.some(r => r.slug === slug)) app.select({...app.selection,slug});
  };
  const slug = new URLSearchParams(window.location.search).get("destino");
  let initial: ReturnType<typeof setTimeout> | undefined;
  if(slug && app.resorts.some(r => r.slug === slug) && app.selection.slug !== slug) initial=setTimeout(restore,0);
  window.addEventListener("popstate",restore);
  return () => { clearTimeout(initial); window.removeEventListener("popstate",restore); };
 },[app]);
 const [category, setCategory] = useState<LeisureCategory>("restaurant");
 const [items, setItems] = useState<LeisureItem[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
 useEffect(() => {
   let active = true;
   async function load() {
    if (!supabase || !resort) return;
    setLoading(true); setError("");
    let query = supabase.from("leisure_items").select("*").eq("resort_id", resort.id).eq("category",category).eq("status","active").gt("expires_at",new Date().toISOString()).order("starts_at", { nullsFirst: false }).order("name").limit(36);
    if ((category === "event" || category === "apres") && app.selection.from) query = query.or(`ends_at.is.null,ends_at.gte.${madridDayBoundary(app.selection.from)}`);
    if ((category === "event" || category === "apres") && app.selection.to) query = query.or(`starts_at.is.null,starts_at.lte.${madridDayBoundary(app.selection.to,true)}`);
    const { data, error } = await query;
    if (active) { setItems((data || []) as LeisureItem[]); setError(error ? "La selección de lugares se está preparando. Puedes consultar las fuentes oficiales de abajo." : ""); setLoading(false); }
   }
   void load(); return () => { active=false; };
 }, [resort, category, app.selection.from, app.selection.to]);
 return <main className="sm-explore"><section className="sm-launch"><div className="container sm-intro"><div className="sm-hero-copy">{resort ? <button type="button" className="sm-back-stations" onClick={backToStations}><ArrowLeft size={17}/> Todas las estaciones</button> : <p className="kicker">FUERA DE LA RUTINA. DENTRO DE LA MONTAÑA.</p>}<h1>{resort ? <>Tu plan en<br/><em>{resort.name}.</em></> : <>¿Dónde vas<br/>a <em>esquiar?</em></>}</h1><p>{resort ? "Pistas, buenos planes y gente con tus mismas ganas." : "Elige destino. Encuentra tu gente. Comparte la bajada."}</p><span className="sm-sport-label"><MountainSnow size={17}/> ESQUÍ · SNOWBOARD · BUENA COMPAÑÍA</span></div><div className="sm-hero-visual">{(resort || app.resorts[0]) && <Photo key={(resort || app.resorts[0]).id} src={destinationImage(resort || app.resorts[0])} fill sizes="(max-width: 700px) 100vw, 50vw" alt="Paisaje alpino ilustrativo" priority/>}<span className="sm-hero-stamp">NOS VEMOS<br/>ARRIBA ↗</span><small>Paisaje ilustrativo de montaña</small></div><DestinationSelector prominent onDestinationChange={chooseStation}/></div></section>

 {!resort ? <section className="container sm-destination-grid" aria-label="Elige estación"><div className="sm-destinations-title"><p className="kicker">EL PUNTO DE PARTIDA</p><h2>Elige tu terreno<span>.</span></h2><p>Tu destino, tu gente y un buen plan.</p></div>{app.resorts.map((r,i) => <button key={r.id} className="sm-destination-card" onClick={() => chooseStation(r.slug)}><Photo src={destinationImage(r)} fill sizes="(max-width: 700px) 100vw, 33vw" alt={`Paisaje alpino ilustrativo para ${r.name}`}/><span className="sm-destination-number">0{i+1}</span><span className="sm-destination-name"><small>{r.region}</small><strong>{r.name}</strong><span>Explorar destino <ArrowUpRight size={18}/></span></span></button>)}<p className="sm-photo-caption">Paisajes de montaña ilustrativos; no fotografías verificadas de cada estación.</p></section> : <>
 <section className="container sm-guide"><div className="sm-section-heading"><div><p className="kicker">MÁS ALLÁ DE LAS PISTAS</p><h2>Qué hacer en {resort.name}</h2><p className="muted">{source?.places}</p></div><Link href="/viajes" className="text-button">¿Quién va por allí? →</Link></div>
 <nav className="sm-category-nav" aria-label="Categorías de ocio">{LEISURE_CATEGORIES.map(c => { const Icon=icons[c.id];return <button key={c.id} aria-pressed={category===c.id} onClick={() => setCategory(c.id)}><Icon size={20}/>{c.label}</button>; })}</nav>
 {loading ? <div className="sm-skeletons" role="status" aria-label="Cargando lugares"><span/><span/><span/></div> : <>
 {items.length ? <div className="sm-leisure-grid">{items.map(item => <article key={item.id} className="sm-leisure-card">{item.image_url && item.image_license ? <Photo src={item.image_url} width={600} height={360} alt={item.name}/> : <div className="sm-place-illustration">{(() => {const Icon=icons[category];return <Icon size={38}/>;})()}<small>{item.subtype || LEISURE_CATEGORIES.find(c=>c.id===category)?.label}</small></div>}<div><small className="kicker">{item.location}</small><h3>{item.name}</h3><p>{item.description}</p>{item.starts_at && <p><CalendarDays size={15}/> {new Date(item.starts_at).toLocaleString("es-ES",{timeZone:"Europe/Madrid",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p>}{category === "activity" && <><p>{[item.distance_km != null && `${item.distance_km} km`, item.elevation_m != null && `${item.elevation_m} m de desnivel`,item.difficulty].filter(Boolean).join(" · ")}</p><p className="sm-safety">{item.winter_status === "summer" ? "Ruta de verano. No se presenta como apta para invierno." : "Comprueba meteorología, nieve y riesgo de aludes. La ficha no garantiza condiciones seguras."}</p></>}<div className="inline-actions">{item.website_url && <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="text-button">Web oficial ↗</a>}<a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-button">Ver fuente <ArrowUpRight size={15}/></a>{item.booking_url && <a href={item.booking_url} target="_blank" rel="noopener noreferrer" className="text-button">Reservar ↗</a>}</div><small className="sm-verification">{item.source_name.includes("OpenStreetMap") ? <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">{item.source_name}</a> : item.source_name} · Revisado {new Date(item.verified_at).toLocaleDateString("es-ES")}{item.image_license && <span> · Imagen: {item.image_license}</span>}</small></div></article>)}</div> : <div className="sm-guide-empty"><h3>{category === "event" ? "Sin eventos verificados para estas fechas" : "Estamos preparando esta selección"}</h3><p>{error || "Solo mostramos información con fuente. Mientras ampliamos la guía, descubre la oferta en los portales oficiales."}</p></div>}
 {source && <div className="sm-official-links"><div><p className="kicker">DIRECTO A LA FUENTE</p><h3>{category === "event" ? "Consulta la agenda oficial" : "Descubre la oferta del destino"}</h3><p>Horarios, disponibilidad y novedades en {source.name}.</p></div><a className="button button-light" href={category === "event" || category === "apres" ? source.agenda : source.url} target="_blank" rel="noopener noreferrer">Abrir web oficial <ArrowUpRight size={16}/></a></div>}
 {category === "activity" && source && <p className="sm-safety">En montaña, consulta el tiempo, el estado de la nieve y el boletín de aludes antes de salir. Una ruta de verano no implica que sea segura en invierno. <a href={source.safety} target="_blank" rel="noopener noreferrer">Consultar condiciones oficiales ↗</a></p>}
 </>}
 </section><section className="container sm-social-invite"><div><p className="kicker">EL PLAN MEJORA EN COMPAÑÍA</p><h2>Una estación.<br/>Muchas formas de coincidir.</h2><p>Descubre quién va o publica tu próxima escapada.</p></div><div><Link className="button button-dark" href="/viajes">Ver viajes →</Link><Link className="button button-light" href="/personas">Conocer personas →</Link></div></section>
 </>}
 </main>;
}
