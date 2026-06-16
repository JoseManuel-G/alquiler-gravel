import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Alquiler Gravel Madrid.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl">
        <Link href="/" className="text-sm font-black text-green-400">← Volver al inicio</Link>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-green-400">Privacidad</p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Política de privacidad</h1>
        <div className="mt-8 space-y-6 text-stone-300 leading-8">
          <p>Esta política es una versión inicial orientativa para una landing de validación.</p>
          <p>Podremos recoger nombre, teléfono, fecha solicitada, altura aproximada, ruta deseada y mensaje de reserva.</p>
          <p>Los datos se usarán para responder solicitudes, gestionar reservas y prestar el servicio de alquiler.</p>
          <p>Para ejercer derechos de acceso, rectificación o supresión, escribe al email de contacto.</p>
        </div>
      </div>
    </main>
  );
}
