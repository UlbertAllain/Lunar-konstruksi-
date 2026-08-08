import { NextRequest, NextResponse } from "next/server";

import {
  LEAD_STATUSES,
  listLeads,
  type LeadStatus,
} from "@/modules/leads/server";
import { requireAdmin } from "@/lib/route";

function errorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  return 500;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const statusParam = request.nextUrl.searchParams.get("status");
    const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 100);

    const status =
      statusParam && LEAD_STATUSES.includes(statusParam as LeadStatus)
        ? (statusParam as LeadStatus)
        : undefined;

    const leads = await listLeads({
      status,
      limit: Number.isFinite(limitParam) ? limitParam : 100,
    });

    return NextResponse.json({ data: leads });
  } catch (error) {
    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to list leads:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil leads.",
      },
      { status },
    );
  }
}