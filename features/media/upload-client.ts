import type { ApiEnvelope } from "@/lib/api";
import { adminFetch } from "@/lib/api";
import type { MediaImage } from "@/types/media";

export async function uploadImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const result = await adminFetch<ApiEnvelope<MediaImage>>("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  return result.data;
}

export async function uploadMultipleImages(files: File[], folder: string) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("folder", folder);

  const result = await adminFetch<ApiEnvelope<MediaImage[]>>(
    "/api/upload/multiple",
    { method: "POST", body: formData },
  );

  return result.data;
}

export async function deleteStoredImage(publicId: string) {
  await adminFetch("/api/upload/delete", {
    method: "DELETE",
    body: JSON.stringify({ publicId }),
  });
}
