import type { SiteContentSettings } from "@/modules/site-content/site-content.types";

export type SiteData = {
  services: unknown[];
  projects: unknown[];
  team: unknown[];
  testimonials: unknown[];
  faqs: unknown[];
  siteContent: SiteContentSettings;
};

export type UnknownRecord = Record<string, unknown>;

export function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null ? (value as UnknownRecord) : {};
}

export function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function textFrom(record: UnknownRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

export function stringArray(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.map((item) => readString(item)).filter(Boolean);
    }
  }
  return [];
}

const directMediaKeys = [
  "url",
  "secure_url",
  "secureUrl",
  "src",
  "imageUrl",
  "imageURL",
  "coverImageUrl",
  "coverUrl",
  "photoUrl",
  "avatarUrl",
  "profileImageUrl",
  "serviceImageUrl",
  "projectImageUrl",
  "thumbnailUrl",
  "bannerUrl",
];

const nestedMediaKeys = [
  "coverImage",
  "cover",
  "image",
  "photo",
  "avatar",
  "profileImage",
  "serviceImage",
  "projectImage",
  "thumbnail",
  "banner",
  "media",
  "images",
  "gallery",
  "assets",
];

function mediaUrl(value: unknown, depth = 0): string {
  if (depth > 4 || value == null) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^(https?:\/\/|\/)/i.test(trimmed) ? trimmed : "";
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = mediaUrl(item, depth + 1);
      if (result) return result;
    }
    return "";
  }
  if (typeof value !== "object") return "";

  const record = value as UnknownRecord;
  for (const key of directMediaKeys) {
    const result = mediaUrl(record[key], depth + 1);
    if (result) return result;
  }
  for (const key of nestedMediaKeys) {
    const result = mediaUrl(record[key], depth + 1);
    if (result) return result;
  }
  for (const [key, nested] of Object.entries(record)) {
    if (!/(image|photo|media|cover|asset|gallery|thumb|avatar|banner|logo)/i.test(key)) continue;
    const result = mediaUrl(nested, depth + 1);
    if (result) return result;
  }
  return "";
}

export function imageFrom(record: UnknownRecord) {
  return mediaUrl(record);
}

export function projectModel(value: unknown, index = 0) {
  const record = asRecord(value);
  return {
    id: textFrom(record, ["id", "slug"], `project-${index}`),
    slug: textFrom(record, ["slug"], ""),
    title: textFrom(record, ["title", "name"], `Project ${String(index + 1).padStart(2, "0")}`),
    location: textFrom(record, ["location", "city"], "Indonesia"),
    year: textFrom(record, ["year"], ""),
    category: textFrom(record, ["category", "type", "projectType"], "Construction"),
    description: textFrom(record, ["shortDescription", "description", "summary"], ""),
    image: imageFrom(record),
  };
}

export function serviceModel(value: unknown, index = 0) {
  const record = asRecord(value);
  return {
    id: textFrom(record, ["id", "slug"], `service-${index}`),
    slug: textFrom(record, ["slug"], ""),
    name: textFrom(record, ["name", "title"], `Service ${String(index + 1).padStart(2, "0")}`),
    shortDescription: textFrom(record, ["shortDescription", "description", "summary"], ""),
    image: imageFrom(record),
    features: stringArray(record, ["features", "items", "scope"]),
  };
}

export function teamModel(value: unknown, index = 0) {
  const record = asRecord(value);
  return {
    id: textFrom(record, ["id", "name"], `team-${index}`),
    name: textFrom(record, ["name", "title"], `Team ${String(index + 1).padStart(2, "0")}`),
    position: textFrom(record, ["position", "role"], "Project Team"),
    description: textFrom(record, ["description", "bio"], ""),
    skills: stringArray(record, ["skills", "expertise"]),
    image: imageFrom(record),
  };
}

export function testimonialModel(value: unknown, index = 0) {
  const record = asRecord(value);
  return {
    id: textFrom(record, ["id", "name"], `testimonial-${index}`),
    name: textFrom(record, ["name", "clientName", "authorName"], "Client"),
    role: textFrom(record, ["position", "role", "company", "clientCompany"], "Client"),
    quote: textFrom(record, ["quote", "content", "message", "testimonial", "description"], ""),
    image: imageFrom(record),
  };
}

export function faqModel(value: unknown, index = 0) {
  const record = asRecord(value);
  return {
    id: textFrom(record, ["id"], `faq-${index}`),
    question: textFrom(record, ["question", "title"], `Pertanyaan ${index + 1}`),
    answer: textFrom(record, ["answer", "description", "content"], ""),
  };
}

export function distinctImages(values: { image: string }[]) {
  const seen = new Set<string>();
  return values
    .map((item) => item.image)
    .filter((image) => {
      if (!image || seen.has(image)) return false;
      seen.add(image);
      return true;
    });
}
