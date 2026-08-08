import type { MediaImage } from "@/modules/media/media.types";

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ConstructionService {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: MediaImage;
  features: ServiceFeature[];
  scopes: { name: string }[];
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
