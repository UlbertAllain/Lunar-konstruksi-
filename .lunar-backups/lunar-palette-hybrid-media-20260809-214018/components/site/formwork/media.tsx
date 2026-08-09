import { ImageIcon } from "lucide-react";

export function DatabaseImage({
  src,
  fallbackSrc = "",
  alt,
  className,
  placeholderLabel = "Media belum diisi",
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className: string;
  placeholderLabel?: string;
}) {
  const resolved = src || fallbackSrc;

  if (!resolved) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#ded8ce] text-[#7f7a72]`}>
        <div className="flex max-w-[180px] flex-col items-center gap-2 px-4 text-center">
          <ImageIcon className="h-5 w-5" />
          <span className="font-mono text-[9px] uppercase leading-5 tracking-[0.18em]">{placeholderLabel}</span>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolved} alt={alt} className={className} />;
}
