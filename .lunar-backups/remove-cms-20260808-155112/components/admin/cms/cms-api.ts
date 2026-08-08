"use client";

import { getAuth } from "firebase/auth";

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  error?: string | { message?: string; code?: string };
};

function readApiError(payload: ApiEnvelope<unknown> | null, fallback: string) {
  if (!payload) return fallback;
  if (typeof payload.error === "string") return payload.error;
  if (payload.error?.message) return payload.error.message;
  return fallback;
}

async function getAdminToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Sesi admin tidak ditemukan. Silakan login kembali.");
  }

  return user.getIdToken();
}

export async function adminCmsRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getAdminToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(readApiError(payload, "Permintaan CMS gagal diproses."));
  }

  if (!payload || payload.data === undefined) {
    throw new Error("Respons CMS tidak memiliki data yang dapat dibaca.");
  }

  return payload.data;
}

export function jsonBody(value: unknown): RequestInit {
  return {
    body: JSON.stringify(value),
  };
}

export async function revalidatePublicSite() {
  return adminCmsRequest<{ revalidated: boolean }>("/api/admin/cms/revalidate", { method: "POST" });
}
