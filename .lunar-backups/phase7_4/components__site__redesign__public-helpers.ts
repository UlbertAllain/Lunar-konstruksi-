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

export function pickImage(record: AnyRecord, fallback = "") {
  return pickText(
    record,
    [
      "coverImageUrl",
      "coverUrl",
      "heroImageUrl",
      "thumbnailUrl",
      "imageUrl",
      "featuredImageUrl",
      "mainImageUrl",
      "photoUrl",
      "avatarUrl",
      "mediaUrl",
      "url",
    ],
    fallback,
  );
}

export function pickHref(record: AnyRecord, fallback = "#") {
  return pickText(record, ["href", "url", "slug", "link"], fallback);
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
  const city = pickText(record, ["city", "locationCity"], "");
  const province = pickText(record, ["province", "locationProvince", "state"], "");
  return [city, province].filter(Boolean).join(", ");
}

export function surfaceImage(seed: string) {
  const encoded = encodeURIComponent(seed || "lunar-konstruksi");
  return `https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80&sig=${encoded}`;
}

export function neutralImage(seed: string) {
  const encoded = encodeURIComponent(seed || "interior stone");
  return `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80&sig=${encoded}`;
}

export function sectionContentText(content: Record<string, unknown>, key: string, fallback: string) {
  return readString(content[key], fallback);
}
