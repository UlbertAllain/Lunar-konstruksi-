"use client";

import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";

export function FormHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="admin-panel">
      <span className="admin-eyebrow">{eyebrow}</span>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function FormActions({
  cancelHref,
  saving,
  label = "Simpan Data",
}: {
  cancelHref: string;
  saving: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/5 backdrop-blur">
      <Link href={cancelHref} className="admin-button-secondary">Batal</Link>
      <button type="submit" disabled={saving} className="admin-button-primary">
        {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
        {saving ? "Menyimpan..." : label}
      </button>
    </div>
  );
}

export function BooleanField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-orange-600"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </label>
  );
}

export function LoadingForm() {
  return <div className="admin-panel min-h-64 animate-pulse bg-slate-100" />;
}
