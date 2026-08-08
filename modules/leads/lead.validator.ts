import { z } from "zod";

import { LEAD_STATUSES } from "./lead.types";

const phonePattern = /^[0-9+().\-\s]+$/;

export const publicLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30).regex(phonePattern),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional(),
  projectType: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(2500),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().positive().optional(),
});

export const adminLeadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    adminNote: z.string().trim().max(2500).optional(),
  })
  .refine(
    (value) => value.status !== undefined || value.adminNote !== undefined,
    "Tidak ada perubahan lead yang dikirim.",
  );