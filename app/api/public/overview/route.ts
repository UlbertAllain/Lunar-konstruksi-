import { routeError, success } from "@/lib/route-response";
import { getPublishedFAQs } from "@/modules/faqs/faq.repository";
import { getPublishedProjects } from "@/modules/projects/project.repository";
import { getPublishedServices } from "@/modules/services/service.repository";
import { getActiveTeamMembers } from "@/modules/team/team.repository";
import { getPublishedTestimonials } from "@/modules/testimonials/testimonial.repository";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [services, projects, team, testimonials, faqs] = await Promise.all([
      getPublishedServices(),
      getPublishedProjects(),
      getActiveTeamMembers(),
      getPublishedTestimonials(),
      getPublishedFAQs(),
    ]);

    return success({ services, projects, team, testimonials, faqs });
  } catch (error) {
    return routeError(error, "Gagal memuat data website.");
  }
}
