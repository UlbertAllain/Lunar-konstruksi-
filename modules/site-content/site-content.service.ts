import { deleteImagesSafely } from "@/modules/media/upload.service";
import {
  getSiteContentSettings,
  saveSiteContentSettings,
} from "./site-content.repository";
import { siteContentSchema } from "./site-content.schema";
import type { SiteContentSettings } from "./site-content.types";
import { invalidatePublicSiteContent } from "@/modules/public-site/public-cache";

function imageIds(
  content: SiteContentSettings,
) {
  return [
    content.homeHero?.publicId,
    content.servicesHero?.publicId,
    content.projectsHero?.publicId,
    content.contactHero?.publicId,
    ...content.partners.map(
      (partner) =>
        partner.logo?.publicId,
    ),
  ].filter(
    (value): value is string =>
      Boolean(value),
  );
}

function decodeHtmlEntities(
  value: string,
) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&quot;", '"');
}

function extractIframeSource(
  value: unknown,
) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const sourceMatch =
    trimmed.match(
      /src\s*=\s*["']([^"']+)["']/i,
    );

  return decodeHtmlEntities(
    sourceMatch?.[1]?.trim() ??
      trimmed,
  );
}

function normalizePayload(
  payload: unknown,
) {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return payload;
  }

  const record = {
    ...(payload as Record<
      string,
      unknown
    >),
  };

  if (
    record.officeLocation &&
    typeof record.officeLocation ===
      "object"
  ) {
    const officeLocation = {
      ...(record.officeLocation as Record<
        string,
        unknown
      >),
    };

    officeLocation.googleMapsEmbedUrl =
      extractIframeSource(
        officeLocation.googleMapsEmbedUrl,
      );

    record.officeLocation =
      officeLocation;
  }

  return record;
}

export function readSiteContentSettings() {
  return getSiteContentSettings();
}

export async function updateSiteContentSettings(
  payload: unknown,
) {
  const previous =
    await getSiteContentSettings();

  const patch =
    siteContentSchema
      .partial()
      .parse(
        normalizePayload(payload),
      );

  const next: SiteContentSettings = {
    ...previous,
    ...patch,
    officeLocation: {
      ...previous.officeLocation,
      ...(patch.officeLocation ?? {}),
    },
    companyProfile: {
      ...previous.companyProfile,
      ...(patch.companyProfile ?? {}),
    },
    id: "public",
  };

  const saved =
    await saveSiteContentSettings(
      patch,
    );

  const retained = new Set(
    imageIds(next),
  );

  await deleteImagesSafely(
    imageIds(previous).filter(
      (publicId) =>
        !retained.has(publicId),
    ),
  );

  invalidatePublicSiteContent();
  return saved;
}
