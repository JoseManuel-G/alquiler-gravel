import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

const whatsappNumber = "34689458241";
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
  ["Sierra de Madrid", "Para salidas más largas y exigentes desde Madrid.", "Avanzado"],
  ["Moncloa y Ciudad Universitaria", "Buen punto de salida para rutas rápidas cerca del centro.", "Urbana"],
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
    <main className="min-h-screen bg-[#f7f3ea] text-[#17212b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="sticky top-0 z-40 border-b border-[#e2d3bd] bg-[#f7f3ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17212b] text-xl font-black text-[#fffaf1]">
              G
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                Gravel Madrid
              </p>
              <p className="text-xs text-[#776b5e]">Bike rental</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#3b4147] lg:flex">
            <a href="#precios" className="hover:text-[#c86f3a]">
              Precios
            </a>
            <a href="#recogida" className="hover:text-[#c86f3a]">
              Recogida
            </a>
            <a href="#rutas" className="hover:text-[#c86f3a]">
              Rutas
            </a>
            <Link href="/rutas-gravel-madrid" className="hover:text-[#c86f3a]">
              Guía rutas
            </Link>
            <a href="#reserva" className="hover:text-[#c86f3a]">
              Reservar
            </a>
            <Link href="/condiciones" className="hover:text-[#c86f3a]">
              Condiciones
            </Link>
            <Link href="/contacto" className="hover:text-[#c86f3a]">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/en"
              className="rounded-full border border-[#d9c7ad] px-4 py-2 text-sm font-black text-[#17212b] transition hover:border-[#c86f3a] hover:text-[#c86f3a]"
            >
              EN
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              className="rounded-full bg-[#17212b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#c86f3a]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section
        className="relative isolate overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,33,43,0.62), rgba(23,33,43,0.42)), url('/foto-portada.png')",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17212b]/85 via-[#17212b]/55 to-[#17212b]/10" />

        <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-5 py-20 lg:py-28">
          <div className="relative z-10 max-w-3xl text-white">
            <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#e6b17e] backdrop-blur">
              Alquiler gravel Madrid
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Gravel por Madrid, sin traer tu bici.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-100">
              Alquila una bicicleta gravel en Madrid para rutas por Casa de
              Campo, El Pardo, Madrid Río, Anillo Verde o Sierra de Madrid.
              Bicis revisadas, reserva rápida por WhatsApp y alquiler por medio
              día, día completo, fin de semana o semana.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                className="rounded-full bg-[#fffaf1] px-8 py-4 text-center font-black text-[#17212b] transition hover:bg-[#e6b17e]"
              >
                Reservar por WhatsApp
              </a>
              <a
                href="#precios"
                className="rounded-full border border-white/60 bg-white/10 px-8 py-4 text-center font-black text-white backdrop-blur transition hover:bg-white hover:text-[#17212b]"
              >
                Ver precios
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-[#e6b17e]">45€</p>
                <p className="mt-1 text-xs text-stone-200">día completo</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-[#e6b17e]">85€</p>
                <p className="mt-1 text-xs text-stone-200">fin de semana</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-[#e6b17e]">Madrid</p>
                <p className="mt-1 text-xs text-stone-200">rutas gravel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
          {[
            ["Alquiler flexible", "Medio día, día completo, finde o semana."],
            ["Bicis revisadas", "Entrega limpia, ajustada y lista para rodar."],
            ["Rutas recomendadas", "Casa de Campo, El Pardo, Anillo Verde y más."],
            ["Reserva rápida", "Consulta disponibilidad directa por WhatsApp."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-[#f7f3ea] p-6">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">
          Tarifas
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
          Precios sencillos para alquilar gravel en Madrid
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {prices.map(([name, price, desc, tag]) => (
            <div
              key={name}
              className="rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#c86f3a]"
            >
              <p className="mb-5 inline-flex rounded-full bg-[#f0dfc8] px-3 py-1 text-xs font-bold text-[#9b4f27]">
                {tag}
              </p>
              <h3 className="text-2xl font-black">{name}</h3>
              <p className="mt-5 text-5xl font-black text-[#c86f3a]">
                {price}
              </p>
              <p className="mt-5 text-sm leading-6 text-[#5b5f62]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#17212b] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e6b17e]">
            Proceso
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Reserva, recoge, rueda y devuelve.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Reserva", "Elige fecha/hora de recogida y devolución."],
              ["02", "Recoge la bici", "La recogida se realiza en zona Manuel Becerra, con buena conexión a muchas rutas y zonas de Madrid."],
              ["03", "Disfruta la ruta", "Te recomendamos rutas según tu nivel."],
              ["04", "Devuelve", "Revisamos la bici y liberamos la fianza si todo está correcto."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-[2rem] bg-white/10 p-6">
                <p className="text-4xl font-black text-[#e6b17e]">{number}</p>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recogida" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">
              Punto de recogida
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Recogida en zona Manuel Becerra.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#4f565b]">
              La zona principal de recogida será <strong>Manuel Becerra</strong>,
              un punto cómodo dentro de Madrid y con buenas conexiones para moverse
              hacia distintas zonas de la ciudad.
            </p>

            <p className="mt-5 text-lg leading-8 text-[#4f565b]">
              Desde Manuel Becerra tienes conexiones sencillas hacia{" "}
              <strong>Madrid centro</strong>, <strong>Retiro</strong>,{" "}
              <strong>Madrid Río</strong>, <strong>Casa de Campo</strong>,{" "}
              <strong>Moncloa</strong> y otras zonas desde las que empezar rutas
              urbanas o gravel.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm">
              <h3 className="text-xl font-black">Cómo se confirma</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b5f62]">
                Al enviar la solicitud, confirmaremos por WhatsApp la
                disponibilidad, la talla de bici, la hora de recogida, la hora
                de devolución y el punto exacto de encuentro en la zona de
                Manuel Becerra.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#c86f3a]">
              Conexiones útiles
            </p>

            <div className="mt-6 grid gap-4">
              {[
                ["Retiro", "Muy cerca para empezar rutas urbanas suaves o moverse por el centro."],
                ["Madrid Río", "Buena conexión para rutas tranquilas y enlaces hacia Casa de Campo."],
                ["Casa de Campo", "Una de las mejores zonas para probar gravel sin salir de Madrid."],
                ["Moncloa", "Buen punto de conexión para rutas hacia Casa de Campo y El Pardo."],
                ["El Pardo", "Zona ideal para rutas gravel más largas e intermedias."],
              ].map(([place, text]) => (
                <div key={place} className="rounded-2xl bg-[#f7f3ea] p-5">
                  <h3 className="font-black text-[#17212b]">{place}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b5f62]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="rutas" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">
          Rutas
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Rutas gravel recomendadas en Madrid
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {routes.map(([title, text, tag]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm"
            >
              <p className="mb-5 inline-flex rounded-full bg-[#eef0e7] px-3 py-1 text-xs font-bold text-[#516b57]">
                {tag}
              </p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </div>

        <Link
          href="/rutas-gravel-madrid"
          className="mt-8 inline-flex rounded-full border border-[#c86f3a] px-6 py-3 font-black text-[#c86f3a] transition hover:bg-[#c86f3a] hover:text-white"
        >
          Ver guía de rutas gravel en Madrid
        </Link>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">
            Madrid gravel
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
            Bicis gravel para rutas urbanas, campo y sierra
          </h2>

          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-8 text-[#4f565b]">
            <p>
              Si buscas <strong>alquiler de bicicletas gravel en Madrid</strong>,
              esta web ofrece una opción flexible para ciclistas que quieren
              salir a rodar sin comprar una bici propia o sin traerla de viaje.
            </p>
            <p>
              Desde Madrid puedes hacer rutas gravel por{" "}
              <strong>Casa de Campo</strong>, <strong>El Pardo</strong>,{" "}
              <strong>Madrid Río</strong>, <strong>Anillo Verde Ciclista</strong>,{" "}
              <strong>Moncloa</strong> y conexiones hacia la{" "}
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
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">
              Reservas
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Solicita disponibilidad para tu próxima ruta.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#4f565b]">
              Indica fecha y hora de recogida, fecha y hora de devolución,
              altura y zona preferida. El formulario abrirá WhatsApp con tu
              solicitud preparada.
            </p>
          </div>

          <ReservationForm whatsappNumber={whatsappNumber} language="es" />
        </div>
      </section>

      <section className="bg-[#17212b] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e6b17e]">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Preguntas frecuentes
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              ["¿Hay fianza?", "Sí. La fianza se devuelve tras revisar la bicicleta."],
              ["¿Qué incluye el alquiler?", "Bici gravel revisada. Según disponibilidad, casco, candado, kit antipinchazos y ruta recomendada."],
              ["¿Qué datos necesito para reservar?", "Nombre, teléfono, fecha/hora de recogida, fecha/hora de devolución, altura y zona preferida."],
              ["¿Qué tallas hay?", "Inicialmente habrá disponibilidad limitada. Consulta por WhatsApp indicando tu altura."],
              ["¿Dónde se recoge?", "La recogida se realiza en zona Manuel Becerra. El punto exacto se confirma por WhatsApp al reservar."],
              ["¿Puedo usarla por montaña?", "Es una bici gravel, no una MTB. No está permitido usarla en descensos agresivos, bikeparks o saltos."],
            ].map(([q, a]) => (
              <div
                key={q}
                className="rounded-[2rem] border border-white/10 bg-white/10 p-6"
              >
                <h3 className="text-xl font-black">{q}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e2d3bd] bg-[#f7f3ea]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-[#776b5e] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-[#17212b]">Gravel Madrid</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Alquiler Gravel Madrid.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/en" className="hover:text-[#c86f3a]">
              English
            </Link>
            <Link href="/rutas-gravel-madrid" className="hover:text-[#c86f3a]">
              Rutas
            </Link>
            <Link href="/condiciones" className="hover:text-[#c86f3a]">
              Condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-[#c86f3a]">
              Privacidad
            </Link>
            <Link href="/contacto" className="hover:text-[#c86f3a]">
              Contacto
            </Link>
          </div>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[#17212b] px-6 py-4 font-black text-white shadow-2xl transition hover:bg-[#c86f3a]"
      >
        WhatsApp
      </a>
    </main>
  );
}
