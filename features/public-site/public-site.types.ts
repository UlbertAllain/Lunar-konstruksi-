import type { CmsBlock, CmsContentSource } from "@/cms/blocks/block.types";
import type { CmsPage } from "@/features/pages/page.types";
import type { SeoMetadata } from "@/features/seo/seo.types";
import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";
import type { FAQ } from "@/types/faq";
import type { Project } from "@/types/project";
import type { ConstructionService } from "@/types/service";
import type { TeamMember } from "@/types/team";
import type { Testimonial } from "@/types/testimonial";

export interface PublicOverviewData {
  services: ConstructionService[];
  projects: Project[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

export interface HydratedCmsSection extends CmsBlock {
  source: CmsContentSource | null;
  data: unknown[];
}

export interface PublicPageContext {
  page: CmsPage | null;
  settings: SiteSettings;
  navigation: NavigationSettings;
  sections: HydratedCmsSection[];
  metadata: SeoMetadata;
}
