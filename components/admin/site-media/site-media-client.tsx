"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type { SiteContentSettings } from "@/modules/site-content/site-content.types";
import {
  FormHeader,
  FormSection,
} from "@/components/admin/forms/form-elements";

const initialState: SiteContentSettings = {
  id: "public",
  homeHero: null,
  servicesHero: null,
  projectsHero: null,
  contactHero: null,
  partners: [],
};

export default function SiteMediaClient() {
  const [content, setContent] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    adminFetch<ApiEnvelope<SiteContentSettings>>("/api/admin/site-content")
      .then((result) => {
        if (active) setContent({ ...initialState, ...result.data });
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Media halaman gagal dimuat.",
        ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function save() {
    try {
      setSaving(true);

      const result = await adminFetch<ApiEnvelope<SiteContentSettings>>(
        "/api/admin/site-content",
        {
          method: "PUT",
          body: JSON.stringify({
            homeHero: content.homeHero,
            servicesHero: content.servicesHero,
            projectsHero: content.projectsHero,
            contactHero: content.contactHero,
          }),
        },
      );

      setContent(result.data);
      toast.success("Gambar hero berhasil diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gambar hero gagal disimpan.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-panel flex min-h-72 items-center justify-center gap-3 text-sm text-[#737e8c]">
        <LoaderCircle size={18} className="animate-spin text-[#b58c2f]" />
        Memuat media halaman...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FormHeader
        eyebrow="Public media / hero"
        title="Gambar Hero Halaman"
        description="Ganti visual utama tiap halaman langsung dari admin. File diunggah melalui Cloudinary; jika dikosongkan, aset lokal tetap dipakai sebagai fallback."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <FormSection title="Homepage" description="Visual utama di sisi kanan hero Home.">
          <MediaUploader
            label="Hero Home"
            folder="site/heroes/home"
            value={content.homeHero}
            onChange={(homeHero) => setContent({ ...content, homeHero })}
          />
        </FormSection>

        <FormSection title="Halaman Layanan" description="Visual utama pada hero daftar layanan.">
          <MediaUploader
            label="Hero Layanan"
            folder="site/heroes/services"
            value={content.servicesHero}
            onChange={(servicesHero) => setContent({ ...content, servicesHero })}
          />
        </FormSection>

        <FormSection title="Halaman Proyek" description="Visual utama pada hero portofolio.">
          <MediaUploader
            label="Hero Proyek"
            folder="site/heroes/projects"
            value={content.projectsHero}
            onChange={(projectsHero) => setContent({ ...content, projectsHero })}
          />
        </FormSection>

        <FormSection title="Halaman Kontak" description="Visual utama pada hero halaman kontak.">
          <MediaUploader
            label="Hero Kontak"
            folder="site/heroes/contact"
            value={content.contactHero}
            onChange={(contactHero) => setContent({ ...content, contactHero })}
          />
        </FormSection>
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end border border-[#d8d1c6] bg-[#f5f1e8]/95 p-4 shadow-[0_18px_55px_rgba(20,36,63,0.10)] backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="admin-button-primary"
        >
          {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan hero"}
        </button>
      </div>
    </div>
  );
}
