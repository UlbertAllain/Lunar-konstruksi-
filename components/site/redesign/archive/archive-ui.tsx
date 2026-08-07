import type { ReactNode } from "react";

export function ArchiveFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden border border-[#2C2925]/20 bg-[#F3EBDD] text-[#231F1B] ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(76,63,49,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(76,63,49,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function ArchiveLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex border px-2 py-1 text-[9px] font-black uppercase tracking-[0.19em] ${dark ? "border-white/25 text-white/70" : "border-[#2C2925]/30 text-[#2C2925]/65"}`}>
      {children}
    </span>
  );
}

export function ArchiveStamp({ children, rotate = "-rotate-6" }: { children: ReactNode; rotate?: string }) {
  return (
    <span className={`inline-flex h-[76px] w-[76px] items-center justify-center rounded-full border-[2px] border-[#C94A28]/70 text-center text-[8px] font-black uppercase leading-3 tracking-[0.12em] text-[#C94A28] ${rotate}`}>
      {children}
    </span>
  );
}

export function RuledTitle({ index, label, title, copy }: { index: string; label: string; title: string; copy?: string }) {
  return (
    <div className="grid gap-5 border-b border-[#2C2925]/22 pb-7 md:grid-cols-[110px_1fr]">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#C94A28]">{index}</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-[#2C2925]/45">{label}</p>
      </div>
      <div>
        <h2 className="font-serif text-[38px] leading-[0.95] tracking-[-0.04em] text-[#201D19] sm:text-[54px]">{title}</h2>
        {copy ? <p className="mt-4 max-w-2xl text-[12px] leading-6 text-[#2C2925]/62">{copy}</p> : null}
      </div>
    </div>
  );
}

export function ArchivePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col justify-between bg-[#DDD2C0] p-5 text-[#5D5449]">
      <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]">LUNAR / MEDIA ARCHIVE</div>
      <div>
        <div className="h-px bg-[#8E8070]/50" />
        <p className="mt-3 font-serif text-2xl">{label}</p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C94A28]">Media belum diisi</p>
      </div>
    </div>
  );
}
