import type {
  CmsBlock,
  CmsBlockDefinition,
  CmsBlockType,
  CmsContentSource,
} from "./block.types";

export const CMS_BLOCK_REGISTRY = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Pembuka halaman dengan headline, media, dan aksi utama.",
    defaultVariant: "structura",
    variants: ["structura", "editorial", "split", "minimal"],
    source: null,
  },
  intro: {
    type: "intro",
    label: "Introduction",
    description: "Narasi singkat untuk memperkenalkan perusahaan atau halaman.",
    defaultVariant: "editorial",
    variants: ["editorial", "split", "minimal"],
    source: null,
  },
  stats: {
    type: "stats",
    label: "Statistics",
    description: "Angka penting, pencapaian, atau indikator kepercayaan.",
    defaultVariant: "inline",
    variants: ["inline", "grid"],
    source: null,
  },
  services: {
    type: "services",
    label: "Services",
    description: "Daftar layanan dari koleksi Services.",
    defaultVariant: "poliform",
    variants: ["poliform", "editorial-grid", "minimal-list"],
    source: "services",
  },
  process: {
    type: "process",
    label: "Process",
    description: "Tahapan kerja atau alur pengerjaan proyek.",
    defaultVariant: "timeline",
    variants: ["timeline", "steps", "editorial"],
    source: null,
  },
  projects: {
    type: "projects",
    label: "Projects",
    description: "Portfolio dari koleksi Projects.",
    defaultVariant: "las-grid",
    variants: ["las-grid", "editorial-list", "featured"],
    source: "projects",
  },
  gallery: {
    type: "gallery",
    label: "Gallery",
    description: "Kumpulan visual pendukung halaman.",
    defaultVariant: "masonry",
    variants: ["masonry", "filmstrip", "grid"],
    source: null,
  },
  team: {
    type: "team",
    label: "Team",
    description: "Anggota tim dari koleksi Team.",
    defaultVariant: "editorial-grid",
    variants: ["editorial-grid", "minimal-list"],
    source: "team",
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    description: "Testimoni pelanggan dari koleksi Testimonials.",
    defaultVariant: "minimal",
    variants: ["minimal", "quote-grid", "slider"],
    source: "testimonials",
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Pertanyaan umum dari koleksi FAQ.",
    defaultVariant: "split",
    variants: ["split", "accordion", "minimal"],
    source: "faqs",
  },
  cta: {
    type: "cta",
    label: "Call to Action",
    description: "Ajakan tindakan menuju kontak atau layanan utama.",
    defaultVariant: "fnji",
    variants: ["fnji", "minimal", "image"],
    source: null,
  },
} satisfies Record<CmsBlockType, CmsBlockDefinition>;

export function getCmsBlockDefinition(type: CmsBlockType) {
  return CMS_BLOCK_REGISTRY[type];
}

export function listCmsBlockDefinitions(): CmsBlockDefinition[] {
  return Object.values(CMS_BLOCK_REGISTRY);
}

export function isCmsBlockVariantAllowed(type: CmsBlockType, variant: string) {
  return CMS_BLOCK_REGISTRY[type].variants.includes(variant);
}

export function getCmsBlockSource(type: CmsBlockType): CmsContentSource | null {
  return CMS_BLOCK_REGISTRY[type].source;
}

export function resolveCmsBlockSource(block: Pick<CmsBlock, "type" | "content">) {
  const registeredSource = getCmsBlockSource(block.type);
  if (!registeredSource) return null;

  const explicitSource = block.content.source;
  return typeof explicitSource === "string"
    ? (explicitSource as CmsContentSource)
    : registeredSource;
}
