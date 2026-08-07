import { z } from "zod";

import { cmsBlocksSchema } from "@/cms";
import { seoMetadataSchema } from "@/features/seo";

import { CMS_PAGE_STATUSES, CMS_SYSTEM_PAGE_KEYS } from "./page.types";

const slugSchema = z
  .string()
  .trim()
  .max(160)
  .refine(
    (value: string) =>
      value === "" ||
      /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
        value,
      ),
    "Slug hanya boleh berisi huruf kecil, angka, tanda hubung, dan garis miring.",
  );

export const createCmsPageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: slugSchema,
  pageType: z.enum(["system", "custom"]),
  systemKey: z.enum(CMS_SYSTEM_PAGE_KEYS).optional(),
  status: z.enum(CMS_PAGE_STATUSES),
  sections: cmsBlocksSchema,
  seo: seoMetadataSchema,
});

export const updateCmsPageSchema = createCmsPageSchema.partial().extend({
  seo: seoMetadataSchema.partial().optional(),
});
