import { NextRequest } from "next/server";

import {
  deleteCmsPage,
  getCmsPage,
  updateCmsPage,
} from "@/features/pages/server";
import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    return apiSuccess(await getCmsPage(id));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const payload = await request.json();
    return apiSuccess(await updateCmsPage(id, payload));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    await deleteCmsPage(id);
    return apiSuccess({ id, deleted: true });
  } catch (error) {
    return apiFailure(error);
  }
}
