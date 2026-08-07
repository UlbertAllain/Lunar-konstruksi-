export const CMS_BLOCK_TYPES = [
  "hero",
  "intro",
  "stats",
  "services",
  "process",
  "projects",
  "gallery",
  "team",
  "testimonials",
  "faq",
  "cta",
] as const;

export const CMS_CONTENT_SOURCES = [
  "services",
  "projects",
  "team",
  "testimonials",
  "faqs",
] as const;

export type CmsBlockType = (typeof CMS_BLOCK_TYPES)[number];
export type CmsContentSource = (typeof CMS_CONTENT_SOURCES)[number];

export interface CmsBlock {
  id: string;
  type: CmsBlockType;
  variant: string;
  isVisible: boolean;
  order: number;
  content: Record<string, unknown>;
}

export interface CmsBlockDefinition {
  type: CmsBlockType;
  label: string;
  description: string;
  defaultVariant: string;
  variants: readonly string[];
  source: CmsContentSource | null;
}
