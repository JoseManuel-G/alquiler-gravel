"use client";

import { useState } from "react";

type ReservationFormProps = {
  whatsappNumber: string;
  language?: "es" | "en";
};

const copy = {
  es: {
    eyebrow: "Solicitud de reserva",
    title: "Comprueba disponibilidad",
    description: "Indica recogida, devolución y altura. Se abrirá WhatsApp con tu solicitud preparada.",
    name: "Nombre",
    phone: "Teléfono",
    email: "Email",
    pickupDate: "Fecha de recogida",
    pickupTime: "Hora de recogida",
    returnDate: "Fecha de devolución",
    returnTime: "Hora de devolución",
    plan: "Tipo de alquiler",
    height: "Altura aproximada. Ej: 1,78 m",
    pickupArea: "Zona preferida de recogida",
    route: "Ruta o zona: Casa de Campo, El Pardo...",
    message: "Mensaje",
    button: "Enviar solicitud por WhatsApp",
    whatsappIntro: "Hola, quiero alquilar una bici gravel en Madrid.",
    labels: {
      name: "Nombre",
      phone: "Teléfono",
      email: "Email",
      pickupDate: "Fecha de recogida",
      pickupTime: "Hora de recogida",
      returnDate: "Fecha de devolución",
      returnTime: "Hora de devolución",
      plan: "Tipo de alquiler",
      height: "Altura aproximada",
      pickupArea: "Zona preferida de recogida",
      route: "Ruta o zona",
      message: "Mensaje"
    },
    plans: ["Medio día", "Día completo", "Fin de semana", "Semana"],
    pickupAreas: ["Madrid centro", "Casa de Campo", "Madrid Río", "Moncloa", "El Pardo", "A concretar por WhatsApp"]
  },
  en: {
    eyebrow: "Booking request",
    title: "Check availability",
    description: "Choose pick-up, return and height. WhatsApp will open with your request ready.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    pickupDate: "Pick-up date",
    pickupTime: "Pick-up time",
    returnDate: "Return date",
    returnTime: "Return time",
    plan: "Rental option",
    height: "Approx. height. Example: 1.78 m",
    pickupArea: "Preferred pick-up area",
    route: "Route or area: Casa de Campo, El Pardo...",
    message: "Message",
    button: "Send request via WhatsApp",
    whatsappIntro: "Hi, I would like to rent a gravel bike in Madrid.",
    labels: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      pickupDate: "Pick-up date",
      pickupTime: "Pick-up time",
      returnDate: "Return date",
      returnTime: "Return time",
      plan: "Rental option",
      height: "Approx. height",
      pickupArea: "Preferred pick-up area",
      route: "Route or area",
      message: "Message"
    },
    plans: ["Half day", "Full day", "Weekend", "Week"],
    pickupAreas: ["Madrid city centre", "Casa de Campo", "Madrid Río", "Moncloa", "El Pardo", "To be agreed on WhatsApp"]
  }
};

export default function ReservationForm({
  whatsappNumber,
  language = "es"
}: ReservationFormProps) {
  const t = copy[language];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    plan: t.plans[1],
    height: "",
    pickupArea: t.pickupAreas[0],
    route: "",
    message: ""
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
${t.labels.email}: ${form.email}
${t.labels.pickupDate}: ${form.pickupDate}
${t.labels.pickupTime}: ${form.pickupTime}
${t.labels.returnDate}: ${form.returnDate}
${t.labels.returnTime}: ${form.returnTime}
${t.labels.plan}: ${form.plan}
${t.labels.height}: ${form.height}
${t.labels.pickupArea}: ${form.pickupArea}
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
      className="rounded-[2rem] border border-[#d9c7ad] bg-[#fffaf1] p-6 shadow-xl"
    >
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c86f3a]">
        {t.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-black text-[#17212b]">{t.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#5b5f62]">{t.description}</p>

      <div className="mt-6 grid gap-4">
        <input name="name" required value={form.name} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.name} />
        <input name="phone" required value={form.phone} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.phone} />
        <input name="email" type="email" value={form.email} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.email} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#776b5e]">{t.pickupDate}</label>
            <input name="pickupDate" type="date" required value={form.pickupDate} onChange={updateField} className="w-full rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#776b5e]">{t.pickupTime}</label>
            <input name="pickupTime" type="time" required value={form.pickupTime} onChange={updateField} className="w-full rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#776b5e]">{t.returnDate}</label>
            <input name="returnDate" type="date" required value={form.returnDate} onChange={updateField} className="w-full rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#776b5e]">{t.returnTime}</label>
            <input name="returnTime" type="time" required value={form.returnTime} onChange={updateField} className="w-full rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]" />
          </div>
        </div>

        <select name="plan" value={form.plan} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]">
          {t.plans.map((plan) => (
            <option key={plan}>{plan}</option>
          ))}
        </select>

        <select name="pickupArea" value={form.pickupArea} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none focus:border-[#c86f3a]">
          {t.pickupAreas.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>

        <input name="height" value={form.height} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.height} />
        <input name="route" value={form.route} onChange={updateField} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.route} />
        <textarea name="message" value={form.message} onChange={updateField} rows={4} className="rounded-2xl border border-[#d9c7ad] bg-white px-4 py-3 text-[#17212b] outline-none placeholder:text-[#8b8173] focus:border-[#c86f3a]" placeholder={t.message} />
        <button type="submit" className="rounded-full bg-[#17212b] px-6 py-4 font-black text-white transition hover:bg-[#c86f3a]">
          {t.button}
        </button>
      </div>
    </form>
  );
}
