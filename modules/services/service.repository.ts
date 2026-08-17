import type { ConstructionService } from "@/modules/services/service.types";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "@/modules/_shared/base.repository";

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


export function getServiceById(id: string) {
  return getDocumentById<ConstructionService>(COLLECTION, id);
}


export function updateService(id: string, data: Partial<ConstructionService>) {
  return updateDocument<ConstructionService>(COLLECTION, id, data);
}

export function deleteService(id: string) {
  return deleteDocument(COLLECTION, id);
}
