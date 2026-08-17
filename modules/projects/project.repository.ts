import type { Project } from "@/modules/projects/project.types";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "@/modules/_shared/base.repository";

const COLLECTION = "projects";

function sortProjects(items: Project[]) {
  return items.sort(
    (a, b) =>
      a.order - b.order ||
      b.year - a.year ||
      a.title.localeCompare(b.title),
  );
}

export function createProject(data: Project) {
  return createDocument<Project>(COLLECTION, data);
}

export async function getProjects() {
  return sortProjects(await listDocuments<Project>(COLLECTION));
}


export function getProjectById(id: string) {
  return getDocumentById<Project>(COLLECTION, id);
}


export function updateProject(id: string, data: Partial<Project>) {
  return updateDocument<Project>(COLLECTION, id, data);
}

export function deleteProject(id: string) {
  return deleteDocument(COLLECTION, id);
}
