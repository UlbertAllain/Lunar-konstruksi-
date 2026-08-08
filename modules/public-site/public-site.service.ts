import { unstable_cache } from "next/cache";

import {
  getPublicProjectBySlug as readPublicProjectBySlug,
  getPublicServiceBySlug as readPublicServiceBySlug,
  listPublicFaqs as readPublicFaqs,
  listPublicProjects as readPublicProjects,
  listPublicServices as readPublicServices,
  listPublicTeam as readPublicTeam,
  listPublicTestimonials as readPublicTestimonials,
} from "./public-content.repository";
import { getNavigationSettingsWithDefaults, getSiteSettingsWithDefaults } from "./site-config";
import type {
  CmsBlockType,
  CmsContentSource,
  HydratedCmsSection,
  PublicOverviewData,
  PublicPageContext,
  PublicPageKey,
  SeoMetadata,
} from "./public-site.types";

const CACHE_SECONDS = 300;

export const getPublicServices = unstable_cache(readPublicServices, ["public-services"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-services"],
});

export const getPublicProjects = unstable_cache(readPublicProjects, ["public-projects"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-projects"],
});

export const getPublicTeam = unstable_cache(readPublicTeam, ["public-team"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-team"],
});

export const getPublicTestimonials = unstable_cache(readPublicTestimonials, ["public-testimonials"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-testimonials"],
});

export const getPublicFaqs = unstable_cache(readPublicFaqs, ["public-faqs"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-faqs"],
});

export async function getPublicProjectBySlug(slug: string) {
  return unstable_cache(() => readPublicProjectBySlug(slug), ["public-project", slug], {
    revalidate: CACHE_SECONDS,
    tags: ["public-projects", `project:${slug}`],
  })();
}

export async function getPublicServiceBySlug(slug: string) {
  return unstable_cache(() => readPublicServiceBySlug(slug), ["public-service", slug], {
    revalidate: CACHE_SECONDS,
    tags: ["public-services", `service:${slug}`],
  })();
}

export async function getPublicOverviewData(): Promise<PublicOverviewData> {
  const [services, projects, team, testimonials, faqs] = await Promise.all([
    getPublicServices(),
    getPublicProjects(),
    getPublicTeam(),
    getPublicTestimonials(),
    getPublicFaqs(),
  ]);

  return { services, projects, team, testimonials, faqs };
}

export async function getPublicHomeData() {
  return getPublicOverviewData();
}

export async function getPublicAboutData() {
  return { team: await getPublicTeam() };
}

export async function getPublicProjectsData() {
  return { projects: await getPublicProjects() };
}

export async function getPublicServicesData() {
  return { services: await getPublicServices() };
}

type SectionSeed = {
  id: string;
  type: CmsBlockType;
  variant: string;
  order: number;
  source?: CmsContentSource;
  content?: Record<string, unknown>;
};

const PAGE_TITLES: Record<PublicPageKey, string> = {
  home: "Home",
  about: "Tentang",
  services: "Layanan",
  projects: "Projects",
  contact: "Kontak",
};

const PAGE_SECTIONS: Record<PublicPageKey, SectionSeed[]> = {
  home: [
    { id: "home-hero", type: "hero", variant: "structura", order: 0 },
    { id: "home-intro", type: "intro", variant: "editorial", order: 10 },
    { id: "home-services", type: "services", variant: "poliform", order: 20, source: "services", content: { limit: 6 } },
    { id: "home-process", type: "process", variant: "timeline", order: 30 },
    { id: "home-projects", type: "projects", variant: "las-grid", order: 40, source: "projects", content: { featuredOnly: true, limit: 6 } },
    { id: "home-testimonials", type: "testimonials", variant: "minimal", order: 50, source: "testimonials" },
    { id: "home-cta", type: "cta", variant: "minimal", order: 60 },
  ],
  about: [
    { id: "about-hero", type: "hero", variant: "editorial", order: 0 },
    { id: "about-intro", type: "intro", variant: "editorial", order: 10 },
    { id: "about-stats", type: "stats", variant: "inline", order: 20 },
    { id: "about-team", type: "team", variant: "editorial-grid", order: 30, source: "team" },
    { id: "about-cta", type: "cta", variant: "minimal", order: 40 },
  ],
  services: [
    { id: "services-hero", type: "hero", variant: "editorial", order: 0 },
    { id: "services-list", type: "services", variant: "poliform", order: 10, source: "services" },
    { id: "services-process", type: "process", variant: "timeline", order: 20 },
    { id: "services-faq", type: "faq", variant: "split", order: 30, source: "faqs" },
    { id: "services-cta", type: "cta", variant: "minimal", order: 40 },
  ],
  projects: [
    { id: "projects-hero", type: "hero", variant: "editorial", order: 0 },
    { id: "projects-list", type: "projects", variant: "las-grid", order: 10, source: "projects" },
    { id: "projects-cta", type: "cta", variant: "minimal", order: 20 },
  ],
  contact: [
    { id: "contact-hero", type: "hero", variant: "minimal", order: 0 },
    { id: "contact-cta", type: "cta", variant: "minimal", order: 10 },
  ],
};

function getSourceData(source: CmsContentSource, content: PublicOverviewData): unknown[] {
  switch (source) {
    case "services":
      return content.services;
    case "projects":
      return content.projects;
    case "team":
      return content.team;
    case "testimonials":
      return content.testimonials;
    case "faqs":
      return content.faqs;
  }
}

function hydrateSections(pageKey: PublicPageKey, content: PublicOverviewData): HydratedCmsSection[] {
  return PAGE_SECTIONS[pageKey].map((seed) => {
    let data = seed.source ? [...getSourceData(seed.source, content)] : [];
    const sectionContent = seed.content ?? {};

    if (sectionContent.featuredOnly === true) {
      data = data.filter(
        (item) => typeof item === "object" && item !== null && "isFeatured" in item && item.isFeatured === true,
      );
    }

    if (typeof sectionContent.limit === "number" && sectionContent.limit > 0) {
      data = data.slice(0, sectionContent.limit);
    }

    return {
      id: seed.id,
      type: seed.type,
      variant: seed.variant,
      isVisible: true,
      order: seed.order,
      content: sectionContent,
      source: seed.source ?? null,
      data,
    };
  });
}

function resolveMetadata(pageKey: PublicPageKey, siteName: string, defaults: SeoMetadata): SeoMetadata {
  const title = pageKey === "home" ? defaults.title || siteName : `${PAGE_TITLES[pageKey]} | ${siteName}`;
  return {
    ...defaults,
    title,
    noIndex: defaults.noIndex ?? false,
    noFollow: defaults.noFollow ?? false,
  };
}

export async function getPublicPageContext(pageKey: PublicPageKey): Promise<PublicPageContext> {
  const [content, settings, navigation] = await Promise.all([
    getPublicOverviewData(),
    getSiteSettingsWithDefaults(),
    getNavigationSettingsWithDefaults(),
  ]);

  const sections = hydrateSections(pageKey, content);
  const siteName = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const metadata = resolveMetadata(pageKey, siteName, settings.defaultSeo);

  return {
    page: {
      id: pageKey,
      title: PAGE_TITLES[pageKey],
      slug: pageKey === "home" ? "" : pageKey,
      pageType: "system",
      systemKey: pageKey,
      status: "published",
      sections,
      seo: metadata,
    },
    settings,
    navigation,
    sections,
    metadata,
  };
}
