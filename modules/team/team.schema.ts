import { z } from "zod";
import { mediaImageSchema, optionalUrl } from "@/modules/_shared/common.schema";

export const teamSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter."),
  position: z.string().trim().min(3, "Posisi minimal 3 karakter."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  photo: mediaImageSchema,
  skills: z.array(z.string().trim().min(2)).min(1, "Tambahkan minimal satu keahlian."),
  social: z
    .object({
      instagram: optionalUrl,
      linkedin: optionalUrl,
    })
    .optional(),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});
