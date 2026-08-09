"use client";

import { FormEvent, useState } from "react";

export function TechnicalContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", projectType: "", location: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281200000000";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-form" }),
      });

      if (!response.ok && response.status !== 404) throw new Error("Request failed");

      if (response.ok) {
        setStatus("sent");
        setForm({ name: "", phone: "", projectType: "", location: "", message: "", website: "" });
        return;
      }
    } catch {
      // The classic backend may not have the leads route. WhatsApp remains the safe fallback.
    }

    const text = [
      "Halo Lunar Konstruksi, saya ingin mendiskusikan proyek.",
      `Nama: ${form.name}`,
      `Nomor: ${form.phone}`,
      `Jenis proyek: ${form.projectType}`,
      `Lokasi: ${form.location}`,
      `Keterangan: ${form.message}`,
    ].join("\n");
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setStatus("idle");
  }

  const input = "w-full border-0 border-b border-[#aaa39a] bg-transparent px-0 py-3 text-sm text-[#182d4d] outline-none placeholder:text-[#8b857d] focus:border-[#dcb458]";

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <input className={input} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="NAMA / COMPANY" required />
      <input className={input} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="PHONE / WHATSAPP" required />
      <input className={input} value={form.projectType} onChange={(event) => setForm((current) => ({ ...current, projectType: event.target.value }))} placeholder="PROJECT TYPE" />
      <input className={input} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="PROJECT LOCATION" />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
      <textarea className={`${input} min-h-28 resize-y sm:col-span-2`} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="BRIEF / SCOPE / TARGET" required />
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="border-b border-[#dcb458] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[.1em] disabled:opacity-50">{status === "sending" ? "SENDING..." : "SEND PROJECT BRIEF →"}</button>
        {status === "sent" ? <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#347458]">Request recorded.</span> : null}
      </div>
    </form>
  );
}
