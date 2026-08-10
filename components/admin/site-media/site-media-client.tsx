"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
  MapPinned,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { MediaUploader } from "@/components/admin/media-uploader";
import {
  FormHeader,
  FormSection,
} from "@/components/admin/forms/form-elements";
import {
  adminFetch,
  type ApiEnvelope,
} from "@/lib/api";
import type { SiteContentSettings } from "@/modules/site-content/site-content.types";

const initialState: SiteContentSettings = {
  id: "public",
  homeHero: null,
  servicesHero: null,
  projectsHero: null,
  contactHero: null,
  partners: [],
  officeLocation: {
    name: "Kantor Lunar Konstruksi",
    address: "",
    googleMapsUrl: "",
    googleMapsEmbedUrl: "",
    isVisible: false,
  },
  companyProfile: {
    companyName: "Lunar Konstruksi",
    shortDescription:
      "Perencanaan, koordinasi, dan pekerjaan konstruksi dengan proses yang jelas dari awal sampai serah terima.",
    email: "hello@lunarkonstruksi.id",
    phone: "+62 812 0000 0000",
    whatsapp: "",
    instagramUrl: "",
    linkedinUrl: "",
    copyrightText: "Lunar Konstruksi",
  },
};

function extractEmbedUrl(
  value: string,
) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const sourceMatch =
    trimmed.match(
      /src\s*=\s*["']([^"']+)["']/i,
    );

  return (
    sourceMatch?.[1] ??
    trimmed
  )
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&quot;", '"');
}

function safeGoogleMapsEmbed(
  value: string,
) {
  const source =
    extractEmbedUrl(value);

  if (!source) {
    return "";
  }

  try {
    const url = new URL(source);

    if (url.protocol !== "https:") {
      return "";
    }

    if (
      (url.hostname ===
        "www.google.com" ||
        url.hostname ===
          "google.com") &&
      url.pathname.startsWith(
        "/maps/embed",
      )
    ) {
      return url.toString();
    }

    if (
      url.hostname ===
        "maps.google.com" &&
      url.searchParams.get(
        "output",
      ) === "embed"
    ) {
      return url.toString();
    }

    return "";
  } catch {
    return "";
  }
}

export default function SiteMediaClient() {
  const [content, setContent] =
    useState(initialState);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  const mapPreviewUrl =
    useMemo(
      () =>
        safeGoogleMapsEmbed(
          content.officeLocation
            .googleMapsEmbedUrl,
        ),
      [
        content.officeLocation
          .googleMapsEmbedUrl,
      ],
    );

  useEffect(() => {
    let active = true;

    adminFetch<
      ApiEnvelope<SiteContentSettings>
    >("/api/admin/site-content")
      .then((result) => {
        if (active) {
          setContent({
            ...initialState,
            ...result.data,
            officeLocation: {
              ...initialState.officeLocation,
              ...result.data
                .officeLocation,
            },
            companyProfile: {
              ...initialState.companyProfile,
              ...result.data
                .companyProfile,
            },
          });
        }
      })
      .catch((error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Konten halaman gagal dimuat.",
        ),
      )
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function updateOffice(
    patch: Partial<
      SiteContentSettings["officeLocation"]
    >,
  ) {
    setContent((current) => ({
      ...current,
      officeLocation: {
        ...current.officeLocation,
        ...patch,
      },
    }));
  }

  function updateCompany(
    patch: Partial<
      SiteContentSettings["companyProfile"]
    >,
  ) {
    setContent((current) => ({
      ...current,
      companyProfile: {
        ...current.companyProfile,
        ...patch,
      },
    }));
  }

  async function save() {
    try {
      setSaving(true);

      const result =
        await adminFetch<
          ApiEnvelope<SiteContentSettings>
        >(
          "/api/admin/site-content",
          {
            method: "PUT",
            body: JSON.stringify({
              homeHero:
                content.homeHero,
              servicesHero:
                content.servicesHero,
              projectsHero:
                content.projectsHero,
              contactHero:
                content.contactHero,
              officeLocation: {
                ...content.officeLocation,
                googleMapsEmbedUrl:
                  extractEmbedUrl(
                    content
                      .officeLocation
                      .googleMapsEmbedUrl,
                  ),
              },
              companyProfile:
                content.companyProfile,
            }),
          },
        );

      setContent({
        ...initialState,
        ...result.data,
        officeLocation: {
          ...initialState.officeLocation,
          ...result.data.officeLocation,
        },
        companyProfile: {
          ...initialState.companyProfile,
          ...result.data.companyProfile,
        },
      });

      toast.success(
        "Konten website berhasil diperbarui.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Konten website gagal disimpan.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-panel flex min-h-72 items-center justify-center gap-3 text-sm text-[#737e8c]">
        <LoaderCircle
          size={18}
          className="animate-spin text-[#b58c2f]"
        />
        Memuat konten website...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FormHeader
        eyebrow="Website / konten utama"
        title="Konten Website"
        description="Kelola informasi perusahaan, gambar hero, dan lokasi kantor yang tampil pada website."
      />

      <FormSection
        title="Biodata Perusahaan"
        description="Data ini dipakai pada footer dan informasi kontak publik. Jadi jika email, nomor, atau deskripsi berubah, cukup ubah dari sini."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="admin-label">
              Nama Perusahaan
            </label>

            <input
              className="admin-input"
              value={
                content.companyProfile
                  .companyName
              }
              onChange={(event) =>
                updateCompany({
                  companyName:
                    event.target.value,
                })
              }
              placeholder="Lunar Konstruksi"
            />
          </div>

          <div>
            <label className="admin-label">
              Email
            </label>

            <input
              type="email"
              className="admin-input"
              value={
                content.companyProfile
                  .email
              }
              onChange={(event) =>
                updateCompany({
                  email:
                    event.target.value,
                })
              }
              placeholder="hello@lunarkonstruksi.id"
            />
          </div>

          <div>
            <label className="admin-label">
              Nomor Telepon
            </label>

            <input
              className="admin-input"
              value={
                content.companyProfile
                  .phone
              }
              onChange={(event) =>
                updateCompany({
                  phone:
                    event.target.value,
                })
              }
              placeholder="+62 812 0000 0000"
            />
          </div>

          <div>
            <label className="admin-label">
              Nomor WhatsApp
            </label>

            <input
              className="admin-input"
              value={
                content.companyProfile
                  .whatsapp
              }
              onChange={(event) =>
                updateCompany({
                  whatsapp:
                    event.target.value,
                })
              }
              placeholder="6281234567890"
            />

            <p className="mt-2 text-xs leading-5 text-[#737e8c]">
              Boleh menggunakan format
              628xxx atau +62 xxx.
            </p>
          </div>

          <div className="lg:col-span-2">
            <label className="admin-label">
              Deskripsi Singkat
            </label>

            <textarea
              className="admin-input min-h-[110px] resize-y"
              value={
                content.companyProfile
                  .shortDescription
              }
              onChange={(event) =>
                updateCompany({
                  shortDescription:
                    event.target.value,
                })
              }
              placeholder="Deskripsi singkat perusahaan untuk footer."
            />
          </div>

          <div>
            <label className="admin-label">
              Instagram
            </label>

            <input
              type="url"
              className="admin-input"
              value={
                content.companyProfile
                  .instagramUrl
              }
              onChange={(event) =>
                updateCompany({
                  instagramUrl:
                    event.target.value,
                })
              }
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="admin-label">
              LinkedIn
            </label>

            <input
              type="url"
              className="admin-input"
              value={
                content.companyProfile
                  .linkedinUrl
              }
              onChange={(event) =>
                updateCompany({
                  linkedinUrl:
                    event.target.value,
                })
              }
              placeholder="https://linkedin.com/company/..."
            />
          </div>

          <div className="lg:col-span-2">
            <label className="admin-label">
              Nama pada Copyright
            </label>

            <input
              className="admin-input"
              value={
                content.companyProfile
                  .copyrightText
              }
              onChange={(event) =>
                updateCompany({
                  copyrightText:
                    event.target.value,
                })
              }
              placeholder="Lunar Konstruksi"
            />
          </div>
        </div>
      </FormSection>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormSection
          title="Homepage"
          description="Visual utama di sisi kanan hero Home."
        >
          <MediaUploader
            label="Hero Home"
            folder="site/heroes/home"
            value={content.homeHero}
            onChange={(homeHero) =>
              setContent({
                ...content,
                homeHero,
              })
            }
          />
        </FormSection>

        <FormSection
          title="Halaman Layanan"
          description="Visual utama pada hero daftar layanan."
        >
          <MediaUploader
            label="Hero Layanan"
            folder="site/heroes/services"
            value={content.servicesHero}
            onChange={(servicesHero) =>
              setContent({
                ...content,
                servicesHero,
              })
            }
          />
        </FormSection>

        <FormSection
          title="Halaman Proyek"
          description="Visual utama pada hero portofolio."
        >
          <MediaUploader
            label="Hero Proyek"
            folder="site/heroes/projects"
            value={content.projectsHero}
            onChange={(projectsHero) =>
              setContent({
                ...content,
                projectsHero,
              })
            }
          />
        </FormSection>

        <FormSection
          title="Halaman Kontak"
          description="Visual utama pada hero halaman kontak."
        >
          <MediaUploader
            label="Hero Kontak"
            folder="site/heroes/contact"
            value={content.contactHero}
            onChange={(contactHero) =>
              setContent({
                ...content,
                contactHero,
              })
            }
          />
        </FormSection>
      </div>

      <FormSection
        title="Lokasi Kantor"
        description="Lokasi ini akan tampil sebagai Google Maps pada halaman Contact. Tidak perlu latitude atau longitude."
      >
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div>
              <label className="admin-label">
                Nama Lokasi
              </label>

              <input
                className="admin-input"
                value={
                  content.officeLocation
                    .name
                }
                onChange={(event) =>
                  updateOffice({
                    name:
                      event.target.value,
                  })
                }
                placeholder="Kantor Lunar Konstruksi"
              />
            </div>

            <div>
              <label className="admin-label">
                Alamat Lengkap
              </label>

              <textarea
                className="admin-input min-h-[110px] resize-y"
                value={
                  content.officeLocation
                    .address
                }
                onChange={(event) =>
                  updateOffice({
                    address:
                      event.target.value,
                  })
                }
                placeholder="Tulis alamat kantor yang ingin ditampilkan."
              />
            </div>

            <div>
              <label className="admin-label">
                Link Google Maps
              </label>

              <input
                type="url"
                className="admin-input"
                value={
                  content.officeLocation
                    .googleMapsUrl
                }
                onChange={(event) =>
                  updateOffice({
                    googleMapsUrl:
                      event.target.value,
                  })
                }
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>

            <div>
              <label className="admin-label">
                Embed Google Maps
              </label>

              <textarea
                className="admin-input min-h-[120px] resize-y font-mono text-[11px]"
                value={
                  content.officeLocation
                    .googleMapsEmbedUrl
                }
                onChange={(event) =>
                  updateOffice({
                    googleMapsEmbedUrl:
                      event.target.value,
                  })
                }
                placeholder='Paste URL embed atau seluruh kode <iframe ...></iframe>'
              />

              <p className="mt-2 text-xs leading-5 text-[#737e8c]">
                Bisa paste URL embed
                atau seluruh iframe
                dari menu Google Maps.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updateOffice({
                  isVisible:
                    !content
                      .officeLocation
                      .isVisible,
                })
              }
              className="admin-button-secondary"
            >
              {content.officeLocation
                .isVisible ? (
                <Eye size={15} />
              ) : (
                <EyeOff size={15} />
              )}

              {content.officeLocation
                .isVisible
                ? "Lokasi tampil di website"
                : "Lokasi disembunyikan"}
            </button>
          </div>

          <div className="overflow-hidden border border-[#d8d1c6] bg-[#f7f3eb]">
            <div className="flex items-center justify-between gap-4 border-b border-[#d8d1c6] px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPinned
                  size={16}
                  className="text-[#b58c2f]"
                />
                <span className="text-xs font-semibold text-[#14243f]">
                  Preview peta
                </span>
              </div>

              {content.officeLocation
                .googleMapsUrl ? (
                <a
                  href={
                    content
                      .officeLocation
                      .googleMapsUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#14243f]"
                >
                  Buka Maps
                  <ExternalLink
                    size={12}
                  />
                </a>
              ) : null}
            </div>

            {mapPreviewUrl ? (
              <iframe
                src={mapPreviewUrl}
                title="Preview lokasi kantor"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[360px] w-full border-0"
              />
            ) : (
              <div className="grid min-h-[360px] place-items-center px-8 text-center">
                <div>
                  <MapPinned
                    size={28}
                    className="mx-auto text-[#b58c2f]"
                  />

                  <p className="mt-4 text-sm font-semibold text-[#14243f]">
                    Belum ada peta
                  </p>

                  <p className="mx-auto mt-2 max-w-[320px] text-xs leading-6 text-[#737e8c]">
                    Paste link Embed
                    Google Maps atau kode
                    iframe untuk melihat
                    preview di sini.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <div className="sticky bottom-4 z-10 flex justify-end border border-[#d8d1c6] bg-[#f5f1e8]/95 p-4 shadow-[0_18px_55px_rgba(20,36,63,0.10)] backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="admin-button-primary"
        >
          {saving ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Save size={16} />
          )}

          {saving
            ? "Menyimpan..."
            : "Simpan perubahan"}
        </button>
      </div>
    </div>
  );
}
