"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Plus, RefreshCcw, Sparkles } from "lucide-react";

import type { CmsPage } from "@/features/pages";

import { adminCmsRequest } from "./cms-api";
import {
  CmsButton,
  CmsCard,
  CmsEmpty,
  CmsField,
  CmsNotice,
  CmsPageHeader,
  inputClass,
} from "./cms-ui";

export function CmsPagesManager() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPages(await adminCmsRequest<CmsPage[]>("/api/admin/cms/pages"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Halaman gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function bootstrap() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminCmsRequest("/api/admin/cms/bootstrap", { method: "POST" });
      setMessage("Fondasi halaman sistem sudah dipastikan tersedia.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Bootstrap CMS gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title="Pages & sections"
        description="Kelola halaman sistem dan halaman custom. Setiap halaman memiliki status publikasi, SEO, serta daftar section yang terkontrol oleh registry CMS."
        action={
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={bootstrap} loading={busy}>
              <Sparkles className="h-4 w-4" /> Bootstrap system pages
            </CmsButton>
            <CmsButton onClick={() => setShowCreate((value) => !value)}>
              <Plus className="h-4 w-4" /> Custom page
            </CmsButton>
          </div>
        }
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {message ? <CmsNotice tone="success">{message}</CmsNotice> : null}

      {showCreate ? (
        <CreateCustomPage
          onCreated={async () => {
            setShowCreate(false);
            await load();
          }}
        />
      ) : null}

      <CmsCard>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-950">Semua halaman</p>
            <p className="mt-1 text-sm text-zinc-500">System page tidak dapat dihapus dan slug-nya dikunci oleh business rule.</p>
          </div>
          <CmsButton variant="ghost" onClick={() => void load()} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </CmsButton>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-500">Memuat halaman...</p>
        ) : pages.length === 0 ? (
          <CmsEmpty
            title="Belum ada halaman CMS"
            description="Jalankan Bootstrap system pages untuk membuat Home, About, Services, Projects, dan Contact tanpa menimpa halaman yang sudah ada."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  <th className="px-3 py-3 font-medium">Page</th>
                  <th className="px-3 py-3 font-medium">Route</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Sections</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-50/70">
                    <td className="px-3 py-4">
                      <p className="font-medium text-zinc-950">{page.title}</p>
                      {page.systemKey ? <p className="mt-1 text-xs text-zinc-500">system: {page.systemKey}</p> : null}
                    </td>
                    <td className="px-3 py-4 font-mono text-xs text-zinc-600">/{page.slug}</td>
                    <td className="px-3 py-4 capitalize text-zinc-600">{page.pageType}</td>
                    <td className="px-3 py-4 text-zinc-600">{page.sections.length}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${page.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <Link
                        href={`/admin/cms/pages/${page.id}`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-zinc-800 hover:bg-zinc-100"
                      >
                        Edit <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CmsCard>
    </div>
  );
}

function CreateCustomPage({ onCreated }: { onCreated: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await adminCmsRequest("/api/admin/cms/pages", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          pageType: "custom",
          status: "draft",
          sections: [],
          seo: { noIndex: false, noFollow: false },
        }),
      });
      await onCreated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Halaman belum dapat dibuat.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <CmsCard>
      <form onSubmit={submit} className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <CmsField label="Nama halaman">
          <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Karier" required />
        </CmsField>
        <CmsField label="Slug" hint="tanpa slash di depan">
          <input className={inputClass} value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="karier" required />
        </CmsField>
        <CmsButton type="submit" loading={busy}>Buat halaman</CmsButton>
        {error ? <div className="md:col-span-3"><CmsNotice tone="danger">{error}</CmsNotice></div> : null}
      </form>
    </CmsCard>
  );
}
