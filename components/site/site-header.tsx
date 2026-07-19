"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, HardHat, Menu, X } from "lucide-react";

const links = [
  { href: "/services", label: "Layanan" },
  { href: "/projects", label: "Portfolio" },
  { href: "/about", label: "Tentang" },
  { href: "/#team", label: "Tim" },
  { href: "/contact", label: "Kontak" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`relative z-50 border-b ${dark ? "border-white/10 bg-[#12151b] text-white" : "border-slate-200 bg-[#f4f1ea] text-slate-950"}`}>
      <div className="site-container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-slate-950"><HardHat size={23} /></span>
          <span>
            <span className="block text-sm font-bold tracking-[0.09em]">LUNAR KONSTRUKSI</span>
            <span className={`mt-0.5 block text-[9px] uppercase tracking-[0.28em] ${dark ? "text-slate-500" : "text-slate-500"}`}>Build with clarity</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className={`text-sm font-medium transition ${dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950"}`}>{link.label}</Link>)}
        </nav>

        <Link href="/contact" className={`hidden items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition sm:inline-flex ${dark ? "bg-white text-slate-950 hover:bg-orange-400" : "bg-slate-950 text-white hover:bg-orange-500 hover:text-slate-950"}`}>
          Mulai Proyek <ArrowUpRight size={16} />
        </Link>

        <button type="button" className="rounded-lg p-2 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Buka navigasi">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className={`absolute inset-x-0 top-20 border-b p-5 shadow-xl lg:hidden ${dark ? "border-white/10 bg-[#12151b]" : "border-slate-200 bg-[#f4f1ea]"}`}>
          <nav className="site-container grid gap-2">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-500 hover:text-slate-950">{link.label}</Link>)}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
