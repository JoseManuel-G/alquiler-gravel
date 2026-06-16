import type { Metadata } from "next";
import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Gravel Bike Rental Madrid | Rent gravel bikes by the day",
  description:
    "Rent a gravel bike in Madrid by the day, half day, weekend or week. Gravel bike rental for tourists and locals near Casa de Campo, El Pardo, Madrid Río and the Sierra de Madrid.",
  keywords: [
    "gravel bike rental Madrid",
    "rent gravel bike Madrid",
    "bike rental Madrid",
    "rent a bike in Madrid",
    "road bike rental Madrid",
    "gravel routes Madrid",
    "Casa de Campo bike rental",
    "El Pardo bike rental",
    "Madrid bike rental for tourists"
  ],
  alternates: {
    canonical: "/en",
    languages: {
      "es-ES": "/",
      "en": "/en",
    },
  },
};

const whatsappNumber = "34600000000";
const whatsappText =
  "Hi, I would like to rent a gravel bike in Madrid. Do you have availability?";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

const prices = [
  ["Half day", "35 €", "Morning or afternoon ride.", "4-5 hours"],
  ["Full day", "45 €", "The most flexible option.", "1 day"],
  ["Weekend", "85 €", "Saturday and Sunday.", "2 days"],
  ["Week", "200 €", "Great for holidays or longer stays.", "7 days"],
];

const routes = [
  ["Casa de Campo", "Easy route to test a gravel bike without leaving Madrid.", "Easy"],
  ["El Pardo", "One of the best areas for gravel riding near Madrid.", "Intermediate"],
  ["Anillo Verde", "Great for covering kilometres with less traffic.", "Rolling"],
  ["Madrid Río", "A good connection point for urban and mixed routes.", "Easy"],
  ["Sierra de Madrid", "Longer and more demanding rides for experienced cyclists.", "Advanced"],
  ["Campoamor summer", "Holiday option for routes around Orihuela Costa.", "Summer"],
];

export default function EnglishHome() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Gravel Bike Rental Madrid",
    description:
      "Gravel bike rental in Madrid by half day, full day, weekend or week.",
    url: "https://alquilergravelmadrid.com/en",
    telephone: "+34600000000",
    areaServed: { "@type": "City", name: "Madrid" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressRegion: "Community of Madrid",
      addressCountry: "ES"
    },
    priceRange: "35€-200€"
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/en" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-xl font-black text-black">G</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Gravel Madrid</p>
              <p className="text-xs text-stone-400">Bike rental</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-300 lg:flex">
            <a href="#prices" className="hover:text-green-400">Prices</a>
            <a href="#routes" className="hover:text-green-400">Routes</a>
            <a href="#booking" className="hover:text-green-400">Book</a>
            <Link href="/contacto" className="hover:text-green-400">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm font-black text-white transition hover:border-green-400 hover:text-green-400">
              ES
            </Link>
            <a href={whatsappUrl} target="_blank" className="rounded-full bg-green-500 px-5 py-3 text-sm font-black text-black transition hover:bg-green-400">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]" />
        <div className="absolute right-0 top-32 h-[300px] w-[300px] rounded-full bg-lime-400/10 blur-[80px]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center lg:py-28">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-green-400">
              Gravel bike rental Madrid
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Rent a gravel bike in Madrid.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-300">
              Gravel bike rental in Madrid for tourists and locals. Ride Casa de Campo,
              El Pardo, Madrid Río, Anillo Verde or the Sierra de Madrid. Clean,
              checked bikes, quick WhatsApp booking and flexible rental options.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href={whatsappUrl} target="_blank" className="rounded-full bg-green-500 px-8 py-4 text-center font-black text-black transition hover:bg-green-400">
                Book via WhatsApp
              </a>
              <a href="#prices" className="rounded-full border border-white/15 px-8 py-4 text-center font-black text-white transition hover:border-green-400 hover:text-green-400">
                See prices
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">45€</p>
                <p className="mt-1 text-xs text-stone-400">full day</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">85€</p>
                <p className="mt-1 text-xs text-stone-400">weekend</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black text-green-400">Madrid</p>
                <p className="mt-1 text-xs text-stone-400">gravel routes</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
            <div className="flex min-h-[470px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-stone-900 to-black p-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">Ready to ride</p>
                <h2 className="mt-4 text-4xl font-black">Gravel, roads, trails and adventure.</h2>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-6 backdrop-blur">
                <p className="text-7xl">🚴‍♂️</p>
                <p className="mt-5 text-lg font-bold">Real bike photo pending</p>
                <p className="mt-2 text-sm leading-6 text-stone-400">This area will show a strong sports-style photo of the bikes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-4">
          {[
            ["Flexible rental", "Half day, full day, weekend or week."],
            ["Checked bikes", "Clean, adjusted and ready to ride."],
            ["Recommended routes", "Casa de Campo, El Pardo, Anillo Verde and more."],
            ["Quick booking", "Check availability directly via WhatsApp."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-black/30 p-6">
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="prices" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">Prices</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Simple prices for gravel bike rental in Madrid</h2>
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
          <p className="text-sm font-black uppercase tracking-[0.3em]">How it works</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Book, pick up, ride and return.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              ["01", "Book", "Message us on WhatsApp or fill in the form."],
              ["02", "Pick up", "We agree on the place and time."],
              ["03", "Ride", "We suggest routes based on your level."],
              ["04", "Return", "We check the bike and release the deposit if everything is fine."],
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

      <section id="routes" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">Routes</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Recommended gravel routes in Madrid</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {routes.map(([title, text, tag]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="mb-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">{tag}</p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">For visitors</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
            Gravel bike rental in Madrid for tourists, expats and weekend riders
          </h2>
          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-8 text-stone-300">
            <p>If you are looking for <strong>gravel bike rental in Madrid</strong>, this service is designed for riders who want to explore the city and nearby trails without bringing their own bike.</p>
            <p>From Madrid you can ride <strong>Casa de Campo</strong>, <strong>El Pardo</strong>, <strong>Madrid Río</strong>, <strong>Anillo Verde</strong> and connections towards the <strong>Sierra de Madrid</strong>.</p>
            <p>You can rent by <strong>half day</strong>, <strong>full day</strong>, <strong>weekend</strong> or <strong>week</strong>.</p>
          </div>
        </div>
      </section>

      <section id="booking" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">Booking</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Check availability for your next ride.</h2>
            <p className="mt-6 text-lg leading-8 text-stone-400">Fill in the form and WhatsApp will open with your request ready to send.</p>
          </div>
          <ReservationForm whatsappNumber={whatsappNumber} language="en" />
        </div>
      </section>

      <section className="bg-white py-20 text-black">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-green-700">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Frequently asked questions</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              ["Is there a deposit?", "Yes. The deposit is returned after checking the bike."],
              ["What is included?", "Checked gravel bike. Helmet, lock, puncture kit and route suggestions depending on availability."],
              ["What happens if I get a puncture?", "Please contact us. Depending on the case, it can be repaired with the kit or charged as a repair cost."],
              ["What sizes are available?", "Initial availability will be limited. Message us with your height."],
              ["Where do I pick up the bike?", "Pick-up point in Madrid, confirmed for each booking."],
              ["Can I use it for mountain biking?", "It is a gravel bike, not an MTB. Aggressive downhill, bikeparks and jumps are not allowed."],
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
            <p className="mt-1">© {new Date().getFullYear()} Gravel Bike Rental Madrid.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-green-400">Español</Link>
            <Link href="/contacto" className="hover:text-green-400">Contact</Link>
          </div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-6 py-4 font-black text-black shadow-2xl transition hover:bg-green-400">WhatsApp</a>
    </main>
  );
}
