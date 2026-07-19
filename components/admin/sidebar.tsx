"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  HardHat,
  HelpCircle,
  Home,
  MessageSquareQuote,
  Users,
  Wrench,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "FAQ", href: "/admin/faqs", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/5 bg-[#12151b] p-5 text-white lg:block">
      <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-2xl p-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-slate-950"><HardHat size={23} /></span>
        <span>
          <span className="block text-sm font-semibold tracking-wide">LUNAR KONSTRUKSI</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.24em] text-slate-500">Admin workspace</span>
        </span>
      </Link>

      <div className="my-7 h-px bg-white/5" />
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">Navigation</p>
      <nav className="space-y-1.5">
        {menu.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-orange-500 text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={18} />
              <span>{item.name}</span>
              {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-950" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
        <p className="text-xs font-semibold text-slate-300">Storage workflow</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">Semua media CMS diunggah langsung ke Cloudinary melalui endpoint terlindungi.</p>
      </div>
    </aside>
  );
}
