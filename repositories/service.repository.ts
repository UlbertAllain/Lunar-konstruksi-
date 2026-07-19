import type { ConstructionService } from "@/types/service";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "./base.repository";

const COLLECTION = "services";

function sortServices(items: ConstructionService[]) {
  return items.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function createService(data: ConstructionService) {
  return createDocument<ConstructionService>(COLLECTION, data);
}

export async function getServices() {
  return sortServices(await listDocuments<ConstructionService>(COLLECTION));
}

export async function getPublishedServices() {
  return sortServices(
    (await listDocuments<ConstructionService>(COLLECTION)).filter(
      (item) => item.isPublished,
    ),
  );
}

export function getServiceById(id: string) {
  return getDocumentById<ConstructionService>(COLLECTION, id);
}

export async function getServiceBySlug(slug: string) {
  return (await listDocuments<ConstructionService>(COLLECTION)).find(
    (item) => item.slug === slug && item.isPublished,
  ) ?? null;
}

export function updateService(id: string, data: Partial<ConstructionService>) {
  return updateDocument<ConstructionService>(COLLECTION, id, data);
}

export function deleteService(id: string) {
  return deleteDocument(COLLECTION, id);
}
