"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, HeartHandshake, CalendarDays, X } from "lucide-react";
import { PersonGallery } from "./photo-album";
import { useApp } from "./app-context";
import { ConnectionPrompt, useConnectionEligibility } from "./connection-eligibility";
import { supabase } from "@/lib/supabase";
import type { Person } from "./station-community";
type Card = Person & { trip_id?: string; resort_name?: string; resort_slug?: string; starts_on?: string; ends_on?: string };
const pageSize=12;
export function People({userId,onTrips}:{userId:string;onTrips:(person:Person)=>void}) {
 const app=useApp();const readiness=useConnectionEligibility(userId);
 const direction=useRef("forward");
 const [relations,setRelations]=useState<Record<string,string>>({});
 const [page,setPage]=useState(0);const [index,setIndex]=useState(0);
 const [people,setPeople]=useState<Card[]>([]);const [more,setMore]=useState(false);
 const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [retry,setRetry]=useState(0);
 const [connecting,setConnecting]=useState(false);const [notice,setNotice]=useState("");const [sent,setSent]=useState<string[]>([]);
 useEffect(()=>{
  let active=true;
  async function load(){
   if(!supabase)return;
   setLoading(true);setError("");
   try{
    const profile=await supabase.from("profiles").select("id").eq("id",userId).maybeSingle();
    if(profile.error||!profile.data)throw new Error("Completa y guarda tu perfil para descubrir a los demás miembros.");
    const {data,error}=await supabase.rpc("discover_person_cards",{page_offset:page*pageSize,page_size:pageSize+1});
    if(error)throw new Error(error.code==="PGRST202"?"Falta activar la nueva vista de personas en Supabase (people-cards.sql).":"No se pudieron cargar las personas. Vuelve a intentarlo.");
    if(active){
      const rows=(data||[]).slice(0,pageSize) as Card[];
      setPeople(rows);setMore((data||[]).length>pageSize);setIndex(direction.current==="back"?Math.max(0,rows.length-1):0);
      const connections=await supabase.from("connections").select("requester_id,recipient_id,status").or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
      if(active){const map:Record<string,string>={};for(const c of connections.data||[]){const other=c.requester_id===userId?c.recipient_id:c.requester_id;map[other]=c.status==="accepted"?"accepted":c.status==="pending"?(c.requester_id===userId?"sent":"incoming"):"declined";}setRelations(map);}
    }
   }catch(error){if(active)setError(error instanceof Error?error.message:"No se pudieron cargar las personas.");}
   finally{if(active)setLoading(false);}
  }
  void load();return()=>{active=false;};
 },[userId,page,retry]);
 const person=people[index];
 function next(){setNotice("");if(index+1<people.length)setIndex(i=>i+1);else if(more){direction.current="forward";setPage(p=>p+1);}else setIndex(people.length);}
 function previous(){setNotice("");if(index>0)setIndex(i=>i-1);else if(page>0){direction.current="back";setPage(p=>p-1);}}
 async function connect(){
  if(!supabase||!person||!readiness.canConnect||connecting)return;
  setConnecting(true);setNotice("");
  try{
   const {error}=await supabase.rpc("request_person_connection",{target_user:person.id,target_trip:null});
   if(error)throw error;
   setSent(s=>[...s,person.id]);setNotice("¡Solicitud enviada! Si acepta, podréis hablar por chat.");
  }catch(error){setNotice(error instanceof Error?error.message:typeof error==="object"&&error&&"message"in error?String(error.message):"No se pudo enviar la solicitud.");}
  finally{setConnecting(false);}
 }
 return <section className="people-deck"><div className="people-deck-intro"><p className="kicker">CONOCE A TU GENTE</p><h1>Tu gente en la montaña.</h1><p className="muted">Mira sus fotos, descubre sus viajes y decide si quieres conectar. Sin filtros de estación ni fechas.</p></div>
 {notice&&<p className="notice" role="status">{notice} <button className="text-button" onClick={()=>app.social("conexiones")}>Ver solicitudes →</button></p>}
 {loading?<p className="loading" role="status">Buscando gente de montaña…</p>:error?<div className="notice" role="alert"><p>{error}</p><Link href="/cuenta" className="text-button">Mi perfil →</Link><button className="text-button" onClick={()=>setRetry(r=>r+1)}>Reintentar</button></div>:person?<>
 <article className="person-deck-card" aria-label={`Perfil de ${person.name}`}><div className="person-deck-photo"><PersonGallery key={person.id} userId={person.id} avatar={person.avatar_url} name={person.name}/><div className="person-deck-identity"><h2 aria-live="polite">{person.name}, {person.age}</h2><div className="chips"><span>{person.level}</span><span>{person.sport}</span></div></div></div><div className="person-deck-info">
 <div className="person-deck-actions"><button className="button button-light" disabled={connecting} onClick={next}><X size={18}/> Pasar</button>{relations[person.id]==="accepted"?<button className="button button-coral" onClick={()=>app.social("mensajes",person.id)}>Abrir chat</button>:relations[person.id]||sent.includes(person.id)?<button className="button button-coral" onClick={()=>app.social("conexiones")}>{relations[person.id]==="incoming"?"Responder solicitud":"Ver solicitud"}</button>:<button className="button button-coral" disabled={connecting||!readiness.canConnect} onClick={()=>void connect()}><HeartHandshake size={19}/>{connecting?"Enviando…":"Conectar"}</button>}<button className="button button-outline" disabled={connecting} onClick={()=>onTrips(person)}><CalendarDays size={18}/> Ver viajes</button></div>
 <p>{person.bio||"Con ganas de compartir la montaña."}</p>{person.preferences&&<p><strong>Le gusta:</strong> {person.preferences}</p>}{person.resort_name&&<p className="person-deck-trip"><CalendarDays size={18}/><span><strong>{person.resort_name}</strong><br/>{person.starts_on&&new Date(person.starts_on+"T12:00:00").toLocaleDateString("es-ES")} → {person.ends_on&&new Date(person.ends_on+"T12:00:00").toLocaleDateString("es-ES")}</span></p>}
 {!readiness.loading&&!readiness.canConnect&&!readiness.error&&<p className="person-deck-hint">{readiness.photos<readiness.minimumPhotos?"Completa tu perfil con dos fotos para conectar.":"Completa y guarda tu perfil para conectar."}</p>}
 </div></article><div className="person-deck-pagination"><button className="text-button" disabled={connecting||(!page&&!index)} onClick={previous}><ChevronLeft size={18}/> Anterior</button><span>Persona {page*pageSize+index+1}</span><button className="text-button" disabled={connecting} onClick={next}>Siguiente <ChevronRight size={18}/></button></div>
 </>:<div className="empty-state"><h2>{people.length||page?"Ya has visto a estas personas":"Todavía no hay personas para mostrar"}</h2><p>Los perfiles con viajes publicados aparecerán aquí. Publica el tuyo para que te descubran.</p><div className="inline-actions">{(people.length>0||page>0)&&<button className="button button-light" onClick={()=>{direction.current="forward";setPage(0);setIndex(0);setRetry(r=>r+1);}}>Volver a empezar</button>}<button className="button button-coral" onClick={()=>app.publish()}>Publicar viaje</button></div></div>}
 <ConnectionPrompt userId={userId}/>
 </section>;
}
