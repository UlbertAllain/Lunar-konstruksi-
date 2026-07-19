import { NextRequest } from "next/server";
import {
  detailTestimonial,
  removeTestimonial,
  updateTestimonialData,
} from "@/services/testimonial.service";
import {
  emptySuccess,
  HttpError,
  requireAdmin,
  routeError,
  success,
} from "@/lib/route";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await detailTestimonial((await context.params).id);
    if (!item) throw new HttpError("Testimoni tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal mengambil testimoni.");
  }
}

async function update(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await updateTestimonialData(
      (await context.params).id,
      await request.json(),
    );
    if (!item) throw new HttpError("Testimoni tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memperbarui testimoni.");
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    if (!(await removeTestimonial((await context.params).id))) {
      throw new HttpError("Testimoni tidak ditemukan.", 404);
    }
    return emptySuccess("Testimoni berhasil dihapus.");
  } catch (error) {
    return routeError(error, "Gagal menghapus testimoni.");
  }
}
