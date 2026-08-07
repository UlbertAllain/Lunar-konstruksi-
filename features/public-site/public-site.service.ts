import { unstable_cache } from "next/cache";

import { resolveCmsBlockSource } from "@/cms/blocks/registry";
import type { CmsBlock, CmsContentSource } from "@/cms/blocks/block.types";
import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import type { CmsSystemPageKey } from "@/features/pages/page.types";
import { getCmsPageRecordBySystemKey } from "@/features/pages/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";

import {
  getPublicProjectBySlug as readPublicProjectBySlug,
  getPublicServiceBySlug as readPublicServiceBySlug,
  listPublicFaqs as readPublicFaqs,
  listPublicProjects as readPublicProjects,
  listPublicServices as readPublicServices,
  listPublicTeam as readPublicTeam,
  listPublicTestimonials as readPublicTestimonials,
} from "./public-content.repository";
import { resolvePublicSeo } from "./public-seo";
import type {
  HydratedCmsSection,
  PublicOverviewData,
  PublicPageContext,
} from "./public-site.types";

const CACHE_SECONDS = 300;

const getCachedSiteSettings = unstable_cache(getSiteSettingsWithDefaults, [
  "public-site-settings",
], {
  revalidate: CACHE_SECONDS,
  tags: ["public-site-settings"],
});

const getCachedNavigation = unstable_cache(getNavigationSettingsWithDefaults, [
  "public-navigation",
], {
  revalidate: CACHE_SECONDS,
  tags: ["public-navigation"],
});

async function getCachedCmsPage(systemKey: CmsSystemPageKey) {
  return unstable_cache(
    () => getCmsPageRecordBySystemKey(systemKey),
    ["public-cms-page", systemKey],
    {
      revalidate: CACHE_SECONDS,
      tags: ["public-cms-pages", `public-cms-page:${systemKey}`],
    },
  )();
}

export const getPublicServices = unstable_cache(readPublicServices, [
  "public-services",
], {
  revalidate: CACHE_SECONDS,
  tags: ["public-services"],
});

export const getPublicProjects = unstable_cache(readPublicProjects, [
  "public-projects",
], {
  revalidate: CACHE_SECONDS,
  tags: ["public-projects"],
});

export const getPublicTeam = unstable_cache(readPublicTeam, ["public-team"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-team"],
});

export const getPublicTestimonials = unstable_cache(readPublicTestimonials, [
  "public-testimonials",
], {
  revalidate: CACHE_SECONDS,
  tags: ["public-testimonials"],
});

export const getPublicFaqs = unstable_cache(readPublicFaqs, ["public-faqs"], {
  revalidate: CACHE_SECONDS,
  tags: ["public-faqs"],
});

export async function getPublicProjectBySlug(slug: string) {
  return unstable_cache(
    () => readPublicProjectBySlug(slug),
    ["public-project", slug],
    { revalidate: CACHE_SECONDS, tags: ["public-projects", `project:${slug}`] },
  )();
}

export async function getPublicServiceBySlug(slug: string) {
  return unstable_cache(
    () => readPublicServiceBySlug(slug),
    ["public-service", slug],
    { revalidate: CACHE_SECONDS, tags: ["public-services", `service:${slug}`] },
  )();
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

function readPositiveInteger(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function getSourceData(
  source: CmsContentSource,
  content: PublicOverviewData,
): unknown[] {
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

async function hydrateSections(
  sections: CmsBlock[],
): Promise<HydratedCmsSection[]> {
  const visible = [...sections]
    .filter((section) => section.isVisible)
    .sort((a, b) => a.order - b.order);

  const content = await getPublicOverviewData();

  return visible.map((section) => {
    const source = resolveCmsBlockSource(section);
    if (!source) {
      return { ...section, source: null, data: [] };
    }

    let data = [...getSourceData(source, content)];
    if (readBoolean(section.content.featuredOnly)) {
      data = data.filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "isFeatured" in item &&
          item.isFeatured === true,
      );
    }

    const limit = readPositiveInteger(section.content.limit);
    if (limit) {
      data = data.slice(0, limit);
    }

    return { ...section, source, data };
  });
}

export async function getPublicPageContext(
  systemKey: CmsSystemPageKey,
): Promise<PublicPageContext> {
  const [pageRecord, settings, navigation] = await Promise.all([
    getCachedCmsPage(systemKey),
    getCachedSiteSettings(),
    getCachedNavigation(),
  ]);

  const page = pageRecord?.status === "published" ? pageRecord : null;
  const sections = page ? await hydrateSections(page.sections) : [];

  return {
    page,
    settings,
    navigation,
    sections,
    metadata: resolvePublicSeo(systemKey, settings, page?.seo),
  };
}
