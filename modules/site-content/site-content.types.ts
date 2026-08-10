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
