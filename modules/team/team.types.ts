import type { MediaImage } from "@/modules/media/media.types";

export interface TeamSocial {
  instagram?: string;
  linkedin?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  position: string;
  description: string;
  photo: MediaImage;
  skills: string[];
  social?: TeamSocial;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
