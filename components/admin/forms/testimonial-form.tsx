"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import type { MediaImage } from "@/types/media";
import type { Testimonial } from "@/types/testimonial";
import {
  BooleanField,
  FormActions,
  FormHeader,
  FormSection,
  LoadingForm,
} from "./form-elements";
import { loadRecord, saveRecord } from "./form-utils";
import { ServiceSelect } from "./service-select";

type Props = { mode: "create" | "edit"; testimonialId?: string };

type FormState = {
  clientName: string;
  clientPosition: string;
  projectName: string;
  serviceId: string;
  message: string;
  rating: number;
  photo: MediaImage | null;
  isPublished: boolean;
  order: number;
};

const initialState: FormState = {
  clientName: "",
  clientPosition: "",
  projectName: "",
  serviceId: "",
  message: "",
  rating: 5,
  photo: null,
  isPublished: true,
  order: 0,
};

export default function TestimonialForm({ mode, testimonialId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !testimonialId) return;
    let active = true;
    loadRecord<Testimonial>("/api/admin/testimonials", testimonialId)
      .then((item) => {
        if (!active) return;
        setForm({
          clientName: item.clientName,
          clientPosition: item.clientPosition ?? "",
          projectName: item.projectName ?? "",
          serviceId: item.serviceId ?? "",
          message: item.message,
          rating: item.rating,
          photo: item.photo ?? null,
          isPublished: item.isPublished,
          order: item.order,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Data gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, testimonialId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      await saveRecord("/api/admin/testimonials", mode, testimonialId, {
        clientName: form.clientName,
        clientPosition: form.clientPosition || undefined,
        projectName: form.projectName || undefined,
        serviceId: form.serviceId || undefined,
        message: form.message,
        rating: form.rating,
        photo: form.photo,
        isPublished: form.isPublished,
        order: form.order,
      });
      toast.success(mode === "create" ? "Testimoni ditambahkan." : "Testimoni diperbarui.");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Testimoni gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingForm />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormHeader eyebrow={mode === "create" ? "New testimonial" : "Edit testimonial"} title={mode === "create" ? "Tambah Testimoni" : "Perbarui Testimoni"} description="Kelola bukti sosial dari klien dengan konteks project dan layanan yang relevan." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <FormSection title="Informasi Klien">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">Nama Klien</label>
                <input className="admin-input" value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Jabatan / Perusahaan</label>
                <input className="admin-input" value={form.clientPosition} onChange={(event) => setForm({ ...form, clientPosition: event.target.value })} />
              </div>
              <div>
                <label className="admin-label">Nama Project</label>
                <input className="admin-input" value={form.projectName} onChange={(event) => setForm({ ...form, projectName: event.target.value })} />
              </div>
              <div>
                <label className="admin-label">Layanan Terkait</label>
                <ServiceSelect optional value={form.serviceId} onChange={(serviceId) => setForm({ ...form, serviceId })} />
              </div>
            </div>
          </FormSection>
          <FormSection title="Isi Testimoni">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Pesan Klien</label>
                <textarea className="admin-textarea min-h-48" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Rating</label>
                <select className="admin-input max-w-48" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
                </select>
              </div>
            </div>
          </FormSection>
        </div>
        <div className="space-y-5">
          <FormSection title="Foto Klien">
            <MediaUploader label="Foto (opsional)" folder="testimonials" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} />
          </FormSection>
          <FormSection title="Publikasi">
            <div className="space-y-3">
              <div>
                <label className="admin-label">Urutan Tampil</label>
                <input type="number" min={0} className="admin-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
              </div>
              <BooleanField label="Publikasikan testimoni" description="Testimoni dapat tampil pada website." checked={form.isPublished} onChange={(isPublished) => setForm({ ...form, isPublished })} />
            </div>
          </FormSection>
        </div>
      </div>
      <FormActions cancelHref="/admin/testimonials" saving={saving} />
    </form>
  );
}
