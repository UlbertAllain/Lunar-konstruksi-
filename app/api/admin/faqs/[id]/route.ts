import { NextRequest } from "next/server";
import { detailFAQ, removeFAQ, updateFAQData } from "@/modules/faqs/faq.service";
import { emptySuccess, requireAdmin, routeError, success } from "@/lib/route";

import { HttpError } from "@/lib/route-response";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await detailFAQ((await context.params).id);
    if (!item) throw new HttpError("FAQ tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal mengambil FAQ.");
  }
}

async function update(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await updateFAQData(
      (await context.params).id,
      await request.json(),
    );
    if (!item) throw new HttpError("FAQ tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memperbarui FAQ.");
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    if (!(await removeFAQ((await context.params).id))) {
      throw new HttpError("FAQ tidak ditemukan.", 404);
    }
    return emptySuccess("FAQ berhasil dihapus.");
  } catch (error) {
    return routeError(error, "Gagal menghapus FAQ.");
  }
}
