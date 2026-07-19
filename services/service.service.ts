import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "@/repositories/service.repository";
import { deleteImagesSafely } from "@/services/upload.service";
import { createUniqueSlug } from "@/utils/unique-slug";
import { serviceSchema } from "@/validators/service.validator";

export async function createServiceData(payload: unknown) {
  const data = serviceSchema.parse(payload);
  const services = await getServices();

  return createService({
    ...data,
    slug: createUniqueSlug(data.name, services.map((item) => item.slug)),
  });
}

export function listServices() {
  return getServices();
}

export function detailService(id: string) {
  return getServiceById(id);
}

export async function updateServiceData(id: string, payload: unknown) {
  const previous = await getServiceById(id);
  if (!previous) return null;

  const data = serviceSchema.partial().parse(payload);
  const services = await getServices();
  const nextData = data.name
    ? {
        ...data,
        slug: createUniqueSlug(
          data.name,
          services.map((item) => item.slug),
          previous.slug,
        ),
      }
    : data;

  const updated = await updateService(id, nextData);

  if (
    data.coverImage?.publicId &&
    data.coverImage.publicId !== previous.coverImage.publicId
  ) {
    await deleteImagesSafely([previous.coverImage.publicId]);
  }

  return updated;
}

export async function removeService(id: string) {
  const previous = await getServiceById(id);
  if (!previous) return false;

  const deleted = await deleteService(id);
  if (deleted) await deleteImagesSafely([previous.coverImage.publicId]);
  return deleted;
}
