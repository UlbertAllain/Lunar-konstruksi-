import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { DomainError } from "@/features/shared/errors/domain-error";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function apiFailure(error: unknown) {
  if (error instanceof DomainError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Data yang dikirim belum valid.",
          issues: error.issues,
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Format JSON tidak valid.",
        },
      },
      { status: 400 },
    );
  }

  console.error("Unhandled CMS route error:", error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Terjadi kesalahan pada server.",
      },
    },
    { status: 500 },
  );
}
