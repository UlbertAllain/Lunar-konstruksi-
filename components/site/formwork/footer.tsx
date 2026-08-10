import Link from "next/link";

import { displayFont } from "./decor";

export function FormworkFooter() {
  const email =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <footer className="bg-[#101f37] text-[#f8f4ec]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid gap-9 border-b border-white/15 pb-9 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          <div>
            <p
              className={`${displayFont} text-[clamp(2rem,3.1vw,3.2rem)] font-black uppercase leading-[.92] tracking-[-0.035em]`}
            >
              Lunar <span className="text-[#dcb458]">/</span> Konstruksi
            </p>

            <p className="mt-4 max-w-lg text-[13px] leading-6 text-white/55">
              Perencanaan, koordinasi, dan pekerjaan konstruksi dengan keputusan
              teknis yang jelas dari awal sampai serah terima.
            </p>
          </div>

          <div className="grid gap-7 text-sm sm:grid-cols-2">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#dcb458]">
                Contact
              </p>
              <p className="mt-3 text-white/75">{email}</p>
              <p className="mt-1 text-white/75">{phone}</p>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#dcb458]">
                Navigate
              </p>

              <div className="mt-3 flex flex-col gap-2 text-white/75">
                <Link href="/">Home</Link>
                <Link href="/projects">Proyek</Link>
                <Link href="/services">Layanan</Link>
                <Link href="/contact">Kontak</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 font-mono text-[8px] uppercase tracking-[.14em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>Â© {new Date().getFullYear()} Lunar Konstruksi</span>
          <span>Built around structure, coordination, delivery.</span>
        </div>
      </div>
    </footer>
  );
}
