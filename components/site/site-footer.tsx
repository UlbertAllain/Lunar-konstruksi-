import Link from "next/link";
import { ArrowUpRight, HardHat } from "lucide-react";

export function SiteFooter() {
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <footer className="bg-[#111318] text-white">
      <div className="site-container border-b border-white/10 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="site-kicker text-orange-400">Start a conversation</span>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Punya ruang, lahan, atau bangunan yang perlu diwujudkan lebih baik?</h2>
          </div>
          <div className="flex flex-col items-start justify-end">
            <p className="max-w-md text-sm leading-7 text-slate-400">Ceritakan konteks, target, lokasi, dan batasannya. Kami akan membantu menyusun langkah awal yang realistis.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">Diskusikan Proyek <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </div>

      <div className="site-container grid gap-10 py-12 md:grid-cols-[1fr_auto_auto]">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-slate-950"><HardHat size={23} /></span>
          <div>
            <p className="text-sm font-bold tracking-[0.09em]">LUNAR KONSTRUKSI</p>
            <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">Perusahaan konstruksi yang mengutamakan kejelasan proses, ketelitian detail, dan kualitas implementasi.</p>
          </div>
        </div>
        <div>
          <p className="site-kicker text-slate-500">Navigation</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <Link href="/services">Layanan</Link><Link href="/projects">Portfolio</Link><Link href="/about">Tentang</Link><Link href="/contact">Kontak</Link>
          </div>
        </div>
        <div>
          <p className="site-kicker text-slate-500">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300"><a href={`mailto:${email}`}>{email}</a><span>{phone}</span><span>Indonesia</span></div>
        </div>
      </div>
      <div className="site-container flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-slate-600 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Lunar Konstruksi.</p>
        <p>Built for clarity, durability, and measurable progress.</p>
      </div>
    </footer>
  );
}
