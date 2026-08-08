import { NextRequest } from "next/server";

import { createCmsPage, listCmsPages } from "@/features/pages/server";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(await listCmsPages());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const payload = await request.json();
    return apiSuccess(await createCmsPage(payload), 201);
  } catch (error) {
    return apiFailure(error);
  }
}
