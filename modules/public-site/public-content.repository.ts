import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";
import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { TeamMember } from "@/modules/team/team.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

function serializeMany<T>(documents: QueryDocumentSnapshot[]) {
  return documents.map((document) => serializeDocument<T>(document.id, document.data()));
}

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

async function listPublished<T extends { order: number }>(collection: string, field: "isPublished" | "isActive") {
  const snapshot = await getAdminDb().collection(collection).where(field, "==", true).get();
  return sortByOrder(serializeMany<T>(snapshot.docs));
}

async function findPublishedBySlug<T extends { isPublished: boolean }>(collection: string, slug: string) {
  const snapshot = await getAdminDb().collection(collection).where("slug", "==", slug).limit(1).get();
  const document = snapshot.docs[0];
  if (!document) return null;
  const item = serializeDocument<T>(document.id, document.data());
  return item.isPublished ? item : null;
}

export function listPublicServices() {
  return listPublished<ConstructionService>("services", "isPublished");
}

export function getPublicServiceBySlug(slug: string) {
  return findPublishedBySlug<ConstructionService>("services", slug);
}

export async function listPublicProjects() {
  const projects = await listPublished<Project>("projects", "isPublished");
  return projects.sort((a, b) => a.order - b.order || b.year - a.year || a.title.localeCompare(b.title));
}

export function getPublicProjectBySlug(slug: string) {
  return findPublishedBySlug<Project>("projects", slug);
}

export function listPublicTeam() {
  return listPublished<TeamMember>("team", "isActive");
}

export function listPublicTestimonials() {
  return listPublished<Testimonial>("testimonials", "isPublished");
}

export function listPublicFaqs() {
  return listPublished<FAQ>("faqs", "isPublished");
}
