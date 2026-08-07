import { z } from "zod";

function isSafeHref(value: string) {
  const href = value.trim();
  if (/^(javascript|data):/i.test(href)) {
    return false;
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return true;
  }

  if (/^(mailto|tel):/i.test(href)) {
    return true;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const baseNavigationItemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(1000).refine(isSafeHref, "Link tidak valid."),
  target: z.enum(["internal", "external"]),
  openInNewTab: z.boolean(),
  isVisible: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export const navigationItemSchema = baseNavigationItemSchema.extend({
  children: z.array(baseNavigationItemSchema).max(8),
});

export const navigationSettingsSchema = z.object({
  header: z.array(navigationItemSchema).max(12),
  footerPrimary: z.array(navigationItemSchema).max(16),
  footerSecondary: z.array(navigationItemSchema).max(16),
});
