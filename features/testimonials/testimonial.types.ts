import type { MediaImage } from "./media";

export interface Testimonial {
  id?: string;
  clientName: string;
  clientPosition?: string;
  projectName?: string;
  serviceId?: string;
  message: string;
  rating: number;
  photo?: MediaImage | null;
  isPublished: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
