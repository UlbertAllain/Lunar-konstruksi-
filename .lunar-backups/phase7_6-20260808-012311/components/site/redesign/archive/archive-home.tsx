import Link from "next/link";
import { ArrowUpRight, Paperclip } from "lucide-react";

import type { PublicOverviewData, PublicPageContext } from "@/features/public-site/public-site.types";

import { PublicContactForm } from "../public-contact-form";
import { asRecord, joinLocation, pickImage, pickText, slugToHref } from "../public-helpers";
import { ArchiveFrame, ArchiveLabel, ArchivePlaceholder, ArchiveStamp, RuledTitle } from "./archive-ui";

const container = "mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8";

function Hero({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  const project = asRecord(data.projects[0]);
  const hero = context.sections.find((section) => section.type === "hero");
  const title = typeof hero?.content.title === "string" && hero.content.title.trim() ? hero.content.title.trim() : "BUILT WORK / FIELD ARCHIVE";
  const description = typeof hero?.content.description === "string" && hero.content.description.trim() ? hero.content.description.trim() : "Catatan proyek, layanan, personel, dan proses kerja Lunar Konstruksi dalam satu arsip publik yang terhubung langsung ke CMS.";
  const projectName = pickText(project,["title","name","projectName"],"Project record");
  const location = joinLocation(project) || "Location not recorded";
  const projectImage = pickImage(project, "");

  return (
    <section className="bg-[#E9DFD0] py-5 sm:py-8">
      <div className={container}>
        <ArchiveFrame className="min-h-[650px] shadow-[0_24px_70px_rgba(55,42,29,0.16)]">
          <div className="grid min-h-[650px] lg:grid-cols-[76px_1fr]">
            <div className="hidden border-r border-[#2C2925]/18 lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-6">
              <p className="[writing-mode:vertical-rl] rotate-180 font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#2C2925]/55">LUNAR / FIELD NOTES / PUBLIC ARCHIVE</p>
              <p className="font-serif text-[30px] text-[#C94A28]">03</p>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2C2925]/20 pb-4">
                <div className="flex flex-wrap gap-2"><ArchiveLabel>Record: Home</ArchiveLabel><ArchiveLabel>Class: Construction</ArchiveLabel><ArchiveLabel>CMS: Live</ArchiveLabel></div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#2C2925]/45">Ref. LK / {new Date().getFullYear()} / 001</p>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <div className="pt-3">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#C94A28]">Construction systems archive</p>
                  <h1 className="mt-4 max-w-[650px] font-serif text-[52px] uppercase leading-[0.82] tracking-[-0.055em] text-[#1E1A16] sm:text-[72px] lg:text-[88px]">{title}</h1>
                  <div className="mt-6 h-[2px] w-24 bg-[#C94A28]" />
                  <p className="mt-6 max-w-xl text-[12px] leading-7 text-[#2C2925]/64">{description}</p>
                  <div className="mt-8 grid max-w-[560px] grid-cols-3 border-y border-[#2C2925]/18 py-5">
                    {[[data.projects.length,"Projects"],[data.services.length,"Services"],[data.team.length,"Personnel"]].map(([value,label],index)=><div key={String(label)} className={index?"border-l border-[#2C2925]/16 pl-5":"pr-5"}><p className="font-serif text-[32px] leading-none">{String(value).padStart(2,"0")}</p><p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#2C2925]/46">{label}</p></div>)}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/projects" className="inline-flex items-center gap-3 border border-[#231F1B] bg-[#231F1B] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#F4EBDD]">Open project archive <ArrowUpRight className="h-4 w-4" /></Link>
                    <Link href="/contact" className="inline-flex items-center gap-3 border border-[#231F1B]/35 px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#231F1B]">Submit project brief</Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[600px] pb-10 pt-5 lg:mr-0">
                  <div className="absolute -right-2 -top-1 z-20"><ArchiveStamp>Approved<br/>Public<br/>Record</ArchiveStamp></div>
                  <div className="absolute -left-4 top-1/3 z-20 hidden -rotate-12 bg-[#E5C98C] px-4 py-3 shadow-md sm:block"><p className="font-mono text-[8px] uppercase tracking-[0.12em]">Project note</p><p className="mt-1 max-w-[150px] font-serif text-lg leading-tight">Data visual diambil dari Project record.</p></div>
                  <div className="rotate-[1.3deg] border border-[#2C2925]/22 bg-[#F8F1E5] p-3 shadow-[0_20px_50px_rgba(66,50,33,0.18)]">
                    <div className="relative h-[360px] overflow-hidden bg-[#DDD2C0] sm:h-[430px]">{projectImage ? <img src={projectImage} alt={projectName} className="h-full w-full object-cover" /> : <ArchivePlaceholder label={projectName} />}</div>
                    <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-[#2C2925]/18 pt-4 mt-3">
                      <div><p className="font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-[#C94A28]">Featured record</p><p className="mt-1 font-serif text-[24px] leading-none">{projectName}</p><p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#2C2925]/45">{location}</p></div>
                      <Paperclip className="h-6 w-6 text-[#2C2925]/42" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ArchiveFrame>
      </div>
    </section>
  );
}

function ProjectLedger({ data }: { data: PublicOverviewData }) {
  const projects = data.projects.map(asRecord).slice(0,6);
  return <section className="bg-[#F4EBDD] py-16 lg:py-20"><div className={container}><RuledTitle index="01" label="Latest Records" title="Project Archive" copy="Setiap entry di bawah berasal dari koleksi Projects yang sudah dipublish. Foto CMS dipakai apa adanya; tidak diganti oleh gambar stok." />
    <div className="mt-8 border border-[#2C2925]/18 bg-[#EEE3D4]">
      <div className="hidden grid-cols-[90px_1.2fr_0.8fr_110px_90px] border-b border-[#2C2925]/18 bg-[#DDD0BD] px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#2C2925]/55 md:grid"><span>Ref</span><span>Record</span><span>Location</span><span>Type</span><span>Open</span></div>
      {projects.map((item,index)=>{const title=pickText(item,["title","name","projectName"],`Project ${index+1}`);const location=joinLocation(item)||"—";const type=pickText(item,["category","projectType","type"],"Project");return <Link key={`${title}-${index}`} href={slugToHref("/projects",item,"/projects")} className="group grid gap-3 border-b border-[#2C2925]/14 px-4 py-4 last:border-b-0 md:grid-cols-[90px_1.2fr_0.8fr_110px_90px] md:items-center"><span className="font-mono text-[9px] font-bold text-[#C94A28]">LK-{String(index+1).padStart(3,"0")}</span><span className="font-serif text-[20px] group-hover:text-[#C94A28]">{title}</span><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#2C2925]/48">{location}</span><span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#2C2925]/45">{type}</span><span className="font-mono text-[8px] font-black uppercase tracking-[0.12em]">View ↗</span></Link>})}
    </div>
  </div></section>;
}

function ServiceDossiers({ data }: { data: PublicOverviewData }) {
  const services=data.services.map(asRecord).slice(0,6);
  return <section className="bg-[#E7DCCB] py-16 lg:py-20"><div className={container}><RuledTitle index="02" label="Capability Files" title="Service Dossiers" copy="Layanan disajikan seperti indeks dokumen: jelas, terstruktur, dan langsung terhubung ke halaman detail yang dikelola CMS." />
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((item,index)=>{const title=pickText(item,["title","name"],`Service ${index+1}`);const desc=pickText(item,["summary","excerpt","description","shortDescription"],"Detail layanan tersedia di halaman service.");return <Link href={slugToHref("/services",item,"/services")} key={`${title}-${index}`} className={`group relative min-h-[260px] border border-[#2C2925]/20 p-5 ${index===1?"bg-[#DCC58F]":index===4?"bg-[#284B38] text-[#F4EBDD]":"bg-[#F5EBDD]"}`}><div className="flex justify-between"><ArchiveLabel dark={index===4}>File {String(index+1).padStart(2,"0")}</ArchiveLabel><span className="font-mono text-[9px] text-[#C94A28]">↗</span></div><h3 className="mt-10 font-serif text-[30px] leading-[0.95]">{title}</h3><p className={`mt-4 text-[11px] leading-6 ${index===4?"text-white/58":"text-[#2C2925]/58"}`}>{desc}</p><div className="absolute inset-x-5 bottom-5 border-t border-current/15 pt-3 font-mono text-[8px] font-bold uppercase tracking-[0.13em] opacity-55">Status / Published / CMS</div></Link>})}</div>
  </div></section>;
}

function TeamRecords({ data }: { data: PublicOverviewData }) {
  const team=data.team.map(asRecord).slice(0,6); if(!team.length)return null;
  return <section className="bg-[#F4EBDD] py-16 lg:py-20"><div className={container}><RuledTitle index="03" label="Personnel Records" title="Team Archive" copy="Foto personel dibaca langsung dari record Team. Jika CMS sudah memiliki foto, gambar tersebut yang digunakan tanpa substitusi." />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{team.map((person,index)=>{const name=pickText(person,["name","fullName","title"],`Team ${index+1}`);const role=pickText(person,["role","position","jobTitle"],"Team member");const image=pickImage(person,"");return <article key={`${name}-${index}`} className="grid grid-cols-[120px_1fr] border border-[#2C2925]/18 bg-[#EFE4D4] sm:grid-cols-1"><div className="h-full min-h-[180px] overflow-hidden border-r border-[#2C2925]/18 bg-[#D9CEBE] sm:h-[280px] sm:border-b sm:border-r-0">{image?<img src={image} alt={name} className="h-full w-full object-cover object-top"/>:<ArchivePlaceholder label={name}/>}</div><div className="p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[#C94A28]">Personnel / {String(index+1).padStart(2,"0")}</p><h3 className="mt-3 font-serif text-[26px] leading-none">{name}</h3><p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#2C2925]/48">{role}</p><div className="mt-6 border-t border-[#2C2925]/15 pt-3 font-mono text-[7px] uppercase tracking-[0.12em] text-[#2C2925]/35">Record source: Firestore Team</div></div></article>})}</div>
  </div></section>;
}

function TestimonialNotes({ data }: { data: PublicOverviewData }) {
  const notes=data.testimonials.map(asRecord).slice(0,3); if(!notes.length)return null;
  return <section className="bg-[#DCCFBD] py-16 lg:py-20"><div className={container}><RuledTitle index="04" label="Client Notes" title="Filed Remarks" />
    <div className="mt-8 grid gap-5 lg:grid-cols-3">{notes.map((item,index)=>{const quote=pickText(item,["quote","message","content","testimonial"],"Testimonial record");const name=pickText(item,["authorName","clientName","name"],`Client ${index+1}`);return <div key={`${name}-${index}`} className={`relative min-h-[240px] border border-[#2C2925]/20 p-6 shadow-[0_12px_24px_rgba(71,53,36,0.08)] ${index===1?"rotate-[1deg] bg-[#F0D990]":"-rotate-[0.5deg] bg-[#F6EBDD]"}`}><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#C94A28]">Note / {String(index+1).padStart(2,"0")}</p><p className="mt-8 font-serif text-[23px] leading-[1.12]">“{quote}”</p><div className="absolute inset-x-6 bottom-5 border-t border-[#2C2925]/16 pt-3"><p className="font-mono text-[8px] font-black uppercase tracking-[0.12em]">{name}</p></div></div>})}</div>
  </div></section>;
}

function Inquiry({ context }: { context: PublicPageContext }) {return <section className="bg-[#F4EBDD] py-16 lg:py-20"><div className={container}><div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]"><div><RuledTitle index="05" label="New Record" title="Project Intake" copy="Form ini tetap memakai Leads Flow Fase 5. Data masuk ke Firestore lebih dulu sebelum tindak lanjut WhatsApp." /></div><div className="border border-[#2C2925]/18 bg-[#E8DDCD] p-5 sm:p-7"><PublicContactForm settings={{whatsapp:context.settings.contact.whatsapp,email:context.settings.contact.email,phone:context.settings.contact.phone}}/></div></div></div></section>}

export function ArchiveHome({context,data}:{context:PublicPageContext;data:PublicOverviewData}){return <div className="bg-[#E9DFD0] text-[#231F1B]"><Hero context={context} data={data}/><ProjectLedger data={data}/><ServiceDossiers data={data}/><TeamRecords data={data}/><TestimonialNotes data={data}/><Inquiry context={context}/></div>}
