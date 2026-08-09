"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "WORK" },
  { href: "/services", label: "CAPABILITIES" },
  { href: "/contact", label: "CONTACT" },
];

export function FormworkHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[#d9d4ca] bg-[#f5f1e8] text-[#182d4d]">
      <div className="mx-auto flex h-[78px] w-full max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-[0.08em]">
          <span>LUNAR</span><span className="text-[#dcb458]">/</span><span>KONSTRUKSI</span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[#354963] transition hover:text-[#dcb458]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="hidden border-b border-[#dcb458] pb-1 font-mono text-[10px] font-semibold tracking-[0.08em] lg:block">
          START A PROJECT →
        </Link>

        <button type="button" onClick={() => setOpen((value) => !value)} className="p-2 lg:hidden" aria-label="Buka navigasi">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#d9d4ca] bg-[#f5f1e8] px-5 py-5 lg:hidden">
          <nav className="flex flex-col">
            {links.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-[#d9d4ca] py-4 font-mono text-xs font-semibold tracking-[0.08em]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
