import { routeError, success } from "@/lib/route-response";
import { getPublicFaqs } from "@/modules/public-site/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublicFaqs());
  } catch (error) {
    return routeError(error, "Gagal memuat FAQ.");
  }
}
