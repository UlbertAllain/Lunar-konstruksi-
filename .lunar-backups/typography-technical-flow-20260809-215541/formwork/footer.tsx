import Link from "next/link";
import { displayFont } from "./decor";

export function FormworkFooter() {
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <footer className="bg-[#101f37] text-[#f8f4ec]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className={`${displayFont} text-4xl font-black uppercase leading-[.9] tracking-[-0.035em] sm:text-6xl`}>Lunar <span className="text-[#dcb458]">/</span> Konstruksi</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">Perencanaan, koordinasi, dan pekerjaan konstruksi dengan keputusan teknis yang jelas dari awal sampai serah terima.</p>
          </div>
          <div className="grid gap-6 text-sm sm:grid-cols-2">
            <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#dcb458]">Contact</p><p className="mt-3 text-white/75">{email}</p><p className="mt-1 text-white/75">{phone}</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#dcb458]">Navigate</p><div className="mt-3 flex flex-col gap-2 text-white/75"><Link href="/about">About</Link><Link href="/projects">Work</Link><Link href="/services">Capabilities</Link><Link href="/contact">Contact</Link></div></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 font-mono text-[9px] uppercase tracking-[.14em] text-white/40 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Lunar Konstruksi</span><span>Built around structure, coordination, delivery.</span></div>
      </div>
    </footer>
  );
}
