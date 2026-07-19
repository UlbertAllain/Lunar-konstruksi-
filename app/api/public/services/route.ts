import { routeError, success } from "@/lib/route-response";
import { getPublishedServices } from "@/repositories/service.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublishedServices());
  } catch (error) {
    return routeError(error, "Gagal memuat layanan.");
  }
}
