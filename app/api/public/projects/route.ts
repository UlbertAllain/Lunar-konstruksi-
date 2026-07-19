import { routeError, success } from "@/lib/route";
import { getPublishedProjects } from "@/repositories/project.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublishedProjects());
  } catch (error) {
    return routeError(error, "Gagal memuat project.");
  }
}
