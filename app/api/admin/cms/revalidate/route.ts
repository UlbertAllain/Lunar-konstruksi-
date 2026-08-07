import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { apiFailure, apiSuccess } from "@/features/shared/http/route-handler";
import { requireAdmin } from "@/lib/route";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    revalidatePath("/", "layout");
    return apiSuccess({ revalidated: true });
  } catch (error) {
    return apiFailure(error);
  }
}
