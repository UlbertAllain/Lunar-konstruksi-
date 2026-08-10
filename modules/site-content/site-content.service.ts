import { deleteImagesSafely } from "@/modules/media/upload.service";
import {
  getSiteContentSettings,
  saveSiteContentSettings,
} from "./site-content.repository";
import { siteContentSchema } from "./site-content.schema";
import type { SiteContentSettings } from "./site-content.types";

function imageIds(content: SiteContentSettings) {
  return [
    content.homeHero?.publicId,
    content.servicesHero?.publicId,
    content.projectsHero?.publicId,
    content.contactHero?.publicId,
    ...content.partners.map((partner) => partner.logo?.publicId),
  ].filter((value): value is string => Boolean(value));
}

export function readSiteContentSettings() {
  return getSiteContentSettings();
}

export async function updateSiteContentSettings(payload: unknown) {
  const previous = await getSiteContentSettings();
  const patch = siteContentSchema.partial().parse(payload);

  const next: SiteContentSettings = {
    ...previous,
    ...patch,
    id: "public",
  };

  const saved = await saveSiteContentSettings(patch);
  const retained = new Set(imageIds(next));

  await deleteImagesSafely(
    imageIds(previous).filter((publicId) => !retained.has(publicId)),
  );

  return saved;
}
