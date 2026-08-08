import { NextRequest } from "next/server";

import { ensureCmsFoundation } from "@/cms/server";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(await ensureCmsFoundation());
  } catch (error) {
    return apiFailure(error);
  }
}
