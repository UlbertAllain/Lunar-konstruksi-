"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import type { CmsBlock, CmsBlockType } from "@/cms";
import type { CmsPage } from "@/features/pages";

import { adminCmsRequest, revalidatePublicSite } from "./cms-api";
import {
  CmsButton,
  CmsCard,
  CmsEmpty,
  CmsField,
  CmsNotice,
  CmsPageHeader,
  inputClass,
  textareaClass,
} from "./cms-ui";

type BlockDefinition = {
  type: CmsBlockType;
  label: string;
  description: string;
  defaultVariant: string;
  variants: readonly string[];
  source?: string | null;
};

type ContentDraft = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  source: string;
  limit: string;
  featuredOnly: boolean;
};

function valueString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function createId(type: string) {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${type}-${suffix}`;
}

function normalizeOrders(sections: CmsBlock[]) {
  return sections.map((section, index) => ({ ...section, order: index * 10 }));
}

export function CmsPageEditor({ pageId }: { pageId: string }) {
  const router = useRouter();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [definitions, setDefinitions] = useState<BlockDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pageData, blockData] = await Promise.all([
        adminCmsRequest<CmsPage>(`/api/admin/cms/pages/${pageId}`),
        adminCmsRequest<BlockDefinition[]>("/api/admin/cms/blocks"),
      ]);
      setPage(pageData);
      setDefinitions(blockData);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Editor halaman gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    void load();
  }, [load]);

  const definitionMap = useMemo(
    () => new Map(definitions.map((definition) => [definition.type, definition])),
    [definitions],
  );

  function patchPage(patch: Partial<CmsPage>) {
    setPage((current) => (current ? { ...current, ...patch } : current));
  }

  function patchSection(sectionId: string, patch: Partial<CmsBlock>) {
    setPage((current) => {
      if (!current) return current;
      return {
        ...current,
        sections: current.sections.map((section) =>
          section.id === sectionId ? { ...section, ...patch } : section,
        ),
      };
    });
  }

  function removeSection(sectionId: string) {
    setPage((current) => {
      if (!current) return current;
      return {
        ...current,
        sections: normalizeOrders(current.sections.filter((section) => section.id !== sectionId)),
      };
    });
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    setPage((current) => {
      if (!current) return current;
      const sections = [...current.sections].sort((a, b) => a.order - b.order);
      const index = sections.findIndex((section) => section.id === sectionId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= sections.length) return current;
      [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      return { ...current, sections: normalizeOrders(sections) };
    });
  }

  function addSection(type: CmsBlockType) {
    const definition = definitionMap.get(type);
    if (!definition) return;

    setPage((current) => {
      if (!current) return current;
      const content: Record<string, unknown> = {};
      if (definition.source) content.source = definition.source;

      return {
        ...current,
        sections: normalizeOrders([
          ...current.sections,
          {
            id: createId(type),
            type,
            variant: definition.defaultVariant,
            isVisible: true,
            order: current.sections.length * 10,
            content,
          },
        ]),
      };
    });
  }

  async function save(event?: FormEvent) {
    event?.preventDefault();
    if (!page) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const saved = await adminCmsRequest<CmsPage>(`/api/admin/cms/pages/${page.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: page.title,
          ...(page.pageType === "custom" ? { slug: page.slug } : {}),
          status: page.status,
          sections: normalizeOrders(page.sections),
          seo: page.seo,
        }),
      });
      setPage(saved);
      await revalidatePublicSite();
      setMessage("Halaman berhasil disimpan dan cache publik direvalidasi.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Halaman belum dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePage() {
    if (!page || page.pageType === "system") return;
    if (!window.confirm(`Hapus halaman “${page.title}”? Tindakan ini tidak dapat dibatalkan.`)) return;

    setDeleting(true);
    setError("");
    try {
      await adminCmsRequest(`/api/admin/cms/pages/${page.id}`, { method: "DELETE" });
      router.push("/admin/cms/pages");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Halaman belum dapat dihapus.");
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-sm text-zinc-500">Memuat editor...</p>;
  }

  if (!page) {
    return <CmsNotice tone="danger">{error || "Halaman tidak ditemukan."}</CmsNotice>;
  }

  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={save} className="space-y-8">
      <div>
        <Link href="/admin/cms/pages" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Pages
        </Link>
        <CmsPageHeader
          eyebrow={page.pageType === "system" ? `System page · ${page.systemKey}` : "Custom page"}
          title={page.title}
          description="Atur identitas halaman, status publikasi, SEO, urutan section, variant desain, dan data section."
          action={<CmsButton type="submit" loading={saving}><Save className="h-4 w-4" /> Simpan perubahan</CmsButton>}
        />
      </div>

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {message ? <CmsNotice tone="success">{message}</CmsNotice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <CmsCard>
            <div className="grid gap-5 md:grid-cols-2">
              <CmsField label="Judul halaman">
                <input className={inputClass} value={page.title} onChange={(event) => patchPage({ title: event.target.value })} />
              </CmsField>
              <CmsField label="Status publikasi">
                <select className={inputClass} value={page.status} onChange={(event) => patchPage({ status: event.target.value as CmsPage["status"] })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </CmsField>
              <CmsField label="Slug" hint={page.pageType === "system" ? "dikunci oleh sistem" : "tanpa slash di depan"}>
                <input className={inputClass} value={page.slug} disabled={page.pageType === "system"} onChange={(event) => patchPage({ slug: event.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </CmsField>
              <CmsField label="Route publik">
                <input className={`${inputClass} bg-zinc-50`} value={`/${page.slug}`} disabled />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard>
            <div className="mb-5">
              <p className="font-semibold text-zinc-950">Sections</p>
              <p className="mt-1 text-sm text-zinc-500">Urutan di sini menjadi urutan render halaman ketika renderer desain Fase 7 aktif.</p>
            </div>

            {sortedSections.length === 0 ? (
              <CmsEmpty title="Belum ada section" description="Tambahkan section dari panel Add section di sebelah kanan." />
            ) : (
              <div className="space-y-4">
                {sortedSections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    definition={definitionMap.get(section.type)}
                    index={index}
                    total={sortedSections.length}
                    onPatch={(patch) => patchSection(section.id, patch)}
                    onMove={(direction) => moveSection(section.id, direction)}
                    onRemove={() => removeSection(section.id)}
                  />
                ))}
              </div>
            )}
          </CmsCard>
        </div>

        <div className="space-y-6">
          <CmsCard>
            <p className="font-semibold text-zinc-950">Add section</p>
            <p className="mt-1 text-sm text-zinc-500">Hanya block type dan variant yang terdaftar di CMS yang bisa digunakan.</p>
            <div className="mt-4 space-y-2">
              {definitions.map((definition) => (
                <button
                  key={definition.type}
                  type="button"
                  onClick={() => addSection(definition.type)}
                  className="flex w-full items-start gap-3 rounded-xl border border-black/10 p-3 text-left transition hover:border-orange-200 hover:bg-orange-50/50"
                >
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  <span>
                    <span className="block text-sm font-medium text-zinc-900">{definition.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{definition.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </CmsCard>

          <SeoEditor page={page} onChange={(seo) => patchPage({ seo })} />

          {page.pageType === "custom" ? (
            <CmsCard>
              <p className="font-semibold text-zinc-950">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">Custom page dapat dihapus permanen. System page dilindungi di service layer.</p>
              <CmsButton type="button" variant="danger" className="mt-4 w-full" loading={deleting} onClick={deletePage}>
                <Trash2 className="h-4 w-4" /> Hapus halaman
              </CmsButton>
            </CmsCard>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function SeoEditor({ page, onChange }: { page: CmsPage; onChange: (seo: CmsPage["seo"]) => void }) {
  const seo = page.seo;
  return (
    <CmsCard>
      <p className="font-semibold text-zinc-950">SEO</p>
      <p className="mt-1 text-sm text-zinc-500">Kosongkan field teks untuk memakai default SEO dari Site Settings.</p>
      <div className="mt-5 space-y-4">
        <CmsField label="SEO title"><input className={inputClass} value={seo.title ?? ""} onChange={(event) => onChange({ ...seo, title: event.target.value })} /></CmsField>
        <CmsField label="Meta description"><textarea className={textareaClass} value={seo.description ?? ""} onChange={(event) => onChange({ ...seo, description: event.target.value })} /></CmsField>
        <CmsField label="OG image URL"><input className={inputClass} value={seo.ogImageUrl ?? ""} onChange={(event) => onChange({ ...seo, ogImageUrl: event.target.value })} /></CmsField>
        <CmsField label="Canonical URL"><input className={inputClass} value={seo.canonicalUrl ?? ""} onChange={(event) => onChange({ ...seo, canonicalUrl: event.target.value })} /></CmsField>
        <label className="flex items-center gap-3 text-sm text-zinc-700"><input type="checkbox" checked={seo.noIndex} onChange={(event) => onChange({ ...seo, noIndex: event.target.checked })} /> No index</label>
        <label className="flex items-center gap-3 text-sm text-zinc-700"><input type="checkbox" checked={seo.noFollow} onChange={(event) => onChange({ ...seo, noFollow: event.target.checked })} /> No follow</label>
      </div>
    </CmsCard>
  );
}

function SectionEditor({
  section,
  definition,
  index,
  total,
  onPatch,
  onMove,
  onRemove,
}: {
  section: CmsBlock;
  definition?: BlockDefinition;
  index: number;
  total: number;
  onPatch: (patch: Partial<CmsBlock>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(section.content, null, 2));
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    setJsonDraft(JSON.stringify(section.content, null, 2));
  }, [section.content]);

  const draft: ContentDraft = {
    eyebrow: valueString(section.content.eyebrow),
    title: valueString(section.content.title),
    description: valueString(section.content.description),
    buttonLabel: valueString(section.content.buttonLabel),
    buttonHref: valueString(section.content.buttonHref),
    imageUrl: valueString(section.content.imageUrl),
    source: valueString(section.content.source) || definition?.source || "",
    limit: typeof section.content.limit === "number" ? String(section.content.limit) : "",
    featuredOnly: section.content.featuredOnly === true,
  };

  function patchContent(patch: Record<string, unknown>) {
    const next = { ...section.content, ...patch };
    for (const [key, value] of Object.entries(next)) {
      if (value === "" || value === undefined) delete next[key];
    }
    onPatch({ content: next });
  }

  function applyAdvancedJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as unknown;
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("Content harus berupa object JSON.");
      }
      if (definition?.source) {
        (parsed as Record<string, unknown>).source = definition.source;
      }
      setJsonError("");
      onPatch({ content: parsed as Record<string, unknown> });
    } catch (reason) {
      setJsonError(reason instanceof Error ? reason.message : "JSON tidak valid.");
    }
  }

  return (
    <div className={`rounded-2xl border p-4 ${section.isVisible ? "border-black/10 bg-white" : "border-dashed border-black/15 bg-zinc-50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
            <p className="font-semibold text-zinc-950">{definition?.label ?? section.type}</p>
            {!section.isVisible ? <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">hidden</span> : null}
          </div>
          <p className="mt-1 text-xs text-zinc-500">{section.id}</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Naikkan section"><ArrowUp className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Turunkan section"><ArrowDown className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" onClick={() => onPatch({ isVisible: !section.isVisible })} aria-label="Toggle visibility">{section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
          <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={onRemove} aria-label="Hapus section"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <CmsField label="Variant">
          <select className={inputClass} value={section.variant} onChange={(event) => onPatch({ variant: event.target.value })}>
            {(definition?.variants ?? [section.variant]).map((variant) => <option key={variant} value={variant}>{variant}</option>)}
          </select>
        </CmsField>
        {definition?.source ? (
          <CmsField label="Content source"><input className={`${inputClass} bg-zinc-50`} value={definition.source} disabled /></CmsField>
        ) : (
          <CmsField label="Eyebrow"><input className={inputClass} value={draft.eyebrow} onChange={(event) => patchContent({ eyebrow: event.target.value })} placeholder="Optional label" /></CmsField>
        )}
        <CmsField label="Title"><input className={inputClass} value={draft.title} onChange={(event) => patchContent({ title: event.target.value })} placeholder="Optional section title" /></CmsField>
        <CmsField label="Image URL"><input className={inputClass} value={draft.imageUrl} onChange={(event) => patchContent({ imageUrl: event.target.value })} placeholder="https://..." /></CmsField>
        <div className="md:col-span-2"><CmsField label="Description"><textarea className={textareaClass} value={draft.description} onChange={(event) => patchContent({ description: event.target.value })} placeholder="Optional section description" /></CmsField></div>
        <CmsField label="CTA label"><input className={inputClass} value={draft.buttonLabel} onChange={(event) => patchContent({ buttonLabel: event.target.value })} /></CmsField>
        <CmsField label="CTA href"><input className={inputClass} value={draft.buttonHref} onChange={(event) => patchContent({ buttonHref: event.target.value })} /></CmsField>
        {definition?.source ? (
          <>
            <CmsField label="Limit" hint="kosong = semua"><input className={inputClass} inputMode="numeric" value={draft.limit} onChange={(event) => patchContent({ limit: event.target.value ? Math.max(1, Number(event.target.value) || 1) : undefined })} /></CmsField>
            <label className="flex items-end gap-3 pb-3 text-sm text-zinc-700"><input type="checkbox" checked={draft.featuredOnly} onChange={(event) => patchContent({ featuredOnly: event.target.checked })} /> Featured only</label>
          </>
        ) : null}
      </div>

      <div className="mt-4 border-t border-black/5 pt-4">
        <button type="button" onClick={() => setAdvancedOpen((value) => !value)} className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 hover:text-zinc-900">
          {advancedOpen ? "Tutup advanced JSON" : "Advanced JSON"}
        </button>
        {advancedOpen ? (
          <div className="mt-3 space-y-3">
            <textarea className={`${textareaClass} min-h-48 font-mono text-xs`} value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} />
            {jsonError ? <CmsNotice tone="danger">{jsonError}</CmsNotice> : null}
            <CmsButton type="button" variant="secondary" onClick={applyAdvancedJson}>Apply JSON</CmsButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}
