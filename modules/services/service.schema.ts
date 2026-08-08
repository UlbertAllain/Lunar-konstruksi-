import { z } from "zod";
import { mediaImageSchema } from "@/modules/_shared/common.schema";

export const serviceSchema = z.object({
  name: z.string().trim().min(3, "Nama layanan minimal 3 karakter."),
  slug: z.string().trim().optional(),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Deskripsi singkat minimal 10 karakter.")
    .max(220, "Deskripsi singkat maksimal 220 karakter."),
  description: z
    .string()
    .trim()
    .min(20, "Deskripsi lengkap minimal 20 karakter."),
  coverImage: mediaImageSchema,
  features: z
    .array(
      z.object({
        title: z.string().trim().min(2, "Judul keunggulan wajib diisi."),
        description: z.string().trim().min(5, "Deskripsi keunggulan terlalu pendek."),
      }),
    )
    .min(1, "Tambahkan minimal satu keunggulan."),
  scopes: z
    .array(z.object({ name: z.string().trim().min(2, "Lingkup pekerjaan wajib diisi.") }))
    .min(1, "Tambahkan minimal satu lingkup pekerjaan."),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
