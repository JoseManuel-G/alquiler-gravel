"use client";

import { useState } from "react";

export default function ReservationForm({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    plan: "Día completo",
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
Hola, quiero alquilar una bici gravel en Madrid.

Nombre: ${form.name}
Teléfono: ${form.phone}
Fecha deseada: ${form.date}
Tipo de alquiler: ${form.plan}
Altura aproximada: ${form.height}
Ruta o zona: ${form.route}
Mensaje: ${form.message}
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
        Reserva rápida
      </p>
      <h3 className="mt-3 text-2xl font-black text-white">
        Consulta disponibilidad
      </h3>
      <p className="mt-3 text-sm leading-6 text-stone-300">
        Rellena los datos y se abrirá WhatsApp con tu solicitud preparada.
      </p>

      <div className="mt-6 grid gap-4">
        <input name="name" required value={form.name} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder="Nombre" />
        <input name="phone" required value={form.phone} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder="Teléfono" />
        <input name="date" type="date" required value={form.date} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-green-500" />
        <select name="plan" value={form.plan} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-green-500">
          <option>Medio día</option>
          <option>Día completo</option>
          <option>Fin de semana</option>
          <option>Semana</option>
        </select>
        <input name="height" value={form.height} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder="Altura aproximada. Ej: 1,78 m" />
        <input name="route" value={form.route} onChange={updateField} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder="Ruta o zona: Casa de Campo, El Pardo..." />
        <textarea name="message" value={form.message} onChange={updateField} rows={4} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-green-500" placeholder="Mensaje" />
        <button type="submit" className="rounded-full bg-green-500 px-6 py-4 font-black text-black transition hover:bg-green-400">
          Enviar solicitud por WhatsApp
        </button>
      </div>
    </form>
  );
}
