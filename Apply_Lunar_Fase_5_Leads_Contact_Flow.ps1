Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Phase([string]$Message) {
    Write-Host "[FASE 5] $Message" -ForegroundColor Cyan
}

function Fail-Phase([string]$Message) {
    Write-Host ""
    Write-Host "[FASE 5] GAGAL: $Message" -ForegroundColor Red
    exit 1
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path $parent)) {
        New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }

    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

if (-not (Test-Path ".git")) {
    Fail-Phase "Jalankan script ini dari root repository Lunar Konstruksi."
}

$repo = (Get-Location).Path
$branch = (git branch --show-current).Trim()
$head = (git rev-parse --short HEAD).Trim()

Write-Phase "Repo   : $repo"
Write-Phase "Branch : $branch"
Write-Phase "HEAD   : $head"

# Abaikan file untracked seperti installer ini, tetapi jangan menimpa perubahan source tracked.
git diff --quiet
if ($LASTEXITCODE -ne 0) {
    Fail-Phase "Working tree tracked belum bersih. Commit/stash perubahan source sebelum menjalankan Fase 5."
}

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    Fail-Phase "Masih ada perubahan staged. Commit/stash dulu sebelum menjalankan Fase 5."
}

$required = @(
    "package.json",
    "components/site/contact-page.tsx",
    "lib/route.ts",
    "lib/firebase/admin.ts",
    "features/public-site/server.ts",
    "features/pages/server.ts",
    "features/content/content.registry.ts"
)

foreach ($path in $required) {
    if (-not (Test-Path $path)) {
        Fail-Phase "Prasyarat tidak ditemukan: $path. Pastikan Fase 1-4 sudah terpasang."
    }
}

$package = Get-Content "package.json" -Raw
if ($package -notmatch '"zod"') {
    Fail-Phase "Dependency zod tidak ditemukan di package.json. Fase 5 tidak akan mengubah dependency."
}

if (Test-Path "features/leads/lead.types.ts") {
    Fail-Phase "features/leads sudah ada. Fase 5 tampaknya sudah pernah diterapkan."
}

$contactCurrent = Get-Content "components/site/contact-page.tsx" -Raw
if ($contactCurrent -notmatch 'export default function ContactPage') {
    Fail-Phase "ContactPage tidak dikenali. Tidak ada file yang diubah."
}

if ($contactCurrent -match '/api/public/leads') {
    Fail-Phase "ContactPage sudah menggunakan Leads API. Fase 5 tampaknya sudah diterapkan."
}

Write-Phase "Prasyarat aman. Menyiapkan Leads & Contact Business Flow..."

$files = @{}

$files["features/leads/lead.types.ts"] = @'
export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadSource = "contact-form";

export interface LeadStatusHistoryEntry {
  status: LeadStatus;
  atMs: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  location: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  adminNote: string;
  createdAtMs: number;
  updatedAtMs: number;
  statusHistory: LeadStatusHistoryEntry[];
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  location: string;
  message: string;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  adminNote?: string;
}

export interface PublicLeadPayload extends CreateLeadInput {
  website?: string;
  startedAt?: number;
}

export interface LeadListOptions {
  status?: LeadStatus;
  limit?: number;
}
'@

$files["features/leads/lead.validator.ts"] = @'
import { z } from "zod";

import { LEAD_STATUSES } from "./lead.types";

const phonePattern = /^[0-9+().\-\s]+$/;

export const publicLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30).regex(phonePattern),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional(),
  projectType: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(2500),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().positive().optional(),
});

export const adminLeadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    adminNote: z.string().trim().max(2500).optional(),
  })
  .refine(
    (value) => value.status !== undefined || value.adminNote !== undefined,
    "Tidak ada perubahan lead yang dikirim.",
  );
'@

$files["features/leads/lead.repository.ts"] = @'
import {
  FieldValue,
  type DocumentData,
  type UpdateData,
} from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";

import type {
  CreateLeadInput,
  Lead,
  LeadListOptions,
  LeadStatus,
  LeadStatusHistoryEntry,
  UpdateLeadInput,
} from "./lead.types";

const COLLECTION = "leads";

type StoredLead = Omit<Lead, "id"> & {
  createdAt?: unknown;
  updatedAt?: unknown;
};

function mapLead(id: string, data: DocumentData): Lead {
  return {
    id,
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: data.email ? String(data.email) : undefined,
    projectType: String(data.projectType ?? ""),
    location: String(data.location ?? ""),
    message: String(data.message ?? ""),
    source: "contact-form",
    status: (data.status ?? "new") as LeadStatus,
    adminNote: String(data.adminNote ?? ""),
    createdAtMs: Number(data.createdAtMs ?? 0),
    updatedAtMs: Number(data.updatedAtMs ?? 0),
    statusHistory: Array.isArray(data.statusHistory)
      ? (data.statusHistory as LeadStatusHistoryEntry[])
      : [],
  };
}

export async function createLeadRecord(input: CreateLeadInput) {
  const ref = getAdminDb().collection(COLLECTION).doc();
  const now = Date.now();

  const record: StoredLead = {
    ...input,
    source: "contact-form",
    status: "new",
    adminNote: "",
    createdAtMs: now,
    updatedAtMs: now,
    statusHistory: [{ status: "new", atMs: now }],
  };

  await ref.set({
    ...record,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    id: ref.id,
    ...record,
  } satisfies Lead;
}

export async function getLeadRecord(id: string) {
  const snapshot = await getAdminDb().collection(COLLECTION).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return mapLead(snapshot.id, snapshot.data() ?? {});
}

export async function listLeadRecords(options: LeadListOptions = {}) {
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200);
  const collection = getAdminDb().collection(COLLECTION);

  const snapshot = options.status
    ? await collection.where("status", "==", options.status).get()
    : await collection.orderBy("createdAtMs", "desc").limit(limit).get();

  return snapshot.docs
    .map((document) => mapLead(document.id, document.data()))
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, limit);
}

export async function updateLeadRecord(id: string, input: UpdateLeadInput) {
  const ref = getAdminDb().collection(COLLECTION).doc(id);

  return getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists) {
      return null;
    }

    const current = mapLead(snapshot.id, snapshot.data() ?? {});
    const now = Date.now();

    const update: UpdateData<DocumentData> = {
      updatedAtMs: now,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.adminNote !== undefined) {
      update.adminNote = input.adminNote;
    }

    if (input.status !== undefined && input.status !== current.status) {
      update.status = input.status;
      update.statusHistory = FieldValue.arrayUnion({
        status: input.status,
        atMs: now,
      });
    }

    transaction.update(ref, update);

    return {
      ...current,
      ...(input.adminNote !== undefined ? { adminNote: input.adminNote } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAtMs: now,
      statusHistory:
        input.status !== undefined && input.status !== current.status
          ? [
              ...current.statusHistory,
              { status: input.status, atMs: now },
            ]
          : current.statusHistory,
    } satisfies Lead;
  });
}
'@

$files["features/leads/lead-rate-limit.ts"] = @'
import { createHash } from "node:crypto";

import type { NextRequest } from "next/server";

import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION = "leadRateLimits";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export class LeadRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Terlalu banyak permintaan. Silakan coba lagi beberapa saat.");
    this.name = "LeadRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function requestFingerprint(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";

  return createHash("sha256")
    .update(`${ip}|${userAgent.slice(0, 180)}`)
    .digest("hex");
}

export async function consumeLeadRateLimit(request: NextRequest) {
  const key = requestFingerprint(request);
  const ref = getAdminDb().collection(COLLECTION).doc(key);
  const now = Date.now();

  await getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();

    const windowStartedAt = Number(data?.windowStartedAt ?? 0);
    const count = Number(data?.count ?? 0);
    const expired = !windowStartedAt || now - windowStartedAt >= WINDOW_MS;

    if (expired) {
      transaction.set(
        ref,
        {
          windowStartedAt: now,
          count: 1,
          updatedAtMs: now,
        },
        { merge: true },
      );
      return;
    }

    if (count >= MAX_ATTEMPTS) {
      const retryAfterMs = WINDOW_MS - (now - windowStartedAt);
      throw new LeadRateLimitError(
        Math.max(1, Math.ceil(retryAfterMs / 1000)),
      );
    }

    transaction.set(
      ref,
      {
        count: count + 1,
        updatedAtMs: now,
      },
      { merge: true },
    );
  });
}
'@

$files["features/leads/lead.service.ts"] = @'
import type {
  CreateLeadInput,
  LeadListOptions,
  UpdateLeadInput,
} from "./lead.types";
import {
  createLeadRecord,
  getLeadRecord,
  listLeadRecords,
  updateLeadRecord,
} from "./lead.repository";

function normalizePhone(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeOptional(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function createLead(input: CreateLeadInput) {
  return createLeadRecord({
    name: input.name.trim(),
    phone: normalizePhone(input.phone),
    email: normalizeOptional(input.email),
    projectType: input.projectType.trim(),
    location: input.location.trim(),
    message: input.message.trim(),
  });
}

export function getLead(id: string) {
  return getLeadRecord(id);
}

export function listLeads(options?: LeadListOptions) {
  return listLeadRecords(options);
}

export function updateLead(id: string, input: UpdateLeadInput) {
  return updateLeadRecord(id, {
    ...input,
    ...(input.adminNote !== undefined
      ? { adminNote: input.adminNote.trim() }
      : {}),
  });
}
'@

$files["features/leads/client.ts"] = @'
import type { PublicLeadPayload } from "./lead.types";

export async function submitPublicLead(payload: PublicLeadPayload) {
  const response = await fetch("/api/public/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as
    | {
        data?: { leadId?: string | null };
        error?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      result?.error ?? "Permintaan belum dapat dikirim. Silakan coba lagi.",
    );
  }

  return {
    leadId: result?.data?.leadId ?? null,
  };
}

export function buildLeadWhatsAppText(
  payload: Omit<PublicLeadPayload, "website" | "startedAt">,
  leadId?: string | null,
) {
  return [
    "Halo Lunar Konstruksi, saya ingin mendiskusikan proyek.",
    leadId ? `Referensi: ${leadId}` : null,
    `Nama: ${payload.name}`,
    `Nomor: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Jenis proyek: ${payload.projectType}`,
    `Lokasi: ${payload.location}`,
    `Keterangan: ${payload.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}
'@

$files["features/leads/index.ts"] = @'
export {
  LEAD_STATUSES,
  type CreateLeadInput,
  type Lead,
  type LeadListOptions,
  type LeadSource,
  type LeadStatus,
  type LeadStatusHistoryEntry,
  type PublicLeadPayload,
  type UpdateLeadInput,
} from "./lead.types";
'@

$files["features/leads/server.ts"] = @'
export {
  createLead,
  getLead,
  listLeads,
  updateLead,
} from "./lead.service";
export {
  consumeLeadRateLimit,
  LeadRateLimitError,
} from "./lead-rate-limit";
export {
  adminLeadUpdateSchema,
  publicLeadSchema,
} from "./lead.validator";
export {
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from "./lead.types";
'@

$files["app/api/public/leads/route.ts"] = @'
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  consumeLeadRateLimit,
  createLead,
  LeadRateLimitError,
  publicLeadSchema,
} from "@/features/leads/server";

export async function POST(request: NextRequest) {
  try {
    const payload = publicLeadSchema.parse(await request.json());

    // Honeypot: bot mendapat respons sukses palsu agar tidak mencoba variasi payload.
    if (payload.website) {
      return NextResponse.json(
        { data: { leadId: null } },
        { status: 202 },
      );
    }

    await consumeLeadRateLimit(request);

    const lead = await createLead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      projectType: payload.projectType,
      location: payload.location,
      message: payload.message,
    });

    return NextResponse.json(
      {
        data: {
          leadId: lead.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof LeadRateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: {
            "Retry-After": String(error.retryAfterSeconds),
          },
        },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            error.issues[0]?.message ??
            "Data permintaan belum lengkap atau tidak valid.",
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Payload tidak valid." },
        { status: 400 },
      );
    }

    console.error("Failed to create public lead:", error);

    return NextResponse.json(
      { error: "Permintaan belum dapat disimpan. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
'@

$files["app/api/admin/leads/route.ts"] = @'
import { NextRequest, NextResponse } from "next/server";

import {
  LEAD_STATUSES,
  listLeads,
  type LeadStatus,
} from "@/features/leads/server";
import { requireAdmin } from "@/lib/route";

function errorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  return 500;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const statusParam = request.nextUrl.searchParams.get("status");
    const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 100);

    const status =
      statusParam && LEAD_STATUSES.includes(statusParam as LeadStatus)
        ? (statusParam as LeadStatus)
        : undefined;

    const leads = await listLeads({
      status,
      limit: Number.isFinite(limitParam) ? limitParam : 100,
    });

    return NextResponse.json({ data: leads });
  } catch (error) {
    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to list leads:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil leads.",
      },
      { status },
    );
  }
}
'@

$files["app/api/admin/leads/[id]/route.ts"] = @'
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminLeadUpdateSchema,
  getLead,
  updateLead,
} from "@/features/leads/server";
import { requireAdmin } from "@/lib/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  return 500;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const lead = await getLead(id);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to get lead:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil lead.",
      },
      { status },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const payload = adminLeadUpdateSchema.parse(await request.json());

    const lead = await updateLead(id, payload);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            error.issues[0]?.message ??
            "Perubahan lead tidak valid.",
        },
        { status: 400 },
      );
    }

    const status = errorStatus(error);

    if (status >= 500) {
      console.error("Failed to update lead:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal memperbarui lead.",
      },
      { status },
    );
  }
}
'@

$files["components/site/contact-page.tsx"] = @'
"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
} from "lucide-react";

import {
  buildLeadWhatsAppText,
  submitPublicLead,
} from "@/features/leads/client";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  message: string;
  website: string;
};

const EMPTY_FORM: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  location: "",
  message: "",
  website: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] =
    useState<ContactFormState | null>(null);
  const [startedAt] = useState(() => Date.now());

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281200000000";
  const email =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const displayPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const result = await submitPublicLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        projectType: form.projectType,
        location: form.location,
        message: form.message,
        website: form.website,
        startedAt,
      });

      setLeadId(result.leadId);
      setSubmittedForm(form);
      setSubmitState("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Permintaan belum dapat dikirim. Silakan coba lagi.",
      );
      setSubmitState("error");
    }
  }

  function openWhatsApp() {
    if (!submittedForm) {
      return;
    }

    const text = buildLeadWhatsAppText(
      {
        name: submittedForm.name,
        phone: submittedForm.phone,
        email: submittedForm.email || undefined,
        projectType: submittedForm.projectType,
        location: submittedForm.location,
        message: submittedForm.message,
      },
      leadId,
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setLeadId(null);
    setSubmittedForm(null);
    setSubmitState("idle");
    setErrorMessage("");
  }

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader dark />

      <main className="bg-[#12151b] pb-20 text-white sm:pb-28">
        <section className="site-container grid gap-14 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="site-kicker text-orange-400">
              Contact / Start here
            </span>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">
              Mari mulai dari konteks yang jelas.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-400">
              Kirim gambaran awal project. Informasi ini akan tercatat agar tim
              kami dapat memahami kebutuhan sebelum menjadwalkan diskusi lebih
              lanjut.
            </p>

            <div className="mt-12 space-y-5 border-t border-white/10 pt-8">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 text-sm text-slate-300"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <Mail size={18} />
                </span>
                {email}
              </a>

              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <Phone size={18} />
                </span>
                {displayPhone}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                  <MapPin size={18} />
                </span>
                Indonesia
              </div>
            </div>
          </div>

          {submitState === "success" ? (
            <div className="flex min-h-[520px] flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 size={26} />
                </span>

                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em]">
                  Permintaan sudah tercatat.
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-slate-400">
                  Detail project kamu sudah masuk ke sistem Lunar Konstruksi.
                  Tim dapat meninjaunya tanpa bergantung pada riwayat chat
                  WhatsApp.
                </p>

                {leadId ? (
                  <div className="mt-7 rounded-2xl border border-white/10 bg-black/10 px-5 py-4">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Referensi
                    </span>
                    <p className="mt-2 font-mono text-sm text-slate-300">
                      {leadId}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex h-13 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-semibold text-slate-950 transition hover:bg-orange-400"
                >
                  Lanjut via WhatsApp
                  <ArrowUpRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-13 items-center justify-center gap-2 rounded-xl border border-white/10 px-6 font-semibold text-white transition hover:bg-white/10"
                >
                  <RotateCcw size={17} />
                  Kirim lainnya
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="contact-label">Nama</span>
                  <input
                    required
                    autoComplete="name"
                    className="contact-input"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Nomor WhatsApp</span>
                  <input
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    className="contact-input"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="contact-label">Email (opsional)</span>
                  <input
                    type="email"
                    autoComplete="email"
                    className="contact-input"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="nama@email.com"
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Jenis Project</span>
                  <input
                    required
                    className="contact-input"
                    value={form.projectType}
                    onChange={(event) =>
                      setForm({ ...form, projectType: event.target.value })
                    }
                    placeholder="Hunian, renovasi, komersial..."
                  />
                </label>

                <label className="block">
                  <span className="contact-label">Lokasi</span>
                  <input
                    required
                    autoComplete="address-level2"
                    className="contact-input"
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="contact-label">Keterangan Awal</span>
                  <textarea
                    required
                    className="contact-input min-h-40 resize-y py-4"
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    placeholder="Ceritakan kebutuhan, ukuran perkiraan, target waktu, dan kondisi saat ini."
                  />
                </label>

                <label
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
                >
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) =>
                      setForm({ ...form, website: event.target.value })
                    }
                  />
                </label>
              </div>

              {submitState === "error" ? (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200"
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menyimpan permintaan...
                  </>
                ) : (
                  <>
                    Kirim permintaan
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Data ini digunakan untuk menindaklanjuti kebutuhan project dan
                tidak dipublikasikan di website.
              </p>
            </form>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
'@

$files["LEADS_CONTACT_FLOW.md"] = @'
# Leads & Contact Business Flow

Fase 5 mengubah formulir kontak Lunar Konstruksi dari sekadar pembuka WhatsApp
menjadi jalur akuisisi lead yang tercatat di server.

## Public flow

1. Visitor mengisi form `/contact`.
2. Browser mengirim JSON ke `POST /api/public/leads`.
3. Zod memvalidasi payload.
4. Honeypot menahan bot sederhana.
5. Rate limiter Firestore membatasi 3 submit per 10 menit per fingerprint.
6. Firebase Admin SDK menyimpan lead ke collection `leads`.
7. Visitor menerima nomor referensi.
8. WhatsApp tersedia sebagai langkah lanjutan opsional.

Browser tidak menulis Firestore langsung.

## Collections

### `leads/{id}`

Field utama:

- `name`
- `phone`
- `email`
- `projectType`
- `location`
- `message`
- `source`
- `status`
- `adminNote`
- `createdAtMs`
- `updatedAtMs`
- `statusHistory`
- `createdAt`
- `updatedAt`

Status:

- `new`
- `contacted`
- `qualified`
- `won`
- `lost`
- `spam`

### `leadRateLimits/{fingerprint}`

Collection operasional untuk throttling form. Fingerprint dibuat dari SHA-256
IP + user-agent. IP mentah tidak disimpan.

## Admin API

Semua endpoint admin menggunakan `requireAdmin()`.

- `GET /api/admin/leads`
- `GET /api/admin/leads?status=new&limit=100`
- `GET /api/admin/leads/{id}`
- `PATCH /api/admin/leads/{id}`

Contoh PATCH:

```json
{
  "status": "contacted",
  "adminNote": "Sudah dihubungi melalui WhatsApp."
}
```

UI pengelolaan leads dibuat pada Fase 6 bersama Admin Full CMS UI.

## Security notes

- Firestore client rules tetap dapat menolak akses langsung.
- Lead dibuat melalui Firebase Admin SDK pada server.
- Payload divalidasi ulang di server.
- Honeypot tidak disimpan.
- Rate limit berjalan dengan Firestore transaction sehingga lebih aman terhadap
  concurrent request dibanding counter in-memory pada serverless instance.
- Data contact tidak pernah dimasukkan ke public CMS resolver.
'@

# Validasi seluruh payload sebelum melakukan write.
foreach ($entry in $files.GetEnumerator()) {
    if ([string]::IsNullOrWhiteSpace($entry.Value)) {
        Fail-Phase "Konten kosong untuk $($entry.Key). Tidak ada file yang diubah."
    }
}

$mustContain = @{
    "components/site/contact-page.tsx" = @(
        "submitPublicLead",
        "Permintaan sudah tercatat",
        "Lanjut via WhatsApp"
    )
    "app/api/public/leads/route.ts" = @(
        "consumeLeadRateLimit",
        "publicLeadSchema",
        "createLead"
    )
    "features/leads/lead.repository.ts" = @(
        'const COLLECTION = "leads"',
        "statusHistory"
    )
}

foreach ($target in $mustContain.Keys) {
    $content = $files[$target]
    foreach ($marker in $mustContain[$target]) {
        if ($content -notmatch [regex]::Escape($marker)) {
            Fail-Phase "Validasi internal gagal pada $target ($marker). Tidak ada file yang diubah."
        }
    }
}

Write-Phase "Semua transformasi tervalidasi. Menulis perubahan..."

foreach ($entry in $files.GetEnumerator() | Sort-Object Name) {
    Write-Utf8NoBom -Path $entry.Key -Content $entry.Value
    Write-Phase "write  $($entry.Key)"
}

Write-Host ""
Write-Phase "Selesai menerapkan Leads & Contact Business Flow."
Write-Host ""
Write-Host "Jalankan:" -ForegroundColor Yellow
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  git diff --check"
Write-Host "  git status --short"
Write-Host ""
Write-Host "Catatan: tidak perlu npm install. Collection leads dan leadRateLimits akan dibuat otomatis oleh Firestore saat digunakan." -ForegroundColor Green
