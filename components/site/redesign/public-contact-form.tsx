"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2, Send } from "lucide-react";

type Props = { settings?: { whatsapp?: string; email?: string; phone?: string } };

type State = { type: "idle" } | { type: "loading" } | { type: "success"; reference: string } | { type: "error"; message: string };

export function PublicContactForm({ settings }: Props) {
  const [state, setState] = useState<State>({ type: "idle" });
  const [form, setForm] = useState({ name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.type === "loading") return;
    setState({ type: "loading" });

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-form" }),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; data?: { lead?: { id?: string }; leadId?: string }; error?: string | { message?: string } } | null;
      if (!response.ok || !payload?.ok) {
        const message = typeof payload?.error === "string" ? payload.error : payload?.error?.message || "Tidak bisa mengirim permintaan sekarang.";
        throw new Error(message);
      }
      const reference = payload.data?.lead?.id || payload.data?.leadId || "-";
      setState({ type: "success", reference });
      setForm({ name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" });
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Terjadi kendala saat mengirim permintaan." });
    }
  }

  const input = "h-12 w-full border border-black/10 bg-[#F7F7F5] px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#F26722] focus:bg-white";

  if (state.type === "success") {
    const digits = (settings?.whatsapp || "").replace(/[^\d]/g, "");
    return (
      <div className="border-l-4 border-[#F26722] bg-[#F7F7F5] p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F26722]">Request recorded</p>
        <h3 className="mt-3 text-2xl font-bold text-zinc-950">Permintaan proyek sudah masuk.</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-600">Referensi: <strong>{state.reference}</strong>. Tim Lunar akan meninjau informasi yang kamu kirim.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {digits ? <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center bg-[#F26722] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">Continue via WhatsApp</a> : null}
          <button type="button" onClick={() => setState({ type: "idle" })} className="inline-flex h-11 items-center border border-black/10 bg-white px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-800">New inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      <input className={input} placeholder="Your name" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} required />
      <input className={input} placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} required />
      <input className={input} placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
      <select className={input} value={form.projectType} onChange={(e) => setForm((v) => ({ ...v, projectType: e.target.value }))}>
        <option value="">Project type</option>
        <option>Residential build</option><option>Renovation</option><option>Interior fit-out</option><option>Commercial project</option><option>Design consultation</option><option>Project supervision</option>
      </select>
      <input className={`${input} md:col-span-2`} placeholder="Project location" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} />
      <textarea className={`${input} min-h-28 resize-y py-3 md:col-span-2`} placeholder="Brief project requirements" value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} required />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} />
      {state.type === "error" ? <p className="md:col-span-2 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</p> : null}
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 bg-[#F26722] px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#D95113] md:col-span-2">
        {state.type === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {state.type === "loading" ? "Submitting..." : "Submit project inquiry"}
      </button>
    </form>
  );
}

export default PublicContactForm;
