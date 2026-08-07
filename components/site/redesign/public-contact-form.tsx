"use client";

import { useMemo, useState } from "react";

import { Loader2, MessageCircleMore, Send } from "lucide-react";

import { readString } from "./public-helpers";

type ContactSettings = {
  whatsapp?: string;
  email?: string;
  phone?: string;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; reference: string; whatsappUrl: string | null }
  | { kind: "error"; message: string };

const projectOptions = [
  "Residential build",
  "Interior fit-out",
  "Renovation",
  "Commercial project",
  "Design consultation",
  "Project supervision",
];

function buildWhatsAppUrl(whatsapp: string | undefined, payload: Record<string, string>) {
  const digits = (whatsapp ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;

  const text = [
    "Halo Lunar Konstruksi,",
    "",
    `Nama: ${payload.name}`,
    `Jenis proyek: ${payload.projectType || "-"}`,
    `Lokasi: ${payload.location || "-"}`,
    `Telepon: ${payload.phone || "-"}`,
    payload.email ? `Email: ${payload.email}` : "",
    "",
    "Kebutuhan:",
    payload.message || "-",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function PublicContactForm({ settings }: { settings?: ContactSettings }) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    location: "",
    message: "",
    website: "",
  });

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 && form.phone.trim().length >= 7 && form.message.trim().length >= 8;
  }, [form]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || state.kind === "saving") return;

    setState({ kind: "saving" });

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          projectType: form.projectType,
          location: form.location,
          message: form.message,
          website: form.website,
          source: "contact-form",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            data?: { lead?: { id?: string } | null; leadId?: string; whatsappUrl?: string | null };
            error?: string | { message?: string };
          }
        | null;

      if (!response.ok || !payload?.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : readString(payload?.error && typeof payload.error === "object" ? payload.error.message : "", "Tidak bisa mengirim permintaan sekarang.");
        throw new Error(message || "Tidak bisa mengirim permintaan sekarang.");
      }

      const reference = readString(payload.data?.lead?.id ?? payload.data?.leadId, "-");
      const whatsappUrl =
        payload.data?.whatsappUrl ??
        buildWhatsAppUrl(settings?.whatsapp, {
          name: form.name,
          phone: form.phone,
          email: form.email,
          projectType: form.projectType,
          location: form.location,
          message: form.message,
        });

      setState({ kind: "success", reference, whatsappUrl });
      setForm({ name: "", phone: "", email: "", projectType: "", location: "", message: "", website: "" });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "Terjadi kendala saat mengirim permintaan.",
      });
    }
  }

  const inputClass =
    "min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#B88B5A] focus:ring-4 focus:ring-[#E9D9C7]";

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8D6A47]">Project inquiry</p>
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">Sampaikan kebutuhan proyek secara ringkas.</h3>
        <p className="max-w-2xl text-sm leading-7 text-zinc-600">
          Tim Lunar akan meninjau kebutuhan proyek, lokasi, dan ruang lingkup pekerjaan sebelum menindaklanjuti melalui WhatsApp atau jalur komunikasi yang kamu pilih.
        </p>
      </div>

      {state.kind === "success" ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-6 text-emerald-900">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Request recorded</p>
          <h4 className="mt-3 text-2xl font-semibold tracking-tight">Permintaan sudah masuk ke sistem Lunar.</h4>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-900/80">
            Referensi permintaan: <span className="font-semibold">{state.reference}</span>. Tim Lunar akan meninjau kebutuhanmu dan menghubungi kembali. Jika ingin mempercepat diskusi, kamu bisa langsung lanjut ke WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {state.whatsappUrl ? (
              <a
                href={state.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                <MessageCircleMore className="h-4 w-4" />
                Lanjut via WhatsApp
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setState({ kind: "idle" })}
              className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Kirim permintaan lain
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Nama</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Nama lengkap" />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Telepon / WhatsApp</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="08xxxxxxxxxx" />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Email (opsional)</label>
            <input className={inputClass} value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} placeholder="nama@email.com" />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Jenis proyek</label>
            <select className={inputClass} value={form.projectType} onChange={(e) => setForm((v) => ({ ...v, projectType: e.target.value }))}>
              <option value="">Pilih kebutuhan</option>
              {projectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Lokasi proyek</label>
            <input className={inputClass} value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Kota / area proyek" />
          </div>
          <div className="hidden">
            <label>Website</label>
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-900">Ringkasan kebutuhan</label>
            <textarea
              className={`${inputClass} min-h-36 resize-y py-3`}
              value={form.message}
              onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
              placeholder="Ceritakan skala proyek, kebutuhan ruang, style yang diinginkan, dan target waktu pengerjaan."
            />
          </div>

          {state.kind === "error" ? (
            <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
          ) : null}

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit || state.kind === "saving"}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.kind === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {state.kind === "saving" ? "Menyimpan permintaan..." : "Kirim permintaan"}
            </button>
            <p className="text-xs leading-6 text-zinc-500">
              Dengan mengirim formulir ini, data permintaan akan dicatat untuk keperluan tindak lanjut proyek.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
