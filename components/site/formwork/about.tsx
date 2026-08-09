import Link from "next/link";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { projectModel, teamModel, type SiteData } from "./data";

export function FormworkAbout({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const team = data.team.map(teamModel);
  const project = projects[0];

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-24">
          <BlueprintLayer />
          <div className="relative mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-10">
            <div>
              <MicroLabel>A-01 / About / field organisation</MicroLabel>
              <h1 className={`${displayFont} mt-8 text-[clamp(3.8rem,7vw,7.8rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}>Keputusan teknis dimulai sebelum pekerjaan lapangan.</h1>
              <p className="mt-8 max-w-xl text-[15px] leading-7 text-[#566476]">Lunar Konstruksi menghubungkan perencanaan, estimasi, koordinasi, dan pelaksanaan agar proyek bergerak dengan struktur kerja yang dapat dibaca dan dipertanggungjawabkan.</p>
            </div>
            <div className="relative min-h-[600px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(10%_0%,78%_0%,100%_12%,100%_69%,91%_72%,82%_100%,17%_94%,0%_76%,0%_18%)]">
                <DatabaseImage src={LOCAL_MEDIA.aboutHero || project?.image || ""} alt={project?.title ?? "Lunar Konstruksi"} className="h-full min-h-[500px] w-full object-cover object-center" />
              </div>
              
              {/* FLOATING-ABOUT-HERO-CARD */}
<div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
  <div className="px-4 py-3">
    <MicroLabel>Field brief / A-02</MicroLabel>
    <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">Tim, koordinasi, dan keputusan lapangan perlu terasa sebagai satu sistem kerja.</p>
  </div>
  <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
    PEOPLE / CONTROL
  </div>
</div>
<TechnicalArc label="TEAM / FIELD" className="bottom-[-10%] left-[14%] h-[380px] w-[520px] rotate-[18deg]" />
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10">
            <div><MicroLabel>Position / responsibility</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl`}>Partner teknis, bukan sekadar pelaksana.</h2></div>
            <div className="grid gap-8 text-lg leading-8 text-[#566476] md:grid-cols-2">
              <p>Kami merapikan keputusan sebelum menjadi pekerjaan. Lingkup, material, urutan kerja, koordinasi, dan perubahan dibahas dalam konteks dampaknya terhadap waktu, biaya, dan mutu.</p>
              <p>Setiap proyek memiliki kondisi berbeda. Karena itu, proses Lunar tidak bergantung pada satu formula visual, tetapi pada disiplin dokumentasi, komunikasi, dan kontrol lapangan.</p>
            </div>
          </div>
        </section>

        <section className="relative border-y border-[#d9d4ca] py-20 sm:py-24">
          <BlueprintLayer className="opacity-[0.08]" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><MicroLabel>Personnel / project team</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-7xl`}>Keahlian lintas fungsi.</h2></div><p className="max-w-md text-sm leading-7 text-[#657184]">Foto dan data personel diambil dari data Team yang dikelola melalui admin.</p></div>
            <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-6">
              {team.slice(0, 8).map((member, index) => {
                const layout = ["col-span-2 row-span-2 md:col-span-3", "col-span-2 md:col-span-3", "col-span-1 row-span-2 md:col-span-2", "col-span-1 md:col-span-2", "col-span-2 md:col-span-2", "col-span-2 md:col-span-3"][index % 6];
                return <article key={member.id} className={`relative overflow-hidden bg-[#d9d4ca] ${layout}`}><DatabaseImage src={member.image} alt={member.name} className="h-full w-full object-cover grayscale-[20%]" /><div className="absolute inset-x-0 bottom-0 bg-[#14243f]/90 p-4 text-white"><p className={`${displayFont} text-xl font-black uppercase leading-none`}>{member.name}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[.12em] text-[#e5c775]">{member.position}</p></div></article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#14243f] py-20 text-[#f8f4ec] sm:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-3 lg:px-10">
            {[["01", "Clarity", "Lingkup, prioritas, keputusan, dan risiko dijelaskan sejak awal."], ["02", "Integration", "Desain, biaya, koordinasi, dan pekerjaan lapangan dibaca sebagai satu sistem."], ["03", "Accountability", "Progres dan perubahan harus bisa ditelusuri melalui komunikasi dan dokumentasi yang rapi."]].map(([number,title,text]) => <article key={number} className="border-t border-white/20 pt-5"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#dcb458]">{number}</p><h3 className={`${displayFont} mt-8 text-4xl font-black uppercase`}>{title}</h3><p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{text}</p></article>)}
          </div>
        </section>

        <section className="relative border-t border-[#d9d4ca] py-20 sm:py-24"><div className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10"><div><MicroLabel>Next / project discussion</MicroLabel><h2 className={`${displayFont} mt-5 max-w-3xl text-6xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-8xl`}>Bicarakan konteks proyek sejak awal.</h2></div><Link href="/contact" className="border-b border-[#dcb458] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[.08em]">Talk to our team →</Link></div></section>
      </main>
      <FormworkFooter />
    </div>
  );
}
