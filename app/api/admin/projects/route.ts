import { NextRequest } from "next/server";
import { createProjectData, listProjects } from "@/modules/projects/project.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await listProjects());
  } catch (error) {
    return routeError(error, "Gagal mengambil project.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await createProjectData(await request.json()), 201);
  } catch (error) {
    return routeError(error, "Gagal menambahkan project.");
  }
}
