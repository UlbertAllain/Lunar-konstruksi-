"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

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
    if (!loading && user) {
      router.replace("/admin/dashboard");
    }
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
    <main className="relative min-h-screen overflow-hidden bg-[#14243f] text-[#f8f4ec]">
      <div className="absolute inset-0 admin-login-grid opacity-25" />
      <div className="absolute -bottom-36 -right-24 h-[420px] w-[420px] rounded-full border border-[#dcb458]/20" />
      <div className="absolute -bottom-20 -right-6 h-[300px] w-[300px] rounded-full border border-white/10" />

      <div className="relative mx-auto grid min-h-screen max-w-[1320px] items-center gap-14 px-6 py-12 lg:grid-cols-[1.05fr_460px] lg:px-10">
        <section className="hidden lg:block">
          <div className="flex items-center gap-4">
            <Image
              src="/lunar-logo-mark.png"
              alt=""
              width={76}
              height={76}
              priority
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="text-lg font-black uppercase tracking-[0.09em]">
                Lunar
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#dcb458]">
                Konstruksi / Admin
              </p>
            </div>
          </div>

          <h1 className="mt-12 max-w-xl text-[clamp(2.8rem,4.5vw,4.8rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]">
            Kelola website dengan tampilan yang tetap satu identitas.
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
            Gunakan panel ini untuk memperbarui layanan, proyek, testimoni, dan
            pertanyaan umum yang tampil di website.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-px border border-white/12 bg-white/12">
            {[
              ["01", "Layanan"],
              ["02", "Proyek"],
              ["03", "Publikasi"],
            ].map(([number, label]) => (
              <div key={number} className="bg-[#14243f] p-5">
                <p className="font-mono text-[9px] text-[#dcb458]">
                  {number}
                </p>
                <p className="mt-8 text-sm font-medium text-white/65">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/14 bg-[#f5f1e8] p-6 text-[#14243f] shadow-[0_28px_80px_rgba(0,0,0,0.22)] sm:p-9 [clip-path:polygon(0_0,94%_0,100%_7%,100%_100%,6%_100%,0_93%)]">
          <div className="mb-8">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Admin access
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em]">
              Masuk ke panel
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d7888]">
              Masukkan akun admin Lunar Konstruksi untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="admin-label">Email</span>
              <span className="relative block">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b94a0]"
                  size={17}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="admin-input pl-12"
                  placeholder="admin@lunarkonstruksi.id"
                />
              </span>
            </label>

            <label className="block">
              <span className="admin-label">Password</span>
              <span className="relative block">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b94a0]"
                  size={17}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="admin-input pl-12"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </span>
            </label>

            {error ? (
              <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="admin-button-primary !mt-6 !h-12 !w-full"
            >
              {submitting ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
              {submitting ? "Memverifikasi..." : "Masuk dashboard"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
