import { NextRequest } from "next/server";

import { listCmsContentModules } from "@/features/content";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(listCmsContentModules());
  } catch (error) {
    return apiFailure(error);
  }
}
