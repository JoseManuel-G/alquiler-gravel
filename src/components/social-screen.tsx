"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Users } from "lucide-react";
import { useApp } from "./app-context";
import { DestinationSelector } from "./destination-selector";
import { PublishedTrips } from "./published-trips";
import { People } from "./people";
import type { Person } from "./station-community";
export function SocialScreen({ screen, initialMine = false, initialPanel, initialPublish = false }: { screen: "trips" | "people"; initialMine?: boolean; initialPanel?: "mensajes" | "conexiones" | "planes"; initialPublish?: boolean }) {
 const router = useRouter(); const app = useApp();
 const opened = useRef(false);
 useEffect(() => {
   if (!app.ready || opened.current || (!initialPanel && !initialPublish)) return;
   const task = setTimeout(() => { opened.current = true; if (initialPanel) app.social(initialPanel); else app.publish(); }, 0);
   return () => clearTimeout(task);
 }, [app, initialPanel, initialPublish]); const [traveler, setTraveler] = useState<Person | null>(null);
 return <main className="container sm-screen"><DestinationSelector /><div className="sm-section-intro"><p className="kicker">{screen === "trips" ? "COMPARTE LA ESCAPADA" : "TU GENTE EN LA MONTAÑA"}</p></div>
 {!app.ready ? <p role="status">Comprobando tu sesión…</p> : !app.user ? <div className="empty-state"><Users size={36}/><h1>{screen === "trips" ? "Tu próximo viaje, en compañía" : "Conoce a quienes van a tu destino"}</h1><p>Los perfiles y viajes son visibles para miembros. Entra para verlos; la guía de Explorar está abierta a todos.</p><button className="button button-coral" onClick={() => app.requireAuth(() => {})}>Entrar o crear cuenta</button></div> : <>
 {screen === "trips" || traveler ? <PublishedTrips key={`${app.selection.slug}:${app.selection.from}:${app.selection.to}:${app.revision}:${traveler?.id || ""}`} initialMine={initialMine} userId={app.user.id} traveler={traveler} onClearTraveler={() => setTraveler(null)} onManage={() => { router.push("/viajes?mine=1"); }} onConnections={() => app.social("conexiones")} onChat={personId => app.social("mensajes", personId)} /> : <People key={`${app.selection.slug}:${app.selection.from}:${app.selection.to}`} userId={app.user.id} onTrips={setTraveler} />}
 </>}
 </main>;
}
