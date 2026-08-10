"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Handshake,
  Home,
  Images,
  LogOut,
  Menu,
  MessageSquareQuote,
  Wrench,
  X,
} from "lucide-react";

import { logoutAdmin } from "@/lib/firebase/auth";

const mobileMenu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Konten Website", href: "/admin/site-media", icon: Images },
  { name: "Layanan", href: "/admin/services", icon: Wrench },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban },
  { name: "Partner", href: "/admin/partners", icon: Handshake },
  {
    name: "Testimoni",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
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
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#d8d1c6] bg-[#f5f1e8]/95 px-4 text-[#14243f] backdrop-blur-xl sm:px-5 lg:px-8">
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
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Lunar / Content
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14243f]">
              Panel Pengelolaan Website
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="admin-button-secondary hidden sm:inline-flex"
          >
            <ExternalLink size={15} />
            Lihat website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-icon-button"
            aria-label="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0b1729]/65 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          />

          <aside className="absolute inset-y-0 left-0 w-[min(88vw,330px)] bg-[#14243f] p-5 text-[#f8f4ec] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <Link
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/lunar-logo-mark.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.08em]">
                    Lunar
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#dcb458]">
                    Admin workspace
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/65 transition hover:text-white"
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              {mobileMenu.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 border-l-2 px-3 py-3 text-sm transition ${
                      active
                        ? "border-[#dcb458] bg-white/[0.06] text-white"
                        : "border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
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
