import type { Testimonial } from "@/types/testimonial";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "./base.repository";

const COLLECTION = "testimonials";

function sortTestimonials(items: Testimonial[]) {
  return items.sort(
    (a, b) => a.order - b.order || a.clientName.localeCompare(b.clientName),
  );
}

export function createTestimonial(data: Testimonial) {
  return createDocument<Testimonial>(COLLECTION, data);
}

export async function getTestimonials() {
  return sortTestimonials(await listDocuments<Testimonial>(COLLECTION));
}

export async function getPublishedTestimonials() {
  return sortTestimonials(
    (await listDocuments<Testimonial>(COLLECTION)).filter(
      (item) => item.isPublished,
    ),
  );
}

export function getTestimonialById(id: string) {
  return getDocumentById<Testimonial>(COLLECTION, id);
}

export function updateTestimonial(id: string, data: Partial<Testimonial>) {
  return updateDocument<Testimonial>(COLLECTION, id, data);
}

export function deleteTestimonial(id: string) {
  return deleteDocument(COLLECTION, id);
}
