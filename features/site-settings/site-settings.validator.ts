import { z } from "zod";

import { seoMetadataSchema } from "@/features/seo";

const optionalUrl = z.union([z.literal(""), z.string().url().max(1000)]);

export const siteSettingsSchema = z.object({
  identity: z.object({
    siteName: z.string().trim().min(2).max(100),
    companyName: z.string().trim().min(2).max(120),
    tagline: z.string().trim().max(160),
    description: z.string().trim().max(600),
    logoUrl: optionalUrl,
    logoDarkUrl: optionalUrl,
    faviconUrl: optionalUrl,
  }),
  contact: z.object({
    email: z.union([z.literal(""), z.string().email().max(160)]),
    phone: z.string().trim().max(40),
    whatsapp: z.string().trim().max(40),
    address: z.string().trim().max(300),
    city: z.string().trim().max(100),
    province: z.string().trim().max(100),
    postalCode: z.string().trim().max(20),
    mapsUrl: optionalUrl,
  }),
  socialLinks: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        label: z.string().trim().min(1).max(80),
        url: z.string().url().max(1000),
        isVisible: z.boolean(),
        order: z.number().int().min(0).max(999),
      }),
    )
    .max(12),
  footer: z.object({
    shortDescription: z.string().trim().max(400),
    copyrightText: z.string().trim().max(200),
  }),
  defaultSeo: seoMetadataSchema,
});
