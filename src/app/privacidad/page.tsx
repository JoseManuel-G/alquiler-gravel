import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Alquiler Gravel Madrid.",
  alternates: { canonical: "/privacidad" }
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-12 text-[#17212b]">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-8 shadow-xl">
        <Link href="/" className="text-sm font-black text-[#c86f3a]">← Volver al inicio</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Privacidad</p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">Política de privacidad</h1>
        <div className="mt-8 space-y-6 text-[#4f565b] leading-8">
          <p>Esta política es una versión inicial orientativa para una landing de validación.</p>
          <p>Podremos recoger nombre, teléfono, email, fecha y hora de recogida, fecha y hora de devolución, altura aproximada, zona preferida, ruta deseada y mensaje de reserva.</p>
          <p>Los datos se usarán para responder solicitudes, gestionar reservas y prestar el servicio de alquiler.</p>
          <p>Para ejercer derechos de acceso, rectificación o supresión, escribe al email de contacto.</p>
        </div>
      </div>
    </main>
  );
}
