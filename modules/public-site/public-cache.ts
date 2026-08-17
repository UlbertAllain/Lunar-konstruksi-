import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_CACHE_TAGS = {
  services: "public-services",
  projects: "public-projects",
  team: "public-team",
  testimonials: "public-testimonials",
  faqs: "public-faqs",
} as const;

type PublicResource = keyof typeof PUBLIC_CACHE_TAGS;

const RESOURCE_PATHS: Record<PublicResource, readonly string[]> = {
  services: ["/", "/services"],
  projects: ["/", "/projects", "/services"],
  team: ["/"],
  testimonials: ["/"],
  faqs: ["/", "/services"],
};

const SITE_CONTENT_PATHS = ["/", "/services", "/projects", "/contact"] as const;

function expireTag(tag: string) {
  revalidateTag(tag, { expire: 0 });
}

function revalidatePaths(paths: readonly string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

/**
 * Keep the public website in sync with Firestore immediately after an admin
 * mutation. Cache tags invalidate the database query cache, while path
 * revalidation clears any already-rendered public route that consumed it.
 */
export function invalidatePublicResource(resource: PublicResource) {
  expireTag(PUBLIC_CACHE_TAGS[resource]);
  revalidatePaths(RESOURCE_PATHS[resource]);

  if (resource === "services") {
    revalidatePath("/services/[slug]", "page");
  }

  if (resource === "projects") {
    revalidatePath("/projects/[slug]", "page");
  }
}

/** Site-wide media, partners, company profile, header/footer and contact data. */
export function invalidatePublicSiteContent() {
  revalidatePaths(SITE_CONTENT_PATHS);
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/projects/[slug]", "page");
}
