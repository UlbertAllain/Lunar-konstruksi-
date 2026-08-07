import {
  createFAQ,
  deleteFAQ,
  getFAQById,
  getFAQs,
  updateFAQ,
} from "@/repositories/faq.repository";
import { faqSchema } from "@/validators/faq.validator";

export async function createFAQData(payload: unknown) {
  return createFAQ(faqSchema.parse(payload));
}

export function listFAQs() {
  return getFAQs();
}

export function detailFAQ(id: string) {
  return getFAQById(id);
}

export async function updateFAQData(id: string, payload: unknown) {
  if (!(await getFAQById(id))) return null;
  return updateFAQ(id, faqSchema.partial().parse(payload));
}

export async function removeFAQ(id: string) {
  return deleteFAQ(id);
}
