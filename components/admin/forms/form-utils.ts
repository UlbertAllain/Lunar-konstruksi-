import type { ApiEnvelope } from "@/lib/api";
import { adminFetch } from "@/lib/api";

export function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function arrayToLines(value: string[] | undefined) {
  return (value ?? []).join("\n");
}

export async function loadRecord<T>(endpoint: string, id: string) {
  const result = await adminFetch<ApiEnvelope<T>>(`${endpoint}/${id}`);
  return result.data;
}

export async function saveRecord<T>(
  endpoint: string,
  mode: "create" | "edit",
  id: string | undefined,
  data: unknown,
) {
  const url = mode === "edit" && id ? `${endpoint}/${id}` : endpoint;
  const result = await adminFetch<ApiEnvelope<T>>(url, {
    method: mode === "edit" ? "PUT" : "POST",
    body: JSON.stringify(data),
  });
  return result.data;
}
