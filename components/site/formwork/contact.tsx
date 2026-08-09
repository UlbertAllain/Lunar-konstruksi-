import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { TechnicalContactForm } from "./contact-form";
import { DatabaseImage } from "./media";
import { type SiteData } from "./data";

export function FormworkContact({ data }: { data: SiteData }) {
  void data;
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-24"><BlueprintLayer /><div className="relative mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><div><MicroLabel>C-01 / Contact / project intake</MicroLabel><h1 className={`${displayFont} mt-8 text-[clamp(3.8rem,7vw,7.7rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}>Mulai dari konteks yang sebenarnya.</h1><p className="mt-8 max-w-lg text-[15px] leading-7 text-[#566476]">Sampaikan tipe pekerjaan, lokasi, ruang lingkup, dan target. Informasi awal yang jelas membuat diskusi teknis jauh lebih efektif.</p></div><div className="relative min-h-[500px]"><div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(14%_0%,84%_0%,100%_18%,95%_70%,100%_86%,83%_100%,17%_94%,0%_76%,4%_19%)]"><DatabaseImage src={LOCAL_MEDIA.contactHero} alt="Lunar Konstruksi  -  konsultasi proyek" className="h-[450px] w-full object-contain mix-blend-multiply mix-blend-multiply" /></div>{/* FLOATING-CONTACT-HERO-CARD */}
<div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
  <div className="px-4 py-3">
    <MicroLabel>Brief intake / C-02</MicroLabel>
    <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">Kebutuhan, ruang lingkup, dan batas keputusan perlu dibaca jelas sejak percakapan pertama.</p>
  </div>
  <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
    BRIEF / INPUT
  </div>
</div>
<TechnicalArc label="BRIEF / INTAKE" className="bottom-[-9%] left-[10%] h-[360px] w-[500px] rotate-[17deg]" /></div></div></section>

        <section className="relative py-20 sm:py-28"><div className="mx-auto grid w-full max-w-[1480px] gap-14 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10"><div><MicroLabel>Direct line / project desk</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] sm:text-7xl`}>Bawa brief. Kami bantu merapikan langkah berikutnya.</h2><div className="mt-10 border-t border-[#c0bbb2] pt-5 font-mono text-[9px] uppercase leading-6 tracking-[.1em] text-[#707b8c]"><p>Email / {email}</p><p>Phone / {phone}</p><p>Availability / by appointment</p></div></div><div><MicroLabel>Project brief / required fields</MicroLabel><div className="mt-7"><TechnicalContactForm /></div></div></div></section>

        <section className="bg-[#14243f] py-16 text-white"><div className="mx-auto grid w-full max-w-[1480px] gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-10">{[["01","Context","Jenis pekerjaan dan alasan proyek dilakukan."],["02","Constraints","Lokasi, waktu, anggaran, akses, dan batasan teknis."],["03","Next step","Review awal lalu diskusi ruang lingkup yang realistis."]].map(([number,title,text]) => <div key={number} className="border-t border-white/20 pt-4"><p className="font-mono text-[9px] text-[#dcb458]">{number}</p><h3 className={`${displayFont} mt-4 text-3xl font-black uppercase`}>{title}</h3><p className="mt-3 text-sm leading-7 text-white/55">{text}</p></div>)}</div></section>
      </main>
      <FormworkFooter />
    </div>
  );
}
