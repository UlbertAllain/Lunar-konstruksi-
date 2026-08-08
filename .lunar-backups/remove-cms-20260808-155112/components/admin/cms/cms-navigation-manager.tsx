"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";

import type {
  NavigationChildItem,
  NavigationItem,
  NavigationSettings,
} from "@/features/navigation";

import { adminCmsRequest, revalidatePublicSite } from "./cms-api";
import {
  CmsButton,
  CmsCard,
  CmsEmpty,
  CmsField,
  CmsNotice,
  CmsPageHeader,
  inputClass,
} from "./cms-ui";

type GroupKey = "header" | "footerPrimary" | "footerSecondary";

const groups: Array<{ key: GroupKey; label: string; description: string }> = [
  { key: "header", label: "Header", description: "Navigasi utama yang tampil di bagian atas website." },
  { key: "footerPrimary", label: "Footer primary", description: "Link utama pada footer." },
  { key: "footerSecondary", label: "Footer secondary", description: "Link pendukung seperti kebijakan atau halaman tambahan." },
];

function createId(prefix: string) {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${suffix}`;
}

function normalizeItems(items: NavigationItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index * 10,
    children: item.children.map((child, childIndex) => ({ ...child, order: childIndex * 10 })),
  }));
}

export function CmsNavigationManager() {
  const [settings, setSettings] = useState<NavigationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSettings(await adminCmsRequest<NavigationSettings>("/api/admin/cms/navigation"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Navigation gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function setGroup(key: GroupKey, items: NavigationItem[]) {
    setSettings((current) => (current ? { ...current, [key]: normalizeItems(items) } : current));
  }

  function addItem(key: GroupKey) {
    if (!settings) return;
    setGroup(key, [
      ...settings[key],
      {
        id: createId("nav"),
        label: "Menu baru",
        href: "/",
        target: "internal",
        openInNewTab: false,
        isVisible: true,
        order: settings[key].length * 10,
        children: [],
      },
    ]);
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await adminCmsRequest<NavigationSettings>("/api/admin/cms/navigation", {
        method: "PUT",
        body: JSON.stringify({
          header: normalizeItems(settings.header),
          footerPrimary: normalizeItems(settings.footerPrimary),
          footerSecondary: normalizeItems(settings.footerSecondary),
        }),
      });
      setSettings(saved);
      await revalidatePublicSite();
      setMessage("Navigasi berhasil disimpan dan cache publik direvalidasi.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Navigation belum dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title="Navigation"
        description="Atur menu header dan footer. Link divalidasi oleh server agar javascript/data URL tidak dapat disisipkan ke CMS."
        action={<CmsButton onClick={save} loading={saving}><Save className="h-4 w-4" /> Simpan navigation</CmsButton>}
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {message ? <CmsNotice tone="success">{message}</CmsNotice> : null}

      {loading || !settings ? (
        <p className="py-12 text-center text-sm text-zinc-500">Memuat navigation...</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <CmsCard key={group.key}>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-950">{group.label}</p>
                  <p className="mt-1 text-sm text-zinc-500">{group.description}</p>
                </div>
                <CmsButton variant="secondary" onClick={() => addItem(group.key)}><Plus className="h-4 w-4" /> Tambah menu</CmsButton>
              </div>

              {settings[group.key].length === 0 ? (
                <CmsEmpty title="Belum ada menu" description="Tambahkan item baru lalu simpan navigation." />
              ) : (
                <div className="space-y-4">
                  {settings[group.key].map((item, index) => (
                    <NavigationItemEditor
                      key={item.id}
                      item={item}
                      index={index}
                      total={settings[group.key].length}
                      onChange={(next) => {
                        const items = [...settings[group.key]];
                        items[index] = next;
                        setGroup(group.key, items);
                      }}
                      onMove={(direction) => {
                        const items = [...settings[group.key]];
                        const nextIndex = index + direction;
                        if (nextIndex < 0 || nextIndex >= items.length) return;
                        [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
                        setGroup(group.key, items);
                      }}
                      onRemove={() => setGroup(group.key, settings[group.key].filter((current) => current.id !== item.id))}
                    />
                  ))}
                </div>
              )}
            </CmsCard>
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationItemEditor({
  item,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  item: NavigationItem;
  index: number;
  total: number;
  onChange: (item: NavigationItem) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  function addChild() {
    onChange({
      ...item,
      children: [
        ...item.children,
        {
          id: createId("nav-child"),
          label: "Submenu baru",
          href: "/",
          target: "internal",
          openInNewTab: false,
          isVisible: true,
          order: item.children.length * 10,
        },
      ],
    });
  }

  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Item {index + 1}</p>
        <div className="flex items-center gap-1">
          <button type="button" disabled={index === 0} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30" onClick={() => onMove(-1)}><ArrowUp className="h-4 w-4" /></button>
          <button type="button" disabled={index === total - 1} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30" onClick={() => onMove(1)}><ArrowDown className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={onRemove}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CmsField label="Label"><input className={inputClass} value={item.label} onChange={(event) => onChange({ ...item, label: event.target.value })} /></CmsField>
        <CmsField label="Href"><input className={inputClass} value={item.href} onChange={(event) => onChange({ ...item, href: event.target.value })} /></CmsField>
        <CmsField label="Target">
          <select className={inputClass} value={item.target} onChange={(event) => onChange({ ...item, target: event.target.value as NavigationItem["target"] })}>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </CmsField>
        <div className="flex flex-col justify-end gap-2 pb-2 text-sm text-zinc-700">
          <label className="flex items-center gap-2"><input type="checkbox" checked={item.isVisible} onChange={(event) => onChange({ ...item, isVisible: event.target.checked })} /> Visible</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={item.openInNewTab} onChange={(event) => onChange({ ...item, openInNewTab: event.target.checked })} /> New tab</label>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-zinc-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-zinc-900">Submenu</p>
          <button type="button" onClick={addChild} className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700"><Plus className="h-3.5 w-3.5" /> Tambah submenu</button>
        </div>
        {item.children.length === 0 ? (
          <p className="mt-3 text-xs text-zinc-500">Tidak ada submenu.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {item.children.map((child, childIndex) => (
              <ChildEditor
                key={child.id}
                child={child}
                onChange={(next) => onChange({ ...item, children: item.children.map((current, currentIndex) => currentIndex === childIndex ? next : current) })}
                onRemove={() => onChange({ ...item, children: item.children.filter((current) => current.id !== child.id) })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChildEditor({ child, onChange, onRemove }: { child: NavigationChildItem; onChange: (item: NavigationChildItem) => void; onRemove: () => void }) {
  return (
    <div className="grid gap-3 rounded-xl border border-black/10 bg-white p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <CmsField label="Label"><input className={inputClass} value={child.label} onChange={(event) => onChange({ ...child, label: event.target.value })} /></CmsField>
      <CmsField label="Href"><input className={inputClass} value={child.href} onChange={(event) => onChange({ ...child, href: event.target.value })} /></CmsField>
      <button type="button" className="mb-1 rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={onRemove}><Trash2 className="h-4 w-4" /></button>
      <div className="flex gap-4 text-xs text-zinc-600 md:col-span-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={child.isVisible} onChange={(event) => onChange({ ...child, isVisible: event.target.checked })} /> Visible</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={child.openInNewTab} onChange={(event) => onChange({ ...child, openInNewTab: event.target.checked })} /> New tab</label>
        <select className="rounded-lg border border-black/10 bg-white px-2 py-1" value={child.target} onChange={(event) => onChange({ ...child, target: event.target.value as NavigationChildItem["target"] })}>
          <option value="internal">Internal</option><option value="external">External</option>
        </select>
      </div>
    </div>
  );
}
