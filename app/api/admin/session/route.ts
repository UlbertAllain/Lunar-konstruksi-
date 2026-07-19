import { NextRequest } from "next/server";
import { requireAdmin, routeError, success } from "@/lib/route";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    return success(await requireAdmin(request));
  } catch (error) {
    return routeError(error, "Sesi admin tidak valid.");
  }
}
