import { getCloudinary } from "@/lib/cloudinary";

interface UploadOptions {
  folder: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export async function uploadImage(file: Buffer, options: UploadOptions) {
  return new Promise<UploadedImage>((resolve, reject) => {
    getCloudinary()
      .uploader.upload_stream(
        {
          folder: options.folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary tidak mengembalikan hasil."));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      )
      .end(file);
  });
}

export function uploadMultipleImages(files: Buffer[], options: UploadOptions) {
  return Promise.all(files.map((file) => uploadImage(file, options)));
}

export async function deleteImage(publicId: string) {
  if (!publicId) return;
  await getCloudinary().uploader.destroy(publicId, { invalidate: true });
}

export async function deleteImagesSafely(publicIds: Array<string | undefined>) {
  const uniqueIds = [...new Set(publicIds.filter(Boolean) as string[])];

  await Promise.allSettled(uniqueIds.map((publicId) => deleteImage(publicId)));
}
