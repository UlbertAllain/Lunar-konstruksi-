import { z } from "zod";

import { CMS_BLOCK_TYPES } from "./block.types";
import { getCmsBlockSource } from "./registry";

export const cmsBlockSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    type: z.enum(CMS_BLOCK_TYPES),
    variant: z.string().trim().min(1).max(80),
    isVisible: z.boolean(),
    order: z.number().int().min(0).max(999),
    content: z.record(z.string(), z.unknown()),
  })
  .superRefine((block, context) => {
    const expectedSource = getCmsBlockSource(block.type);
    const providedSource = block.content.source;

    if (
      expectedSource &&
      providedSource !== undefined &&
      providedSource !== expectedSource
    ) {
      context.addIssue({
        code: "custom",
        path: ["content", "source"],
        message: `Section ${block.type} hanya boleh menggunakan source ${expectedSource}.`,
      });
    }
  });

export const cmsBlocksSchema = z.array(cmsBlockSchema).max(30);
