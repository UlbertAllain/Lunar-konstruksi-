import { NextRequest } from "next/server";

import { HttpError } from "@/lib/route-response";
import { requireAdmin, routeError, success } from "@/lib/route";
import { uploadImage } from "@/modules/media/upload.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function sanitizeFolder(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      throw new HttpError("File gambar wajib dipilih.", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new HttpError(
        "Format gambar harus JPG, PNG, WEBP, atau AVIF.",
        415,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new HttpError("Ukuran gambar maksimal 5 MB.", 413);
    }

    if (typeof folder !== "string" || !sanitizeFolder(folder)) {
      throw new HttpError("Folder upload tidak valid.", 400);
    }

    const result = await uploadImage(Buffer.from(await file.arrayBuffer()), {
      folder: `lunar-konstruksi/${sanitizeFolder(folder)}`,
    });

    return success(result, 201);
  } catch (error) {
    return routeError(error, "Upload gambar gagal.");
  }
}
