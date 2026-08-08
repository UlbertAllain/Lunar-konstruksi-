import { NextRequest } from "next/server";
import { createFAQData, listFAQs } from "@/modules/faqs/faq.service";
import { requireAdmin, routeError, success } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await listFAQs());
  } catch (error) {
    return routeError(error, "Gagal mengambil FAQ.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return success(await createFAQData(await request.json()), 201);
  } catch (error) {
    return routeError(error, "Gagal menambahkan FAQ.");
  }
}
