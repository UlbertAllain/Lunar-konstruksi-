"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { readString } from "./public-helpers";

type SubmitState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; reference: string; whatsappUrl: string | null }
  | { kind: "error"; message: string };

export function PublicContactForm({ whatsapp }: { whatsapp?: string }) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [form, setForm] = useState({ name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" });
  const valid = useMemo(() => form.name.trim().length >= 2 && form.phone.trim().length >= 7 && form.message.trim().length >= 8, [form]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || state.kind === "saving") return;
    setState({ kind: "saving" });

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-form" }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; data?: { lead?: { id?: string }; leadId?: string; whatsappUrl?: string | null }; error?: string | { message?: string } } | null;
      if (!response.ok || !payload?.ok) {
        const message = typeof payload?.error === "string" ? payload.error : readString(payload?.error && typeof payload.error === "object" ? payload.error.message : "", "Permintaan belum dapat dikirim.");
        throw new Error(message);
      }
      const reference = readString(payload.data?.lead?.id ?? payload.data?.leadId, "-");
      const digits = (whatsapp ?? "").replace(/[^\d]/g, "");
      const whatsappUrl = payload.data?.whatsappUrl ?? (digits ? `https://wa.me/${digits}` : null);
      setState({ kind: "success", reference, whatsappUrl });
      setForm({ name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" });
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "Terjadi kendala saat mengirim permintaan." });
    }
  }

  const fieldClass = "w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-[#8d6f49]";

  if (state.kind === "success") {
    return (
      <div className="border-t border-black/15 pt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6f49]">Inquiry recorded</p>
        <h3 className="mt-3 font-serif text-3xl text-zinc-950">Permintaan proyek sudah masuk.</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600">Referensi: <strong>{state.reference}</strong>. Tim Lunar akan meninjau kebutuhan proyek sebelum menindaklanjuti.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {state.whatsappUrl ? <a href={state.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 bg-[#11110f] px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Continue on WhatsApp <ArrowUpRight className="h-4 w-4" /></a> : null}
          <button type="button" onClick={() => setState({ kind: "idle" })} className="h-11 border border-black/20 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-900">New inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Name</label><input className={fieldClass} value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Nama lengkap" /></div>
      <div><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Phone / WhatsApp</label><input className={fieldClass} value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="08xxxxxxxxxx" /></div>
      <div><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Email</label><input className={fieldClass} value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} placeholder="nama@email.com" /></div>
      <div><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Project type</label><input className={fieldClass} value={form.projectType} onChange={(e) => setForm((v) => ({ ...v, projectType: e.target.value }))} placeholder="Residential / Commercial / Interior" /></div>
      <div className="sm:col-span-2"><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Location</label><input className={fieldClass} value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Kota / area proyek" /></div>
      <div className="hidden"><input tabIndex={-1} value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} /></div>
      <div className="sm:col-span-2"><label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Brief</label><textarea className={`${fieldClass} min-h-28 resize-y`} value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} placeholder="Jelaskan kebutuhan ruang, skala proyek, dan target waktu secara singkat." /></div>
      {state.kind === "error" ? <div className="sm:col-span-2 border-l-2 border-red-500 pl-4 text-sm text-red-700">{state.message}</div> : null}
      <div className="sm:col-span-2 pt-3">
        <button type="submit" disabled={!valid || state.kind === "saving"} className="inline-flex h-12 items-center gap-3 bg-[#11110f] px-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#8d6f49] disabled:opacity-40">
          {state.kind === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {state.kind === "saving" ? "Sending..." : "Send project inquiry"}
          {state.kind !== "saving" ? <ArrowUpRight className="h-4 w-4" /> : null}
        </button>
      </div>
    </form>
  );
}
