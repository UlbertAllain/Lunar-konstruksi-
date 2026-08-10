import Link from "next/link";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { projectModel, type SiteData } from "./data";

export function FormworkProjects({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const hero = projects[0];

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-24"><BlueprintLayer /><div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-10"><div><MicroLabel>P-01 / Work / documented projects</MicroLabel><h1 className={`${displayFont} mt-8 text-[clamp(3rem,5.1vw,5.35rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}>Pekerjaan nyata membentuk arsip kami.</h1><p className="mt-8 max-w-lg text-[15px] leading-7 text-[#566476]">Setiap entri berasal dari Project yang dikelola melalui admin dan menggunakan media proyek yang tersimpan di database.</p></div><div className="relative min-h-[520px]"><div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,84%_0%,100%_10%,100%_74%,92%_100%,27%_100%,14%_93%,0%_79%,0%_17%)]"><DatabaseImage src={LOCAL_MEDIA.projectsHero || hero?.image || ""} alt={hero?.title ?? "Project"} className="h-full min-h-[500px] w-full object-cover object-center" /></div>{/* FLOATING-PROJECTS-HERO-CARD */}
<div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
  <div className="px-4 py-3">
    <MicroLabel>Portofolio proyek / P-02</MicroLabel>
    <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">Arsip proyek menjadi bukti keputusan, progres, dan hasil yang benar-benar dikerjakan.</p>
  </div>
  <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
    WORK / RECORD
  </div>
</div>
<TechnicalArc label="WORK / ARCHIVE" className="bottom-[-10%] left-[12%] h-[360px] w-[500px] rotate-[17deg]" /></div></div></section>

        <section className="relative py-20 sm:py-28"><div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10"><div className="grid auto-rows-[190px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-6">{projects.map((project,index) => { const layouts=["col-span-2 row-span-2 md:col-span-3","col-span-2 md:col-span-3","col-span-1 row-span-2 md:col-span-2","col-span-1 md:col-span-2","col-span-2 md:col-span-2","col-span-2 row-span-2 md:col-span-3","col-span-2 md:col-span-3"]; const layout=layouts[index%layouts.length]; return <Link key={project.id} href={project.slug?`/projects/${project.slug}`:"/projects"} className={`group relative overflow-hidden bg-[#ddd8cf] ${layout}`}><DatabaseImage src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-x-0 bottom-0 bg-[#14243f]/90 p-4 text-white"><div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e5c775]">{project.location}{project.year?` / ${project.year}`:""}</p><h2 className={`${displayFont} mt-1 text-2xl font-black uppercase leading-none`}>{project.title}</h2></div><span className="font-mono text-[9px]">P-{String(index+1).padStart(2,"0")}</span></div></div></Link>; })}</div></div></section>

        <section className="bg-[#14243f] py-20 text-white"><div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10"><div><MicroLabel>Project record / archive</MicroLabel><h2 className={`${displayFont} mt-5 max-w-4xl text-4xl font-black uppercase leading-[.92] sm:text-5xl lg:text-6xl`}>Lokasi, material, urutan kerja, dan hasil akhir selalu punya konteks.</h2></div><Link href="/contact" className="font-mono text-[10px] uppercase tracking-[.1em] text-[#e5c775]">Discuss a project →</Link></div></section>
      </main>
      <FormworkFooter />
    </div>
  );
}
