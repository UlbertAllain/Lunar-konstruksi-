import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminLeadUpdateSchema,
  getLead,
  updateLead,
} from "@/features/leads/server";
import { requireAdmin } from "@/lib/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const lead = await getLead(id);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to get lead:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil lead.",
      },
      { status },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const payload = adminLeadUpdateSchema.parse(await request.json());

    const lead = await updateLead(id, payload);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            error.issues[0]?.message ??
            "Perubahan lead tidak valid.",
        },
        { status: 400 },
      );
    }

    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to update lead:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal memperbarui lead.",
      },
      { status },
    );
  }
}