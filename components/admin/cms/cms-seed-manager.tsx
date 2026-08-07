"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, DatabaseZap, ExternalLink, Loader2 } from "lucide-react";

import { adminCmsRequest, revalidatePublicSite } from "./cms-api";
import { CmsButton, CmsCard, CmsNotice, CmsPageHeader } from "./cms-ui";

type SeedResult = {
  seeded: boolean;
  pages: string[];
  navigation: boolean;
  siteSettings: boolean;
  note: string;
};

export function CmsSeedManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState("");

  async function runSeed() {
    if (!window.confirm("Seed akan memperbarui dan mem-publish Home, About, Services, Projects, Contact, Navigation, dan copy dasar Site Settings. Lanjutkan?")) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await adminCmsRequest<SeedResult>("/api/admin/cms/seed", {
        method: "POST",
      });
      await revalidatePublicSite();
      setResult(response);
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Seed CMS gagal dijalankan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <CmsPageHeader
        eyebrow="CMS Setup"
        title="Seed public website"
        description="Isi struktur dan copy dasar untuk semua halaman publik Lunar, lalu publish agar renderer Fase 7 langsung memiliki konten."
        action={
          <CmsButton type="button" onClick={runSeed} loading={loading}>
            <DatabaseZap className="h-4 w-4" />
            Seed semua halaman
          </CmsButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <CmsCard>
          <h2 className="text-lg font-semibold text-zinc-950">Yang akan diisi</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-zinc-600">
            {[
              "Home — hero, intro, stats, services, process, projects, testimonials, CTA",
              "About — hero, company approach, stats, team, process, CTA",
              "Services — hero, services list, process, FAQ, CTA",
              "Projects — hero, intro, projects grid, CTA",
              "Contact — hero, intro, lalu project inquiry dari Leads Flow",
              "Navigation — Home, About, Services, Projects, Contact",
              "Site Settings — identity copy, footer copy, dan default SEO",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-black/8 bg-zinc-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CmsCard>

        <CmsCard>
          <h2 className="text-lg font-semibold text-zinc-950">Data yang tidak ditimpa</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Seed ini tidak membuat atau mengganti koleksi Services, Projects, Team, Testimonials, dan FAQ. Kelima koleksi tersebut tetap dikelola lewat CRUD masing-masing agar data asli dan media Cloudinary tetap aman.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/cms/content" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/10 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50">
              Kelola content
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link href="/" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
              Buka website
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </CmsCard>
      </div>

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {loading ? (
        <CmsNotice>
          <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menulis dan mem-publish seluruh struktur halaman CMS...</span>
        </CmsNotice>
      ) : null}
      {result ? (
        <CmsNotice tone="success">
          Seed selesai. Halaman dipublish: {result.pages.join(", ")}. Public cache juga sudah direvalidate. {result.note}
        </CmsNotice>
      ) : null}
    </div>
  );
}
