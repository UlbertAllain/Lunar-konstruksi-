import { z } from "zod";

export const mediaImageSchema = z.object({
  url: z.string().url("URL media tidak valid."),
  publicId: z.string().min(1, "Public ID media wajib tersedia."),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().max(160).optional(),
});

export const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//.test(value), {
    message: "Tautan harus diawali http:// atau https://.",
  })
  .optional();
