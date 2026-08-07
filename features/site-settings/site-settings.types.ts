import type { SeoMetadata } from "@/features/seo";

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

export type SiteSettingsInput = Omit<
  SiteSettings,
  "id" | "createdAt" | "updatedAt"
>;
