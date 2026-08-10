"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  FolderKanban,
  Home,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Layanan", href: "/admin/services", icon: Wrench },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban },
  {
    name: "Testimoni",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { name: "FAQ", href: "/admin/faqs", icon: CircleHelp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 border-r border-white/10 bg-[#14243f] px-5 py-6 text-[#f8f4ec] lg:block">
      <Link href="/admin/dashboard" className="flex items-center gap-3 px-1">
        <Image
          src="/lunar-logo-mark.png"
          alt=""
          width={64}
          height={64}
          priority
          className="h-11 w-11 object-contain"
        />

        <span>
          <span className="block text-sm font-black uppercase tracking-[0.08em]">
            Lunar
          </span>
          <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#dcb458]">
            Content workspace
          </span>
        </span>
      </Link>

      <div className="my-7 h-px bg-white/10" />

      <p className="mb-3 px-3 font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-white/35">
        Kelola konten
      </p>

      <nav className="space-y-1">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "border-[#dcb458] bg-white/[0.065] text-white"
                  : "border-transparent text-white/52 hover:bg-white/[0.035] hover:text-white"
              }`}
            >
              <Icon size={17} />
              <span>{item.name}</span>

              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#dcb458]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-5">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#dcb458]">
          Public website
        </p>
        <p className="mt-2 text-[11px] leading-5 text-white/42">
          Perubahan yang dipublikasikan akan tampil pada website Lunar
          Konstruksi.
        </p>
      </div>
    </aside>
  );
}
