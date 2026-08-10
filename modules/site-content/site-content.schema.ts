import { z } from "zod";

const mediaImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
});

const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Nama partner minimal 2 karakter."),
  logo: mediaImageSchema.nullable(),
  website: z.string().trim(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const siteContentSchema = z.object({
  homeHero: mediaImageSchema.nullable(),
  servicesHero: mediaImageSchema.nullable(),
  projectsHero: mediaImageSchema.nullable(),
  contactHero: mediaImageSchema.nullable(),
  partners: z.array(partnerSchema),
});
