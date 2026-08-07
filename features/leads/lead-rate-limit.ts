import { createHash } from "node:crypto";

import type { NextRequest } from "next/server";

import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION = "leadRateLimits";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export class LeadRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Terlalu banyak permintaan. Silakan coba lagi beberapa saat.");
    this.name = "LeadRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function requestFingerprint(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";

  return createHash("sha256")
    .update(`${ip}|${userAgent.slice(0, 180)}`)
    .digest("hex");
}

export async function consumeLeadRateLimit(request: NextRequest) {
  const key = requestFingerprint(request);
  const ref = getAdminDb().collection(COLLECTION).doc(key);
  const now = Date.now();

  await getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();

    const windowStartedAt = Number(data?.windowStartedAt ?? 0);
    const count = Number(data?.count ?? 0);
    const expired = !windowStartedAt || now - windowStartedAt >= WINDOW_MS;

    if (expired) {
      transaction.set(
        ref,
        {
          windowStartedAt: now,
          count: 1,
          updatedAtMs: now,
        },
        { merge: true },
      );
      return;
    }

    if (count >= MAX_ATTEMPTS) {
      const retryAfterMs = WINDOW_MS - (now - windowStartedAt);
      throw new LeadRateLimitError(
        Math.max(1, Math.ceil(retryAfterMs / 1000)),
      );
    }

    transaction.set(
      ref,
      {
        count: count + 1,
        updatedAtMs: now,
      },
      { merge: true },
    );
  });
}