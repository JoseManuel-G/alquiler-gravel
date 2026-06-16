import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rutas gravel en Madrid | Casa de Campo, El Pardo y Anillo Verde",
  description: "Ideas de rutas gravel en Madrid para hacer con bici alquilada.",
  alternates: { canonical: "/rutas-gravel-madrid" }
};

const routes = [
  ["Casa de Campo", "Una de las mejores zonas para empezar con una bicicleta gravel en Madrid.", "Nivel fácil"],
  ["El Pardo", "Opción popular para ciclistas que buscan rutas gravel cerca de Madrid.", "Nivel intermedio"],
  ["Anillo Verde Ciclista", "Perfecto para rodar muchos kilómetros alrededor de Madrid.", "Ruta rodadora"],
  ["Madrid Río", "Zona cómoda para empezar rutas suaves y conectar con Casa de Campo.", "Nivel fácil"],
  ["Moncloa y Ciudad Universitaria", "Buen punto para salidas rápidas cerca del centro.", "Nivel fácil"],
  ["Sierra de Madrid", "Para ciclistas con experiencia: rutas más largas, desnivel y paisajes abiertos.", "Nivel avanzado"]
];

export default function RutasGravelMadridPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-12 text-[#17212b]">
      <article className="mx-auto max-w-5xl rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-8 shadow-xl">
        <Link href="/" className="text-sm font-black text-[#c86f3a]">← Volver al inicio</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Guía gravel</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Rutas gravel en Madrid para hacer con bici alquilada</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f565b]">Madrid permite combinar tramos urbanos, carriles bici, caminos compactos, parques y salidas hacia Casa de Campo, El Pardo o la Sierra.</p>
        <section className="mt-12 grid gap-5">
          {routes.map(([title, text, tag]) => (
            <div key={title} className="rounded-[2rem] border border-[#e2d3bd] bg-[#f7f3ea] p-6">
              <p className="mb-4 inline-flex rounded-full bg-[#eef0e7] px-3 py-1 text-xs font-bold text-[#516b57]">{tag}</p>
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-4 leading-8 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </section>
        <div className="mt-10 rounded-[2rem] bg-[#17212b] p-8 text-white">
          <h2 className="text-3xl font-black">¿Quieres alquilar una bici gravel?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-stone-300">Consulta disponibilidad por WhatsApp e indica fecha/hora de recogida, devolución, altura y tipo de ruta.</p>
          <Link href="/#reserva" className="mt-6 inline-flex rounded-full bg-[#e6b17e] px-6 py-3 font-black text-[#17212b] transition hover:bg-white">Solicitar disponibilidad</Link>
        </div>
      </article>
    </main>
  );
}
