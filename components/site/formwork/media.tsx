import Image from "next/image";
import { ImageIcon } from "lucide-react";

type DatabaseImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className: string;
  placeholderLabel?: string;
  sizes?: string;
  preload?: boolean;
  quality?: number;
  unoptimized?: boolean;
};

export function DatabaseImage({
  src,
  fallbackSrc = "",
  alt,
  className,
  placeholderLabel = "Media belum diisi",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
  preload = false,
  quality = 90,
  unoptimized = false,
}: DatabaseImageProps) {
  const resolved = src || fallbackSrc;

  if (!resolved) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#ded8ce] text-[#7f7a72]`}
      >
        <div className="flex max-w-[180px] flex-col items-center gap-2 px-4 text-center">
          <ImageIcon className="h-5 w-5" />
          <span className="font-mono text-[9px] uppercase leading-5 tracking-[0.18em]">
            {placeholderLabel}
          </span>
        </div>
      </div>
    );
  }

  const lower = resolved.toLowerCase();
  const isDataUrl = resolved.startsWith("data:");
  const isSvg = lower.endsWith(".svg") || lower.includes(".svg?");

  return (
    <Image
      src={resolved}
      alt={alt}
      width={1800}
      height={1200}
      sizes={sizes}
      preload={preload}
      quality={quality}
      loading={preload ? undefined : "lazy"}
      decoding="async"
      unoptimized={unoptimized || isDataUrl || isSvg}
      className={className}
    />
  );
}
