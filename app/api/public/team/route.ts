import { routeError, success } from "@/lib/route-response";
import { getPublicTeam } from "@/modules/public-site/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublicTeam());
  } catch (error) {
    return routeError(error, "Gagal memuat tim.");
  }
}
