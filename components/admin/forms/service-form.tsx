"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import {
  BooleanField,
  FormActions,
  FormHeader,
  FormSection,
  LoadingForm,
} from "./form-elements";
import { loadRecord, saveRecord } from "./form-utils";
import type { ConstructionService, ServiceFeature } from "@/modules/services/service.types";
import type { MediaImage } from "@/modules/media/media.types";

type Props = { mode: "create" | "edit"; serviceId?: string };

type FormState = {
  name: string;
  shortDescription: string;
  description: string;
  coverImage: MediaImage | null;
  features: ServiceFeature[];
  scopes: { name: string }[];
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

const initialState: FormState = {
  name: "",
  shortDescription: "",
  description: "",
  coverImage: null,
  features: [{ title: "", description: "" }],
  scopes: [{ name: "" }],
  isFeatured: false,
  isPublished: true,
  order: 0,
};

export default function ServiceForm({ mode, serviceId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !serviceId) return;
    let active = true;

    loadRecord<ConstructionService>("/api/admin/services", serviceId)
      .then((service) => {
        if (!active) return;
        setForm({
          name: service.name,
          shortDescription: service.shortDescription,
          description: service.description,
          coverImage: service.coverImage,
          features: service.features.length ? service.features : initialState.features,
          scopes: service.scopes.length ? service.scopes : initialState.scopes,
          isFeatured: service.isFeatured,
          isPublished: service.isPublished,
          order: service.order,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Data gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, serviceId]);

  function updateFeature(index: number, field: keyof ServiceFeature, value: string) {
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index ? { ...feature, [field]: value } : feature,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.coverImage) {
      toast.error("Cover layanan wajib diunggah dari perangkat.");
      return;
    }

    try {
      setSaving(true);
      await saveRecord(
        "/api/admin/services",
        mode,
        serviceId,
        {
          ...form,
          features: form.features.filter((item) => item.title.trim() && item.description.trim()),
          scopes: form.scopes.filter((item) => item.name.trim()),
        },
      );
      toast.success(mode === "create" ? "Layanan berhasil ditambahkan." : "Layanan berhasil diperbarui.");
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Layanan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingForm />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormHeader
        eyebrow={mode === "create" ? "New service" : "Edit service"}
        title={mode === "create" ? "Tambah Layanan" : "Perbarui Layanan"}
        description="Atur informasi layanan, keunggulan, lingkup pekerjaan, gambar cover, dan status publikasinya."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <FormSection title="Informasi Utama">
            <div className="grid gap-4">
              <div>
                <label className="admin-label">Nama Layanan</label>
                <input className="admin-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Contoh: Konstruksi Bangunan" required />
              </div>
              <div>
                <label className="admin-label">Deskripsi Singkat</label>
                <textarea className="admin-textarea min-h-24" value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} maxLength={220} required />
                <p className="mt-1 text-right text-xs text-slate-400">{form.shortDescription.length}/220</p>
              </div>
              <div>
                <label className="admin-label">Deskripsi Lengkap</label>
                <textarea className="admin-textarea min-h-44" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
              </div>
            </div>
          </FormSection>

          <FormSection title="Keunggulan Layanan" description="Jelaskan alasan utama klien memilih layanan ini.">
            <div className="space-y-3">
              {form.features.map((feature, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_1.5fr_auto]">
                  <input className="admin-input" value={feature.title} onChange={(event) => updateFeature(index, "title", event.target.value)} placeholder="Judul keunggulan" />
                  <input className="admin-input" value={feature.description} onChange={(event) => updateFeature(index, "description", event.target.value)} placeholder="Penjelasan singkat" />
                  <button type="button" className="admin-icon-button text-red-600" onClick={() => setForm((current) => ({ ...current, features: current.features.filter((_, itemIndex) => itemIndex !== index) }))} disabled={form.features.length === 1}><Trash2 size={16} /></button>
                </div>
              ))}
              <button type="button" className="admin-button-secondary" onClick={() => setForm((current) => ({ ...current, features: [...current.features, { title: "", description: "" }] }))}><Plus size={16} /> Tambah Keunggulan</button>
            </div>
          </FormSection>

          <FormSection title="Lingkup Pekerjaan">
            <div className="space-y-3">
              {form.scopes.map((scope, index) => (
                <div key={index} className="flex gap-3">
                  <input className="admin-input" value={scope.name} onChange={(event) => setForm((current) => ({ ...current, scopes: current.scopes.map((item, itemIndex) => itemIndex === index ? { name: event.target.value } : item) }))} placeholder="Contoh: Pekerjaan struktur" />
                  <button type="button" className="admin-icon-button text-red-600" onClick={() => setForm((current) => ({ ...current, scopes: current.scopes.filter((_, itemIndex) => itemIndex !== index) }))} disabled={form.scopes.length === 1}><Trash2 size={16} /></button>
                </div>
              ))}
              <button type="button" className="admin-button-secondary" onClick={() => setForm((current) => ({ ...current, scopes: [...current.scopes, { name: "" }] }))}><Plus size={16} /> Tambah Lingkup</button>
            </div>
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Media">
            <MediaUploader label="Cover Layanan" folder="services" value={form.coverImage} onChange={(coverImage) => setForm({ ...form, coverImage })} required />
          </FormSection>
          <FormSection title="Publikasi">
            <div className="space-y-3">
              <div>
                <label className="admin-label">Urutan Tampil</label>
                <input type="number" min={0} className="admin-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
              </div>
              <BooleanField label="Tampilkan di website" description="Layanan dapat dibaca oleh pengunjung." checked={form.isPublished} onChange={(isPublished) => setForm({ ...form, isPublished })} />
              <BooleanField label="Jadikan unggulan" description="Prioritaskan layanan pada halaman utama." checked={form.isFeatured} onChange={(isFeatured) => setForm({ ...form, isFeatured })} />
            </div>
          </FormSection>
        </div>
      </div>

      <FormActions cancelHref="/admin/services" saving={saving} />
    </form>
  );
}
