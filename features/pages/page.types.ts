import type { CmsBlock } from "@/cms";
import type { SeoMetadata } from "@/features/seo";

export const CMS_PAGE_STATUSES = ["draft", "published"] as const;
export type CmsPageStatus = (typeof CMS_PAGE_STATUSES)[number];

export const CMS_SYSTEM_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "projects",
  "contact",
] as const;
export type CmsSystemPageKey = (typeof CMS_SYSTEM_PAGE_KEYS)[number];

export type CmsPageType = "system" | "custom";

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  pageType: CmsPageType;
  systemKey?: CmsSystemPageKey;
  status: CmsPageStatus;
  sections: CmsBlock[];
  seo: SeoMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCmsPageInput = Omit<
  CmsPage,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateCmsPageInput = Omit<
  Partial<CreateCmsPageInput>,
  "seo"
> & {
  seo?: Partial<SeoMetadata>;
};
