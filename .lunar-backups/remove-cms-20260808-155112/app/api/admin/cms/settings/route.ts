import { NextRequest } from "next/server";

import {
  getSiteSettingsWithDefaults,
  saveSiteSettings,
} from "@/features/site-settings/server";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(await getSiteSettingsWithDefaults());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const payload = await request.json();
    return apiSuccess(await saveSiteSettings(payload));
  } catch (error) {
    return apiFailure(error);
  }
}
