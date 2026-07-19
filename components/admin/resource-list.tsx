"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { adminFetch, type ApiEnvelope } from "@/lib/api";

type BaseItem = {
  id?: string;
  isPublished?: boolean;
  isActive?: boolean;
};

type Column<T> = {
  label: string;
  className?: string;
  render: (item: T) => React.ReactNode;
};

type Props<T extends BaseItem> = {
  title: string;
  description: string;
  endpoint: string;
  createHref: string;
  editHref: (item: T) => string;
  searchText: (item: T) => string;
  columns: Column<T>[];
  statusField?: "isPublished" | "isActive";
  statusLabels?: [string, string];
  emptyLabel: string;
};

export function ResourceList<T extends BaseItem>({
  title,
  description,
  endpoint,
  createHref,
  editHref,
  searchText,
  columns,
  statusField,
  statusLabels = ["Draft", "Published"],
  emptyLabel,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    adminFetch<ApiEnvelope<T[]>>(endpoint)
      .then((result) => {
        if (active) setItems(result.data);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Data gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => searchText(item).toLowerCase().includes(keyword));
  }, [items, query, searchText]);

  async function toggleStatus(item: T) {
    if (!statusField || !item.id) return;
    const nextValue = !Boolean(item[statusField]);

    try {
      setProcessingId(item.id);
      await adminFetch(`${endpoint}/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [statusField]: nextValue }),
      });
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, [statusField]: nextValue } : entry,
        ),
      );
      toast.success("Status berhasil diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Status gagal diperbarui.");
    } finally {
      setProcessingId(null);
    }
  }

  async function removeItem(item: T) {
    if (!item.id || !window.confirm("Hapus data ini secara permanen?")) return;

    try {
      setProcessingId(item.id);
      await adminFetch(`${endpoint}/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast.success("Data berhasil dihapus.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Data gagal dihapus.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="admin-panel flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="admin-eyebrow">Content management</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <Link href={createHref} className="admin-button-primary shrink-0">
          <Plus size={17} /> Tambah Data
        </Link>
      </section>

      <section className="admin-panel p-0">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Cari ${title.toLowerCase()}...`}
              className="admin-input pl-10"
            />
          </div>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
            {filteredItems.length} data
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-500">
            <LoaderCircle size={18} className="animate-spin" /> Memuat data...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="min-h-52 p-8 text-center">
            <p className="font-semibold text-slate-800">{emptyLabel}</p>
            <p className="mt-1 text-sm text-slate-500">Tambahkan data baru atau ubah kata pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  {columns.map((column) => (
                    <th key={column.label} className={`px-5 py-4 font-semibold ${column.className ?? ""}`}>
                      {column.label}
                    </th>
                  ))}
                  {statusField ? <th className="px-5 py-4 font-semibold">Status</th> : null}
                  <th className="px-5 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, index) => {
                  const id = item.id ?? String(index);
                  const active = statusField ? Boolean(item[statusField]) : false;
                  const processing = processingId === item.id;

                  return (
                    <tr key={id} className="transition hover:bg-slate-50/70">
                      {columns.map((column) => (
                        <td key={column.label} className={`px-5 py-4 align-middle ${column.className ?? ""}`}>
                          {column.render(item)}
                        </td>
                      ))}
                      {statusField ? (
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => toggleStatus(item)}
                            disabled={processing}
                            className={active ? "admin-status-active" : "admin-status-inactive"}
                          >
                            {active ? statusLabels[1] : statusLabels[0]}
                          </button>
                        </td>
                      ) : null}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={editHref(item)} className="admin-icon-button" aria-label="Edit">
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            disabled={processing}
                            className="admin-icon-button text-red-600 hover:border-red-200 hover:bg-red-50"
                            aria-label="Hapus"
                          >
                            {processing ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
