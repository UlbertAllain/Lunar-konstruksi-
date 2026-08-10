import type { MediaImage } from "@/modules/media/media.types";

export interface SitePartner {
  id: string;
  name: string;
  logo: MediaImage | null;
  website: string;
  isPublished: boolean;
  order: number;
}

export interface OfficeLocation {
  name: string;
  address: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  isVisible: boolean;
}

export interface CompanyProfile {
  companyName: string;
  shortDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
  linkedinUrl: string;
  copyrightText: string;
}

export interface SiteContentSettings {
  id: "public";
  homeHero: MediaImage | null;
  servicesHero: MediaImage | null;
  projectsHero: MediaImage | null;
  contactHero: MediaImage | null;
  partners: SitePartner[];
  officeLocation: OfficeLocation;
  companyProfile: CompanyProfile;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
