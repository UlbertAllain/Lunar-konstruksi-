import { NextRequest } from "next/server";

import { HttpError, requireAdmin, routeError, success } from "@/lib/route";
import { uploadMultipleImages } from "@/services/upload.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function sanitizeFolder(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9/_-]/g, "").slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder");

    if (files.length === 0 || files.length > MAX_FILES) {
      throw new HttpError(`Pilih 1 sampai ${MAX_FILES} gambar.`, 400);
    }

    if (typeof folder !== "string" || !sanitizeFolder(folder)) {
      throw new HttpError("Folder upload tidak valid.", 400);
    }

    const buffers = await Promise.all(
      files.map(async (entry) => {
        if (!(entry instanceof File)) {
          throw new HttpError("File upload tidak valid.", 400);
        }
        if (!ALLOWED_TYPES.has(entry.type)) {
          throw new HttpError("Format gambar harus JPG, PNG, WEBP, atau AVIF.", 415);
        }
        if (entry.size > MAX_FILE_SIZE) {
          throw new HttpError("Ukuran setiap gambar maksimal 5 MB.", 413);
        }
        return Buffer.from(await entry.arrayBuffer());
      }),
    );

    return success(
      await uploadMultipleImages(buffers, {
        folder: `lunar-konstruksi/${sanitizeFolder(folder)}`,
      }),
      201,
    );
  } catch (error) {
    return routeError(error, "Upload gallery gagal.");
  }
}
