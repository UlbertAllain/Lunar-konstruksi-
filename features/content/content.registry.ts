import type { CmsContentSource } from "@/cms";

import type { CmsContentModuleDefinition } from "./content-module.types";

export const CMS_CONTENT_MODULE_REGISTRY = {
  services: {
    key: "services",
    label: "Layanan",
    singularLabel: "Layanan",
    description: "Kelola layanan utama yang ditawarkan Lunar Konstruksi.",
    collection: "services",
    adminPath: "/admin/services",
    publicPath: "/services",
    lifecycle: "activation",
    blockTypes: ["services"],
    capabilities: {
      slug: true,
      detailPage: true,
      ordering: true,
      media: true,
      featured: false,
    },
  },
  projects: {
    key: "projects",
    label: "Projects",
    singularLabel: "Project",
    description: "Kelola portfolio, cover, gallery, dan status publikasi project.",
    collection: "projects",
    adminPath: "/admin/projects",
    publicPath: "/projects",
    lifecycle: "publication",
    blockTypes: ["projects"],
    capabilities: {
      slug: true,
      detailPage: true,
      ordering: true,
      media: true,
      featured: true,
    },
  },
  team: {
    key: "team",
    label: "Tim",
    singularLabel: "Anggota Tim",
    description: "Kelola anggota tim yang dapat ditampilkan pada halaman perusahaan.",
    collection: "team",
    adminPath: "/admin/team",
    publicPath: null,
    lifecycle: "activation",
    blockTypes: ["team"],
    capabilities: {
      slug: false,
      detailPage: false,
      ordering: true,
      media: true,
      featured: false,
    },
  },
  testimonials: {
    key: "testimonials",
    label: "Testimoni",
    singularLabel: "Testimoni",
    description: "Kelola testimoni pelanggan yang tampil sebagai social proof.",
    collection: "testimonials",
    adminPath: "/admin/testimonials",
    publicPath: null,
    lifecycle: "activation",
    blockTypes: ["testimonials"],
    capabilities: {
      slug: false,
      detailPage: false,
      ordering: true,
      media: true,
      featured: false,
    },
  },
  faqs: {
    key: "faqs",
    label: "FAQ",
    singularLabel: "FAQ",
    description: "Kelola pertanyaan dan jawaban yang sering dibutuhkan calon klien.",
    collection: "faqs",
    adminPath: "/admin/faqs",
    publicPath: null,
    lifecycle: "activation",
    blockTypes: ["faq"],
    capabilities: {
      slug: false,
      detailPage: false,
      ordering: true,
      media: false,
      featured: false,
    },
  },
} satisfies Record<CmsContentSource, CmsContentModuleDefinition>;

export function getCmsContentModule(key: CmsContentSource) {
  return CMS_CONTENT_MODULE_REGISTRY[key];
}

export function listCmsContentModules(): CmsContentModuleDefinition[] {
  return Object.values(CMS_CONTENT_MODULE_REGISTRY);
}
