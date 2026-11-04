"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useApp, type EditableTrip } from "./app-context";
import { supabase } from "@/lib/supabase";
export function TripEditor({ trip, onSaved }: { trip?: EditableTrip; onSaved: () => void }) {
  const { user, selection, select, resorts } = useApp();
  const selected = resorts.find(r => r.slug === selection.slug);
  const [station, setStation] = useState(trip?.resort_id || selected?.id || "");
  const [from, setFrom] = useState(trip?.starts_on || selection.from);
  const [to, setTo] = useState(trip?.ends_on || selection.to || selection.from);
  const [withWhom, setWithWhom] = useState(trip?.traveling_with || "Solo/a");
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!supabase || !user) return;
    if (!from || !to || to < from || (Date.parse(to) - Date.parse(from)) / 86400000 > 90) { setMessage("Elige fechas válidas para un viaje de hasta 90 días."); return; }
    setBusy(true); setMessage("");
    const f = new FormData(e.currentTarget);
    try {
      const profile = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
      if (profile.error || !profile.data) throw new Error("Completa y guarda tu perfil antes de publicar. Es necesario tener al menos 18 años.");
      const value = { user_id: user.id, resort_id: station, starts_on: from, ends_on: to, traveling_with: withWhom, party_size: withWhom === "Solo/a" ? 1 : Number(f.get("size") || 2), looking_for: String(f.get("description") || "").trim() };
      const result = trip ? await supabase.from("trips").update(value).eq("id", trip.id).eq("user_id", user.id).select("id").single() : await supabase.from("trips").upsert(value, { onConflict: "user_id,resort_id,starts_on,ends_on" }).select("id").single();
      if (result.error) throw new Error(result.error.code === "PGRST204" ? "Falta aplicar la actualización de grupos en Supabase (community-update.sql)." : "No se pudo guardar el viaje. Revisa las fechas y vuelve a intentarlo.");
      select({ slug: resorts.find(r => r.id === station)?.slug || "", from, to }); onSaved();
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar el viaje."); } finally { setBusy(false); }
  }
  return <form className="form-stack sm-trip-form" onSubmit={save}><p className="muted">Tu escapada, en menos de un minuto.</p>
    <label className="field">Estación<select required value={station} onChange={e => setStation(e.target.value)}><option value="">Elige estación</option>{resorts.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
    <div className="form-row"><label className="field">Llegada<input type="date" required value={from} min={new Date().toLocaleDateString("en-CA")} onChange={e => { setFrom(e.target.value); if (!to || to < e.target.value) setTo(e.target.value); }} /></label><label className="field">Salida<input type="date" required min={from} value={to} onChange={e => setTo(e.target.value)} /></label></div>
    <label className="field">¿Con quién viajas?<select value={withWhom} onChange={e => setWithWhom(e.target.value)}>{["Solo/a", "En pareja", "Con amigos", ...(trip?.traveling_with === "En familia" ? ["En familia"] : [])].map(s => <option key={s}>{s}</option>)}</select></label>
    {withWhom !== "Solo/a" && <label className="field">¿Cuántos vais? · incluyéndote<input name="size" type="number" min={2} max={30} defaultValue={Math.max(2, trip?.party_size || 2)} required /></label>}
    <label className="field">Descripción · opcional<textarea name="description" maxLength={160} defaultValue={trip?.looking_for || ""} placeholder="Unas bajadas tranquilas y algo de après-ski. ¿Te apuntas?" /></label>
    {message && <p className="notice" role="alert">{message} <Link href="/cuenta?return=publish">Mi perfil →</Link></p>}
    <button disabled={busy} className="button button-coral">{busy ? "Guardando…" : trip ? "Guardar cambios" : "Publicar viaje"}</button>
    {station && <details className="sm-secondary-plan"><summary>Organizar un plan con plazas</summary><p>Los planes compartidos mantienen su aprobación de participantes y límite de plazas.</p><Link href={`/estaciones/${resorts.find(r => r.id === station)?.slug}?from=${from}&to=${to}#planes`}>Crear un plan en esta estación →</Link></details>}
  </form>;
}
