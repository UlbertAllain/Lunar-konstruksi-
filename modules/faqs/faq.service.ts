import {
  createFAQ,
  deleteFAQ,
  getFAQById,
  getFAQs,
  updateFAQ,
} from "@/modules/faqs/faq.repository";
import { faqSchema } from "@/modules/faqs/faq.schema";
import { invalidatePublicResource } from "@/modules/public-site/public-cache";

export async function createFAQData(payload: unknown) {
  const created = await createFAQ(faqSchema.parse(payload));
  invalidatePublicResource("faqs");
  return created;
}

export function listFAQs() {
  return getFAQs();
}

export function detailFAQ(id: string) {
  return getFAQById(id);
}

export async function updateFAQData(id: string, payload: unknown) {
  if (!(await getFAQById(id))) return null;
  const updated = await updateFAQ(id, faqSchema.partial().parse(payload));
  invalidatePublicResource("faqs");
  return updated;
}

export async function removeFAQ(id: string) {
  const deleted = await deleteFAQ(id);
  if (deleted) invalidatePublicResource("faqs");
  return deleted;
}
