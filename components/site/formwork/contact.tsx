import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { TechnicalContactForm } from "./contact-form";
import { DatabaseImage } from "./media";
import { projectModel, type SiteData } from "./data";

export function FormworkContact({ data }: { data: SiteData }) {
  const project = data.projects.map(projectModel)[0];
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <div className="overflow-hidden bg-[#f2eee7] text-[#22292a]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d8d1c6] py-16 sm:py-24"><BlueprintLayer /><div className="relative mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><div><MicroLabel>Contact / project intake</MicroLabel><h1 className={`${displayFont} mt-8 text-[clamp(3.8rem,7vw,7.7rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}>Mulai dari konteks yang sebenarnya.</h1><p className="mt-8 max-w-lg text-[15px] leading-7 text-[#50514e]">Sampaikan tipe pekerjaan, lokasi, ruang lingkup, dan target. Informasi awal yang jelas membuat diskusi teknis jauh lebih efektif.</p></div><div className="relative min-h-[500px]"><div className="absolute right-0 top-0 w-[84%] overflow-hidden [border-radius:58%_42%_45%_55%/40%_48%_52%_60%]"><DatabaseImage src={project?.image ?? ""} alt={project?.title ?? "Lunar Konstruksi"} className="h-[450px] w-full object-cover" /></div><TechnicalArc className="bottom-[-9%] left-[10%] h-[360px] w-[500px] rotate-[17deg]" /></div></div></section>

        <section className="relative py-20 sm:py-28"><div className="mx-auto grid w-full max-w-[1480px] gap-14 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10"><div><MicroLabel>Direct line / project desk</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] sm:text-7xl`}>Bawa brief. Kami bantu merapikan langkah berikutnya.</h2><div className="mt-10 border-t border-[#bbb4aa] pt-5 font-mono text-[9px] uppercase leading-6 tracking-[.1em] text-[#6c6760]"><p>Email / {email}</p><p>Phone / {phone}</p><p>Availability / by appointment</p></div></div><div><MicroLabel>Project brief / required fields</MicroLabel><div className="mt-7"><TechnicalContactForm /></div></div></div></section>

        <section className="bg-[#172124] py-16 text-white"><div className="mx-auto grid w-full max-w-[1480px] gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-10">{[["01","Context","Jenis pekerjaan dan alasan proyek dilakukan."],["02","Constraints","Lokasi, waktu, anggaran, akses, dan batasan teknis."],["03","Next step","Review awal lalu diskusi ruang lingkup yang realistis."]].map(([number,title,text]) => <div key={number} className="border-t border-white/20 pt-4"><p className="font-mono text-[9px] text-[#e36c2f]">{number}</p><h3 className={`${displayFont} mt-4 text-3xl font-black uppercase`}>{title}</h3><p className="mt-3 text-sm leading-7 text-white/55">{text}</p></div>)}</div></section>
      </main>
      <FormworkFooter />
    </div>
  );
}
