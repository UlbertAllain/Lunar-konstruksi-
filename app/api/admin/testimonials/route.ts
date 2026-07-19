import { NextRequest } from "next/server";
import {
  createTestimonialData,
  listTestimonials,
} from "@/services/testimonial.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await listTestimonials());
  } catch (error) {
    return routeError(error, "Gagal mengambil testimoni.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await createTestimonialData(await request.json()), 201);
  } catch (error) {
    return routeError(error, "Gagal menambahkan testimoni.");
  }
}
