import { routeError, success } from "@/lib/route-response";
import { getPublicProjects } from "@/modules/public-site/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublicProjects());
  } catch (error) {
    return routeError(error, "Gagal memuat project.");
  }
}
