import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "@/modules/projects/project.repository";
import { deleteImagesSafely } from "@/modules/media/upload.service";
import { createUniqueSlug } from "@/shared/unique-slug";
import { projectSchema } from "@/modules/projects/project.schema";

export async function createProjectData(payload: unknown) {
  const data = projectSchema.parse(payload);
  const projects = await getProjects();

  return createProject({
    ...data,
    slug: createUniqueSlug(data.title, projects.map((item) => item.slug)),
  });
}

export function listProjects() {
  return getProjects();
}

export function detailProject(id: string) {
  return getProjectById(id);
}

export async function updateProjectData(id: string, payload: unknown) {
  const previous = await getProjectById(id);
  if (!previous) return null;

  const data = projectSchema.partial().parse(payload);
  const projects = await getProjects();
  const nextData = data.title
    ? {
        ...data,
        slug: createUniqueSlug(
          data.title,
          projects.map((item) => item.slug),
          previous.slug,
        ),
      }
    : data;

  const updated = await updateProject(id, nextData);
  const retainedIds = new Set([
    data.coverImage?.publicId ?? previous.coverImage.publicId,
    ...(data.gallery ?? previous.gallery).map((image) => image.publicId),
  ]);
  const previousIds = [
    previous.coverImage.publicId,
    ...previous.gallery.map((image) => image.publicId),
  ];

  await deleteImagesSafely(previousIds.filter((idValue) => !retainedIds.has(idValue)));
  return updated;
}

export async function removeProject(id: string) {
  const previous = await getProjectById(id);
  if (!previous) return false;

  const deleted = await deleteProject(id);
  if (deleted) {
    await deleteImagesSafely([
      previous.coverImage.publicId,
      ...previous.gallery.map((image) => image.publicId),
    ]);
  }
  return deleted;
}
