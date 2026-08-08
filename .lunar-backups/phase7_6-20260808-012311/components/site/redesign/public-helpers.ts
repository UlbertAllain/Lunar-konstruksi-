export type AnyRecord = Record<string, unknown>;

export function asRecord(value: unknown): AnyRecord {
  return typeof value === "object" && value !== null ? (value as AnyRecord) : {};
}

export function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

export function readNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function readArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function readList(value: unknown): string[] {
  return readArray(value).map((item) => readString(item)).filter(Boolean);
}

export function pickText(record: AnyRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}

export function pickNumber(record: AnyRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return fallback;
}

function looksLikeMediaUrl(value: string) {
  const normalized = value.trim();
  if (!normalized) return false;
  return (
    normalized.startsWith("https://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("data:image/") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("/")
  );
}

const DIRECT_MEDIA_KEYS = [
  "photoUrl",
  "profilePhotoUrl",
  "profileImageUrl",
  "avatarUrl",
  "coverImageUrl",
  "coverUrl",
  "thumbnailUrl",
  "featuredImageUrl",
  "mainImageUrl",
  "heroImageUrl",
  "imageUrl",
  "mediaUrl",
  "assetUrl",
  "secureUrl",
  "secure_url",
] as const;

const NESTED_MEDIA_KEYS = [
  "photo",
  "profilePhoto",
  "profileImage",
  "avatar",
  "coverImage",
  "cover",
  "thumbnail",
  "featuredImage",
  "mainImage",
  "heroImage",
  "image",
  "media",
  "images",
  "photos",
  "gallery",
  "mediaItems",
  "projectImages",
  "imageUrls",
  "assets",
] as const;

const CLOUDINARY_URL_KEYS = ["secure_url", "secureUrl", "url", "src", "assetUrl", "imageUrl"] as const;

function resolveMediaValue(value: unknown, depth = 0): string {
  if (depth > 4 || value == null) return "";

  if (typeof value === "string") {
    return looksLikeMediaUrl(value) ? value.trim() : "";
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const result = resolveMediaValue(entry, depth + 1);
      if (result) return result;
    }
    return "";
  }

  if (typeof value === "object") {
    const object = value as AnyRecord;

    for (const key of CLOUDINARY_URL_KEYS) {
      const raw = object[key];
      if (typeof raw === "string" && looksLikeMediaUrl(raw)) return raw.trim();
    }

    for (const key of [...DIRECT_MEDIA_KEYS, ...NESTED_MEDIA_KEYS]) {
      if (!(key in object)) continue;
      const result = resolveMediaValue(object[key], depth + 1);
      if (result) return result;
    }
  }

  return "";
}

export function pickImage(record: AnyRecord, fallback = "") {
  for (const key of DIRECT_MEDIA_KEYS) {
    const result = resolveMediaValue(record[key]);
    if (result) return result;
  }

  for (const key of NESTED_MEDIA_KEYS) {
    const result = resolveMediaValue(record[key]);
    if (result) return result;
  }

  return fallback;
}

export function pickHref(record: AnyRecord, fallback = "#") {
  return pickText(record, ["href", "url", "link"], fallback);
}

export function slugToHref(basePath: string, record: AnyRecord, fallback = "#") {
  const slug = pickText(record, ["slug"], "");
  return slug ? `${basePath}/${slug}` : fallback;
}

export function initials(value: string) {
  const clean = value.trim();
  if (!clean) return "LK";
  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function joinLocation(record: AnyRecord) {
  const direct = pickText(record, ["location", "projectLocation", "address"], "");
  if (direct) return direct;
  const city = pickText(record, ["city", "locationCity"], "");
  const province = pickText(record, ["province", "locationProvince", "state"], "");
  return [city, province].filter(Boolean).join(", ");
}

export function technicalPlaceholder(label = "Lunar Konstruksi", tone: "light" | "dark" = "light") {
  const safe = label.replace(/[<>&\"']/g, "").slice(0, 46) || "Lunar Konstruksi";
  const background = tone === "dark" ? "#111111" : "#ECEBE8";
  const grid = tone === "dark" ? "#272727" : "#D6D4CF";
  const text = tone === "dark" ? "#F3F3F1" : "#292929";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${background}"/><g stroke="${grid}" stroke-width="1"><path d="M0 100H1200M0 200H1200M0 300H1200M0 400H1200M0 500H1200M0 600H1200M0 700H1200"/><path d="M100 0V800M200 0V800M300 0V800M400 0V800M500 0V800M600 0V800M700 0V800M800 0V800M900 0V800M1000 0V800M1100 0V800"/></g><rect x="78" y="78" width="1044" height="644" fill="none" stroke="#F26422" stroke-width="4"/><text x="96" y="650" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="50" font-weight="700">${safe}</text><text x="96" y="695" fill="#F26422" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700" letter-spacing="4">MEDIA BELUM DIISI</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function surfaceImage(seed: string) {
  return technicalPlaceholder(seed, "dark");
}

export function neutralImage(seed: string) {
  return technicalPlaceholder(seed, "light");
}

export function sectionContentText(content: Record<string, unknown>, key: string, fallback: string) {
  return readString(content[key], fallback);
}
