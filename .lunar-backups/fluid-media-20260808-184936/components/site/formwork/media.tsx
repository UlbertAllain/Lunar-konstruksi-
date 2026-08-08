import { ImageIcon } from "lucide-react";

export function DatabaseImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#ddd7cd] text-[#7f7a72]`}>
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <ImageIcon className="h-5 w-5" />
          <span className="font-mono text-[9px] uppercase tracking-[0.18em]">Media belum diisi</span>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
