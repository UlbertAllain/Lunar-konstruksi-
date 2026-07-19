import { getFirebaseAuth } from "@/lib/firebase/client";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ?? `Permintaan gagal dengan status ${response.status}.`,
    );
  }

  return payload as T;
}

export async function adminFetch<T>(url: string, options: RequestInit = {}) {
  const user = getFirebaseAuth().currentUser;

  if (!user) {
    throw new Error("Sesi login tidak tersedia. Silakan login kembali.");
  }

  const token = await user.getIdToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  return parseResponse<T>(response);
}

export async function publicFetch<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);
  return parseResponse<T>(response);
}
