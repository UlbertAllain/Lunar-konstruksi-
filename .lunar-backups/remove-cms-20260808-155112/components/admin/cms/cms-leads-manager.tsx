"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/features/leads";

import { adminCmsRequest } from "./cms-api";
import {
  CmsButton,
  CmsCard,
  CmsEmpty,
  CmsNotice,
  CmsPageHeader,
  inputClass,
} from "./cms-ui";

const labels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
  spam: "Spam",
};

function formatDate(ms: number) {
  if (!ms) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

export function CmsLeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      setLeads(await adminCmsRequest<Lead[]>(`/api/admin/leads${query}`));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Leads gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = useMemo(() => {
    const counts = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0])) as Record<LeadStatus, number>;
    for (const lead of leads) counts[lead.status] += 1;
    return counts;
  }, [leads]);

  return (
    <div className="space-y-8">
      <CmsPageHeader
        title="Leads inbox"
        description="Semua inquiry dari contact form tercatat sebelum pengguna melanjutkan ke WhatsApp. Gunakan status dan internal note untuk menjaga tindak lanjut tetap jelas."
        action={<CmsButton variant="secondary" onClick={() => void load()} disabled={loading}><RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</CmsButton>}
      />

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {LEAD_STATUSES.map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-2xl border p-4 text-left transition ${filter === status ? "border-zinc-950 bg-zinc-950 text-white" : "border-black/10 bg-white hover:bg-zinc-50"}`}
          >
            <p className={`text-xs font-medium uppercase tracking-[0.12em] ${filter === status ? "text-zinc-300" : "text-zinc-500"}`}>{labels[status]}</p>
            <p className="mt-2 text-2xl font-semibold">{summary[status]}</p>
          </button>
        ))}
      </div>

      <CmsCard>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-950">Inquiry</p>
            <p className="mt-1 text-sm text-zinc-500">Filter server-side berdasarkan status.</p>
          </div>
          <select className={`${inputClass} w-auto min-w-44`} value={filter} onChange={(event) => setFilter(event.target.value as LeadStatus | "all")}>
            <option value="all">Semua status</option>
            {LEAD_STATUSES.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-500">Memuat leads...</p>
        ) : leads.length === 0 ? (
          <CmsEmpty title="Belum ada lead" description="Inquiry dari halaman Contact akan muncul di sini setelah berhasil disimpan oleh Leads API." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead><tr className="border-b border-black/10 text-xs uppercase tracking-[0.12em] text-zinc-500"><th className="px-3 py-3 font-medium">Client</th><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Location</th><th className="px-3 py-3 font-medium">Received</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 text-right font-medium">Action</th></tr></thead>
              <tbody className="divide-y divide-black/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50/70">
                    <td className="px-3 py-4"><p className="font-medium text-zinc-950">{lead.name}</p><p className="mt-1 text-xs text-zinc-500">{lead.phone}</p></td>
                    <td className="px-3 py-4 text-zinc-700">{lead.projectType}</td>
                    <td className="px-3 py-4 text-zinc-600">{lead.location}</td>
                    <td className="px-3 py-4 text-xs text-zinc-500">{formatDate(lead.createdAtMs)}</td>
                    <td className="px-3 py-4"><LeadBadge status={lead.status} /></td>
                    <td className="px-3 py-4 text-right"><Link href={`/admin/cms/leads/${lead.id}`} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-zinc-800 hover:bg-zinc-100">Detail <ArrowUpRight className="h-4 w-4" /></Link></td>
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

export function LeadBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-800",
    qualified: "bg-violet-100 text-violet-700",
    won: "bg-emerald-100 text-emerald-700",
    lost: "bg-zinc-200 text-zinc-700",
    spam: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}
