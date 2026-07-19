import { routeError, success } from "@/lib/route";
import { getPublishedTestimonials } from "@/repositories/testimonial.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getPublishedTestimonials());
  } catch (error) {
    return routeError(error, "Gagal memuat testimoni.");
  }
}
