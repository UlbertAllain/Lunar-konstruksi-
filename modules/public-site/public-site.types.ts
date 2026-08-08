import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { TeamMember } from "@/modules/team/team.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

export type PublicPageKey = "home" | "about" | "services" | "projects" | "contact";
export type CmsSystemPageKey = PublicPageKey;

export interface SeoMetadata {
  title?: string;
  description?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export type NavigationTarget = "internal" | "external";

export interface NavigationChildItem {
  id: string;
  label: string;
  href: string;
  target: NavigationTarget;
  openInNewTab: boolean;
  isVisible: boolean;
  order: number;
}

export interface NavigationItem extends NavigationChildItem {
  children: NavigationChildItem[];
}

export interface NavigationSettings {
  id: string;
  header: NavigationItem[];
  footerPrimary: NavigationItem[];
  footerSecondary: NavigationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  isVisible: boolean;
  order: number;
}

export interface SiteIdentity {
  siteName: string;
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
}

export interface SiteContact {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  mapsUrl: string;
}

export interface FooterSettings {
  shortDescription: string;
  copyrightText: string;
}

export interface SiteSettings {
  id: string;
  identity: SiteIdentity;
  contact: SiteContact;
  socialLinks: SocialLink[];
  footer: FooterSettings;
  defaultSeo: SeoMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export type CmsContentSource = "services" | "projects" | "team" | "testimonials" | "faqs";
export type CmsBlockType = "hero" | "intro" | "stats" | "services" | "process" | "projects" | "gallery" | "team" | "testimonials" | "faq" | "cta";

export interface HydratedCmsSection {
  id: string;
  type: CmsBlockType;
  variant: string;
  isVisible: boolean;
  order: number;
  content: Record<string, unknown>;
  source: CmsContentSource | null;
  data: unknown[];
}

export interface PublicPageRecord {
  id: string;
  title: string;
  slug: string;
  pageType: "system";
  systemKey: PublicPageKey;
  status: "published";
  sections: HydratedCmsSection[];
  seo: SeoMetadata;
}

export interface PublicOverviewData {
  services: ConstructionService[];
  projects: Project[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

export interface PublicPageContext {
  page: PublicPageRecord;
  settings: SiteSettings;
  navigation: NavigationSettings;
  sections: HydratedCmsSection[];
  metadata: SeoMetadata;
}
