"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
} from "lucide-react";

import {
  buildLeadWhatsAppText,
  submitPublicLead,
} from "@/features/leads/client";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  message: string;
  website: string;
};

const EMPTY_FORM: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  location: "",
  message: "",
  website: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] =
    useState<ContactFormState | null>(null);
  const [startedAt] = useState(() => Date.now());

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281200000000";
  const email =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const displayPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const result = await submitPublicLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        projectType: form.projectType,
        location: form.location,
        message: form.message,
        website: form.website,
        startedAt,
      });

      setLeadId(result.leadId);
      setSubmittedForm(form);
      setSubmitState("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Permintaan belum dapat dikirim. Silakan coba lagi.",
      );
      setSubmitState("error");
    }
  }

  function openWhatsApp() {
    if (!submittedForm) {
      return;
    }

    const text = buildLeadWhatsAppText(
      {
        name: submittedForm.name,
        phone: submittedForm.phone,
        email: submittedForm.email || undefined,
        projectType: submittedForm.projectType,
        location: submittedForm.location,
        message: submittedForm.message,
      },
      leadId,
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setLeadId(null);
    setSubmittedForm(null);
    setSubmitState("idle");
    setErrorMessage("");
  }

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader dark />

      <main className="bg-[#12151b] pb-20 text-white sm:pb-28">
        <section className="site-container grid gap-14 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="site-kicker text-orange-400">
              Contact / Start here
            </span>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">
              Mari mulai dari konteks yang jelas.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-400">
              Kirim gambaran awal project. Informasi ini akan tercatat agar tim
              kami dapat memahami kebutuhan sebelum menjadwalkan diskusi lebih
              lanjut.
            </p>

            <div className="mt-12 space-y-5 border-t border-white/10 pt-8">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 text-sm text-slate-300"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <Mail size={18} />
                </span>
                {email}
              </a>

              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <Phone size={18} />
                </span>
                {displayPhone}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <MapPin size={18} />
                </span>
                Indonesia
              </div>
            </div>
          </div>

          {submitState === "success" ? (
            <div className="flex min-h-[520px] flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 size={26} />
                </span>

                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em]">
                  Permintaan sudah tercatat.
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-slate-400">
                  Detail project kamu sudah masuk ke sistem Lunar Konstruksi.
                  Tim dapat meninjaunya tanpa bergantung pada riwayat chat
                  WhatsApp.
                </p>

                {leadId ? (
                  <div className="mt-7 rounded-2xl border border-white/10 bg-black/10 px-5 py-4">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Referensi
                    </span>
                    <p className="mt-2 font-mono text-sm text-slate-300">
                      {leadId}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex h-13 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-semibold text-slate-950 transition hover:bg-orange-400"
                >
                  Lanjut via WhatsApp
                  <ArrowUpRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-13 items-center justify-center gap-2 rounded-xl border border-white/10 px-6 font-semibold text-white transition hover:bg-white/10"
                >
                  <RotateCcw size={17} />
                  Kirim lainnya
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="contact-label">Nama</span>
                  <input
                    required
                    autoComplete="name"
                    className="contact-input"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Nomor WhatsApp</span>
                  <input
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    className="contact-input"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="contact-label">Email (opsional)</span>
                  <input
                    type="email"
                    autoComplete="email"
                    className="contact-input"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="nama@email.com"
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Jenis Project</span>
                  <input
                    required
                    className="contact-input"
                    value={form.projectType}
                    onChange={(event) =>
                      setForm({ ...form, projectType: event.target.value })
                    }
                    placeholder="Hunian, renovasi, komersial..."
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Lokasi</span>
                  <input
                    required
                    autoComplete="address-level2"
                    className="contact-input"
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="contact-label">Keterangan Awal</span>
                  <textarea
                    required
                    className="contact-input min-h-40 resize-y py-4"
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    placeholder="Ceritakan kebutuhan, ukuran perkiraan, target waktu, dan kondisi saat ini."
                  />
                </label>

                <label
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
                >
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) =>
                      setForm({ ...form, website: event.target.value })
                    }
                  />
                </label>
              </div>

              {submitState === "error" ? (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menyimpan permintaan...
                  </>
                ) : (
                  <>
                    Kirim permintaan
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Data ini digunakan untuk menindaklanjuti kebutuhan project dan
                tidak dipublikasikan di website.
              </p>
            </form>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}