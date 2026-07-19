import type { MediaImage } from "./media";

export type ProjectStatus = "PLANNING" | "PROCESS" | "COMPLETED";

export interface Project {
  id?: string;
  title: string;
  slug: string;
  serviceId: string;
  clientName?: string;
  location: string;
  year: number;
  shortDescription: string;
  description: string;
  coverImage: MediaImage;
  gallery: MediaImage[];
  scope: string[];
  materials: string[];
  duration: string;
  status: ProjectStatus;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
