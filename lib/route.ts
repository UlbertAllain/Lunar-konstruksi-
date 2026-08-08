import { NextRequest } from "next/server";

import { verifyAdmin } from "@/modules/admin/admin-auth.service";

import { HttpError } from "@/lib/route-response";

export { success, emptySuccess, routeError } from "@/lib/route-response";

export async function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    throw new HttpError("Unauthorized", 401);
  }

  try {
    return await verifyAdmin(token);
  } catch (error) {
    throw new HttpError(
      error instanceof Error ? error.message : "Forbidden",
      403,
    );
  }
}
