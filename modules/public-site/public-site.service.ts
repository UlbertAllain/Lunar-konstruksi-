import { unstable_cache } from "next/cache";

import { getSiteContentSettings } from "@/modules/site-content/site-content.repository";

import { PUBLIC_CACHE_TAGS } from "./public-cache";
import {
  getPublicProjectBySlug as readPublicProjectBySlug,
  getPublicServiceBySlug as readPublicServiceBySlug,
  listPublicFaqs as readPublicFaqs,
  listPublicProjects as readPublicProjects,
  listPublicServices as readPublicServices,
  listPublicTeam as readPublicTeam,
  listPublicTestimonials as readPublicTestimonials,
} from "./public-content.repository";
import type { PublicOverviewData } from "./public-site.types";

const CACHE_SECONDS = 300;

export const getPublicServices = unstable_cache(
  readPublicServices,
  [PUBLIC_CACHE_TAGS.services],
  {
    revalidate: CACHE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.services],
  },
);

export const getPublicProjects = unstable_cache(
  readPublicProjects,
  [PUBLIC_CACHE_TAGS.projects],
  {
    revalidate: CACHE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.projects],
  },
);

export const getPublicTeam = unstable_cache(
  readPublicTeam,
  [PUBLIC_CACHE_TAGS.team],
  {
    revalidate: CACHE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.team],
  },
);

export const getPublicTestimonials = unstable_cache(
  readPublicTestimonials,
  [PUBLIC_CACHE_TAGS.testimonials],
  {
    revalidate: CACHE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.testimonials],
  },
);

export const getPublicFaqs = unstable_cache(
  readPublicFaqs,
  [PUBLIC_CACHE_TAGS.faqs],
  {
    revalidate: CACHE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.faqs],
  },
);

export async function getPublicProjectBySlug(slug: string) {
  return unstable_cache(
    () => readPublicProjectBySlug(slug),
    ["public-project", slug],
    {
      revalidate: CACHE_SECONDS,
      tags: [PUBLIC_CACHE_TAGS.projects, `project:${slug}`],
    },
  )();
}

export async function getPublicServiceBySlug(slug: string) {
  return unstable_cache(
    () => readPublicServiceBySlug(slug),
    ["public-service", slug],
    {
      revalidate: CACHE_SECONDS,
      tags: [PUBLIC_CACHE_TAGS.services, `service:${slug}`],
    },
  )();
}

export async function getPublicOverviewData(): Promise<PublicOverviewData> {
  const [services, projects, team, testimonials, faqs, siteContent] =
    await Promise.all([
      getPublicServices(),
      getPublicProjects(),
      getPublicTeam(),
      getPublicTestimonials(),
      getPublicFaqs(),
      getSiteContentSettings(),
    ]);

  return {
    services,
    projects,
    team,
    testimonials,
    faqs,
    siteContent,
  };
}

export const getPublicHomeData = getPublicOverviewData;
