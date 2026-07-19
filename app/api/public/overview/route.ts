import { routeError, success } from "@/lib/route";
import { getPublishedFAQs } from "@/repositories/faq.repository";
import { getPublishedProjects } from "@/repositories/project.repository";
import { getPublishedServices } from "@/repositories/service.repository";
import { getActiveTeamMembers } from "@/repositories/team.repository";
import { getPublishedTestimonials } from "@/repositories/testimonial.repository";

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
