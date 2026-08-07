import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
} from "@/repositories/testimonial.repository";
import { deleteImagesSafely } from "@/services/upload.service";
import { testimonialSchema } from "@/validators/testimonial.validator";

export async function createTestimonialData(payload: unknown) {
  return createTestimonial(testimonialSchema.parse(payload));
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

  return updated;
}

export async function removeTestimonial(id: string) {
  const previous = await getTestimonialById(id);
  if (!previous) return false;

  const deleted = await deleteTestimonial(id);
  if (deleted) await deleteImagesSafely([previous.photo?.publicId]);
  return deleted;
}
