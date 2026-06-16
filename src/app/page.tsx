import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

const whatsappNumber = "34600000000";
const whatsappText =
  "Hola, quiero alquilar una bici gravel en Madrid. ¿Tenéis disponibilidad?";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappText
)}`;

const prices = [
  ["Medio día", "35 €", "Ruta de mañana o tarde.", "4-5 horas"],
  ["Día completo", "45 €", "La opción más flexible.", "1 día"],
  ["Fin de semana", "85 €", "Sábado y domingo.", "2 días"],
  ["Semana", "200 €", "Vacaciones o estancia larga.", "7 días"],
];

const routes = [
  ["Casa de Campo", "Ruta fácil para probar gravel sin salir de Madrid.", "Fácil"],
  ["El Pardo", "Una de las mejores zonas para gravel cerca de Madrid.", "Intermedio"],
  ["Anillo Verde", "Perfecta para rodar kilómetros con poco tráfico.", "Rodadora"],
  ["Madrid Río", "Buena conexión para empezar rutas urbanas y mixtas.", "Fácil"],
  ["Sierra de Madrid", "Para salidas más largas y exigentes.", "Avanzado"],
  ["Campoamor verano", "Opción vacacional para rutas por Orihuela Costa.", "Verano"],
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Alquiler Gravel Madrid",
    description:
      "Alquiler de bicicletas gravel en Madrid por medio día, día completo, fin de semana o semana.",
    url: "https://alquilergravelmadrid.com",
    telephone: "+34600000000",
    areaServed: { "@type": "City", name: "Madrid" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressRegion: "Comunidad de Madrid",
      addressCountry: "ES",
    },
    priceRange: "35€-200€",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-xl font-black text-black">
              G
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Gravel Madrid</p>
              <p className="text-xs text-stone-400">Bike rental</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-300 lg:flex">
            <a href="#precios" className="hover:text-green-400">Precios</a>
            <a href="#rutas" className="hover:text-green-400">Rutas</a>
            <Link href="/rutas-gravel-madrid" className="hover:text-green-400">Guía rutas</Link>
            <a href="#reserva" className="hover:text-green-400">Reservar</a>
            <Link href="/condiciones" className="hover:text-green-400">Condiciones</Link>
            <Link href="/contacto" className="hover:text-green-400">Contacto</Link>
          </nav>

          <a href={whatsappUrl} target="_blank" className="rounded-full bg-green-500 px-5 py-3 text-sm font-black text-black transition hover:bg-green-400">
            WhatsApp
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[300px] w-[300px] rounded-full bg-lime-400/10 blur-[80px]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center lg:py-28">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-green-400">
              Alquiler gravel Madrid
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Alquiler de bicis gravel en Madrid.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-300">
              Alquila una bicicleta gravel en Madrid para rutas por Casa de Campo,
              El Pardo, Madrid Río, Anillo Verde o Sierra de Madrid. Bicis revisadas,
              reserva rápida por WhatsApp y alquiler por medio día, día completo,
              fin de semana o semana.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href={whatsappUrl} target="_blank" className="rounded-full bg-green-500 px-8 py-4 text-center font-black text-black transition hover:bg-green-400">
                Reservar por WhatsApp
              </a>
              <a href="#precios" className="rounded-full border border-white/15 px-8 py-4 text-center font-black text-white transition hover:border-green-400 hover:text-green-400">
                Ver precios
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">45€</p>
                <p className="mt-1 text-xs text-stone-400">día completo</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">85€</p>
                <p className="mt-1 text-xs text-stone-400">fin de semana</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">Madrid</p>
                <p className="mt-1 text-xs text-stone-400">rutas gravel</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
            <div className="flex min-h-[470px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-stone-900 to-black p-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
                  Ready to ride
                </p>
                <h2 className="mt-4 text-4xl font-black">
                  Gravel, asfalto, pistas y aventura.
                </h2>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-6 backdrop-blur">
                <p className="text-7xl">🚴‍♂️</p>
                <p className="mt-5 text-lg font-bold">Foto real pendiente</p>
                <p className="mt-2 text-sm leading-6 text-stone-400">
                  Aquí pondremos una imagen potente de tus bicis cuando las tengas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
          {[
            ["Alquiler flexible", "Medio día, día completo, finde o semana."],
            ["Bicis revisadas", "Entrega limpia, ajustada y lista para rodar."],
            ["Rutas recomendadas", "Casa de Campo, El Pardo, Anillo Verde y más."],
            ["Reserva rápida", "Consulta disponibilidad directa por WhatsApp."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-black/30 p-6">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
          Tarifas
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Precios sencillos para alquilar gravel en Madrid
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {prices.map(([name, price, desc, tag]) => (
            <div key={name} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-green-400/50">
              <p className="mb-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">{tag}</p>
              <h3 className="text-2xl font-black">{name}</h3>
              <p className="mt-5 text-5xl font-black text-green-400">{price}</p>
              <p className="mt-5 text-sm leading-6 text-stone-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-500 py-20 text-black">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.3em]">Proceso</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Reserva, recoge, rueda y devuelve.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Reserva", "Escríbenos por WhatsApp o completa el formulario."],
              ["02", "Recoge la bici", "Quedamos en el punto y hora acordados."],
              ["03", "Disfruta la ruta", "Te recomendamos rutas según tu nivel."],
              ["04", "Devuelve", "Revisamos la bici y liberamos la fianza si todo está correcto."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-[2rem] bg-black p-6 text-white">
                <p className="text-4xl font-black text-green-400">{number}</p>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rutas" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
          Rutas
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Rutas gravel recomendadas en Madrid
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {routes.map(([title, text, tag]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="mb-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">{tag}</p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-stone-400">{text}</p>
            </div>
          ))}
        </div>

        <Link href="/rutas-gravel-madrid" className="mt-8 inline-flex rounded-full border border-green-400 px-6 py-3 font-black text-green-400 transition hover:bg-green-400 hover:text-black">
          Ver guía de rutas gravel en Madrid
        </Link>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
            SEO local
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
            Alquiler de bicicletas gravel en Madrid para rutas urbanas, campo y sierra
          </h2>

          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-8 text-stone-300">
            <p>
              Si buscas <strong>alquiler de bicicletas gravel en Madrid</strong>,
              esta web ofrece una opción flexible para ciclistas que quieren salir
              a rodar sin comprar una bici propia o sin traerla de viaje.
            </p>
            <p>
              Desde Madrid puedes hacer rutas gravel por <strong>Casa de Campo</strong>,{" "}
              <strong>El Pardo</strong>, <strong>Madrid Río</strong>,{" "}
              <strong>Anillo Verde Ciclista</strong> y conexiones hacia la{" "}
              <strong>Sierra de Madrid</strong>.
            </p>
            <p>
              El alquiler puede hacerse por <strong>medio día</strong>,{" "}
              <strong>día completo</strong>, <strong>fin de semana</strong> o{" "}
              <strong>semana</strong>.
            </p>
          </div>
        </div>
      </section>

      <section id="reserva" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
              Reservas
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Solicita disponibilidad para tu próxima ruta.
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone-400">
              Completa el formulario y se abrirá WhatsApp con tu solicitud.
            </p>
          </div>

          <ReservationForm whatsappNumber={whatsappNumber} />
        </div>
      </section>

      <section className="bg-white py-20 text-black">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Preguntas frecuentes
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              ["¿Hay fianza?", "Sí. La fianza se devuelve tras revisar la bicicleta."],
              ["¿Qué incluye el alquiler?", "Bici gravel revisada. Según disponibilidad, casco, candado, kit antipinchazos y ruta recomendada."],
              ["¿Qué pasa si pincho?", "El cliente debe avisar. Según el caso, se podrá reparar con el kit o aplicar el coste de reparación."],
              ["¿Qué tallas hay?", "Inicialmente habrá disponibilidad limitada. Consulta por WhatsApp indicando tu altura."],
              ["¿Dónde se recoge?", "Punto de recogida en Madrid, pendiente de confirmar según reserva."],
              ["¿Puedo usarla por montaña?", "Es una bici gravel, no una MTB. No está permitido usarla en descensos agresivos, bikeparks o saltos."],
            ].map(([q, a]) => (
              <div key={q} className="rounded-[2rem] border border-black/10 p-6">
                <h3 className="text-xl font-black">{q}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-stone-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-white">Gravel Madrid</p>
            <p className="mt-1">© {new Date().getFullYear()} Alquiler Gravel Madrid.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/rutas-gravel-madrid" className="hover:text-green-400">Rutas</Link>
            <Link href="/condiciones" className="hover:text-green-400">Condiciones</Link>
            <Link href="/privacidad" className="hover:text-green-400">Privacidad</Link>
            <Link href="/contacto" className="hover:text-green-400">Contacto</Link>
          </div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-6 py-4 font-black text-black shadow-2xl transition hover:bg-green-400">
        WhatsApp
      </a>
    </main>
  );
}
