import { HttpError, routeError, success } from "@/lib/route-response";
import { getProjectBySlug } from "@/modules/projects/project.repository";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const item = await getProjectBySlug((await context.params).slug);
    if (!item) throw new HttpError("Project tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memuat project.");
  }
}
