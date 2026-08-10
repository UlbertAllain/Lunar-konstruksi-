import { z } from "zod";

const mediaImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
});

const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Nama partner minimal 2 karakter."),
  logo: mediaImageSchema.nullable(),
  website: z.string().trim(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().min(0),
});

function isHttpsUrl(value: string) {
  if (!value) return true;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isGoogleMapsLink(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return false;
    }

    return (
      url.hostname === "maps.app.goo.gl" ||
      url.hostname === "goo.gl" ||
      url.hostname === "www.google.com" ||
      url.hostname === "google.com" ||
      url.hostname === "maps.google.com"
    );
  } catch {
    return false;
  }
}

function isGoogleMapsEmbed(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return false;
    }

    if (
      url.hostname === "www.google.com" ||
      url.hostname === "google.com"
    ) {
      return url.pathname.startsWith("/maps/embed");
    }

    if (url.hostname === "maps.google.com") {
      return url.searchParams.get("output") === "embed";
    }

    return false;
  } catch {
    return false;
  }
}

const officeLocationSchema = z.object({
  name: z.string().trim(),
  address: z.string().trim(),
  googleMapsUrl: z
    .string()
    .trim()
    .refine(
      isGoogleMapsLink,
      "Gunakan link yang berasal dari Google Maps.",
    ),
  googleMapsEmbedUrl: z
    .string()
    .trim()
    .refine(
      isGoogleMapsEmbed,
      "Gunakan link Embed Google Maps yang valid.",
    ),
  isVisible: z.boolean(),
});

const companyProfileSchema = z.object({
  companyName: z.string().trim(),
  shortDescription: z.string().trim(),
  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        z.string().email().safeParse(value).success,
      "Format email tidak valid.",
    ),
  phone: z.string().trim(),
  whatsapp: z.string().trim(),
  instagramUrl: z
    .string()
    .trim()
    .refine(
      isHttpsUrl,
      "Link Instagram harus menggunakan HTTPS.",
    ),
  linkedinUrl: z
    .string()
    .trim()
    .refine(
      isHttpsUrl,
      "Link LinkedIn harus menggunakan HTTPS.",
    ),
  copyrightText: z.string().trim(),
});

export const siteContentSchema = z.object({
  homeHero: mediaImageSchema.nullable(),
  servicesHero: mediaImageSchema.nullable(),
  projectsHero: mediaImageSchema.nullable(),
  contactHero: mediaImageSchema.nullable(),
  partners: z.array(partnerSchema),
  officeLocation: officeLocationSchema,
  companyProfile: companyProfileSchema,
});
