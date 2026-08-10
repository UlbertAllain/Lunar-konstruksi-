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
  hero?: boolean;
};

function cloudinaryHeroSource(src: string) {
  if (
    !src.includes("res.cloudinary.com") ||
    !src.includes("/image/upload/")
  ) {
    return src;
  }

  if (
    src.includes("/q_auto:best/") ||
    src.includes("/q_95/")
  ) {
    return src;
  }

  return src.replace(
    "/image/upload/",
    "/image/upload/c_limit,w_2400/q_auto:best/f_auto/",
  );
}

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
  hero = false,
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
  const isSvg =
    lower.endsWith(".svg") ||
    lower.includes(".svg?");
  const isCloudinaryHero =
    hero &&
    resolved.includes("res.cloudinary.com") &&
    resolved.includes("/image/upload/");

  const finalSrc = hero
    ? cloudinaryHeroSource(resolved)
    : resolved;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={hero ? 2400 : 1800}
      height={hero ? 1500 : 1200}
      sizes={sizes}
      preload={hero || preload}
      quality={quality}
      loading={hero || preload ? undefined : "lazy"}
      decoding="async"
      unoptimized={
        unoptimized ||
        isCloudinaryHero ||
        isDataUrl ||
        isSvg
      }
      className={`${className} ${
        hero ? "lunar-hero-image" : ""
      }`}
    />
  );
}
