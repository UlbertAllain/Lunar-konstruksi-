"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";

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
      className={`relative inline-flex min-h-14 items-center px-3 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
        active ? "text-[#F26722]" : "text-zinc-700 hover:text-[#F26722]"
      }`}
    >
      {item.label}
      {active ? <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#F26722]" /> : null}
    </Link>
  );
}

export function PublicHeader({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const navItems = useMemo(
    () => navigation.header.filter((item) => item.isVisible).sort((a, b) => a.order - b.order),
    [navigation.header],
  );
  const whatsapp = settings.contact.whatsapp.replace(/[^\d]/g, "");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(15,23,42,.08)]">
      <div className="hidden border-b border-black/6 bg-[#F7F7F5] lg:block">
        <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-end gap-7 px-8 text-[11px] text-zinc-500">
          {settings.contact.email ? (
            <a href={`mailto:${settings.contact.email}`} className="inline-flex items-center gap-2 hover:text-[#F26722]">
              <Mail className="h-3.5 w-3.5" /> {settings.contact.email}
            </a>
          ) : null}
          {settings.contact.phone ? (
            <a href={`tel:${settings.contact.phone}`} className="inline-flex items-center gap-2 hover:text-[#F26722]">
              <Phone className="h-3.5 w-3.5" /> {settings.contact.phone}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings.identity.logoUrl ? (
            <img src={settings.identity.logoUrl} alt={brand} className="h-11 w-auto max-w-[180px] object-contain" />
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center border-2 border-[#F26722] bg-white text-sm font-black tracking-[0.08em] text-[#222]">
                {initials(brand)}
              </span>
              <span className="leading-tight">
                <strong className="block text-[15px] font-black uppercase tracking-[0.05em] text-[#202020]">{brand}</strong>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Construction · Interior</span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-stretch lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return <HeaderLink key={item.id} item={item} active={active} />;
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noreferrer" : undefined}
            className="inline-flex h-11 items-center bg-[#F26722] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#D95113]"
          >
            Get a quotation
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center border border-black/10 text-zinc-900 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/8 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return <HeaderLink key={item.id} item={item} active={active} onClick={() => setOpen(false)} />;
            })}
          </nav>
          <Link
            href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noreferrer" : undefined}
            className="mt-3 flex h-12 items-center justify-center bg-[#F26722] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Get a quotation
          </Link>
        </div>
      ) : null}
    </header>
  );
}

export default PublicHeader;
