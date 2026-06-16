"use client";

import { useState } from "react";

type ReservationFormProps = {
  whatsappNumber: string;
  language?: "es" | "en";
};

const copy = {
  es: {
    eyebrow: "Reserva rápida",
    title: "Consulta disponibilidad",
    description: "Rellena los datos y se abrirá WhatsApp con tu solicitud preparada.",
    name: "Nombre",
    phone: "Teléfono",
    date: "Fecha deseada",
    plan: "Tipo de alquiler",
    height: "Altura aproximada. Ej: 1,78 m",
    route: "Ruta o zona: Casa de Campo, El Pardo...",
    message: "Mensaje",
    button: "Enviar solicitud por WhatsApp",
    whatsappIntro: "Hola, quiero alquilar una bici gravel en Madrid.",
    labels: {
      name: "Nombre",
      phone: "Teléfono",
      date: "Fecha deseada",
      plan: "Tipo de alquiler",
      height: "Altura aproximada",
      route: "Ruta o zona",
      message: "Mensaje",
    },
    plans: ["Medio día", "Día completo", "Fin de semana", "Semana"],
  },
  en: {
    eyebrow: "Quick booking",
    title: "Check availability",
    description: "Fill in your details and WhatsApp will open with your request ready to send.",
    name: "Name",
    phone: "Phone",
    date: "Desired date",
    plan: "Rental option",
    height: "Approx. height. Example: 1.78 m",
    route: "Route or area: Casa de Campo, El Pardo...",
    message: "Message",
    button: "Send request via WhatsApp",
    whatsappIntro: "Hi, I would like to rent a gravel bike in Madrid.",
    labels: {
      name: "Name",
      phone: "Phone",
      date: "Desired date",
      plan: "Rental option",
      height: "Approx. height",
      route: "Route or area",
      message: "Message",
    },
    plans: ["Half day", "Full day", "Weekend", "Week"],
  },
};

export default function ReservationForm({
  whatsappNumber,
  language = "es",
}: ReservationFormProps) {
  const t = copy[language];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    plan: t.plans[1],
    height: "",
    route: "",
    message: "",
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = `
${t.whatsappIntro}

${t.labels.name}: ${form.name}
${t.labels.phone}: ${form.phone}
${t.labels.date}: ${form.date}
${t.labels.plan}: ${form.plan}
${t.labels.height}: ${form.height}
${t.labels.route}: ${form.route}
${t.labels.message}: ${form.message}
    `.trim();

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  return (
    <form
      onSubmit={submitForm}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
    >
      <p className="text-sm font-black uppercase tracking-[0.3em] text-green-400">
        {t.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-black text-white">{t.title}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-300">{t.description}</p>

      <div className="mt-6 grid gap-4">
        <input name="name" required value={form.name} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder={t.name} />
        <input name="phone" required value={form.phone} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder={t.phone} />
        <input name="date" type="date" required value={form.date} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-green-500" />
        <select name="plan" value={form.plan} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-green-500">
          {t.plans.map((plan) => (
            <option key={plan}>{plan}</option>
          ))}
        </select>
        <input name="height" value={form.height} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder={t.height} />
        <input name="route" value={form.route} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder={t.route} />
        <textarea name="message" value={form.message} onChange={updateField} rows={4} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder={t.message} />
        <button type="submit" className="rounded-full bg-green-500 px-6 py-4 font-black text-black transition hover:bg-green-400">
          {t.button}
        </button>
      </div>
    </form>
  );
}
