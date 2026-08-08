import Link from "next/link";

import type { HydratedCmsSection, PublicPageContext } from "@/modules/public-site/public-site.types";

import { PublicContactForm } from "../public-contact-form";
import { asRecord, joinLocation, pickImage, pickText, slugToHref } from "../public-helpers";
import { ArchiveFrame, ArchiveLabel, ArchivePlaceholder, ArchiveStamp, RuledTitle } from "./archive-ui";

const container = "mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8";
type PageKey = "about" | "services" | "projects" | "contact";

const bentoSpans = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-7",
];

const personnelSpans = [
  "md:col-span-5 md:row-span-2",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-5",
];

function firstRecord(sections: HydratedCmsSection[]) {
  for (const section of sections) {
    if (section.data?.length) return asRecord(section.data[0]);
  }
  return {} as Record<string, unknown>;
}

function ArchiveHero({ context, pageKey }: { context: PublicPageContext; pageKey: PageKey }) {
  const hero = context.sections.find((section) => section.type === "hero");
  const record = firstRecord(context.sections);
  const image = pickImage(record, "");
  const title = typeof hero?.content.title === "string" && hero.content.title.trim() ? hero.content.title.trim() : context.page?.title || pageKey.toUpperCase();
  const desc = typeof hero?.content.description === "string" && hero.content.description.trim() ? hero.content.description.trim() : "Public company record generated from Lunar CMS.";

  return (
    <section className="bg-[#E9DFD0] py-6">
      <div className={container}>
        <ArchiveFrame>
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-7 sm:p-10">
              <div className="flex gap-2"><ArchiveLabel>Page / {pageKey}</ArchiveLabel><ArchiveLabel>CMS / Published</ArchiveLabel></div>
              <h1 className="mt-9 font-serif text-[52px] uppercase leading-[0.84] tracking-[-0.055em] sm:text-[72px]">{title}</h1>
              <div className="mt-6 h-[2px] w-20 bg-[#C94A28]" />
              <p className="mt-6 max-w-xl text-[12px] leading-7 text-[#2C2925]/60">{desc}</p>
              <div className="mt-8"><ArchiveStamp>Public<br />Record</ArchiveStamp></div>
            </div>
            <div className="h-[300px] border-t border-[#2C2925]/18 bg-[#DCCFBD] sm:h-[340px] lg:h-auto lg:max-h-[420px] lg:border-l lg:border-t-0">
              {image ? <img src={image} alt={title} className="h-full w-full object-cover" /> : <ArchivePlaceholder label={title} />}
            </div>
          </div>
        </ArchiveFrame>
      </div>
    </section>
  );
}

function CollectionCard({ section, record, index }: { section: HydratedCmsSection; record: Record<string, unknown>; index: number }) {
  const name = pickText(record, ["title", "name", "question", "authorName", "clientName", "fullName"], `${section.type} ${index + 1}`);
  const desc = pickText(record, ["summary", "excerpt", "description", "answer", "quote", "message", "content", "role", "position"], "");
  const image = pickImage(record, "");
  const base = section.type === "projects" ? "/projects" : section.type === "services" ? "/services" : "";
  const href = base ? slugToHref(base, record, base) : "#";
  const isPersonnel = section.type === "team";
  const visual = ["projects", "services", "team"].includes(section.type);
  const span = isPersonnel ? personnelSpans[index % personnelSpans.length] : bentoSpans[index % bentoSpans.length];

  const inner = (
    <>
      {visual ? (
        <>
          <div className="absolute inset-0 bg-[#DCCFBD]">
            {image ? <img src={image} alt={name} className={`h-full w-full object-cover ${isPersonnel ? "object-top" : ""}`} /> : <ArchivePlaceholder label={name} />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#171411]/92 via-[#171411]/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-[#F8EFE3] sm:p-5">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#F08A67]">REC / {String(index + 1).padStart(2, "0")} / {section.type}</p>
            <h3 className="mt-2 font-serif text-[24px] leading-[0.94] sm:text-[27px]">{name}</h3>
            {section.type === "projects" ? <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.1em] text-white/55">{joinLocation(record) || "Location —"}</p> : desc ? <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-white/58">{desc}</p> : null}
          </div>
        </>
      ) : (
        <div className="p-5">
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#C94A28]">REC / {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-4 font-serif text-[27px] leading-[0.95]">{name}</h3>
          {desc ? <p className="mt-4 text-[11px] leading-6 text-[#2C2925]/56">{desc}</p> : null}
        </div>
      )}
    </>
  );

  const className = visual
    ? `group relative min-h-[164px] overflow-hidden border border-[#2C2925]/18 bg-[#F5EBDD] ${span}`
    : "border border-[#2C2925]/18 bg-[#F5EBDD]";

  return href !== "#" ? <Link href={href} className={className}>{inner}</Link> : <article className={className}>{inner}</article>;
}

function DataSection({ section, index }: { section: HydratedCmsSection; index: number }) {
  const records = section.data.map(asRecord);
  const title = typeof section.content.title === "string" && section.content.title.trim() ? section.content.title.trim() : section.type.charAt(0).toUpperCase() + section.type.slice(1);
  if (["hero", "cta", "intro", "stats", "process", "gallery"].includes(section.type) || !records.length) return null;

  const visual = ["projects", "services", "team"].includes(section.type);
  return (
    <section className={`${index % 2 ? "bg-[#E7DCCB]" : "bg-[#F4EBDD]"} py-14 lg:py-18`}>
      <div className={container}>
        <RuledTitle index={String(index + 1).padStart(2, "0")} label={`${section.type} / ${section.variant}`} title={title} />
        <div className={`mt-7 grid gap-4 ${visual ? "auto-rows-[164px] md:grid-cols-12" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {records.map((record, i) => <CollectionCard key={`${section.id}-${i}`} section={section} record={record} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Narrative({ context }: { context: PublicPageContext }) {
  const sections = context.sections.filter((section) => ["intro", "stats", "process"].includes(section.type));
  if (!sections.length) return null;
  return (
    <section className="bg-[#F4EBDD] py-14">
      <div className={container}>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr_1fr]">
          {sections.map((section, i) => (
            <div key={section.id} className={`min-h-[190px] border border-[#2C2925]/18 p-5 ${i === 1 ? "bg-[#ECD896] lg:translate-y-5" : "bg-[#E8DDCD]"}`}>
              <ArchiveLabel>{section.type} / {String(i + 1).padStart(2, "0")}</ArchiveLabel>
              <h3 className="mt-7 font-serif text-[29px] leading-[0.98]">{typeof section.content.title === "string" ? section.content.title : section.type.toUpperCase()}</h3>
              {typeof section.content.description === "string" ? <p className="mt-4 text-[11px] leading-6 text-[#2C2925]/58">{section.content.description}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ context }: { context: PublicPageContext }) {
  return (
    <section className="bg-[#E7DCCB] py-16">
      <div className={container}>
        <div className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
          <div><RuledTitle index="99" label="Project Intake" title="Open New Record" copy="Masukkan kebutuhan proyek. Data akan masuk ke Leads CMS dan menjadi catatan tindak lanjut tim Lunar." /></div>
          <div className="border border-[#2C2925]/18 bg-[#F4EBDD] p-5"><PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} /></div>
        </div>
      </div>
    </section>
  );
}

export function ArchivePageRenderer({ context, pageKey }: { context: PublicPageContext; pageKey: PageKey }) {
  return (
    <div className="bg-[#E9DFD0] text-[#231F1B]">
      <ArchiveHero context={context} pageKey={pageKey} />
      <Narrative context={context} />
      {context.sections.map((section, index) => <DataSection key={section.id} section={section} index={index} />)}
      {pageKey === "contact" ? <ContactBlock context={context} /> : null}
    </div>
  );
}
