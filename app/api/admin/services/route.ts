import { NextRequest } from "next/server";
import { createServiceData, listServices } from "@/services/service.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await listServices());
  } catch (error) {
    return routeError(error, "Gagal mengambil layanan.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await createServiceData(await request.json()), 201);
  } catch (error) {
    return routeError(error, "Gagal menambahkan layanan.");
  }
}
