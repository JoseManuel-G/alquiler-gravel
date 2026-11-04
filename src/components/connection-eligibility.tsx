"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "./app-context";
import { supabase } from "@/lib/supabase";
export function useConnectionEligibility(userId: string) {
 const app=useApp();
 const [state,setState]=useState({loading:true,hasTrip:false,photos:0,hasProfile:false,error:""});
 useEffect(()=>{
  let active=true;
  async function load(){
   if(!supabase)return;
   const {data,error}=await supabase.rpc("connection_readiness");
   if(active)setState({loading:false,hasTrip:!!data?.has_trip,photos:Number(data?.photo_count || 0),hasProfile:!!data?.has_profile,error:error ? "Falta activar los requisitos de fotos y viajes en Supabase (people-cards.sql)." : ""});
  }
  void load();return()=>{active=false;};
 },[userId,app.revision]);
 return {...state,canConnect:!state.loading&&!state.error&&state.hasProfile&&state.photos>=2};
}
export function ConnectionPrompt({ userId }: {userId:string}) {
 const app=useApp();const readiness=useConnectionEligibility(userId);
 return <aside className="connection-prompt"><div><strong>Publica un viaje para que conecten contigo</strong><p>Con dos fotos en tu perfil puedes conectar con personas que tengan viajes publicados. Publica uno para que otras personas también puedan descubrirte.</p>{readiness.error&&<p role="status">{readiness.error}</p>}</div><div className="inline-actions">{!readiness.loading&&(!readiness.hasProfile||readiness.photos<2)&&<Link className="button button-light" href="/cuenta">{readiness.hasProfile?"Completar mis fotos":"Completar mi perfil"}</Link>}<button className="button button-coral" onClick={()=>app.publish()}>Publicar viaje</button></div></aside>;
}
