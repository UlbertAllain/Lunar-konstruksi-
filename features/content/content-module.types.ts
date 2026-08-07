import type { CmsBlockType, CmsContentSource } from "@/cms";

export type CmsContentLifecycle = "publication" | "activation";

export interface CmsContentModuleCapabilities {
  slug: boolean;
  detailPage: boolean;
  ordering: boolean;
  media: boolean;
  featured: boolean;
}

export interface CmsContentModuleDefinition {
  key: CmsContentSource;
  label: string;
  singularLabel: string;
  description: string;
  collection: string;
  adminPath: string;
  publicPath: string | null;
  lifecycle: CmsContentLifecycle;
  blockTypes: readonly CmsBlockType[];
  capabilities: CmsContentModuleCapabilities;
}
