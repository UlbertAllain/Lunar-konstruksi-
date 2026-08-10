"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { displayFont } from "./decor";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Proyek" },
  { href: "/services", label: "Layanan" },
  { href: "/contact", label: "Kontak" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FormworkHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d1c6] bg-[#f5f1e8]/95 text-[#182d4d] backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] w-full max-w-[1480px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
          aria-label="Lunar Konstruksi"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center">
            <Image
              src="/lunar-logo-mark.png"
              alt=""
              width={750}
              height={770}
              priority
              className="h-11 w-11 object-contain transition duration-300 group-hover:scale-[1.04]"
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span
              className={`${displayFont} block text-[1.02rem] font-black uppercase leading-none tracking-[0.12em] text-[#14243f]`}
            >
              Lunar
            </span>
            <span className="mt-1 block font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-[#b58c2f]">
              Konstruksi
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#d8d1c6] bg-white/35 p-1 lg:flex">
          {links.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                  active
                    ? "bg-[#14243f] text-[#f8f4ec]"
                    : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="h-px w-8 bg-[#dcb458]" />
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#14243f] transition hover:bg-[#14243f] hover:text-[#f8f4ec]"
          >
            Konsultasikan proyek
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] lg:hidden"
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#d8d1c6] bg-[#f5f1e8] px-5 pb-6 pt-3 sm:px-8 lg:hidden">
          <nav className="mx-auto flex max-w-[1480px] flex-col">
            {links.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-[#ddd5c8] py-4 text-sm font-semibold ${
                    active ? "text-[#b58c2f]" : "text-[#14243f]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[9px] text-[#8b94a0]">
                    {active ? "ACTIVE" : "OPEN"} â†’
                  </span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#f8f4ec]"
            >
              Konsultasikan proyek
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
