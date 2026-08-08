import { z } from "zod";
import { mediaImageSchema } from "@/modules/_shared/common.schema";

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(3, "Nama klien minimal 3 karakter."),
  clientPosition: z.string().trim().optional(),
  projectName: z.string().trim().optional(),
  serviceId: z.string().trim().optional(),
  message: z.string().trim().min(10, "Testimoni minimal 10 karakter."),
  rating: z.coerce.number().int().min(1).max(5),
  photo: mediaImageSchema.nullable().optional(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0),
});
