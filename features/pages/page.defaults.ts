import type { CmsBlock } from "@/cms";

import type { CreateCmsPageInput, CmsSystemPageKey } from "./page.types";

const SYSTEM_PAGE_SLUGS: Record<CmsSystemPageKey, string> = {
  home: "",
  about: "about",
  services: "services",
  projects: "projects",
  contact: "contact",
};

function block(
  id: string,
  type: CmsBlock["type"],
  variant: string,
  order: number,
  content: Record<string, unknown> = {},
): CmsBlock {
  return { id, type, variant, isVisible: true, order, content };
}

export const DEFAULT_SYSTEM_PAGES: CreateCmsPageInput[] = [
  {
    title: "Home",
    slug: SYSTEM_PAGE_SLUGS.home,
    pageType: "system",
    systemKey: "home",
    status: "draft",
    sections: [
      block("home-hero", "hero", "structura", 0),
      block("home-intro", "intro", "editorial", 10),
      block("home-services", "services", "poliform", 20, {
        source: "services",
        limit: 6,
      }),
      block("home-process", "process", "timeline", 30),
      block("home-projects", "projects", "las-grid", 40, {
        source: "projects",
        featuredOnly: true,
        limit: 6,
      }),
      block("home-testimonials", "testimonials", "minimal", 50, {
        source: "testimonials",
      }),
      block("home-cta", "cta", "fnji", 60),
    ],
    seo: { noIndex: false, noFollow: false },
  },
  {
    title: "About",
    slug: SYSTEM_PAGE_SLUGS.about,
    pageType: "system",
    systemKey: "about",
    status: "draft",
    sections: [
      block("about-hero", "hero", "editorial", 0),
      block("about-intro", "intro", "editorial", 10),
      block("about-stats", "stats", "inline", 20),
      block("about-team", "team", "editorial-grid", 30, { source: "team" }),
      block("about-cta", "cta", "fnji", 40),
    ],
    seo: { noIndex: false, noFollow: false },
  },
  {
    title: "Services",
    slug: SYSTEM_PAGE_SLUGS.services,
    pageType: "system",
    systemKey: "services",
    status: "draft",
    sections: [
      block("services-hero", "hero", "editorial", 0),
      block("services-list", "services", "poliform", 10, {
        source: "services",
      }),
      block("services-process", "process", "timeline", 20),
      block("services-faq", "faq", "split", 30, { source: "faqs" }),
      block("services-cta", "cta", "fnji", 40),
    ],
    seo: { noIndex: false, noFollow: false },
  },
  {
    title: "Projects",
    slug: SYSTEM_PAGE_SLUGS.projects,
    pageType: "system",
    systemKey: "projects",
    status: "draft",
    sections: [
      block("projects-hero", "hero", "editorial", 0),
      block("projects-list", "projects", "las-grid", 10, {
        source: "projects",
      }),
      block("projects-cta", "cta", "fnji", 20),
    ],
    seo: { noIndex: false, noFollow: false },
  },
  {
    title: "Contact",
    slug: SYSTEM_PAGE_SLUGS.contact,
    pageType: "system",
    systemKey: "contact",
    status: "draft",
    sections: [
      block("contact-hero", "hero", "minimal", 0),
      block("contact-cta", "cta", "minimal", 10),
    ],
    seo: { noIndex: false, noFollow: false },
  },
];

export { SYSTEM_PAGE_SLUGS };
