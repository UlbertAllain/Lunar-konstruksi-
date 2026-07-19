import type { FAQ } from "@/types/faq";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "./base.repository";

const COLLECTION = "faqs";

function sortFAQs(items: FAQ[]) {
  return items.sort((a, b) => a.order - b.order || a.question.localeCompare(b.question));
}

export function createFAQ(data: FAQ) {
  return createDocument<FAQ>(COLLECTION, data);
}

export async function getFAQs() {
  return sortFAQs(await listDocuments<FAQ>(COLLECTION));
}

export async function getPublishedFAQs() {
  return sortFAQs(
    (await listDocuments<FAQ>(COLLECTION)).filter((item) => item.isPublished),
  );
}

export function getFAQById(id: string) {
  return getDocumentById<FAQ>(COLLECTION, id);
}

export function updateFAQ(id: string, data: Partial<FAQ>) {
  return updateDocument<FAQ>(COLLECTION, id, data);
}

export function deleteFAQ(id: string) {
  return deleteDocument(COLLECTION, id);
}
