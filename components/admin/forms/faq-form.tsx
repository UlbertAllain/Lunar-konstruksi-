"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { FAQ } from "@/modules/faqs/faq.types";
import {
  BooleanField,
  FormActions,
  FormHeader,
  FormSection,
  LoadingForm,
} from "./form-elements";
import { loadRecord, saveRecord } from "./form-utils";
import { ServiceSelect } from "./service-select";

type Props = { mode: "create" | "edit"; faqId?: string };

const initialState = {
  question: "",
  answer: "",
  serviceId: "",
  order: 0,
  isPublished: true,
};

export default function FAQForm({ mode, faqId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !faqId) return;
    let active = true;
    loadRecord<FAQ>("/api/admin/faqs", faqId)
      .then((item) => {
        if (!active) return;
        setForm({
          question: item.question,
          answer: item.answer,
          serviceId: item.serviceId ?? "",
          order: item.order,
          isPublished: item.isPublished,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Data gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, faqId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      await saveRecord("/api/admin/faqs", mode, faqId, {
        question: form.question,
        answer: form.answer,
        serviceId: form.serviceId || undefined,
        order: form.order,
        isPublished: form.isPublished,
      });
      toast.success(mode === "create" ? "FAQ ditambahkan." : "FAQ diperbarui.");
      router.push("/admin/faqs");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "FAQ gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingForm />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormHeader eyebrow={mode === "create" ? "New FAQ" : "Edit FAQ"} title={mode === "create" ? "Tambah FAQ" : "Perbarui FAQ"} description="Susun jawaban yang jelas untuk mengurangi friksi sebelum calon klien menghubungi tim." />
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <FormSection title="Pertanyaan dan Jawaban">
          <div className="space-y-4">
            <div>
              <label className="admin-label">Pertanyaan</label>
              <input className="admin-input" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Jawaban</label>
              <textarea className="admin-textarea min-h-56" value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} required />
            </div>
          </div>
        </FormSection>
        <FormSection title="Klasifikasi">
          <div className="space-y-4">
            <div>
              <label className="admin-label">Layanan Terkait</label>
              <ServiceSelect optional value={form.serviceId} onChange={(serviceId) => setForm({ ...form, serviceId })} />
            </div>
            <div>
              <label className="admin-label">Urutan Tampil</label>
              <input type="number" min={0} className="admin-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
            </div>
            <BooleanField label="Publikasikan FAQ" description="Pertanyaan ditampilkan pada website." checked={form.isPublished} onChange={(isPublished) => setForm({ ...form, isPublished })} />
          </div>
        </FormSection>
      </div>
      <FormActions cancelHref="/admin/faqs" saving={saving} />
    </form>
  );
}
