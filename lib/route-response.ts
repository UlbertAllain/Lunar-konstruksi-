import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
    },
  );
}

export function emptySuccess(message: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
    },
    {
      status,
    },
  );
}

export function routeError(error: unknown, fallback = "Terjadi kesalahan.") {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: error.status,
      },
    );
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];

    return NextResponse.json(
      {
        success: false,
        message: firstIssue?.message ?? "Data yang dikirim tidak valid.",
        issues: error.issues,
      },
      {
        status: 422,
      },
    );
  }

  console.error("[ROUTE_ERROR]", error);

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : fallback,
    },
    {
      status: 500,
    },
  );
}
