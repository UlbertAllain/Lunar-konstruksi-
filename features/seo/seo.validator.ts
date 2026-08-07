import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url().max(1000)]).optional();

export const seoMetadataSchema = z.object({
  title: z.string().trim().max(70).optional(),
  description: z.string().trim().max(180).optional(),
  ogImageUrl: optionalUrl,
  canonicalUrl: optionalUrl,
  noIndex: z.boolean(),
  noFollow: z.boolean(),
});
