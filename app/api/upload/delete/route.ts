import { NextRequest } from "next/server";

import { HttpError } from "@/lib/route-response";
import { emptySuccess, requireAdmin, routeError } from "@/lib/route";
import { deleteImage } from "@/modules/media/upload.service";

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = (await request.json()) as { publicId?: string };

    if (!body.publicId?.startsWith("lunar-konstruksi/")) {
      throw new HttpError("Public ID gambar tidak valid.", 400);
    }

    await deleteImage(body.publicId);
    return emptySuccess("Gambar berhasil dihapus dari storage.");
  } catch (error) {
    return routeError(error, "Gagal menghapus gambar.");
  }
}
