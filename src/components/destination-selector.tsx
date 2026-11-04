"use client";
import { useState } from "react";
import { CalendarDays, MapPin, ChevronDown } from "lucide-react";
import { useApp } from "./app-context";
import { selectionLabel } from "@/lib/travel-selection";
export function DestinationSelector({ prominent = false }: { prominent?: boolean }) {
  const { selection, select, resorts, catalogError } = useApp();
  const [dates, setDates] = useState(false);
  const [message, setMessage] = useState("");
  const selected = resorts.find(r => r.slug === selection.slug);
  return <section className={prominent ? "destination-bar prominent" : "destination-bar"} aria-label="Destino y fechas para toda la aplicación">
    <div className="destination-input"><MapPin size={19} /><label><span>¿Dónde vas a esquiar?</span><select value={selected?.slug || ""} onChange={e => select({ ...selection, slug: e.target.value })}><option value="">Elige estación</option>{resorts.map(r => <option key={r.id} value={r.slug}>{r.name}</option>)}</select></label></div>
    <button className="destination-dates" type="button" aria-expanded={dates} onClick={() => setDates(!dates)}><CalendarDays size={19} /><span><small>Fechas opcionales</small><strong>{selectionLabel(selection)}</strong></span><ChevronDown size={16} /></button>
    {dates && <form className="destination-date-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const from = String(f.get("from") || ""); const to = String(f.get("to") || from); if (from && to && to < from) { setMessage("La salida no puede ser anterior a la llegada."); return; } select({ ...selection, from, to }); setDates(false); setMessage(""); }}>
      <label className="field">Llegada<input key={selection.from} name="from" type="date" defaultValue={selection.from} /></label><label className="field">Salida<input key={selection.to} name="to" type="date" defaultValue={selection.to} /></label><button className="button button-dark">Aplicar fechas</button><button type="button" className="text-button" onClick={() => { select({ ...selection, from: "", to: "" }); setDates(false); }}>Sin fechas</button>{message && <p role="alert">{message}</p>}
    </form>}
    {catalogError && <p role="alert">No se pudieron cargar los destinos. Recarga para volver a intentarlo.</p>}
  </section>;
}
