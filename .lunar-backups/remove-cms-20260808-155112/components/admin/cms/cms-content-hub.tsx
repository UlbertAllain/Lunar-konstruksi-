"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";

import { adminCmsRequest } from "./cms-api";
import { CmsCard, CmsNotice, CmsPageHeader } from "./cms-ui";

type ModuleDefinition = {
  key: string;
  label: string;
  singularLabel: string;
  description: string;
  adminPath: string;
  publicPath: string | null;
  lifecycle: string;
  blockTypes: string[];
  capabilities: {
    slug: boolean;
    detailPage: boolean;
    ordering: boolean;
    media: boolean;
    featured: boolean;
  };
};

export function CmsContentHub({ mediaOnly = false }: { mediaOnly?: boolean }) {
  const [modules, setModules] = useState<ModuleDefinition[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    adminCmsRequest<ModuleDefinition[]>("/api/admin/cms/modules")
      .then((data) => {
        if (active) setModules(data);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Module CMS gagal dimuat.");
      });
    return () => { active = false; };
  }, []);

  const visibleModules = mediaOnly ? modules.filter((module) => module.capabilities.media) : modules;

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title={mediaOnly ? "Media management" : "Content collections"}
        description={mediaOnly
          ? "Media Lunar tetap mengikuti lifecycle record-nya. Kelola cover, gallery, foto tim, dan testimonial dari modul pemilik media agar cleanup Cloudinary tetap konsisten."
          : "Services, Projects, Team, Testimonials, dan FAQ tetap memakai CRUD existing, tetapi sekarang semuanya terhubung ke registry CMS sebagai source section resmi."}
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleModules.map((module) => (
          <Link key={module.key} href={module.adminPath} className="group">
            <CmsCard className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-950">{module.label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{module.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-950" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {module.capabilities.media ? <Badge><ImageIcon className="h-3 w-3" /> Media</Badge> : null}
                {module.capabilities.detailPage ? <Badge>Detail page</Badge> : null}
                {module.capabilities.featured ? <Badge>Featured</Badge> : null}
                {module.capabilities.ordering ? <Badge>Ordering</Badge> : null}
                <Badge>{module.lifecycle}</Badge>
              </div>
              <p className="mt-5 text-xs text-zinc-400">Section source: {module.blockTypes.join(", ")}</p>
            </CmsCard>
          </Link>
        ))}
      </div>

      {mediaOnly ? (
        <CmsNotice>
          Media library global sengaja tidak dibuat di fase ini. Media existing memiliki cleanup lifecycle saat record diperbarui/dihapus; memisahkan upload menjadi library bebas tanpa reference tracking justru berisiko meninggalkan orphan asset di Cloudinary.
        </CmsNotice>
      ) : null}
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">{children}</span>;
}
