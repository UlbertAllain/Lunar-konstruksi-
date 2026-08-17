import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
} from "@/modules/testimonials/testimonial.repository";
import { deleteImagesSafely } from "@/modules/media/upload.service";
import { testimonialSchema } from "@/modules/testimonials/testimonial.schema";
import { invalidatePublicResource } from "@/modules/public-site/public-cache";

export async function createTestimonialData(payload: unknown) {
  const created = await createTestimonial(testimonialSchema.parse(payload));
  invalidatePublicResource("testimonials");
  return created;
}

export function listTestimonials() {
  return getTestimonials();
}

export function detailTestimonial(id: string) {
  return getTestimonialById(id);
}

export async function updateTestimonialData(id: string, payload: unknown) {
  const previous = await getTestimonialById(id);
  if (!previous) return null;

  const data = testimonialSchema.partial().parse(payload);
  const updated = await updateTestimonial(id, data);
  const photoWasProvided = Object.prototype.hasOwnProperty.call(data, "photo");
  const nextId = data.photo?.publicId;

  if (previous.photo?.publicId && photoWasProvided && nextId !== previous.photo.publicId) {
    await deleteImagesSafely([previous.photo.publicId]);
  }

  invalidatePublicResource("testimonials");
  return updated;
}

export async function removeTestimonial(id: string) {
  const previous = await getTestimonialById(id);
  if (!previous) return false;

  const deleted = await deleteTestimonial(id);
  if (deleted) {
    await deleteImagesSafely([previous.photo?.publicId]);
    invalidatePublicResource("testimonials");
  }
  return deleted;
}
