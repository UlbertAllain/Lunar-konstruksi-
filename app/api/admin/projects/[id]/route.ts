import { NextRequest } from "next/server";
import {
  detailProject,
  removeProject,
  updateProjectData,
} from "@/services/project.service";
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
    const item = await detailProject((await context.params).id);
    if (!item) throw new HttpError("Project tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal mengambil project.");
  }
}

async function update(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await updateProjectData(
      (await context.params).id,
      await request.json(),
    );
    if (!item) throw new HttpError("Project tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memperbarui project.");
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    if (!(await removeProject((await context.params).id))) {
      throw new HttpError("Project tidak ditemukan.", 404);
    }
    return emptySuccess("Project berhasil dihapus.");
  } catch (error) {
    return routeError(error, "Gagal menghapus project.");
  }
}
