import { NextRequest } from "next/server";
import {
  detailTeam,
  removeTeam,
  updateTeamData,
} from "@/services/team.service";

import { HttpError } from "@/lib/route-response";
import { emptySuccess, requireAdmin, routeError, success } from "@/lib/route";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await detailTeam((await context.params).id);
    if (!item) throw new HttpError("Anggota tim tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal mengambil anggota tim.");
  }
}

async function update(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    const item = await updateTeamData(
      (await context.params).id,
      await request.json(),
    );
    if (!item) throw new HttpError("Anggota tim tidak ditemukan.", 404);
    return success(item);
  } catch (error) {
    return routeError(error, "Gagal memperbarui anggota tim.");
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request);
    if (!(await removeTeam((await context.params).id))) {
      throw new HttpError("Anggota tim tidak ditemukan.", 404);
    }
    return emptySuccess("Anggota tim berhasil dihapus.");
  } catch (error) {
    return routeError(error, "Gagal menghapus anggota tim.");
  }
}
