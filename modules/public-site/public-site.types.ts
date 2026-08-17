import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { SiteContentSettings } from "@/modules/site-content/site-content.types";
import type { TeamMember } from "@/modules/team/team.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

export interface PublicOverviewData {
  services: ConstructionService[];
  projects: Project[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  siteContent: SiteContentSettings;
}
