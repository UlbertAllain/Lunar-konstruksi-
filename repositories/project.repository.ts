import type { Project } from "@/types/project";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "./base.repository";

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

export async function getPublishedProjects() {
  return sortProjects(
    (await listDocuments<Project>(COLLECTION)).filter(
      (item) => item.isPublished,
    ),
  );
}

export function getProjectById(id: string) {
  return getDocumentById<Project>(COLLECTION, id);
}

export async function getProjectBySlug(slug: string) {
  return (await listDocuments<Project>(COLLECTION)).find(
    (item) => item.slug === slug && item.isPublished,
  ) ?? null;
}

export function updateProject(id: string, data: Partial<Project>) {
  return updateDocument<Project>(COLLECTION, id, data);
}

export function deleteProject(id: string) {
  return deleteDocument(COLLECTION, id);
}
