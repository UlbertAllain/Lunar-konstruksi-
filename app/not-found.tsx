import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-slate-950">
      <SiteHeader />
      <section className="site-container flex min-h-[68vh] items-center py-20">
        <div className="max-w-3xl">
          <span className="site-kicker text-orange-600">404 / Area belum tersedia</span>
          <Construction className="mt-8 h-16 w-16 text-orange-500" strokeWidth={1.5} />
          <h1 className="mt-8 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Halaman ini belum dibangun.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            Alamat yang Anda buka tidak ditemukan atau sudah dipindahkan. Kembali ke halaman utama untuk melihat layanan dan portfolio Lunar Konstruksi.
          </p>
          <Link href="/" className="mt-9 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 hover:text-slate-950">
            <ArrowLeft size={17} /> Kembali ke beranda
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
