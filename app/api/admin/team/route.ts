import { NextRequest } from "next/server";
import { createTeamData, listTeam } from "@/modules/team/team.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await listTeam());
  } catch (error) {
    return routeError(error, "Gagal mengambil tim.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await createTeamData(await request.json()), 201);
  } catch (error) {
    return routeError(error, "Gagal menambahkan anggota tim.");
  }
}
