"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import {
  FormHeader,
  FormSection,
} from "@/components/admin/forms/form-elements";
import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type {
  SiteContentSettings,
  SitePartner,
} from "@/modules/site-content/site-content.types";

function createPartner(): SitePartner {
  return {
    id: crypto.randomUUID(),
    name: "",
    logo: null,
    website: "",
    isPublished: true,
    order: 0,
  };
}

export default function PartnersClient() {
  const [partners, setPartners] = useState<SitePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    adminFetch<ApiEnvelope<SiteContentSettings>>("/api/admin/site-content")
      .then((result) => {
        if (active) {
          setPartners(
            [...(result.data.partners ?? [])].sort(
              (a, b) => a.order - b.order,
            ),
          );
        }
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Partner gagal dimuat.",
        ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updatePartner(id: string, patch: Partial<SitePartner>) {
    setPartners((current) =>
      current.map((partner) =>
        partner.id === id ? { ...partner, ...patch } : partner,
      ),
    );
  }

  async function save() {
    const normalized = partners.map((partner, index) => ({
      ...partner,
      name: partner.name.trim(),
      website: partner.website.trim(),
      order: Number.isFinite(partner.order) ? partner.order : index,
    }));

    if (normalized.some((partner) => partner.name.length < 2)) {
      toast.error("Semua partner harus memiliki nama.");
      return;
    }

    try {
      setSaving(true);

      const result = await adminFetch<ApiEnvelope<SiteContentSettings>>(
        "/api/admin/site-content",
        {
          method: "PUT",
          body: JSON.stringify({ partners: normalized }),
        },
      );

      setPartners(result.data.partners);
      toast.success("Partner berhasil disimpan.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Partner gagal disimpan.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-panel flex min-h-72 items-center justify-center gap-3 text-sm text-[#737e8c]">
        <LoaderCircle size={18} className="animate-spin text-[#b58c2f]" />
        Memuat partner...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FormHeader
        eyebrow="Homepage / partners"
        title="Our Partners"
        description="Nama partner wajib diisi. Logo opsional: jika tidak ada logo, homepage otomatis menampilkan nama partner sebagai teks."
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setPartners((current) => [...current, createPartner()])}
          className="admin-button-primary"
        >
          <Plus size={16} />
          Tambah partner
        </button>
      </div>

      {partners.length ? (
        <div className="space-y-4">
          {partners.map((partner, index) => (
            <FormSection
              key={partner.id}
              title={`Partner ${String(index + 1).padStart(2, "0")}`}
              description={partner.name || "Partner baru"}
            >
              <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
                <div className="grid content-start gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="admin-label">Nama Partner</label>
                    <input
                      className="admin-input"
                      value={partner.name}
                      onChange={(event) =>
                        updatePartner(partner.id, { name: event.target.value })
                      }
                      placeholder="Contoh: PT Mitra Konstruksi"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Website</label>
                    <input
                      type="url"
                      className="admin-input"
                      value={partner.website}
                      onChange={(event) =>
                        updatePartner(partner.id, { website: event.target.value })
                      }
                      placeholder="https://... (opsional)"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Urutan Tampil</label>
                    <input
                      type="number"
                      min={0}
                      className="admin-input"
                      value={partner.order}
                      onChange={(event) =>
                        updatePartner(partner.id, {
                          order: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updatePartner(partner.id, {
                          isPublished: !partner.isPublished,
                        })
                      }
                      className="admin-button-secondary"
                    >
                      {partner.isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
                      {partner.isPublished ? "Tampil di website" : "Disembunyikan"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPartners((current) =>
                          current.filter((item) => item.id !== partner.id),
                        )
                      }
                      className="admin-button-danger"
                    >
                      <Trash2 size={15} />
                      Hapus partner
                    </button>
                  </div>
                </div>

                <MediaUploader
                  label="Logo Partner (opsional)"
                  folder="site/partners"
                  value={partner.logo}
                  onChange={(logo) => updatePartner(partner.id, { logo })}
                />
              </div>
            </FormSection>
          ))}
        </div>
      ) : (
        <div className="admin-panel py-12 text-center text-sm text-[#737e8c]">
          Belum ada partner. Tambahkan partner pertama untuk menampilkan section Our Partners.
        </div>
      )}

      <div className="sticky bottom-4 z-10 flex justify-end border border-[#d8d1c6] bg-[#f5f1e8]/95 p-4 shadow-[0_18px_55px_rgba(20,36,63,0.10)] backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="admin-button-primary"
        >
          {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan partner"}
        </button>
      </div>
    </div>
  );
}
