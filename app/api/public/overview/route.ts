import { routeError, success } from "@/lib/route-response";
import { getPublicOverviewData } from "@/modules/public-site/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { services, projects, team, testimonials, faqs } =
      await getPublicOverviewData();

    return success({ services, projects, team, testimonials, faqs });
  } catch (error) {
    return routeError(error, "Gagal memuat data website.");
  }
}
