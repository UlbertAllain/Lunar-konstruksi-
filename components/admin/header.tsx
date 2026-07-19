"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  MessageSquareQuote,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { logoutAdmin } from "@/lib/firebase/auth";

const mobileMenu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "FAQ", href: "/admin/faqs", icon: CircleHelp },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/admin/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="admin-icon-button lg:hidden"
            aria-label="Buka menu admin"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Operations</p>
            <p className="text-sm font-semibold text-slate-800">Company Profile CMS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="admin-button-secondary hidden sm:inline-flex">
            <ExternalLink size={16} /> Lihat Website
          </Link>
          <button type="button" onClick={handleLogout} className="admin-icon-button" aria-label="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(86vw,320px)] bg-[#12151b] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wide">LUNAR KONSTRUKSI</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">Admin workspace</p>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 space-y-1.5">
              {mobileMenu.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-orange-500 text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon size={18} /> {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
