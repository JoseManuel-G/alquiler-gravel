"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CalendarDays,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import type { Resort } from "@/lib/resorts";
export function Search({ resorts }: { resorts: Resort[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("");
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        if (!slug) {
          document
            .getElementById("estaciones")
            ?.scrollIntoView({ behavior: "smooth" });
          return;
        }
        router.push(
          `/estaciones/${slug}?${new URLSearchParams({ from: date, level })}#companeros`,
        );
      }}
    >
      <label>
        <MapPin />
        <span>
          <b>¿Dónde quieres esquiar?</b>
          <select
            aria-label="Estación"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            <option value="">Elige tu próxima montaña</option>
            {resorts.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label>
        <CalendarDays />
        <span>
          <b>¿Cuándo nos vemos?</b>
          <input
            aria-label="Fecha del viaje"
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </span>
      </label>
      <label>
        <SlidersHorizontal />
        <span>
          <b>A tu ritmo</b>
          <select
            aria-label="Nivel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            {["Principiante", "Intermedio", "Avanzado", "Experto"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </span>
      </label>
      <button className="search-button" aria-label="Buscar compañeros">
        <ArrowRight />
      </button>
    </form>
  );
}
