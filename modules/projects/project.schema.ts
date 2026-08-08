import { z } from "zod";
import { mediaImageSchema } from "@/modules/_shared/common.schema";

export const projectSchema = z.object({
  title: z.string().trim().min(3, "Judul project minimal 3 karakter."),
  slug: z.string().trim().optional(),
  serviceId: z.string().trim().min(1, "Layanan wajib dipilih."),
  clientName: z.string().trim().optional(),
  location: z.string().trim().min(2, "Lokasi project wajib diisi."),
  year: z.coerce.number().int().min(2000).max(2100),
  shortDescription: z.string().trim().min(10).max(220),
  description: z.string().trim().min(20),
  coverImage: mediaImageSchema,
  gallery: z.array(mediaImageSchema).max(10, "Maksimal 10 gambar gallery."),
  scope: z.array(z.string().trim().min(2)).min(1, "Lingkup project wajib diisi."),
  materials: z.array(z.string().trim().min(2)).min(1, "Material wajib diisi."),
  duration: z.string().trim().min(2, "Durasi wajib diisi."),
  status: z.enum(["PLANNING", "PROCESS", "COMPLETED"]),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0).default(0),
});
