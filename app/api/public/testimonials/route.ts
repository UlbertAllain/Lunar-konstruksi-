import { routeError, success } from "@/lib/route-response";
import { getPublicTestimonials } from "@/modules/public-site/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublicTestimonials());
  } catch (error) {
    return routeError(error, "Gagal memuat testimoni.");
  }
}
