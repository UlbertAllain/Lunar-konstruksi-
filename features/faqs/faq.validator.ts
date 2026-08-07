import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(5, "Pertanyaan minimal 5 karakter."),
  answer: z.string().trim().min(10, "Jawaban minimal 10 karakter."),
  serviceId: z.string().trim().optional(),
  order: z.coerce.number().int().min(0),
  isPublished: z.boolean(),
});
