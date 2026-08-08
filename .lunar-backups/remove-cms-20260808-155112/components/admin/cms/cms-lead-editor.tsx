"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";

import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/features/leads";

import { adminCmsRequest } from "./cms-api";
import { LeadBadge } from "./cms-leads-manager";
import {
  CmsButton,
  CmsCard,
  CmsField,
  CmsNotice,
  CmsPageHeader,
  inputClass,
  textareaClass,
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
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(ms));
}

function whatsappHref(phone: string, name: string, leadId: string) {
  const normalized = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const text = encodeURIComponent(`Halo ${name}, kami dari Lunar Konstruksi menindaklanjuti permintaan proyek dengan referensi ${leadId}.`);
  return normalized ? `https://wa.me/${normalized}?text=${text}` : "#";
}

export function CmsLeadEditor({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadStatus>("new");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminCmsRequest<Lead>(`/api/admin/leads/${leadId}`);
      setLead(data);
      setStatus(data.status);
      setNote(data.adminNote);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Lead gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { void load(); }, [load]);

  const whatsapp = useMemo(() => lead ? whatsappHref(lead.phone, lead.name, lead.id) : "#", [lead]);

  async function save() {
    if (!lead) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await adminCmsRequest<Lead>(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminNote: note }),
      });
      setLead(saved);
      setStatus(saved.status);
      setNote(saved.adminNote);
      setMessage("Lead berhasil diperbarui.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Lead belum dapat diperbarui.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="py-16 text-center text-sm text-zinc-500">Memuat lead...</p>;
  if (!lead) return <CmsNotice tone="danger">{error || "Lead tidak ditemukan."}</CmsNotice>;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/cms/leads" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950"><ArrowLeft className="h-4 w-4" /> Kembali ke Leads</Link>
        <CmsPageHeader
          eyebrow={`Lead · ${lead.id}`}
          title={lead.name}
          description={`${lead.projectType} · ${lead.location}`}
          action={<div className="flex flex-wrap gap-2"><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50">WhatsApp <ExternalLink className="h-4 w-4" /></a><CmsButton onClick={save} loading={saving}><Save className="h-4 w-4" /> Simpan lead</CmsButton></div>}
        />
      </div>

      {error ? <CmsNotice tone="danger">{error}</CmsNotice> : null}
      {message ? <CmsNotice tone="success">{message}</CmsNotice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <CmsCard>
            <p className="font-semibold text-zinc-950">Project brief</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Info label="Phone" value={lead.phone} />
              <Info label="Email" value={lead.email || "-"} />
              <Info label="Project type" value={lead.projectType} />
              <Info label="Location" value={lead.location} />
              <div className="md:col-span-2"><Info label="Message" value={lead.message} multiline /></div>
            </div>
          </CmsCard>

          <CmsCard>
            <p className="font-semibold text-zinc-950">Status history</p>
            <div className="mt-5 space-y-3">
              {[...lead.statusHistory].reverse().map((entry, index) => (
                <div key={`${entry.status}-${entry.atMs}-${index}`} className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 px-4 py-3">
                  <LeadBadge status={entry.status} />
                  <span className="text-xs text-zinc-500">{formatDate(entry.atMs)}</span>
                </div>
              ))}
            </div>
          </CmsCard>
        </div>

        <div className="space-y-6">
          <CmsCard>
            <p className="font-semibold text-zinc-950">Follow-up</p>
            <div className="mt-5 space-y-4">
              <CmsField label="Lead status"><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>{LEAD_STATUSES.map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select></CmsField>
              <CmsField label="Internal note" hint="tidak tampil ke client"><textarea className={`${textareaClass} min-h-44`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Catatan hasil follow-up, kebutuhan client, estimasi next action..." /></CmsField>
            </div>
          </CmsCard>

          <CmsCard>
            <p className="font-semibold text-zinc-950">Lead metadata</p>
            <div className="mt-4 space-y-3 text-sm"><Meta label="Status" value={<LeadBadge status={lead.status} />} /><Meta label="Source" value={lead.source} /><Meta label="Received" value={formatDate(lead.createdAtMs)} /><Meta label="Updated" value={formatDate(lead.updatedAtMs)} /></div>
          </CmsCard>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</p><p className={`mt-2 text-sm text-zinc-800 ${multiline ? "whitespace-pre-wrap leading-7" : ""}`}>{value}</p></div>;
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-3 last:border-0 last:pb-0"><span className="text-zinc-500">{label}</span><span className="text-right text-zinc-800">{value}</span></div>;
}
