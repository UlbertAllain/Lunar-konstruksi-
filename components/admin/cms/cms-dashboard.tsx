"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  FileText,
  MailOpen,
  Menu,
  Settings2,
} from "lucide-react";

import type { CmsPage } from "@/features/pages";
import type { Lead } from "@/features/leads";

import { adminCmsRequest, revalidatePublicSite } from "./cms-api";
import { CmsCard, CmsNotice, CmsPageHeader } from "./cms-ui";

type ModuleDefinition = {
  key: string;
  label: string;
  description: string;
  adminPath: string;
};

export function CmsDashboard() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [modules, setModules] = useState<ModuleDefinition[]>([]);
  const [error, setError] = useState("");
  const [cacheMessage, setCacheMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      adminCmsRequest<CmsPage[]>("/api/admin/cms/pages"),
      adminCmsRequest<Lead[]>("/api/admin/leads?limit=200"),
      adminCmsRequest<ModuleDefinition[]>("/api/admin/cms/modules"),
    ])
      .then(([pageData, leadData, moduleData]) => {
        if (!active) return;
        setPages(pageData);
        setLeads(leadData);
        setModules(moduleData);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Dashboard CMS gagal dimuat.");
      });

    return () => {
      active = false;
    };
  }, []);

  const published = useMemo(
    () => pages.filter((page) => page.status === "published").length,
    [pages],
  );
  const newLeads = useMemo(
    () => leads.filter((lead) => lead.status === "new").length,
    [leads],
  );

  const cards = [
    { label: "Pages", value: pages.length, detail: `${published} published`, href: "/admin/cms/pages", icon: FileText },
    { label: "Leads", value: leads.length, detail: `${newLeads} belum ditangani`, href: "/admin/cms/leads", icon: MailOpen },
    { label: "Content modules", value: modules.length, detail: "services, projects, team, dll.", href: "/admin/cms/content", icon: Boxes },
  ];

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title="Content workspace"
        description="Pusat kendali konten Lunar Konstruksi. Atur halaman, navigasi, identitas website, SEO, konten utama, dan inquiry calon klien tanpa menyentuh source code."
        action={
          <button
            type="button"
            onClick={async () => {
              setCacheMessage("");
              try {
                await revalidatePublicSite();
                setCacheMessage("Cache publik direvalidasi.");
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : "Revalidation gagal.");
              }
            }}
            className="inline-flex min-h-10 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Refresh public cache
          </button>
        }
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {cacheMessage ? <CmsNotice tone="success">{cacheMessage}</CmsNotice> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <CmsCard className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700"><Icon className="h-5 w-5" /></span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:text-zinc-950" />
                </div>
                <p className="mt-6 text-sm font-medium text-zinc-500">{card.label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">{card.value}</p>
                <p className="mt-2 text-sm text-zinc-500">{card.detail}</p>
              </CmsCard>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CmsCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-950">Website structure</p>
              <p className="mt-1 text-sm text-zinc-500">Hal yang membentuk tampilan dan identitas website.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <QuickLink href="/admin/cms/pages" icon={FileText} label="Pages & sections" />
            <QuickLink href="/admin/cms/navigation" icon={Menu} label="Navigation" />
            <QuickLink href="/admin/cms/settings" icon={Settings2} label="Site settings & SEO" />
            <QuickLink href="/admin/cms/content" icon={Boxes} label="Content collections" />
          </div>
        </CmsCard>

        <CmsCard>
          <p className="font-semibold text-zinc-950">Content modules</p>
          <p className="mt-1 text-sm text-zinc-500">CRUD existing tetap dipakai, tetapi sekarang terdaftar sebagai bagian resmi dari CMS.</p>
          <div className="mt-5 divide-y divide-black/5 rounded-xl border border-black/10">
            {modules.map((module) => (
              <Link
                key={module.key}
                href={module.adminPath}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{module.label}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{module.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </Link>
            ))}
          </div>
        </CmsCard>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof FileText;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center gap-3 rounded-xl border border-black/10 px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
    >
      <Icon className="h-4 w-4 text-orange-600" />
      {label}
    </Link>
  );
}
