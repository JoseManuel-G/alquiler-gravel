import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Condiciones de alquiler",
  description: "Condiciones de alquiler de bicicletas gravel en Madrid.",
  alternates: { canonical: "/condiciones" }
};

const items = [
  ["Identificación del cliente", "Para alquilar una bicicleta será necesario aportar nombre completo, DNI/NIE/pasaporte, teléfono y datos de contacto."],
  ["Reserva y horarios", "La reserva deberá indicar fecha y hora de recogida, fecha y hora de devolución y zona preferida de recogida."],
  ["Fianza", "Se podrá solicitar una fianza antes de la entrega. La fianza será devuelta tras la revisión de la bicicleta y accesorios."],
  ["Uso permitido", "No está permitido usar la bici en competiciones, descensos agresivos, bikeparks, saltos o actividades distintas al ciclismo recreativo."],
  ["Daños y averías", "El cliente será responsable de los daños causados por mal uso, negligencia, caída, robo o pérdida de accesorios."],
  ["Devolución", "La bicicleta deberá devolverse en la fecha, hora y lugar acordados. Los retrasos podrán generar cargos adicionales."]
];

export default function CondicionesPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-12 text-[#17212b]">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-8 shadow-xl">
        <Link href="/" className="text-sm font-black text-[#c86f3a]">← Volver al inicio</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Legal</p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Condiciones de alquiler</h1>
        <p className="mt-6 leading-8 text-[#4f565b]">Versión inicial orientativa. Antes de operar comercialmente, revisa el contrato con un profesional.</p>
        <section className="mt-10 space-y-6">
          {items.map(([title, text], i) => (
            <div key={title} className="rounded-3xl bg-[#f7f3ea] p-6">
              <h2 className="text-xl font-black">{i + 1}. {title}</h2>
              <p className="mt-3 leading-7 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
