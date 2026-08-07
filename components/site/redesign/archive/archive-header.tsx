import Link from "next/link";

import type { NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

export function ArchiveHeader({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const items = navigation.header.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A251F]/20 bg-[#F4EBDD]/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1360px] grid-cols-[1fr_auto] items-center gap-5 px-4 py-3 sm:px-6 lg:grid-cols-[270px_1fr_190px] lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings.identity.logoUrl ? <img src={settings.identity.logoUrl} alt={brand} className="h-8 w-auto object-contain" /> : null}
          <div>
            <p className="font-serif text-[20px] leading-none tracking-[-0.03em] text-[#1F1B17]">{brand}</p>
            <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.19em] text-[#C94A28]">Field Archive / Design & Build</p>
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex">
          {items.map((item, index) => (
            <Link key={item.id} href={item.href || "#"} className="group relative px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#2B2722]/70 transition hover:text-[#C94A28]">
              <span className="mr-1 text-[7px] text-[#2B2722]/25">{String(index + 1).padStart(2, "0")}</span>{item.label}
              <span className="absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-[#C94A28] transition group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end text-right lg:block">
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#2B2722]/40">Archive status</p>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#2B2722]">Public / Active</p>
        </div>

        <details className="justify-self-end lg:hidden">
          <summary className="cursor-pointer list-none border border-[#2B2722]/25 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em]">Index</summary>
          <div className="absolute left-0 right-0 top-full border-b border-[#2B2722]/20 bg-[#F4EBDD] px-4 py-5 shadow-xl">
            <div className="mx-auto flex max-w-[1360px] flex-col">
              {items.map((item, index) => <Link key={item.id} href={item.href || "#"} className="border-b border-[#2B2722]/12 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"><span className="mr-3 text-[#C94A28]">{String(index + 1).padStart(2,"0")}</span>{item.label}</Link>)}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
