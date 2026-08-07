"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import type { NavigationItem, NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

import { initials } from "./public-helpers";

function HeaderLink({ item, active, onClick }: { item: NavigationItem; active: boolean; onClick?: () => void }) {
  const target = item.openInNewTab || item.target === "external" ? "_blank" : undefined;
  return (
    <Link
      href={item.href || "#"}
      target={target}
      rel={target ? "noreferrer" : undefined}
      onClick={onClick}
      className={`relative px-1 py-2 text-[12px] font-medium uppercase tracking-[0.16em] transition ${
        active ? "text-white" : "text-white/65 hover:text-white"
      }`}
    >
      {item.label}
      <span className={`absolute inset-x-0 -bottom-px h-px origin-left bg-[#c7a36d] transition-transform ${active ? "scale-x-100" : "scale-x-0"}`} />
    </Link>
  );
}

export function PublicHeader({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = useMemo(() => navigation.header.filter((item) => item.isVisible).sort((a, b) => a.order - b.order), [navigation.header]);
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const whatsapp = settings.contact.whatsapp?.replace(/[^\d]/g, "");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#10100f]/88 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-white">
          {settings.identity.logoDarkUrl || settings.identity.logoUrl ? (
            <img src={settings.identity.logoDarkUrl || settings.identity.logoUrl} alt={brand} className="h-9 w-auto object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center border border-[#c7a36d]/50 text-[11px] font-semibold tracking-[0.2em] text-[#e4c89e]">
              {initials(brand)}
            </span>
          )}
          <span className="hidden sm:block">
            <span className="block text-[10px] uppercase tracking-[0.26em] text-[#c7a36d]">Architecture · Build</span>
            <span className="mt-0.5 block text-sm font-semibold tracking-[0.02em]">{brand}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <HeaderLink key={item.id} item={item} active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noreferrer" : undefined}
            className="inline-flex h-10 items-center border border-[#c7a36d]/60 px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ead6b7] transition hover:bg-[#c7a36d] hover:text-[#11110f]"
          >
            Start a project
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center border border-white/15 text-white lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#10100f] px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {items.map((item) => (
              <HeaderLink key={item.id} item={item} active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))} onClick={() => setOpen(false)} />
            ))}
          </nav>
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-6 flex h-11 items-center justify-center border border-[#c7a36d]/60 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ead6b7]">
            Start a project
          </Link>
        </div>
      ) : null}
    </header>
  );
}
