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
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-24"><BlueprintLayer /><div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-10"><div><MicroLabel>P-01 / Work / documented projects</MicroLabel><h1 className={`${displayFont} mt-8 text-[clamp(3.8rem,7vw,7.8rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}>Pekerjaan nyata membentuk arsip kami.</h1><p className="mt-8 max-w-lg text-[15px] leading-7 text-[#566476]">Setiap entri berasal dari Project yang dikelola melalui admin dan menggunakan media proyek yang tersimpan di database.</p></div><div className="relative min-h-[520px]"><div className="absolute inset-y-0 right-[-3%] w-[94%] overflow-visible"><DatabaseImage src={LOCAL_MEDIA.projectsHero || hero?.image || ""} alt={hero?.title ?? "Project"} className="h-[470px] w-full object-cover" /></div><TechnicalArc label="WORK / ARCHIVE" className="bottom-[-10%] left-[12%] h-[360px] w-[500px] rotate-[17deg]" /></div></div></section>

        <section className="relative py-20 sm:py-28"><div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10"><div className="grid auto-rows-[190px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-6">{projects.map((project,index) => { const layouts=["col-span-2 row-span-2 md:col-span-3","col-span-2 md:col-span-3","col-span-1 row-span-2 md:col-span-2","col-span-1 md:col-span-2","col-span-2 md:col-span-2","col-span-2 row-span-2 md:col-span-3","col-span-2 md:col-span-3"]; const layout=layouts[index%layouts.length]; return <Link key={project.id} href={project.slug?`/projects/${project.slug}`:"/projects"} className={`group relative overflow-hidden bg-[#ddd8cf] ${layout}`}><DatabaseImage src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-x-0 bottom-0 bg-[#14243f]/90 p-4 text-white"><div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e5c775]">{project.location}{project.year?` / ${project.year}`:""}</p><h2 className={`${displayFont} mt-1 text-2xl font-black uppercase leading-none`}>{project.title}</h2></div><span className="font-mono text-[9px]">P-{String(index+1).padStart(2,"0")}</span></div></div></Link>; })}</div></div></section>

        <section className="bg-[#14243f] py-20 text-white"><div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10"><div><MicroLabel>Project record / archive</MicroLabel><h2 className={`${displayFont} mt-5 max-w-4xl text-5xl font-black uppercase leading-[.88] sm:text-7xl`}>Lokasi, material, urutan kerja, dan hasil akhir selalu punya konteks.</h2></div><Link href="/contact" className="font-mono text-[10px] uppercase tracking-[.1em] text-[#e5c775]">Discuss a project →</Link></div></section>
      </main>
      <FormworkFooter />
    </div>
  );
}
