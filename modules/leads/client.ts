import type { PublicLeadPayload } from "./lead.types";

export async function submitPublicLead(payload: PublicLeadPayload) {
  const response = await fetch("/api/public/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as
    | {
        data?: { leadId?: string | null };
        error?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Permintaan belum dapat dikirim. Silakan coba lagi.",
    );
  }

  return {
    leadId: result?.data?.leadId ?? null,
  };
}

export function buildLeadWhatsAppText(
  payload: Omit<PublicLeadPayload, "website" | "startedAt">,
  leadId?: string | null,
) {
  return [
    "Halo Lunar Konstruksi, saya ingin mendiskusikan proyek.",
    leadId ? `Referensi: ${leadId}` : null,
    `Nama: ${payload.name}`,
    `Nomor: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Jenis proyek: ${payload.projectType}`,
    `Lokasi: ${payload.location}`,
    `Keterangan: ${payload.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}