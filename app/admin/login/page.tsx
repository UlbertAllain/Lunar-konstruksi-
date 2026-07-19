"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, HardHat, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { adminFetch } from "@/lib/api";
import { loginAdmin, logoutAdmin } from "@/lib/firebase/auth";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [loading, router, user]);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await loginAdmin(email.trim(), password);
      await adminFetch("/api/admin/session");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (caughtError) {
      await logoutAdmin().catch(() => undefined);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Email atau password tidak valid.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111318] text-white">
      <div className="absolute inset-0 admin-login-grid opacity-30" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-12 lg:grid-cols-[1.1fr_480px] lg:px-10">
        <section className="hidden lg:block">
          <div className="mb-12 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-slate-950">
              <HardHat size={26} />
            </div>
            <div>
              <p className="font-semibold tracking-wide">LUNAR KONSTRUKSI</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Control room</p>
            </div>
          </div>
          <p className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em]">
            Kelola setiap detail perusahaan dari satu ruang kerja.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {[
              ["01", "Konten"],
              ["02", "Portfolio"],
              ["03", "Publikasi"],
            ].map(([number, label]) => (
              <div key={number} className="bg-slate-950/80 p-5">
                <p className="font-mono text-xs text-orange-400">{number}</p>
                <p className="mt-6 text-sm font-medium text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">Admin access</span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Masuk ke dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Gunakan akun Firebase Authentication yang terdaftar pada koleksi admins.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500" placeholder="admin@lunarkonstruksi.id" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500" placeholder="••••••••" />
              </span>
            </label>

            {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

            <button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:opacity-60">
              {submitting ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              {submitting ? "Memverifikasi..." : "Masuk Dashboard"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
