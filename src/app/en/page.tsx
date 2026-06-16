import type { Metadata } from "next";
import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Gravel Bike Rental Madrid | Rent gravel bikes by the day",
  description: "Rent a gravel bike in Madrid by the day, half day, weekend or week. Gravel bike rental for tourists and locals.",
  keywords: ["gravel bike rental Madrid", "rent gravel bike Madrid", "bike rental Madrid", "rent a bike in Madrid", "gravel routes Madrid"],
  alternates: { canonical: "/en", languages: { "es-ES": "/", "en": "/en" } }
};

const whatsappNumber = "34600000000";
const whatsappText =
  "Hi, I would like to rent a gravel bike in Madrid. Do you have availability?";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

const prices = [
  ["Half day", "35 €", "Morning or afternoon ride.", "4-5 hours"],
  ["Full day", "45 €", "The most flexible option.", "1 day"],
  ["Weekend", "85 €", "Saturday and Sunday.", "2 days"],
  ["Week", "200 €", "Great for holidays or longer stays.", "7 days"]
];

const routes = [
  ["Casa de Campo", "Easy route to test a gravel bike without leaving Madrid.", "Easy"],
  ["El Pardo", "One of the best areas for gravel riding near Madrid.", "Intermediate"],
  ["Anillo Verde", "Great for covering kilometres with less traffic.", "Rolling"],
  ["Madrid Río", "A good connection point for urban and mixed routes.", "Easy"],
  ["Sierra de Madrid", "Longer and more demanding rides from Madrid.", "Advanced"],
  ["Moncloa and Ciudad Universitaria", "A good starting point for quick rides near the centre.", "Urban"]
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Gravel Bike Rental Madrid",
    description:
      "Alquiler de bicicletas gravel en Madrid por medio día, full day, weekend o semana.",
    url: "https://alquilergravelmadrid.com",
    telephone: "+34600000000",
    areaServed: { "@type": "City", name: "Madrid" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressRegion: "Comunidad de Madrid",
      addressCountry: "ES"
    },
    priceRange: "35€-200€"
  };

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#17212b]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="sticky top-0 z-40 border-b border-[#e2d3bd] bg-[#f7f3ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17212b] text-xl font-black text-[#fffaf1]">G</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Gravel Madrid</p>
              <p className="text-xs text-[#776b5e]">Bike rental</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#3b4147] lg:flex">
            <a href="#prices" className="hover:text-[#c86f3a]">Prices</a>
            <a href="#routes" className="hover:text-[#c86f3a]">Routes</a>
            <Link href="/rutas-gravel-madrid" className="hover:text-[#c86f3a]">Route guide</Link>
            <a href="#booking" className="hover:text-[#c86f3a]">Book</a>
            <Link href="/condiciones" className="hover:text-[#c86f3a]">Terms</Link>
            <Link href="/contacto" className="hover:text-[#c86f3a]">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-[#d9c7ad] px-4 py-2 text-sm font-black text-[#17212b] transition hover:border-[#c86f3a] hover:text-[#c86f3a]">ES</Link>
            <a href={whatsappUrl} target="_blank" className="rounded-full bg-[#17212b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#c86f3a]">WhatsApp</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -right-28 top-16 h-[520px] w-[520px] rounded-full bg-[#c86f3a]/15 blur-[80px]" />
        <div className="absolute -left-28 bottom-8 h-[420px] w-[420px] rounded-full bg-[#516b57]/15 blur-[90px]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center lg:py-28">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-[#d9c7ad] bg-[#fffaf1] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#c86f3a]">
              Gravel bike rental Madrid
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Explore Madrid by gravel bike.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#4f565b]">
              Rent a gravel bike in Madrid for Casa de Campo, El Pardo, Madrid Río, Anillo Verde or Sierra de Madrid. Checked bikes, quick WhatsApp booking and flexible rental options.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href={whatsappUrl} target="_blank" className="rounded-full bg-[#17212b] px-8 py-4 text-center font-black text-white transition hover:bg-[#c86f3a]">
                Book via WhatsApp
              </a>
              <a href="#prices" className="rounded-full border border-[#c8b69d] px-8 py-4 text-center font-black text-[#17212b] transition hover:border-[#c86f3a] hover:text-[#c86f3a]">
                See prices
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-[#e2d3bd] bg-[#fffaf1] p-4 shadow-sm"><p className="text-2xl font-black text-[#c86f3a]">45€</p><p className="mt-1 text-xs text-[#776b5e]">full day</p></div>
              <div className="rounded-3xl border border-[#e2d3bd] bg-[#fffaf1] p-4 shadow-sm"><p className="text-2xl font-black text-[#c86f3a]">85€</p><p className="mt-1 text-xs text-[#776b5e]">weekend</p></div>
              <div className="rounded-3xl border border-[#e2d3bd] bg-[#fffaf1] p-4 shadow-sm"><p className="text-2xl font-black text-[#516b57]">Madrid</p><p className="mt-1 text-xs text-[#776b5e]">gravel routes</p></div>
            </div>
          </div>

          <div className="relative z-10 rounded-[2.5rem] border border-[#e2d3bd] bg-[#fffaf1] p-5 shadow-2xl">
            <div className="flex min-h-[470px] flex-col justify-between rounded-[2rem] bg-[#17212b] p-8 text-white">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#e6b17e]">Ready to ride</p>
                <h2 className="mt-4 text-4xl font-black">Roads, trails and adventure around Madrid.</h2>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
                <p className="text-7xl">🚴‍♂️</p>
                <p className="mt-5 text-lg font-bold">Real bike photo pending</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">This area will show a real outdoor-style photo of the bikes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
          {[["Alquiler flexible", "Medio día, full day, finde o semana."], ["Bicis revisadas", "Entrega limpia, ajustada y lista para rodar."], ["Routes recomendadas", "Casa de Campo, El Pardo, Anillo Verde y más."], ["Reserva rápida", "Consulta disponibilidad directa por WhatsApp."]].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-[#f7f3ea] p-6">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="prices" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Prices</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Simple prices for gravel bike rental in Madrid</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {prices.map(([name, price, desc, tag]) => (
            <div key={name} className="rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#c86f3a]">
              <p className="mb-5 inline-flex rounded-full bg-[#f0dfc8] px-3 py-1 text-xs font-bold text-[#9b4f27]">{tag}</p>
              <h3 className="text-2xl font-black">{name}</h3>
              <p className="mt-5 text-5xl font-black text-[#c86f3a]">{price}</p>
              <p className="mt-5 text-sm leading-6 text-[#5b5f62]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#17212b] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e6b17e]">How it works</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Book, pick up, ride and return.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[["01", "Reserva", "Choose pick-up and return date/time."], ["02", "Recoge la bici", "We meet at the agreed point and time in Madrid."], ["03", "Disfruta la ruta", "We suggest routes based on your level."], ["04", "Devuelve", "We check the bike and release the deposit if everything is fine."]].map(([number, title, text]) => (
              <div key={number} className="rounded-[2rem] bg-white/10 p-6">
                <p className="text-4xl font-black text-[#e6b17e]">{number}</p>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Routes</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Routes gravel recomendadas en Madrid</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {routes.map(([title, text, tag]) => (
            <div key={title} className="rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm">
              <p className="mb-5 inline-flex rounded-full bg-[#eef0e7] px-3 py-1 text-xs font-bold text-[#516b57]">{tag}</p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/rutas-gravel-madrid" className="mt-8 inline-flex rounded-full border border-[#c86f3a] px-6 py-3 font-black text-[#c86f3a] transition hover:bg-[#c86f3a] hover:text-white">Ver guía de gravel routes en Madrid</Link>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Madrid gravel</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">Gravel bikes for city routes, trails and the Sierra</h2>
          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-8 text-[#4f565b]">
            <p>Si buscas <strong>alquiler de bicicletas gravel en Madrid</strong>, esta web ofrece una opción flexible para ciclistas que quieren salir a rodar sin comprar una bici propia o sin traerla de viaje.</p>
            <p>Desde Madrid puedes hacer gravel routes por <strong>Casa de Campo</strong>, <strong>El Pardo</strong>, <strong>Madrid Río</strong>, <strong>Anillo Verde Ciclista</strong>, <strong>Moncloa</strong> y conexiones hacia la <strong>Sierra de Madrid</strong>.</p>
            <p>El alquiler puede hacerse por <strong>medio día</strong>, <strong>full day</strong>, <strong>weekend</strong> o <strong>semana</strong>.</p>
          </div>
        </div>
      </section>

      <section id="booking" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Booking</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Check availability for your next ride.</h2>
            <p className="mt-6 text-lg leading-8 text-[#4f565b]">Choose pick-up date/time, return date/time, height and preferred pick-up area. The form will open WhatsApp with your request ready.</p>
          </div>
          <ReservationForm whatsappNumber={whatsappNumber} language="en" />
        </div>
      </section>

      <section className="bg-[#17212b] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e6b17e]">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Frequently asked questions</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[["¿Hay fianza?", "Sí. La fianza se devuelve tras revisar la bicicleta."], ["¿Qué incluye el alquiler?", "Bici gravel revisada. Según disponibilidad, casco, candado, kit antipinchazos y ruta recomendada."], ["¿Qué datos necesito para reservar?", "Nombre, teléfono, fecha/hora de recogida, fecha/hora de devolución, altura y zona preferida."], ["¿Qué tallas hay?", "Inicialmente habrá disponibilidad limitada. Consulta por WhatsApp indicando tu altura."], ["¿Dónde se recoge?", "Punto de recogida en Madrid, pendiente de confirmar según reserva."], ["¿Puedo usarla por montaña?", "Es una bici gravel, no una MTB. No está permitido usarla en descensos agresivos, bikeparks o saltos."]].map(([q, a]) => (
              <div key={q} className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
                <h3 className="text-xl font-black">{q}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e2d3bd] bg-[#f7f3ea]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-[#776b5e] md:flex-row md:items-center md:justify-between">
          <div><p className="font-black text-[#17212b]">Gravel Madrid</p><p className="mt-1">© {new Date().getFullYear()} Gravel Bike Rental Madrid.</p></div>
          <div className="flex flex-wrap gap-4"><Link href="/en" className="hover:text-[#c86f3a]">Español</Link><Link href="/rutas-gravel-madrid" className="hover:text-[#c86f3a]">Routes</Link><Link href="/condiciones" className="hover:text-[#c86f3a]">Terms</Link><Link href="/privacidad" className="hover:text-[#c86f3a]">Privacidad</Link><Link href="/contacto" className="hover:text-[#c86f3a]">Contact</Link></div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" className="fixed bottom-5 right-5 z-50 rounded-full bg-[#17212b] px-6 py-4 font-black text-white shadow-2xl transition hover:bg-[#c86f3a]">WhatsApp</a>
    </main>
  );
}
