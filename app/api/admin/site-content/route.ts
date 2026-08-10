import { NextRequest } from "next/server";

import {
  readSiteContentSettings,
  updateSiteContentSettings,
} from "@/modules/site-content/site-content.service";
import {
  requireAdmin,
  routeError,
  success,
} from "@/lib/route";

export async function GET(
  request: NextRequest,
) {
  try {
    await requireAdmin(request);

    return success(
      await readSiteContentSettings(),
    );
  } catch (error) {
    return routeError(
      error,
      "Gagal mengambil konten situs.",
    );
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    await requireAdmin(request);

    return success(
      await updateSiteContentSettings(
        await request.json(),
      ),
    );
  } catch (error) {
    return routeError(
      error,
      "Gagal menyimpan konten situs.",
    );
  }
}

export const PATCH = PUT;
