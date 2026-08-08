"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import type { MediaImage } from "@/modules/media/media.types";
import type { TeamMember } from "@/modules/team/team.types";
import {
  BooleanField,
  FormActions,
  FormHeader,
  FormSection,
  LoadingForm,
} from "./form-elements";
import { arrayToLines, linesToArray, loadRecord, saveRecord } from "./form-utils";

type Props = { mode: "create" | "edit"; memberId?: string };

type FormState = {
  name: string;
  position: string;
  description: string;
  photo: MediaImage | null;
  skillsText: string;
  instagram: string;
  linkedin: string;
  order: number;
  isActive: boolean;
};

const initialState: FormState = {
  name: "",
  position: "",
  description: "",
  photo: null,
  skillsText: "",
  instagram: "",
  linkedin: "",
  order: 0,
  isActive: true,
};

export default function TeamForm({ mode, memberId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !memberId) return;
    let active = true;
    loadRecord<TeamMember>("/api/admin/team", memberId)
      .then((member) => {
        if (!active) return;
        setForm({
          name: member.name,
          position: member.position,
          description: member.description,
          photo: member.photo,
          skillsText: arrayToLines(member.skills),
          instagram: member.social?.instagram ?? "",
          linkedin: member.social?.linkedin ?? "",
          order: member.order,
          isActive: member.isActive,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Data gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, memberId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.photo) {
      toast.error("Foto anggota tim wajib diunggah.");
      return;
    }

    try {
      setSaving(true);
      await saveRecord("/api/admin/team", mode, memberId, {
        name: form.name,
        position: form.position,
        description: form.description,
        photo: form.photo,
        skills: linesToArray(form.skillsText),
        social: {
          instagram: form.instagram,
          linkedin: form.linkedin,
        },
        order: form.order,
        isActive: form.isActive,
      });
      toast.success(mode === "create" ? "Anggota tim ditambahkan." : "Anggota tim diperbarui.");
      router.push("/admin/team");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Data gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingForm />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormHeader eyebrow={mode === "create" ? "New team member" : "Edit team member"} title={mode === "create" ? "Tambah Anggota Tim" : "Perbarui Anggota Tim"} description="Tampilkan sosok di balik kualitas pengerjaan Lunar Konstruksi secara profesional." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <FormSection title="Profil Profesional">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">Nama Lengkap</label>
                <input className="admin-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Posisi</label>
                <input className="admin-input" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Deskripsi</label>
                <textarea className="admin-textarea min-h-40" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Keahlian</label>
                <textarea className="admin-textarea min-h-32" value={form.skillsText} onChange={(event) => setForm({ ...form, skillsText: event.target.value })} placeholder={'Manajemen proyek\nEstimasi biaya\nQuality control'} required />
                <p className="mt-1 text-xs text-slate-400">Satu keahlian per baris.</p>
              </div>
            </div>
          </FormSection>
          <FormSection title="Tautan Profesional">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">Instagram</label>
                <input type="url" className="admin-input" value={form.instagram} onChange={(event) => setForm({ ...form, instagram: event.target.value })} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="admin-label">LinkedIn</label>
                <input type="url" className="admin-input" value={form.linkedin} onChange={(event) => setForm({ ...form, linkedin: event.target.value })} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </FormSection>
        </div>
        <div className="space-y-5">
          <FormSection title="Foto Profil">
            <MediaUploader label="Foto Anggota" folder="team" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} required />
          </FormSection>
          <FormSection title="Penayangan">
            <div className="space-y-3">
              <div>
                <label className="admin-label">Urutan Tampil</label>
                <input type="number" min={0} className="admin-input" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
              </div>
              <BooleanField label="Anggota aktif" description="Profil ditampilkan pada website publik." checked={form.isActive} onChange={(isActive) => setForm({ ...form, isActive })} />
            </div>
          </FormSection>
        </div>
      </div>
      <FormActions cancelHref="/admin/team" saving={saving} />
    </form>
  );
}
