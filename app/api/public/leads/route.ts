import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  consumeLeadRateLimit,
  createLead,
  LeadRateLimitError,
  publicLeadSchema,
} from "@/features/leads/server";

export async function POST(request: NextRequest) {
  try {
    const payload = publicLeadSchema.parse(await request.json());

    // Honeypot: bot mendapat respons sukses palsu agar tidak mencoba variasi payload.
    if (payload.website) {
      return NextResponse.json(
        { data: { leadId: null } },
        { status: 202 },
      );
    }

    await consumeLeadRateLimit(request);

    const lead = await createLead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      projectType: payload.projectType,
      location: payload.location,
      message: payload.message,
    });

    return NextResponse.json(
      {
        data: {
          leadId: lead.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof LeadRateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: {
            "Retry-After": String(error.retryAfterSeconds),
          },
        },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            error.issues[0]?.message ??
            "Data permintaan belum lengkap atau tidak valid.",
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Payload tidak valid." },
        { status: 400 },
      );
    }

    console.error("Failed to create public lead:", error);

    return NextResponse.json(
      { error: "Permintaan belum dapat disimpan. Silakan coba lagi." },
      { status: 500 },
    );
  }
}