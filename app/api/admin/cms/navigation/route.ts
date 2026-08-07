import { NextRequest } from "next/server";

import {
  getNavigationSettingsWithDefaults,
  saveNavigationSettings,
} from "@/features/navigation/server";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return apiSuccess(await getNavigationSettingsWithDefaults());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const payload = await request.json();
    return apiSuccess(await saveNavigationSettings(payload));
  } catch (error) {
    return apiFailure(error);
  }
}
