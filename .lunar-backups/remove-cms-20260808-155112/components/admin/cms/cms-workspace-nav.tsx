"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  DatabaseZap,
  FileText,
  ImageIcon,
  LayoutDashboard,
  MailOpen,
  Menu,
  Settings2,
} from "lucide-react";

const items = [
  { href: "/admin/cms", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/cms/pages", label: "Pages", icon: FileText },
  { href: "/admin/cms/navigation", label: "Navigation", icon: Menu },
  { href: "/admin/cms/settings", label: "Site Settings", icon: Settings2 },
  { href: "/admin/cms/content", label: "Content", icon: Boxes },
  { href: "/admin/cms/leads", label: "Leads", icon: MailOpen },
  { href: "/admin/cms/media", label: "Media", icon: ImageIcon },
  { href: "/admin/cms/seed", label: "Seed", icon: DatabaseZap },
];

export function CmsWorkspaceNav() {
  const pathname = usePathname();

  return (
    <div className="mb-8 overflow-x-auto rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
      <nav className="flex min-w-max items-center gap-1" aria-label="CMS workspace">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${
                active
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
