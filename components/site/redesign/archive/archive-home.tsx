import Link from "next/link";
import { ArrowUpRight, Paperclip } from "lucide-react";

import type { PublicOverviewData, PublicPageContext } from "@/modules/public-site/public-site.types";

import { PublicContactForm } from "../public-contact-form";
import { asRecord, joinLocation, pickImage, pickText, slugToHref } from "../public-helpers";
import { ArchiveFrame, ArchiveLabel, ArchivePlaceholder, ArchiveStamp, RuledTitle } from "./archive-ui";

const container = "mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8";

const projectLayouts = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

const serviceLayouts = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

const teamLayouts = [
  "md:col-span-5 md:row-span-2",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-5",
];

function Hero({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  const project = asRecord(data.projects[0]);
  const hero = context.sections.find((section) => section.type === "hero");
  const title = typeof hero?.content.title === "string" && hero.content.title.trim() ? hero.content.title.trim() : "BUILT WORK / FIELD ARCHIVE";
  const description = typeof hero?.content.description === "string" && hero.content.description.trim() ? hero.content.description.trim() : "Catatan proyek, layanan, personel, dan proses kerja Lunar Konstruksi dalam satu arsip publik yang terhubung langsung ke CMS.";
  const projectName = pickText(project, ["title", "name", "projectName"], "Project record");
  const location = joinLocation(project) || "Location not recorded";
  const projectImage = pickImage(project, "");

  return (
    <section className="bg-[#E9DFD0] py-5 sm:py-8">
      <div className={container}>
        <ArchiveFrame className="min-h-[590px] shadow-[0_24px_70px_rgba(55,42,29,0.16)]">
          <div className="grid min-h-[590px] lg:grid-cols-[76px_1fr]">
            <div className="hidden border-r border-[#2C2925]/18 lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-6">
              <p className="[writing-mode:vertical-rl] rotate-180 font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#2C2925]/55">LUNAR / FIELD NOTES / PUBLIC ARCHIVE</p>
              <p className="font-serif text-[30px] text-[#C94A28]">03</p>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2C2925]/20 pb-4">
                <div className="flex flex-wrap gap-2"><ArchiveLabel>Record: Home</ArchiveLabel><ArchiveLabel>Class: Construction</ArchiveLabel><ArchiveLabel>CMS: Live</ArchiveLabel></div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#2C2925]/45">Ref. LK / {new Date().getFullYear()} / 001</p>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#C94A28]">Construction systems archive</p>
                  <h1 className="mt-4 max-w-[650px] font-serif text-[48px] uppercase leading-[0.84] tracking-[-0.055em] text-[#1E1A16] sm:text-[66px] lg:text-[78px]">{title}</h1>
                  <div className="mt-6 h-[2px] w-24 bg-[#C94A28]" />
                  <p className="mt-6 max-w-xl text-[12px] leading-7 text-[#2C2925]/64">{description}</p>
                  <div className="mt-8 grid max-w-[560px] grid-cols-3 border-y border-[#2C2925]/18 py-5">
                    {[[data.projects.length, "Projects"], [data.services.length, "Services"], [data.team.length, "Personnel"]].map(([value, label], index) => (
                      <div key={String(label)} className={index ? "border-l border-[#2C2925]/16 pl-5" : "pr-5"}>
                        <p className="font-serif text-[32px] leading-none">{String(value).padStart(2, "0")}</p>
                        <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#2C2925]/46">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/projects" className="inline-flex items-center gap-3 border border-[#231F1B] bg-[#231F1B] px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#F4EBDD]">Open project archive <ArrowUpRight className="h-4 w-4" /></Link>
                    <Link href="/contact" className="inline-flex items-center gap-3 border border-[#231F1B]/35 px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#231F1B]">Submit project brief</Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[560px] pb-6 pt-3 lg:mr-0">
                  <div className="absolute -right-2 -top-1 z-20"><ArchiveStamp>Approved<br />Public<br />Record</ArchiveStamp></div>
                  <div className="rotate-[1.1deg] border border-[#2C2925]/22 bg-[#F8F1E5] p-3 shadow-[0_20px_50px_rgba(66,50,33,0.18)]">
                    <div className="relative h-[300px] overflow-hidden bg-[#DDD2C0] sm:h-[350px]">{projectImage ? <img src={projectImage} alt={projectName} className="h-full w-full object-cover" /> : <ArchivePlaceholder label={projectName} />}</div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-4 border-t border-[#2C2925]/18 pt-4">
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

function ProjectArchive({ data }: { data: PublicOverviewData }) {
  const projects = data.projects.map(asRecord).slice(0, 6);
  if (!projects.length) return null;

  return (
    <section className="bg-[#F4EBDD] py-16 lg:py-20">
      <div className={container}>
        <RuledTitle index="01" label="Latest Records" title="Project Archive" copy="Portfolio dibuat sebagai grid arsip asimetris agar ritmenya lebih hidup. Foto tetap berasal dari Project record di CMS." />
        <div className="mt-8 grid auto-rows-[168px] gap-4 md:grid-cols-12">
          {projects.map((item, index) => {
            const title = pickText(item, ["title", "name", "projectName"], `Project ${index + 1}`);
            const image = pickImage(item, "");
            const location = joinLocation(item) || "Location —";
            const type = pickText(item, ["category", "projectType", "type"], "Project");
            const tall = index === 0;
            return (
              <Link
                key={`${title}-${index}`}
                href={slugToHref("/projects", item, "/projects")}
                className={`group relative overflow-hidden border border-[#2C2925]/18 bg-[#DDD2C0] ${projectLayouts[index] ?? "md:col-span-4"}`}
              >
                {image ? <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : <ArchivePlaceholder label={title} />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/90 via-[#171411]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-[#F7EFE3] sm:p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#F08A67]">LK-{String(index + 1).padStart(3, "0")} / {type}</p>
                      <h3 className={`${tall ? "text-[30px]" : "text-[23px]"} mt-2 font-serif leading-[0.92]`}>{title}</h3>
                      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.1em] text-white/55">{location}</p>
                    </div>
                    <span className="font-mono text-[12px]">↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceDossiers({ data }: { data: PublicOverviewData }) {
  const services = data.services.map(asRecord).slice(0, 6);
  if (!services.length) return null;

  return (
    <section className="bg-[#E7DCCB] py-16 lg:py-20">
      <div className={container}>
        <RuledTitle index="02" label="Capability Files" title="Service Dossiers" copy="Service sekarang memakai media dari database dan komposisi bento, bukan deretan kartu identik dari kiri ke kanan." />
        <div className="mt-8 grid auto-rows-[164px] gap-4 md:grid-cols-12">
          {services.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
            const desc = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Detail layanan tersedia di halaman service.");
            const image = pickImage(item, "");
            const feature = index === 0;
            return (
              <Link
                href={slugToHref("/services", item, "/services")}
                key={`${title}-${index}`}
                className={`group relative overflow-hidden border border-[#2C2925]/20 bg-[#F5EBDD] ${serviceLayouts[index] ?? "md:col-span-4"}`}
              >
                {image ? (
                  <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                ) : (
                  <ArchivePlaceholder label={title} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/95 via-[#171411]/30 to-[#171411]/5" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-[#F8F0E4] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <ArchiveLabel dark>File {String(index + 1).padStart(2, "0")}</ArchiveLabel>
                    <span className="font-mono text-[10px] text-[#F08A67]">↗</span>
                  </div>
                  <h3 className={`${feature ? "text-[31px]" : "text-[23px]"} mt-4 font-serif leading-[0.92]`}>{title}</h3>
                  {feature ? <p className="mt-3 max-w-xl text-[10px] leading-5 text-white/62">{desc}</p> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TeamRecords({ data }: { data: PublicOverviewData }) {
  const team = data.team.map(asRecord).slice(0, 6);
  if (!team.length) return null;

  return (
    <section className="bg-[#F4EBDD] py-16 lg:py-20">
      <div className={container}>
        <RuledTitle index="03" label="Personnel Records" title="Team Archive" copy="Foto personel tetap diambil dari Team record. Komposisi sekarang berupa personnel mosaic agar tidak terasa seperti daftar kartu biasa." />
        <div className="mt-8 grid auto-rows-[150px] gap-4 md:grid-cols-12">
          {team.map((person, index) => {
            const name = pickText(person, ["name", "fullName", "title"], `Team ${index + 1}`);
            const role = pickText(person, ["role", "position", "jobTitle"], "Team member");
            const image = pickImage(person, "");
            return (
              <article key={`${name}-${index}`} className={`group relative overflow-hidden border border-[#2C2925]/18 bg-[#D9CEBE] ${teamLayouts[index] ?? "md:col-span-4"}`}>
                {image ? <img src={image} alt={name} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]" /> : <ArchivePlaceholder label={name} />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/92 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-[#F7EFE3]">
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#F08A67]">Personnel / {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-serif text-[24px] leading-none">{name}</h3>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/55">{role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialNotes({ data }: { data: PublicOverviewData }) {
  const notes = data.testimonials.map(asRecord).slice(0, 3);
  if (!notes.length) return null;
  return (
    <section className="bg-[#DCCFBD] py-16 lg:py-20">
      <div className={container}>
        <RuledTitle index="04" label="Client Notes" title="Filed Remarks" />
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
          {notes.map((item, index) => {
            const quote = pickText(item, ["quote", "message", "content", "testimonial"], "Testimonial record");
            const name = pickText(item, ["authorName", "clientName", "name"], `Client ${index + 1}`);
            return (
              <div key={`${name}-${index}`} className={`relative min-h-[220px] border border-[#2C2925]/20 p-6 shadow-[0_12px_24px_rgba(71,53,36,0.08)] ${index === 1 ? "bg-[#F0D990] lg:-translate-y-3" : "bg-[#F6EBDD]"}`}>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#C94A28]">Note / {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-7 font-serif text-[22px] leading-[1.12]">“{quote}”</p>
                <div className="absolute inset-x-6 bottom-5 border-t border-[#2C2925]/16 pt-3"><p className="font-mono text-[8px] font-black uppercase tracking-[0.12em]">{name}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Inquiry({ context }: { context: PublicPageContext }) {
  return (
    <section className="bg-[#F4EBDD] py-16 lg:py-20">
      <div className={container}>
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <div><RuledTitle index="05" label="New Record" title="Project Intake" copy="Form ini tetap memakai Leads Flow Fase 5. Data masuk ke Firestore lebih dulu sebelum tindak lanjut WhatsApp." /></div>
          <div className="border border-[#2C2925]/18 bg-[#E8DDCD] p-5 sm:p-7"><PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} /></div>
        </div>
      </div>
    </section>
  );
}

export function ArchiveHome({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  return <div className="bg-[#E9DFD0] text-[#231F1B]"><Hero context={context} data={data} /><ProjectArchive data={data} /><ServiceDossiers data={data} /><TeamRecords data={data} /><TestimonialNotes data={data} /><Inquiry context={context} /></div>;
}
