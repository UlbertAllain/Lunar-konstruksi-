import { routeError, success } from "@/lib/route-response";
import { getPublishedProjects } from "@/modules/projects/project.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublishedProjects());
  } catch (error) {
    return routeError(error, "Gagal memuat project.");
  }
}
