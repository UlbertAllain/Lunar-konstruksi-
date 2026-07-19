"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  MediaUploader,
  MultipleMediaUploader,
} from "@/components/admin/media-uploader";
import type { MediaImage } from "@/types/media";
import type { Project, ProjectStatus } from "@/types/project";
import {
  BooleanField,
  FormActions,
  FormHeader,
  FormSection,
  LoadingForm,
} from "./form-elements";
import {
  arrayToLines,
  linesToArray,
  loadRecord,
  saveRecord,
} from "./form-utils";
import { ServiceSelect } from "./service-select";

type Props = { mode: "create" | "edit"; projectId?: string };

type FormState = {
  title: string;
  serviceId: string;
  clientName: string;
  location: string;
  year: number;
  shortDescription: string;
  description: string;
  coverImage: MediaImage | null;
  gallery: MediaImage[];
  scopeText: string;
  materialsText: string;
  duration: string;
  status: ProjectStatus;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

const initialState: FormState = {
  title: "",
  serviceId: "",
  clientName: "",
  location: "",
  year: new Date().getFullYear(),
  shortDescription: "",
  description: "",
  coverImage: null,
  gallery: [],
  scopeText: "",
  materialsText: "",
  duration: "",
  status: "COMPLETED",
  isFeatured: false,
  isPublished: true,
  order: 0,
};

export default function ProjectForm({ mode, projectId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !projectId) return;
    let active = true;

    loadRecord<Project>("/api/admin/projects", projectId)
      .then((project) => {
        if (!active) return;
        setForm({
          title: project.title,
          serviceId: project.serviceId,
          clientName: project.clientName ?? "",
          location: project.location,
          year: project.year,
          shortDescription: project.shortDescription,
          description: project.description,
          coverImage: project.coverImage,
          gallery: project.gallery ?? [],
          scopeText: arrayToLines(project.scope),
          materialsText: arrayToLines(project.materials),
          duration: project.duration,
          status: project.status,
          isFeatured: project.isFeatured,
          isPublished: project.isPublished,
          order: project.order ?? 0,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Data gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, projectId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.coverImage) {
      toast.error("Cover project wajib diunggah.");
      return;
    }

    try {
      setSaving(true);
      await saveRecord("/api/admin/projects", mode, projectId, {
        title: form.title,
        serviceId: form.serviceId,
        clientName: form.clientName || undefined,
        location: form.location,
        year: form.year,
        shortDescription: form.shortDescription,
        description: form.description,
        coverImage: form.coverImage,
        gallery: form.gallery,
        scope: linesToArray(form.scopeText),
        materials: linesToArray(form.materialsText),
        duration: form.duration,
        status: form.status,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        order: form.order,
      });
      toast.success(mode === "create" ? "Project berhasil ditambahkan." : "Project berhasil diperbarui.");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Project gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingForm />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormHeader
        eyebrow={mode === "create" ? "New portfolio" : "Edit portfolio"}
        title={mode === "create" ? "Tambah Project" : "Perbarui Project"}
        description="Bangun studi kasus portfolio yang terstruktur, lengkap dengan dokumentasi visual dari storage."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <FormSection title="Identitas Project">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="admin-label">Judul Project</label>
                <input className="admin-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Layanan</label>
                <ServiceSelect value={form.serviceId} onChange={(serviceId) => setForm({ ...form, serviceId })} />
              </div>
              <div>
                <label className="admin-label">Nama Klien</label>
                <input className="admin-input" value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} placeholder="Opsional" />
              </div>
              <div>
                <label className="admin-label">Lokasi</label>
                <input className="admin-input" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Tahun</label>
                <input type="number" min={2000} max={2100} className="admin-input" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} required />
              </div>
            </div>
          </FormSection>

          <FormSection title="Narasi Project">
            <div className="space-y-4">
              <div>
                <label className="admin-label">Ringkasan</label>
                <textarea className="admin-textarea min-h-24" maxLength={220} value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Deskripsi Lengkap</label>
                <textarea className="admin-textarea min-h-48" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
              </div>
            </div>
          </FormSection>

          <FormSection title="Detail Teknis" description="Masukkan satu item per baris agar tampil rapi pada halaman project.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">Lingkup Pekerjaan</label>
                <textarea className="admin-textarea min-h-36" value={form.scopeText} onChange={(event) => setForm({ ...form, scopeText: event.target.value })} placeholder={'Pekerjaan struktur\nFinishing interior'} required />
              </div>
              <div>
                <label className="admin-label">Material Utama</label>
                <textarea className="admin-textarea min-h-36" value={form.materialsText} onChange={(event) => setForm({ ...form, materialsText: event.target.value })} placeholder={'Beton bertulang\nBaja ringan'} required />
              </div>
              <div>
                <label className="admin-label">Durasi</label>
                <input className="admin-input" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder="Contoh: 4 bulan" required />
              </div>
              <div>
                <label className="admin-label">Status Pengerjaan</label>
                <select className="admin-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}>
                  <option value="PLANNING">Perencanaan</option>
                  <option value="PROCESS">Dalam Proses</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection title="Gallery Dokumentasi">
            <MultipleMediaUploader label="Foto Project" folder="projects/gallery" value={form.gallery} onChange={(gallery) => setForm({ ...form, gallery })} />
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Cover Project">
            <MediaUploader label="Gambar Cover" folder="projects/cover" value={form.coverImage} onChange={(coverImage) => setForm({ ...form, coverImage })} required />
          </FormSection>
          <FormSection title="Publikasi">
            <div className="space-y-3">
              <div>
                <label className="admin-label">Urutan Tampil</label>
                <input type="number" min={0} className="admin-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
              </div>
              <BooleanField label="Publikasikan project" description="Project tampil pada portfolio publik." checked={form.isPublished} onChange={(isPublished) => setForm({ ...form, isPublished })} />
              <BooleanField label="Project unggulan" description="Project diprioritaskan pada homepage." checked={form.isFeatured} onChange={(isFeatured) => setForm({ ...form, isFeatured })} />
            </div>
          </FormSection>
        </div>
      </div>

      <FormActions cancelHref="/admin/projects" saving={saving} />
    </form>
  );
}
