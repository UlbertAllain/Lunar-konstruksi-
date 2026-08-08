"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import type { NavigationSettings } from "@/modules/public-site";
import type { SiteSettings } from "@/modules/public-site";

import { initials } from "./public-helpers";

export function PublicHeader({ navigation, settings }: { navigation: NavigationSettings; settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = useMemo(() => navigation.header.filter((item) => item.isVisible).sort((a, b) => a.order - b.order), [navigation.header]);
  const brand = settings.identity.companyName || settings.identity.siteName || "Lunar Konstruksi";
  const phone = settings.contact.phone || settings.contact.whatsapp || "";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.05)]">
      <div className="border-b border-black/6">
        <div className="mx-auto flex h-8 max-w-[1180px] items-center justify-end gap-5 px-5 text-[9px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-7 lg:px-8">
          {settings.contact.email ? <span>{settings.contact.email}</span> : null}
          {settings.contact.city ? <span>{settings.contact.city}</span> : null}
        </div>
      </div>
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {settings.identity.logoUrl ? (
            <img src={settings.identity.logoUrl} alt={brand} className="h-10 w-auto object-contain" />
          ) : (
            <span className="grid h-10 w-10 place-items-center border-2 border-[#F26422] text-[11px] font-black text-[#29292B]">{initials(brand)}</span>
          )}
          <div className="hidden sm:block">
            <p className="text-[14px] font-black leading-none tracking-[-0.025em] text-[#29292B]">{brand}</p>
            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.18em] text-zinc-400">Construction · Interior · Renovation</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.id} href={item.href || "#"} className={`px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${active ? "text-[#F26422]" : "text-[#29292B] hover:text-[#F26422]"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link href="/contact" className="inline-flex h-11 items-center bg-[#F26422] px-5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white hover:bg-[#da551a]">Get in touch</Link>
          {phone ? (
            <div className="flex h-11 items-center gap-3 bg-[#29292B] px-4 text-white">
              <Phone className="h-4 w-4 text-[#FF9A68]" />
              <span className="text-[11px] font-bold">{phone}</span>
            </div>
          ) : null}
        </div>

        <button type="button" className="grid h-10 w-10 place-items-center border border-black/10 text-[#29292B] lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-black/6 bg-white px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-[1180px] flex-col">
            {items.map((item) => (
              <Link key={item.id} href={item.href || "#"} onClick={() => setOpen(false)} className="border-b border-black/6 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#29292B]">{item.label}</Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-4 inline-flex h-11 items-center justify-center bg-[#F26422] px-5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white">Get in touch</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
