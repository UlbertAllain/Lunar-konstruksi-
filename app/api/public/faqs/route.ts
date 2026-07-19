import { routeError, success } from "@/lib/route-response";
import { getPublishedFAQs } from "@/repositories/faq.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublishedFAQs());
  } catch (error) {
    return routeError(error, "Gagal memuat FAQ.");
  }
}
