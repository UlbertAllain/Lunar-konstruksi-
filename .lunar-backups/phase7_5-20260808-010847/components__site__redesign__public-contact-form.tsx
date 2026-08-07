"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ContactSettings = { whatsapp?: string; email?: string; phone?: string };

type FormState = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  message: string;
  website: string;
};

const initial: FormState = { name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" };

export function PublicContactForm({ settings }: { settings?: ContactSettings }) {
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-form" }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string | { message?: string } } | null;
      if (!response.ok || !payload?.ok) {
        const message = typeof payload?.error === "string" ? payload.error : payload?.error?.message;
        throw new Error(message || "Permintaan belum dapat dikirim.");
      }
      setForm(initial);
      setNotice({ kind: "ok", text: "Permintaan sudah tercatat. Tim Lunar akan meninjau dan menghubungi kamu kembali." });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Terjadi kendala saat mengirim permintaan." });
    } finally {
      setBusy(false);
    }
  }

  const field = "h-11 w-full border-0 bg-[#F2F2F0] px-4 text-[12px] text-[#29292B] outline-none placeholder:text-zinc-400 focus:bg-[#ECECEA] focus:ring-1 focus:ring-[#F26422]";

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input className={field} value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Your name" required />
      <input className={field} value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="Phone / WhatsApp" required />
      <input className={field} value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} placeholder="Email (optional)" />
      <select className={field} value={form.projectType} onChange={(e) => setForm((v) => ({ ...v, projectType: e.target.value }))}>
        <option value="">Project type</option>
        <option value="Residential construction">Residential construction</option>
        <option value="Renovation">Renovation</option>
        <option value="Interior fit-out">Interior fit-out</option>
        <option value="Commercial project">Commercial project</option>
        <option value="Project supervision">Project supervision</option>
      </select>
      <input className={`${field} sm:col-span-2`} value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Project location" />
      <textarea className={`${field} min-h-[100px] resize-y py-3 sm:col-span-2`} value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} placeholder="Brief project requirement" required />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} />
      {notice ? <div className={`sm:col-span-2 px-4 py-3 text-[11px] ${notice.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{notice.text}</div> : null}
      <button type="submit" disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 bg-[#F26422] px-6 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#DB541A] disabled:opacity-50 sm:col-span-2">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {busy ? "Sending request" : "Submit project inquiry"}
      </button>
      {settings?.whatsapp ? <p className="sm:col-span-2 text-[10px] leading-5 text-zinc-400">After submission, Lunar may follow up through WhatsApp at the contact number provided.</p> : null}
    </form>
  );
}
