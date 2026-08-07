import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";

import type { HydratedCmsSection, PublicPageContext } from "@/features/public-site/public-site.types";

import { PublicContactForm } from "./public-contact-form";
import { asRecord, joinLocation, neutralImage, pickImage, pickText, readArray, readList, readString, sectionContentText, slugToHref, surfaceImage } from "./public-helpers";

type PageKey = "home" | "about" | "services" | "projects" | "contact";

function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-7 lg:px-10 ${className}`}>{children}</div>;
}

function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${light ? "text-[#d1ad77]" : "text-[#8d6f49]"}`}>{children}</p>;
}

function HeaderBlock({ label, title, description, light = false }: { label: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="grid gap-6 border-t border-current/15 pt-5 lg:grid-cols-[0.32fr_1fr]">
      <Label light={light}>{label}</Label>
      <div>
        <h2 className={`max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.025em] sm:text-5xl lg:text-[64px] ${light ? "text-[#f5f1ea]" : "text-[#171714]"}`}>{title}</h2>
        {description ? <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${light ? "text-white/60" : "text-zinc-600"}`}>{description}</p> : null}
      </div>
    </div>
  );
}

function SectionHero({ context, pageKey, section }: { context: PublicPageContext; pageKey: PageKey; section: HydratedCmsSection }) {
  const content = section.content;
  const projectImage = context.sections
    .filter((item) => item.type === "projects")
    .flatMap((item) => item.data)
    .map(asRecord)
    .map((item) => pickImage(item, ""))
    .find(Boolean);
  const imageUrl = sectionContentText(content, "imageUrl", projectImage || surfaceImage(`${pageKey}-architecture`));
  const title = sectionContentText(
    content,
    "title",
    pageKey === "home"
      ? "Design, build, and interior work with a clearer process."
      : context.page?.title || "Lunar Konstruksi",
  );
  const description = sectionContentText(
    content,
    "description",
    pageKey === "home"
      ? "Lunar Konstruksi menangani perancangan, pembangunan, renovasi, dan penyempurnaan ruang dengan perhatian pada fungsi, detail, serta koordinasi lapangan."
      : "Informasi, ruang lingkup, dan pekerjaan disusun secara jelas agar keputusan proyek lebih mudah dipahami sejak awal.",
  );
  const eyebrow = sectionContentText(content, "eyebrow", pageKey === "home" ? "Architecture · Interior · Construction" : context.page?.title || "Lunar Konstruksi");
  const ctaLabel = sectionContentText(content, "ctaLabel", pageKey === "home" ? "View selected projects" : "Discuss a project");
  const ctaHref = sectionContentText(content, "ctaHref", pageKey === "home" ? "/projects" : "/contact");

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#10100f] pt-[76px] text-white lg:min-h-[790px]">
      <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,11,0.94)_0%,rgba(12,12,11,0.76)_36%,rgba(12,12,11,0.12)_78%,rgba(12,12,11,0.05)_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:96px_96px]" />

      <Wrap className="relative flex min-h-[644px] items-end pb-14 pt-20 lg:min-h-[714px] lg:pb-16">
        <div className="max-w-[760px]">
          <Label light>{eyebrow}</Label>
          <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.035em] text-[#f5f1ea] sm:text-6xl lg:text-[82px]">{title}</h1>
          <div className="mt-8 grid max-w-2xl gap-6 border-t border-white/20 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-xl text-sm leading-7 text-white/68 sm:text-base">{description}</p>
            <Link href={ctaHref} className="inline-flex h-11 items-center gap-3 border border-[#c7a36d]/70 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ecd9ba] transition hover:bg-[#c7a36d] hover:text-[#11110f]">
              {ctaLabel}<ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Wrap>

      <div className="relative border-t border-white/15 bg-black/22 backdrop-blur-sm">
        <Wrap>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              [sectionContentText(content, "statOneValue", "08+"), "Years of practice"],
              [sectionContentText(content, "statTwoValue", "120+"), "Projects delivered"],
              [sectionContentText(content, "statThreeValue", "98%"), "Client satisfaction"],
              [sectionContentText(content, "statFourValue", "Integrated"), "Design-build workflow"],
            ].map(([value, label], index) => (
              <div key={label} className={`py-5 ${index % 2 ? "border-l border-white/15 pl-5" : ""} lg:border-l lg:border-white/15 lg:px-7 lg:first:border-l-0 lg:first:pl-0`}>
                <p className="font-serif text-2xl text-[#f1dfc1] sm:text-3xl">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/48">{label}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </div>
    </section>
  );
}

function SectionIntro({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "A practical design-build partner for spaces that need to work properly.");
  const description = sectionContentText(content, "description", "Lunar menyatukan kebutuhan fungsi, detail desain, dokumentasi, dan pelaksanaan agar proyek tidak terpecah menjadi keputusan yang saling bertentangan.");
  const points = readList(content.points).length ? readList(content.points) : ["Clear project scope and priorities", "Coordinated design and technical decisions", "Execution with measurable checkpoints"];

  return (
    <section className="bg-[#f2efe9] py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="01 / Approach" title={title} description={description} />
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <img src={sectionContentText(content, "imageUrl", neutralImage(title))} alt={title} className="h-[460px] w-full object-cover lg:h-[560px]" />
          <div className="border-t border-black/20">
            {points.map((point, index) => (
              <div key={point} className="grid grid-cols-[48px_1fr] gap-4 border-b border-black/15 py-5">
                <span className="font-serif text-lg text-[#8d6f49]">0{index + 1}</span>
                <p className="text-sm leading-7 text-zinc-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function SectionStats({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const custom = readArray<Record<string, unknown>>(content.items);
  const items = custom.length
    ? custom.map((item) => [readString(item.value, "—"), readString(item.label, "Metric")])
    : [[readString(content.statOneValue, "08+"), "Years of practice"], [readString(content.statTwoValue, "120+"), "Projects delivered"], [readString(content.statThreeValue, "98%"), "Client satisfaction"], [readString(content.statFourValue, "Integrated"), "Design-build workflow"]];

  return (
    <section className="bg-white py-16 lg:py-20">
      <Wrap>
        <div className="grid grid-cols-2 border-y border-black/15 lg:grid-cols-4">
          {items.map(([value, label], index) => (
            <div key={String(label)} className={`py-8 ${index % 2 ? "border-l border-black/15 pl-6" : ""} lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0`}>
              <p className="font-serif text-4xl tracking-[-0.03em] text-[#171714] lg:text-5xl">{String(value)}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{String(label)}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function SectionServices({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="bg-[#11110f] py-20 text-white lg:py-28">
      <Wrap>
        <HeaderBlock label="02 / Services" title="Services structured around how a project actually moves." description="Setiap layanan ditempatkan dalam alur yang jelas, dari keputusan awal sampai pelaksanaan dan penyelesaian." light />
        <div className="mt-14 border-t border-white/15">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
            const summary = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Detail layanan tersedia pada halaman layanan.");
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/services", item, "/services")} className="group grid gap-4 border-b border-white/15 py-7 transition hover:bg-white/[0.025] lg:grid-cols-[0.12fr_0.43fr_0.35fr_0.1fr] lg:items-center">
                <span className="font-serif text-2xl text-[#c7a36d]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-3xl tracking-[-0.02em] text-[#f5f1ea] lg:text-4xl">{title}</h3>
                <p className="max-w-xl text-sm leading-7 text-white/55">{summary}</p>
                <ArrowUpRight className="h-5 w-5 text-white/45 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#c7a36d]" />
              </Link>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

function SectionProcess({ section }: { section: HydratedCmsSection }) {
  const custom = readArray<Record<string, unknown>>(section.content.items);
  const items = custom.length ? custom.map((item, index) => ({ title: readString(item.title, `Stage ${index + 1}`), description: readString(item.description, "") })) : [
    { title: "Consult", description: "Kebutuhan, ruang lingkup, lokasi, prioritas, dan batasan proyek dibahas terlebih dahulu." },
    { title: "Draft", description: "Konsep dan layout disusun sampai arah ruang cukup jelas untuk dinilai secara teknis." },
    { title: "Develop", description: "Detail, material, dan keputusan konstruksi dimatangkan untuk mengurangi keputusan mendadak di lapangan." },
    { title: "Document", description: "Dokumentasi kerja dan kebutuhan koordinasi dirapikan sebelum atau selama pelaksanaan." },
    { title: "Deliver", description: "Pekerjaan ditutup dengan pemeriksaan hasil dan penyelesaian detail akhir." },
  ];

  return (
    <section className="bg-[#f2efe9] py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="03 / Process" title="A straightforward workflow from brief to delivery." description="Tahapan dibuat sederhana agar klien tahu apa yang sedang diputuskan, dikerjakan, dan diperiksa." />
        <div className="relative mt-16 grid gap-0 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-black/20 lg:block" />
          {items.map((item, index) => (
            <div key={item.title} className="relative border-t border-black/15 py-7 lg:border-t-0 lg:px-5 lg:pt-0 lg:first:pl-0">
              <div className="relative z-10 mb-7 flex h-9 w-9 items-center justify-center rounded-full border border-[#8d6f49] bg-[#f2efe9] font-serif text-sm text-[#8d6f49]">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="font-serif text-2xl text-[#171714]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function SectionProjects({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord).slice(0, 6);
  return (
    <section className="bg-white py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="04 / Selected work" title="Projects are shown through space, material, and proportion—not decorative UI." description="Portfolio disusun agar visual proyek tetap menjadi fokus utama." />
        <div className="mt-14 grid auto-rows-[220px] gap-3 sm:auto-rows-[260px] lg:grid-cols-12 lg:auto-rows-[210px]">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Project ${index + 1}`);
            const image = pickImage(item, index % 2 === 0 ? surfaceImage(title) : neutralImage(title));
            const placement = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"][index] || "lg:col-span-4";
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/projects", item, "/projects")} className={`group relative overflow-hidden bg-zinc-200 ${placement}`}>
                <img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                  <div>
                    <p className="font-serif text-2xl leading-tight">{title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/55">{joinLocation(item) || pickText(item, ["category", "projectType"], "Project")}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/70" />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end">
          <Link href="/projects" className="inline-flex items-center gap-2 border-b border-black/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-900">View all projects <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </Wrap>
    </section>
  );
}

function SectionTeam({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="bg-[#f2efe9] py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="05 / Team" title="A small team is useful when responsibilities stay clear." description="Setiap anggota membawa peran yang spesifik dalam proses desain, koordinasi, dan pengerjaan." />
        <div className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const name = pickText(item, ["name", "title"], `Team ${index + 1}`);
            return (
              <article key={name}>
                <img src={pickImage(item, neutralImage(name))} alt={name} className="aspect-[4/5] w-full object-cover" />
                <div className="mt-4 border-t border-black/20 pt-3">
                  <h3 className="font-serif text-xl text-[#171714]">{name}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">{pickText(item, ["role", "position"], "Team member")}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

function SectionTestimonials({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  const first = items[0] || {};
  const quote = pickText(first, ["quote", "message", "content", "testimonial"], "Komunikasi yang jelas dan proses yang rapi menjadi bagian penting dari pengalaman kerja bersama Lunar.");
  const name = pickText(first, ["authorName", "name", "clientName"], "Client");
  const role = pickText(first, ["authorRole", "company", "role"], "Project client");
  return (
    <section className="bg-[#11110f] py-20 text-white lg:py-28">
      <Wrap>
        <div className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-[0.32fr_1fr]">
          <Label light>06 / Client note</Label>
          <div>
            <blockquote className="max-w-5xl font-serif text-4xl leading-[1.14] tracking-[-0.025em] text-[#f5f1ea] sm:text-5xl lg:text-6xl">“{quote}”</blockquote>
            <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-white/45">{name} · {role}</p>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function SectionFaq({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="bg-white py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="FAQ" title="Useful questions before the first meeting." description="Jawaban singkat untuk membantu menentukan apakah kebutuhan proyek sesuai dengan ruang lingkup kerja Lunar." />
        <div className="mt-12 border-t border-black/15">
          {items.map((item, index) => (
            <details key={index} className="group border-b border-black/15 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-[#171714] sm:text-2xl">
                {pickText(item, ["question", "title"], `Question ${index + 1}`)}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-7 text-zinc-600">{pickText(item, ["answer", "description", "content"], "Jawaban akan ditampilkan di sini.")}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function SectionCta({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "Have a project that needs a clearer direction?");
  const description = sectionContentText(content, "description", "Sampaikan kebutuhan ruang, lokasi, dan tahap proyek saat ini. Tim Lunar akan menilai ruang lingkup sebelum melanjutkan ke diskusi teknis.");
  const image = sectionContentText(content, "imageUrl", neutralImage(title));
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#11110f] text-white">
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />
      <Wrap className="relative flex min-h-[560px] items-end py-16 lg:py-20">
        <div className="grid w-full gap-8 border-t border-white/25 pt-6 lg:grid-cols-[0.32fr_1fr]">
          <Label light>Next project</Label>
          <div>
            <h2 className="max-w-4xl font-serif text-4xl leading-[1.02] tracking-[-0.025em] text-[#f5f1ea] sm:text-5xl lg:text-7xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">{description}</p>
            <Link href={sectionContentText(content, "ctaHref", "/contact")} className="mt-8 inline-flex h-11 items-center gap-3 border border-[#c7a36d]/70 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ecd9ba] transition hover:bg-[#c7a36d] hover:text-[#11110f]">{sectionContentText(content, "ctaLabel", "Discuss your project")} <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function ContactSection({ context }: { context: PublicPageContext }) {
  const contact = context.settings.contact;
  return (
    <section className="bg-[#f2efe9] py-20 lg:py-28">
      <Wrap>
        <HeaderBlock label="Project inquiry" title="Start with the essentials. We can structure the rest together." description="Ceritakan tipe proyek, lokasi, dan apa yang perlu diselesaikan. Tim Lunar akan menggunakan informasi ini untuk menilai langkah awal yang masuk akal." />
        <div className="mt-14 grid gap-14 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="space-y-7 border-t border-black/15 pt-6 text-sm text-zinc-600">
            {contact.email ? <div><Mail className="mb-3 h-4 w-4 text-[#8d6f49]" /><p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Email</p><p className="mt-1 text-zinc-800">{contact.email}</p></div> : null}
            {contact.phone ? <div><Phone className="mb-3 h-4 w-4 text-[#8d6f49]" /><p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Phone</p><p className="mt-1 text-zinc-800">{contact.phone}</p></div> : null}
            {[contact.address, contact.city, contact.province].filter(Boolean).length ? <div><MapPin className="mb-3 h-4 w-4 text-[#8d6f49]" /><p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">Location</p><p className="mt-1 leading-6 text-zinc-800">{[contact.address, contact.city, contact.province].filter(Boolean).join(", ")}</p></div> : null}
          </div>
          <PublicContactForm whatsapp={contact.whatsapp} />
        </div>
      </Wrap>
    </section>
  );
}

export function PublicPageRenderer({ context, pageKey }: { context: PublicPageContext; pageKey: PageKey }) {
  return (
    <div className="bg-white text-zinc-950">
      {context.sections.map((section) => {
        switch (section.type) {
          case "hero": return <SectionHero key={section.id} context={context} pageKey={pageKey} section={section} />;
          case "intro": return <SectionIntro key={section.id} section={section} />;
          case "stats": return <SectionStats key={section.id} section={section} />;
          case "services": return <SectionServices key={section.id} section={section} />;
          case "process": return <SectionProcess key={section.id} section={section} />;
          case "projects": return <SectionProjects key={section.id} section={section} />;
          case "team": return <SectionTeam key={section.id} section={section} />;
          case "testimonials": return <SectionTestimonials key={section.id} section={section} />;
          case "faq": return <SectionFaq key={section.id} section={section} />;
          case "cta": return <SectionCta key={section.id} section={section} />;
          case "gallery": return null;
          default: return null;
        }
      })}
      {pageKey === "contact" ? <ContactSection context={context} /> : null}
    </div>
  );
}
