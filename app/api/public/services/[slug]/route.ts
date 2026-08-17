import { HttpError, routeError, success } from "@/lib/route-response";
import { getPublicServiceBySlug } from "@/modules/public-site/server";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const item = await getPublicServiceBySlug((await context.params).slug);
    if (!item) throw new HttpError("Layanan tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memuat layanan.");
  }
}
