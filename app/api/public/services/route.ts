import { routeError, success } from "@/lib/route-response";
import { getPublicServices } from "@/modules/public-site/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublicServices());
  } catch (error) {
    return routeError(error, "Gagal memuat layanan.");
  }
}
