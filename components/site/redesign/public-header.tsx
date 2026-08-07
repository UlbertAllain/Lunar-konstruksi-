"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Menu, X } from "lucide-react";

import type { NavigationItem, NavigationSettings } from "@/features/navigation/navigation.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

import { initials } from "./public-helpers";

function NavLink({ item, active, onClick }: { item: NavigationItem; active: boolean; onClick?: () => void }) {
  const target = item.openInNewTab || item.target === "external" ? "_blank" : undefined;
  const rel = target === "_blank" ? "noreferrer" : undefined;

  return (
    <Link
      href={item.href || "#"}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition ${
        active ? "bg-white/12 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function PublicHeader({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const headerItems = useMemo(() => navigation.header.filter((item) => item.isVisible).sort((a, b) => a.order - b.order), [navigation.header]);
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const shortBrand = initials(brand);
  const whatsapp = settings.contact.whatsapp?.replace(/[^\d]/g, "");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0C0C0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          {settings.identity.logoUrl ? (
            <img src={settings.identity.logoUrl} alt={brand} className="h-10 w-auto object-contain" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B88B5A]/40 bg-[#1A1612] text-sm font-semibold tracking-[0.18em] text-[#E6C699]">
              {shortBrand}
            </span>
          )}
          <span className="hidden flex-col sm:flex">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C7A878]">Architecture & Construction</span>
            <span className="text-base font-semibold tracking-tight text-white">{brand}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {headerItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return <NavLink key={item.id} item={item} active={active} />;
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noreferrer" : undefined}
            className="inline-flex min-h-11 items-center rounded-full border border-[#B88B5A]/45 px-5 text-sm font-medium text-[#F3E6D4] transition hover:bg-[#B88B5A] hover:text-[#16120F]"
          >
            Let&apos;s collaborate
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0C0C0B] px-4 pb-5 pt-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {headerItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return <NavLink key={item.id} item={item} active={active} onClick={() => setOpen(false)} />;
            })}
            <Link
              href={whatsapp ? `https://wa.me/${whatsapp}` : "/contact"}
              target={whatsapp ? "_blank" : undefined}
              rel={whatsapp ? "noreferrer" : undefined}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[#B88B5A] px-5 text-sm font-medium text-[#16120F]"
            >
              Let&apos;s collaborate
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
