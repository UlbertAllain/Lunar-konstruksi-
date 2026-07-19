"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", project: "", location: "", message: "" });
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281200000000";
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const displayPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = [
      "Halo Lunar Konstruksi, saya ingin mendiskusikan proyek.",
      `Nama: ${form.name}`,
      `Nomor: ${form.phone}`,
      `Jenis proyek: ${form.project}`,
      `Lokasi: ${form.location}`,
      `Keterangan: ${form.message}`,
    ].join("\n");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader dark />
      <main className="bg-[#12151b] pb-20 text-white sm:pb-28">
        <section className="site-container grid gap-14 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="site-kicker text-orange-400">Contact / Start here</span>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">Mari mulai dari konteks yang jelas.</h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-slate-400">Kirim gambaran awal project. Informasi ini membantu kami memahami kebutuhan sebelum menjadwalkan diskusi lebih lanjut.</p>
            <div className="mt-12 space-y-5 border-t border-white/10 pt-8">
              <a href={`mailto:${email}`} className="flex items-center gap-4 text-sm text-slate-300"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"><Mail size={18} /></span>{email}</a>
              <div className="flex items-center gap-4 text-sm text-slate-300"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"><Phone size={18} /></span>{displayPhone}</div>
              <div className="flex items-center gap-4 text-sm text-slate-300"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"><MapPin size={18} /></span>Indonesia</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="contact-label">Nama</span><input required className="contact-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label className="block"><span className="contact-label">Nomor WhatsApp</span><input required className="contact-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
              <label className="block"><span className="contact-label">Jenis Project</span><input required className="contact-input" value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} placeholder="Hunian, renovasi, komersial..." /></label>
              <label className="block"><span className="contact-label">Lokasi</span><input required className="contact-input" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
              <label className="block sm:col-span-2"><span className="contact-label">Keterangan Awal</span><textarea required className="contact-input min-h-40 resize-y py-4" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Ceritakan kebutuhan, ukuran perkiraan, target waktu, dan kondisi saat ini." /></label>
            </div>
            <button type="submit" className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-semibold text-slate-950 transition hover:bg-orange-400">Kirim via WhatsApp <ArrowUpRight size={18} /></button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
