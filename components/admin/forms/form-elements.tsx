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
      <h1 className="mt-3 text-[clamp(1.9rem,3vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687587]">
        {description}
      </p>
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
      <div className="mb-5 border-b border-[#ded7cb] pb-4">
        <h2 className="font-bold text-[#14243f]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[#737e8c]">
            {description}
          </p>
        ) : null}
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
    <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 border border-[#d8d1c6] bg-[#f5f1e8]/95 p-4 shadow-[0_18px_55px_rgba(20,36,63,0.10)] backdrop-blur">
      <Link href={cancelHref} className="admin-button-secondary">
        Batal
      </Link>

      <button
        type="submit"
        disabled={saving}
        className="admin-button-primary"
      >
        {saving ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
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
    <label className="flex cursor-pointer items-start gap-3 border border-[#d8d1c6] bg-[#faf7f0] p-4 transition hover:border-[#b58c2f] hover:bg-[#f2ead8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[#b58c2f]"
      />

      <span>
        <span className="block text-sm font-semibold text-[#14243f]">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[#737e8c]">
          {description}
        </span>
      </span>
    </label>
  );
}

export function LoadingForm() {
  return (
    <div className="admin-panel min-h-64 animate-pulse !bg-[#eee8df]" />
  );
}
