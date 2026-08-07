import { NextRequest } from "next/server";

import { listCmsBlockDefinitions } from "@/cms";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(listCmsBlockDefinitions());
  } catch (error) {
    return apiFailure(error);
  }
}
