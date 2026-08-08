import { createSlug } from "./slug";

export function createUniqueSlug(
  value: string,
  existingSlugs: string[],
  currentSlug?: string,
) {
  const base = createSlug(value) || "item";
  const occupied = new Set(existingSlugs.filter((slug) => slug !== currentSlug));

  if (!occupied.has(base)) {
    return base;
  }

  let suffix = 2;
  while (occupied.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}
