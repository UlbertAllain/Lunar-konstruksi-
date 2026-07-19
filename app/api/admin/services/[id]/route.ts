import { NextRequest } from "next/server";
import {
  detailService,
  removeService,
  updateServiceData,
} from "@/services/service.service";

import { HttpError } from "@/lib/route-response";
import { emptySuccess, requireAdmin, routeError, success } from "@/lib/route";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await detailService((await context.params).id);
    if (!item) throw new HttpError("Layanan tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal mengambil layanan.");
  }
}

async function update(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await updateServiceData(
      (await context.params).id,
      await request.json(),
    );
    if (!item) throw new HttpError("Layanan tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memperbarui layanan.");
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    if (!(await removeService((await context.params).id))) {
      throw new HttpError("Layanan tidak ditemukan.", 404);
    }
    return emptySuccess("Layanan berhasil dihapus.");
  } catch (error) {
    return routeError(error, "Gagal menghapus layanan.");
  }
}
