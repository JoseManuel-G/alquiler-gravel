import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con Alquiler Gravel Madrid para consultar disponibilidad.",
  alternates: { canonical: "/contacto" },
};

const whatsappNumber = "34600000000";
const whatsappText = "Hola, quiero información sobre el alquiler de bicis gravel en Madrid.";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl">
        <Link href="/" className="text-sm font-black text-green-400">← Volver al inicio</Link>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-green-400">Contacto</p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Contacta para alquilar una gravel</h1>
        <p className="mt-6 max-w-2xl leading-8 text-stone-300">Consulta disponibilidad, tallas, precios, rutas recomendadas o condiciones.</p>
        <div className="mt-10 grid gap-5">
          <a href={whatsappUrl} target="_blank" className="rounded-full bg-green-500 px-6 py-4 text-center font-black text-black transition hover:bg-green-400">Contactar por WhatsApp</a>
          <div className="rounded-3xl bg-black/40 p-6"><h2 className="text-xl font-black">Email</h2><p className="mt-2 text-stone-400">pendiente@email.com</p></div>
          <div className="rounded-3xl bg-black/40 p-6"><h2 className="text-xl font-black">Zona de recogida</h2><p className="mt-2 text-stone-400">Madrid. Punto exacto pendiente de confirmar según reserva.</p></div>
        </div>
      </div>
    </main>
  );
}
