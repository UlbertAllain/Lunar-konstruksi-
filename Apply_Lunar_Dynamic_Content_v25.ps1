# Lunar Konstruksi - Dynamic Hero + Partners + Navbar Dropdown + Related Projects v25
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Dynamic_Content_v25.ps1
# Tidak menambah dependency baru.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

function Backup-File {
  param([string]$Source, [string]$BackupRoot, [string]$RelativePath)
  if (-not (Test-Path $Source)) { return }
  $dest = Join-Path $BackupRoot $RelativePath
  $dir = Split-Path -Parent $dest
  if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Copy-Item -Force $Source $dest
}

function Replace-Safe {
  param([string]$Path, [string]$Old, [string]$New, [string]$Label)
  if (-not (Test-Path $Path)) { Write-Warning "Missing: $Path"; return }
  $text = [System.IO.File]::ReadAllText($Path)
  if ($text.Contains($Old)) {
    Write-Utf8NoBom $Path ($text.Replace($Old, $New))
    Write-Host "  updated: $Label" -ForegroundColor DarkGray
  } elseif ($text.Contains($New)) {
    Write-Host "  already: $Label" -ForegroundColor DarkGray
  } else {
    Write-Warning "Pattern tidak ditemukan: $Label"
  }
}

$repoRoot = $PSScriptRoot
if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
  if (Test-Path (Join-Path (Get-Location) "package.json")) {
    $repoRoot = (Get-Location).Path
  } else {
    throw "Jalankan dari root repository Lunar Konstruksi."
  }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\dynamic-content-v25-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupTargets = @(
  "components\site\formwork\data.ts",
  "components\site\formwork\header.tsx",
  "components\site\site-header.tsx",
  "components\site\formwork\home.tsx",
  "components\site\formwork\services.tsx",
  "components\site\formwork\projects.tsx",
  "components\site\formwork\contact.tsx",
  "components\site\service-detail-page.tsx",
  "modules\public-site\public-site.service.ts",
  "modules\public-site\public-site.types.ts",
  "components\admin\header.tsx",
  "components\admin\sidebar.tsx",
  "app\services\[slug]\page.tsx"
)
foreach ($relative in $backupTargets) {
  Backup-File (Join-Path $repoRoot $relative) $backupRoot $relative
}

Write-Host ""
Write-Host "=== Lunar Dynamic Content v25 ===" -ForegroundColor Cyan

# 1. Site content backend
Write-Host "[1/6] Site content backend..." -ForegroundColor Yellow

Write-Utf8NoBom (Join-Path $repoRoot "modules\site-content\site-content.types.ts") @'
import type { MediaImage } from "@/modules/media/media.types";

export interface SitePartner {
  id: string;
  name: string;
  logo: MediaImage | null;
  website: string;
  isPublished: boolean;
  order: number;
}

export interface SiteContentSettings {
  id: "public";
  homeHero: MediaImage | null;
  servicesHero: MediaImage | null;
  projectsHero: MediaImage | null;
  contactHero: MediaImage | null;
  partners: SitePartner[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

'@
Write-Utf8NoBom (Join-Path $repoRoot "modules\site-content\site-content.schema.ts") @'
import { z } from "zod";

const mediaImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
});

const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Nama partner minimal 2 karakter."),
  logo: mediaImageSchema.nullable(),
  website: z.string().trim(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const siteContentSchema = z.object({
  homeHero: mediaImageSchema.nullable(),
  servicesHero: mediaImageSchema.nullable(),
  projectsHero: mediaImageSchema.nullable(),
  contactHero: mediaImageSchema.nullable(),
  partners: z.array(partnerSchema),
});

'@
Write-Utf8NoBom (Join-Path $repoRoot "modules\site-content\site-content.repository.ts") @'
import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";
import type { SiteContentSettings } from "./site-content.types";

const COLLECTION = "siteSettings";
const DOCUMENT = "publicContent";

export const SITE_CONTENT_DEFAULTS: SiteContentSettings = {
  id: "public",
  homeHero: null,
  servicesHero: null,
  projectsHero: null,
  contactHero: null,
  partners: [],
};

export async function getSiteContentSettings(): Promise<SiteContentSettings> {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .doc(DOCUMENT)
    .get();

  if (!snapshot.exists) {
    return SITE_CONTENT_DEFAULTS;
  }

  const data = serializeDocument<
    Omit<SiteContentSettings, "id">
  >(snapshot.id, snapshot.data());

  return {
    ...SITE_CONTENT_DEFAULTS,
    ...data,
    id: "public",
    partners: Array.isArray(data.partners) ? data.partners : [],
  };
}

export async function saveSiteContentSettings(
  data: Partial<Omit<SiteContentSettings, "id" | "createdAt" | "updatedAt">>,
) {
  const ref = getAdminDb().collection(COLLECTION).doc(DOCUMENT);
  const exists = (await ref.get()).exists;

  await ref.set(
    {
      ...data,
      ...(exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return getSiteContentSettings();
}

'@
Write-Utf8NoBom (Join-Path $repoRoot "modules\site-content\site-content.service.ts") @'
import { deleteImagesSafely } from "@/modules/media/upload.service";
import {
  getSiteContentSettings,
  saveSiteContentSettings,
} from "./site-content.repository";
import { siteContentSchema } from "./site-content.schema";
import type { SiteContentSettings } from "./site-content.types";

function imageIds(content: SiteContentSettings) {
  return [
    content.homeHero?.publicId,
    content.servicesHero?.publicId,
    content.projectsHero?.publicId,
    content.contactHero?.publicId,
    ...content.partners.map((partner) => partner.logo?.publicId),
  ].filter((value): value is string => Boolean(value));
}

export function readSiteContentSettings() {
  return getSiteContentSettings();
}

export async function updateSiteContentSettings(payload: unknown) {
  const previous = await getSiteContentSettings();
  const patch = siteContentSchema.partial().parse(payload);

  const next: SiteContentSettings = {
    ...previous,
    ...patch,
    id: "public",
  };

  const saved = await saveSiteContentSettings(patch);
  const retained = new Set(imageIds(next));

  await deleteImagesSafely(
    imageIds(previous).filter((publicId) => !retained.has(publicId)),
  );

  return saved;
}

'@
Write-Utf8NoBom (Join-Path $repoRoot "app\api\admin\site-content\route.ts") @'
import { NextRequest } from "next/server";

import {
  readSiteContentSettings,
  updateSiteContentSettings,
} from "@/modules/site-content/site-content.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await readSiteContentSettings());
  } catch (error) {
    return routeError(error, "Gagal mengambil konten situs.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(
      await updateSiteContentSettings(await request.json()),
    );
  } catch (error) {
    return routeError(error, "Gagal menyimpan konten situs.");
  }
}

export const PATCH = PUT;

'@

# 2. Public data integration
Write-Host "[2/6] Public data integration..." -ForegroundColor Yellow

$typesFile = Join-Path $repoRoot "modules\public-site\public-site.types.ts"
$types = [System.IO.File]::ReadAllText($typesFile)

if (-not $types.Contains('SiteContentSettings')) {
  $types = $types.Replace(
    'import type { Testimonial } from "@/modules/testimonials/testimonial.types";',
    'import type { Testimonial } from "@/modules/testimonials/testimonial.types";' + [Environment]::NewLine +
    'import type { SiteContentSettings } from "@/modules/site-content/site-content.types";'
  )
}
if (-not $types.Contains('siteContent: SiteContentSettings;')) {
  $types = $types.Replace(
    '  faqs: FAQ[];',
    '  faqs: FAQ[];' + [Environment]::NewLine +
    '  siteContent: SiteContentSettings;'
  )
}
Write-Utf8NoBom $typesFile $types

$serviceFile = Join-Path $repoRoot "modules\public-site\public-site.service.ts"
$serviceText = [System.IO.File]::ReadAllText($serviceFile)

if (-not $serviceText.Contains('getSiteContentSettings')) {
  $serviceText = 'import { getSiteContentSettings } from "@/modules/site-content/site-content.repository";' +
    [Environment]::NewLine + $serviceText
}

$oldPromise = @'
  const [services, projects, team, testimonials, faqs] = await Promise.all([
    getPublicServices(),
    getPublicProjects(),
    getPublicTeam(),
    getPublicTestimonials(),
    getPublicFaqs(),
  ]);

  return { services, projects, team, testimonials, faqs };
'@
$newPromise = @'
  const [services, projects, team, testimonials, faqs, siteContent] = await Promise.all([
    getPublicServices(),
    getPublicProjects(),
    getPublicTeam(),
    getPublicTestimonials(),
    getPublicFaqs(),
    getSiteContentSettings(),
  ]);

  return { services, projects, team, testimonials, faqs, siteContent };
'@
if ($serviceText.Contains($oldPromise)) {
  $serviceText = $serviceText.Replace($oldPromise, $newPromise)
} elseif (-not $serviceText.Contains('siteContent] = await Promise.all')) {
  throw "getPublicOverviewData structure tidak cocok; hentikan agar aman."
}
Write-Utf8NoBom $serviceFile $serviceText

$dataFile = Join-Path $repoRoot "components\site\formwork\data.ts"
$dataText = [System.IO.File]::ReadAllText($dataFile)
if (-not $dataText.Contains('SiteContentSettings')) {
  $dataText = 'import type { SiteContentSettings } from "@/modules/site-content/site-content.types";' +
    [Environment]::NewLine + [Environment]::NewLine + $dataText
}
if (-not $dataText.Contains('siteContent: SiteContentSettings;')) {
  $dataText = $dataText.Replace(
    '  faqs: unknown[];',
    '  faqs: unknown[];' + [Environment]::NewLine +
    '  siteContent: SiteContentSettings;'
  )
}
Write-Utf8NoBom $dataFile $dataText

# 3. Admin UI
Write-Host "[3/6] Admin Hero + Partners..." -ForegroundColor Yellow

Write-Utf8NoBom (Join-Path $repoRoot "components\admin\site-media\site-media-client.tsx") @'
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

'@
Write-Utf8NoBom (Join-Path $repoRoot "components\admin\partners\partners-client.tsx") @'
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

'@
Write-Utf8NoBom (Join-Path $repoRoot "app\admin\(dashboard)\site-media\page.tsx") @'
import SiteMediaClient from "@/components/admin/site-media/site-media-client";

export default function SiteMediaPage() {
  return <SiteMediaClient />;
}
'@
Write-Utf8NoBom (Join-Path $repoRoot "app\admin\(dashboard)\partners\page.tsx") @'
import PartnersClient from "@/components/admin/partners/partners-client";

export default function PartnersPage() {
  return <PartnersClient />;
}
'@

foreach ($adminFile in @(
  (Join-Path $repoRoot "components\admin\sidebar.tsx"),
  (Join-Path $repoRoot "components\admin\header.tsx")
)) {
  $adminText = [System.IO.File]::ReadAllText($adminFile)

  if (-not $adminText.Contains('Handshake,')) {
    $adminText = $adminText.Replace(
      '  Home,',
      '  Handshake,' + [Environment]::NewLine +
      '  Home,' + [Environment]::NewLine +
      '  Images,'
    )
  }

  if (-not $adminText.Contains('href: "/admin/site-media"')) {
    $adminText = $adminText.Replace(
      '{ name: "Dashboard", href: "/admin/dashboard", icon: Home },',
      '{ name: "Dashboard", href: "/admin/dashboard", icon: Home },' + [Environment]::NewLine +
      '  { name: "Media Halaman", href: "/admin/site-media", icon: Images },'
    )
  }

  if (-not $adminText.Contains('href: "/admin/partners"')) {
    $adminText = $adminText.Replace(
      '{ name: "Proyek", href: "/admin/projects", icon: FolderKanban },',
      '{ name: "Proyek", href: "/admin/projects", icon: FolderKanban },' + [Environment]::NewLine +
      '  { name: "Partner", href: "/admin/partners", icon: Handshake },'
    )
  }

  Write-Utf8NoBom $adminFile $adminText
}

# 4. Dynamic navbar
Write-Host "[4/6] Navbar dropdown..." -ForegroundColor Yellow

Write-Utf8NoBom (Join-Path $repoRoot "components\site\formwork\header.tsx") @'
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { displayFont } from "./decor";
import { projectModel, serviceModel } from "./data";

type Props = {
  services?: unknown[];
  projects?: unknown[];
};

function activePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FormworkHeader({
  services = [],
  projects = [],
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<"projects" | "services" | null>(null);

  const serviceItems = useMemo(
    () => services.map(serviceModel).filter((item) => item.slug),
    [services],
  );
  const projectItems = useMemo(
    () => projects.map(projectModel).filter((item) => item.slug),
    [projects],
  );

  const groups = [
    {
      key: "projects" as const,
      href: "/projects",
      label: "Proyek",
      items: projectItems.map((item) => ({
        href: `/projects/${item.slug}`,
        label: item.title,
        meta: item.location,
      })),
    },
    {
      key: "services" as const,
      href: "/services",
      label: "Layanan",
      items: serviceItems.map((item) => ({
        href: `/services/${item.slug}`,
        label: item.name,
        meta: "Layanan",
      })),
    },
  ];

  function closeMobile() {
    setOpen(false);
    setMobileGroup(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d1c6] bg-[#f5f1e8]/95 text-[#182d4d] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:h-[82px] sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeMobile}
          className="group flex min-w-0 items-center gap-3"
          aria-label="Lunar Konstruksi"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center sm:h-11 sm:w-11">
            <Image
              src="/lunar-logo-mark.png"
              alt=""
              width={750}
              height={770}
              priority
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            />
          </span>
          <span className="hidden sm:block">
            <span className={`${displayFont} block text-[1.02rem] font-black uppercase leading-none tracking-[0.12em]`}>
              Lunar
            </span>
            <span className="mt-1 block font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-[#b58c2f]">
              Konstruksi
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#d8d1c6] bg-white/35 p-1 lg:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
              activePath(pathname, "/")
                ? "bg-[#14243f] text-[#f8f4ec]"
                : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
            }`}
          >
            Home
          </Link>

          {groups.map((group) => (
            <div key={group.key} className="group relative">
              <Link
                href={group.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                  activePath(pathname, group.href)
                    ? "bg-[#14243f] text-[#f8f4ec]"
                    : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
                }`}
              >
                {group.label}
                <ChevronDown className="h-3 w-3 transition group-hover:rotate-180" />
              </Link>

              {group.items.length ? (
                <div className="invisible absolute left-1/2 top-[calc(100%+10px)] w-[330px] -translate-x-1/2 translate-y-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="overflow-hidden border border-[#d8d1c6] bg-[#f8f4ec] shadow-[0_22px_55px_rgba(20,36,63,0.14)]">
                    <div className="border-b border-[#ded7cb] px-4 py-3 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#b58c2f]">
                      Pilih {group.label}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center justify-between gap-4 border-b border-[#e5ded3] px-3 py-3 last:border-b-0 hover:bg-[#eee8df]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[12px] font-semibold text-[#14243f]">
                              {item.label}
                            </span>
                            <span className="mt-1 block truncate font-mono text-[7px] uppercase tracking-[0.13em] text-[#89919c]">
                              {item.meta}
                            </span>
                          </span>
                          <span className="text-[#b58c2f]">→</span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={group.href}
                      className="flex items-center justify-between bg-[#14243f] px-4 py-3 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#f8f4ec]"
                    >
                      Lihat semua {group.label}
                      <span className="text-[#dcb458]">→</span>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          <Link
            href="/contact"
            className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
              activePath(pathname, "/contact")
                ? "bg-[#14243f] text-[#f8f4ec]"
                : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
            }`}
          >
            Kontak
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="h-px w-8 bg-[#dcb458]" />
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:bg-[#14243f] hover:text-[#f8f4ec]"
          >
            Konsultasikan proyek
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] sm:h-11 sm:w-11 lg:hidden"
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#d8d1c6] bg-[#f5f1e8] px-4 pb-6 pt-2 sm:px-8 lg:hidden">
          <nav className="mx-auto flex max-w-[1480px] flex-col">
            <Link href="/" onClick={closeMobile} className="border-b border-[#ddd5c8] py-4 text-sm font-semibold">
              Home
            </Link>

            {groups.map((group) => {
              const expanded = mobileGroup === group.key;

              return (
                <div key={group.key} className="border-b border-[#ddd5c8]">
                  <div className="flex items-center">
                    <Link
                      href={group.href}
                      onClick={closeMobile}
                      className={`flex-1 py-4 text-sm font-semibold ${
                        activePath(pathname, group.href)
                          ? "text-[#b58c2f]"
                          : "text-[#14243f]"
                      }`}
                    >
                      {group.label}
                    </Link>

                    {group.items.length ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileGroup(expanded ? null : group.key)
                        }
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d1c6]"
                        aria-label={`Buka daftar ${group.label}`}
                        aria-expanded={expanded}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {expanded ? (
                    <div className="mb-3 border-l border-[#dcb458] pl-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center justify-between gap-3 py-3 text-[12px] text-[#526074]"
                        >
                          <span>{item.label}</span>
                          <span className="text-[#b58c2f]">→</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <Link href="/contact" onClick={closeMobile} className="border-b border-[#ddd5c8] py-4 text-sm font-semibold">
              Kontak
            </Link>

            <Link
              href="/contact"
              onClick={closeMobile}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#f8f4ec]"
            >
              Konsultasikan proyek
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

'@
Write-Utf8NoBom (Join-Path $repoRoot "components\site\site-header.tsx") @'
import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkHeader } from "./formwork/header";

export async function SiteHeader() {
  const data = await getPublicHomeData();

  return (
    <FormworkHeader
      services={data.services}
      projects={data.projects}
    />
  );
}

export default SiteHeader;
'@

$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"
$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
$contactFile = Join-Path $repoRoot "components\site\formwork\contact.tsx"

foreach ($publicFile in @($homeFile, $servicesFile, $projectsFile, $contactFile)) {
  Replace-Safe $publicFile '<FormworkHeader />' '<FormworkHeader services={data.services} projects={data.projects} />' "header data props"
}

# 5. Hero DB + Partners + FAQ
Write-Host "[5/6] Hero DB + Our Partners + FAQ..." -ForegroundColor Yellow

Replace-Safe $homeFile 'src={LOCAL_MEDIA.hero}' 'src={data.siteContent.homeHero?.url || LOCAL_MEDIA.hero}' "home hero"
Replace-Safe $projectsFile 'src={LOCAL_MEDIA.projectsHero || hero?.image || ""}' 'src={data.siteContent.projectsHero?.url || LOCAL_MEDIA.projectsHero || hero?.image || ""}' "projects hero"
Replace-Safe $contactFile 'src={LOCAL_MEDIA.contactHero}' 'src={data.siteContent.contactHero?.url || LOCAL_MEDIA.contactHero}' "contact hero"

$servicesText = [System.IO.File]::ReadAllText($servicesFile)
$servicesPattern = '(?s)src=\{\s*LOCAL_MEDIA\.servicesHero\s*\|\|\s*services\[0\]\?\.image\s*\|\|\s*projects\[0\]\?\.image\s*\|\|\s*""\s*\}'
$servicesText = [System.Text.RegularExpressions.Regex]::Replace(
  $servicesText,
  $servicesPattern,
  'src={data.siteContent.servicesHero?.url || LOCAL_MEDIA.servicesHero || services[0]?.image || projects[0]?.image || ""}',
  1
)
Write-Utf8NoBom $servicesFile $servicesText

$homeText = [System.IO.File]::ReadAllText($homeFile)

if (-not $homeText.Contains('const partners = data.siteContent.partners')) {
  $homeText = $homeText.Replace(
    '  const projects = data.projects.map(projectModel);',
    '  const projects = data.projects.map(projectModel);' + [Environment]::NewLine +
    '  const partners = [...data.siteContent.partners]' + [Environment]::NewLine +
    '    .filter((partner) => partner.isPublished)' + [Environment]::NewLine +
    '    .sort((a, b) => a.order - b.order);'
  )
}

if (-not $homeText.Contains('Mitra yang ikut menjadi bagian dari perjalanan proyek.')) {
  $marker = '<ServiceStaggeredCarousel services={services} />'
  $index = $homeText.IndexOf($marker)
  if ($index -lt 0) { throw "Carousel layanan tidak ditemukan di home.tsx." }
  $index += $marker.Length

  $partnerSection = @'

        {partners.length ? (
          <section className="relative border-b border-[#d8d1c6] py-10 sm:py-12">
            <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-4 border-b border-[#d9d2c6] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
                    Our Partners
                  </p>
                  <h2 className={`${displayFont} mt-3 max-w-[620px] text-[clamp(1.7rem,2.6vw,2.65rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]`}>
                    Mitra yang ikut menjadi bagian dari perjalanan proyek.
                  </h2>
                </div>
                <p className="max-w-md text-[12px] leading-6 text-[#6b7686]">
                  Kolaborasi dengan berbagai pihak membantu pekerjaan bergerak lebih terarah sesuai kebutuhan proyek.
                </p>
              </div>

              <div className="mt-5 flex gap-px overflow-x-auto border border-[#ddd6ca] bg-[#ddd6ca] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {partners.map((partner) => {
                  const partnerContent = (
                    <div className="group flex h-[104px] min-w-[180px] flex-1 items-center justify-center bg-[#f8f4ec] px-6 transition hover:bg-[#eee8df] sm:min-w-[210px]">
                      {partner.logo?.url ? (
                        <DatabaseImage
                          src={partner.logo.url}
                          alt={partner.logo.alt || partner.name}
                          className="h-[46px] w-full max-w-[150px] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                          sizes="150px"
                        />
                      ) : (
                        <span className="max-w-[160px] text-center text-[13px] font-black uppercase leading-5 tracking-[0.08em] text-[#14243f]/70 transition group-hover:text-[#14243f]">
                          {partner.name}
                        </span>
                      )}
                    </div>
                  );

                  return partner.website ? (
                    <a
                      key={partner.id}
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Kunjungi ${partner.name}`}
                    >
                      {partnerContent}
                    </a>
                  ) : (
                    <div key={partner.id}>{partnerContent}</div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
'@

  $homeText = $homeText.Substring(0, $index) + $partnerSection + $homeText.Substring($index)
}

$qPattern = '(?s)\s*<div className="flex items-center justify-between gap-4">\s*<span className="font-mono text-\[8px\][^"]*">\s*Q-\{String\(index \+ 1\)\.padStart\(2, "0"\)\}\s*</span>\s*<span className="h-2 w-2 rounded-full border border-\[#dcb458\]" />\s*</div>'
$homeText = [System.Text.RegularExpressions.Regex]::Replace($homeText, $qPattern, '', 1)
$homeText = $homeText.Replace(
  'className={`${displayFont} mt-8 text-[1.3rem]',
  'className={`${displayFont} mt-2 text-[1.3rem]'
)
Write-Utf8NoBom $homeFile $homeText

# 6. Related projects
Write-Host "[6/6] Related projects per layanan..." -ForegroundColor Yellow

Write-Utf8NoBom (Join-Path $repoRoot "components\site\related-projects-section.tsx") @'
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/modules/projects/project.types";
import { MicroLabel, displayFont } from "./formwork/decor";
import { DatabaseImage } from "./formwork/media";

const layouts = [
  {
    wrapper: "md:col-span-7",
    media: "aspect-[16/10]",
    shape: "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-5 md:pt-10",
    media: "aspect-[16/10]",
    shape: "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
  },
  {
    wrapper: "md:col-span-5",
    media: "aspect-[5/4]",
    shape: "[clip-path:polygon(0%_0%,100%_0%,96%_88%,86%_100%,0%_100%,4%_14%)]",
  },
  {
    wrapper: "md:col-span-7 md:pt-8",
    media: "aspect-[16/9]",
    shape: "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
  },
];

export function RelatedProjectsSection({
  projects,
  serviceName,
}: {
  projects: Project[];
  serviceName: string;
}) {
  if (!projects.length) return null;

  return (
    <section className="relative border-t border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-7 border-b border-[#d5cec2] pb-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <MicroLabel>Proyek terkait</MicroLabel>
            <h2 className={`${displayFont} mt-4 max-w-[620px] text-[clamp(2rem,3.2vw,3.35rem)] font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#14243f]`}>
              Contoh pekerjaan untuk {serviceName}.
            </h2>
          </div>

          <p className="max-w-xl text-[13px] leading-6 text-[#657184] lg:justify-self-end">
            Beberapa proyek yang menggunakan layanan ini dan dapat dilihat lebih lengkap melalui dokumentasi proyek.
          </p>
        </div>

        <div className="mt-8 grid gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-5 md:gap-y-14">
          {projects.slice(0, 4).map((project, index) => {
            const layout = layouts[index % layouts.length];

            return (
              <Link
                key={project.id ?? project.slug}
                href={`/projects/${project.slug}`}
                className={`group block ${layout.wrapper}`}
              >
                <article>
                  <div className={`relative overflow-hidden bg-[#ddd6cb] ${layout.media} ${layout.shape}`}>
                    <DatabaseImage
                      src={project.coverImage.url}
                      alt={project.coverImage.alt || project.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                      sizes="(max-width: 767px) 100vw, 58vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091b34]/55 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-[#14243f]/55 text-white backdrop-blur">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="relative z-10 -mt-9 ml-[4%] w-[92%] border-l-2 border-[#dcb458] bg-[#14243f] px-4 py-4 text-white sm:px-5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#e5c775]">
                      {project.location}{project.year ? ` / ${project.year}` : ""}
                    </p>
                    <h3 className={`${displayFont} mt-2 text-[clamp(1.35rem,2vw,1.9rem)] font-black uppercase leading-[0.95] tracking-[-0.025em]`}>
                      {project.title}
                    </h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <Link
          href="/projects"
          className="mt-10 inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
        >
          Lihat semua proyek
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

'@

Write-Utf8NoBom (Join-Path $repoRoot "app\services\[slug]\page.tsx") @'
import { notFound } from "next/navigation";

import ServiceDetailPage from "@/components/site/service-detail-page";
import {
  getPublicProjects,
  getPublicServiceBySlug,
} from "@/modules/public-site/server";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const projects = await getPublicProjects();
  const relatedProjects = service.id
    ? projects.filter((project) => project.serviceId === service.id)
    : [];

  return (
    <ServiceDetailPage
      service={service}
      relatedProjects={relatedProjects}
    />
  );
}
'@

$detailFile = Join-Path $repoRoot "components\site\service-detail-page.tsx"
$detail = [System.IO.File]::ReadAllText($detailFile)

if (-not $detail.Contains('import type { Project } from "@/modules/projects/project.types";')) {
  $detail = $detail.Replace(
    'import type { ConstructionService } from "@/modules/services/service.types";',
    'import type { ConstructionService } from "@/modules/services/service.types";' + [Environment]::NewLine +
    'import type { Project } from "@/modules/projects/project.types";'
  )
}
if (-not $detail.Contains('import { RelatedProjectsSection } from "./related-projects-section";')) {
  $detail = $detail.Replace(
    'import { SiteHeader } from "./site-header";',
    'import { SiteHeader } from "./site-header";' + [Environment]::NewLine +
    'import { RelatedProjectsSection } from "./related-projects-section";'
  )
}

$detail = $detail.Replace(
  'interface ServiceDetailPageProps {' + [Environment]::NewLine +
  '  service: ConstructionService;' + [Environment]::NewLine +
  '}',
  'interface ServiceDetailPageProps {' + [Environment]::NewLine +
  '  service: ConstructionService;' + [Environment]::NewLine +
  '  relatedProjects: Project[];' + [Environment]::NewLine +
  '}'
)

$detail = $detail.Replace(
  'export default function ServiceDetailPage({' + [Environment]::NewLine +
  '  service,' + [Environment]::NewLine +
  '}: ServiceDetailPageProps) {',
  'export default function ServiceDetailPage({' + [Environment]::NewLine +
  '  service,' + [Environment]::NewLine +
  '  relatedProjects,' + [Environment]::NewLine +
  '}: ServiceDetailPageProps) {'
)

if (-not $detail.Contains('<RelatedProjectsSection')) {
  $cta = '        <section className="py-16 sm:py-20">'
  $ctaIndex = $detail.LastIndexOf($cta)
  if ($ctaIndex -lt 0) { throw "CTA detail layanan tidak ditemukan." }

  $related = @'
        <RelatedProjectsSection
          projects={relatedProjects}
          serviceName={service.name}
        />

'@
  $detail = $detail.Substring(0, $ctaIndex) + $related + $detail.Substring($ctaIndex)
}
Write-Utf8NoBom $detailFile $detail

Write-Host ""
Write-Host "=== v25 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Admin baru:" -ForegroundColor Cyan
Write-Host "  /admin/site-media"
Write-Host "  /admin/partners"
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Catatan:" -ForegroundColor Yellow
Write-Host "  Hero detail layanan/proyek tetap memakai cover masing-masing dari admin."
Write-Host "  Related project otomatis berdasarkan serviceId yang sudah ada pada Project."
