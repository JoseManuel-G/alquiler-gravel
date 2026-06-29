import type { Metadata } from "next";
import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Gravel Bike Rental Madrid | Rent gravel bikes by the day",
  description: "Rent a gravel bike in Madrid by the day, half day, weekend or week. Gravel bike rental for tourists and locals.",
  keywords: ["gravel bike rental Madrid", "rent gravel bike Madrid", "bike rental Madrid", "rent a bike in Madrid", "gravel routes Madrid"],
  alternates: { canonical: "/en", languages: { "es-ES": "/", "en": "/en" } }
};

const whatsappNumber = "34689458241";
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
            <a href="#pickup" className="hover:text-[#c86f3a]">Pick-up</a>
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
              Gravel bike rental Madrid
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Gravel around Madrid, without bringing your bike.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-100">
              Rent a gravel bike in Madrid for routes through Casa de Campo, El
              Pardo, Madrid Río, Anillo Verde or Sierra de Madrid. Checked bikes,
              quick WhatsApp booking and half-day, full-day, weekend or weekly
              rentals.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                className="rounded-full bg-[#fffaf1] px-8 py-4 text-center font-black text-[#17212b] transition hover:bg-[#e6b17e]"
              >
                Book via WhatsApp
              </a>
              <a
                href="#prices"
                className="rounded-full border border-white/60 bg-white/10 px-8 py-4 text-center font-black text-white backdrop-blur transition hover:bg-white hover:text-[#17212b]"
              >
                See prices
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur"><p className="text-2xl font-black text-[#e6b17e]">45€</p><p className="mt-1 text-xs text-stone-200">full day</p></div>
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur"><p className="text-2xl font-black text-[#e6b17e]">85€</p><p className="mt-1 text-xs text-stone-200">weekend</p></div>
              <div className="rounded-3xl border border-white/15 bg-white/15 p-4 shadow-sm backdrop-blur"><p className="text-2xl font-black text-[#e6b17e]">Madrid</p><p className="mt-1 text-xs text-stone-200">gravel routes</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
          {[["Flexible rental", "Half day, full day, weekend or week."], ["Checked bikes", "Clean, adjusted and ready to ride."], ["Recommended routes", "Casa de Campo, El Pardo, Anillo Verde and more."], ["Quick booking", "Check availability directly by WhatsApp."]].map(([title, text]) => (
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
            {[["01", "Book", "Choose pick-up and return date/time."], ["02", "Pick up the bike", "Pick-up takes place in the Manuel Becerra area, with good connections to many routes and areas of Madrid."], ["03", "Enjoy the route", "We suggest routes based on your level."], ["04", "Return", "We check the bike and release the deposit if everything is fine."]].map(([number, title, text]) => (
              <div key={number} className="rounded-[2rem] bg-white/10 p-6">
                <p className="text-4xl font-black text-[#e6b17e]">{number}</p>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pickup" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Pick-up point</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Pick-up in the Manuel Becerra area.</h2>
            <p className="mt-6 text-lg leading-8 text-[#4f565b]">
              The main pick-up area is <strong>Manuel Becerra</strong>, a convenient
              location within Madrid with good connections to different parts of the city.
            </p>
            <p className="mt-5 text-lg leading-8 text-[#4f565b]">
              From Manuel Becerra you have easy connections to <strong>central Madrid</strong>, <strong>Retiro</strong>, <strong>Madrid Río</strong>, <strong>Casa de Campo</strong>, <strong>Moncloa</strong> and other areas where urban or gravel routes can start.
            </p>
            <div className="mt-8 rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm">
              <h3 className="text-xl font-black">How it is confirmed</h3>
              <p className="mt-3 text-sm leading-6 text-[#5b5f62]">
                When you send the request, we will confirm availability, bike size,
                pick-up time, return time and the exact meeting point in the Manuel
                Becerra area by WhatsApp.
              </p>
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#c86f3a]">Useful connections</p>
            <div className="mt-6 grid gap-4">
              {[["Retiro", "Very close for easy urban rides or moving around the centre."], ["Madrid Río", "Good connection for relaxed routes and links towards Casa de Campo."], ["Casa de Campo", "One of the best areas to try gravel without leaving Madrid."], ["Moncloa", "Good connection point for routes towards Casa de Campo and El Pardo."], ["El Pardo", "Ideal area for longer and intermediate gravel routes."]].map(([place, text]) => (
                <div key={place} className="rounded-2xl bg-[#f7f3ea] p-5">
                  <h3 className="font-black text-[#17212b]">{place}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b5f62]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Routes</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Recommended gravel routes in Madrid</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {routes.map(([title, text, tag]) => (
            <div key={title} className="rounded-[2rem] border border-[#e2d3bd] bg-[#fffaf1] p-6 shadow-sm">
              <p className="mb-5 inline-flex rounded-full bg-[#eef0e7] px-3 py-1 text-xs font-bold text-[#516b57]">{tag}</p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#5b5f62]">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/rutas-gravel-madrid" className="mt-8 inline-flex rounded-full border border-[#c86f3a] px-6 py-3 font-black text-[#c86f3a] transition hover:bg-[#c86f3a] hover:text-white">See the Madrid gravel route guide</Link>
      </section>

      <section className="border-y border-[#e2d3bd] bg-[#fffaf1] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c86f3a]">Madrid gravel</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">Gravel bikes for city routes, trails and the Sierra</h2>
          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-8 text-[#4f565b]">
            <p>If you are looking for <strong>gravel bike rental in Madrid</strong>, this website offers a flexible option for riders who want to go cycling without buying their own bike or bringing one on their trip.</p>
            <p>From Madrid you can ride gravel routes through <strong>Casa de Campo</strong>, <strong>El Pardo</strong>, <strong>Madrid Río</strong>, <strong>Anillo Verde Ciclista</strong>, <strong>Moncloa</strong> and connections towards the <strong>Sierra de Madrid</strong>.</p>
            <p>Rental is available for <strong>half day</strong>, <strong>full day</strong>, <strong>weekend</strong> or <strong>week</strong>.</p>
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
            {[["Is there a deposit?", "Yes. The deposit is returned after checking the bike."], ["What is included in the rental?", "A checked gravel bike. Depending on availability: helmet, lock, puncture kit and recommended route."], ["What details do I need to book?", "Name, phone, pick-up date/time, return date/time, height and preferred area."], ["What sizes are available?", "Availability will initially be limited. Check by WhatsApp and include your height."], ["Where is pick-up?", "Pick-up takes place in the Manuel Becerra area. The exact point is confirmed by WhatsApp when booking."], ["Can I use it in the mountains?", "It is a gravel bike, not an MTB. Aggressive descents, bike parks and jumps are not allowed."]].map(([q, a]) => (
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
