"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "./app-context";
import { supabase } from "@/lib/supabase";
export function useConnectionEligibility(userId: string) {
 const app=useApp();
 const [state,setState]=useState({loading:true,hasTrip:false,photos:0,minimumPhotos:2,hasProfile:false,error:""});
 useEffect(()=>{
  let active=true;
  async function load(){
   if(!supabase)return;
   const {data,error}=await supabase.rpc("connection_readiness");
   if(active)setState({loading:false,hasTrip:!!data?.has_trip,photos:Number(data?.photo_count || 0),minimumPhotos:data?.minimum_photos===0?0:2,hasProfile:!!data?.has_profile,error:error ? "No se pudo comprobar la configuración de tu cuenta." : typeof data?.minimum_photos!=="number" ? "Falta aplicar la corrección para conservar las cuentas anteriores (legacy-profiles.sql)." : ""});
  }
  void load();return()=>{active=false;};
 },[userId,app.revision]);
 return {...state,canConnect:!state.loading&&!state.error&&state.hasProfile&&state.photos>=state.minimumPhotos};
}
export function ConnectionPrompt({ userId }: {userId:string}) {
 const app=useApp();const readiness=useConnectionEligibility(userId);
 return <aside className="connection-prompt"><div><strong>Publica un viaje para que conecten contigo</strong><p>Conecta con personas que tengan viajes publicados. Publica uno para que otras personas también puedan descubrirte.</p>{readiness.error&&<p role="status">{readiness.error}</p>}</div><div className="inline-actions">{!readiness.loading&&!readiness.error&&(!readiness.hasProfile||readiness.photos<readiness.minimumPhotos)&&<Link className="button button-light" href="/cuenta">{readiness.hasProfile?"Completar mis fotos":"Completar mi perfil"}</Link>}<button className="button button-coral" onClick={()=>app.publish()}>Publicar viaje</button></div></aside>;
}
