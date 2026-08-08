import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  DraftingCompass,
  HardHat,
  Hammer,
  Ruler,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import type { HydratedCmsSection, PublicPageContext } from "@/modules/public-site/public-site.types";

import { PublicContactForm } from "./public-contact-form";
import {
  asRecord,
  joinLocation,
  neutralImage,
  pickImage,
  pickText,
  readArray,
  readList,
  readString,
  sectionContentText,
  slugToHref,
  surfaceImage,
} from "./public-helpers";

type PageKey = "home" | "about" | "services" | "projects" | "contact";

function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-7 lg:px-8 ${className}`}>{children}</div>;
}

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-[#FF9A68]" : "text-[#F26722]"}`}>{children}</p>;
}

function BlueprintBackground() {
  return <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] [background-size:48px_48px]" />;
}

function HeadingBlock({ kicker, title, description, light = false }: { kicker: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <Kicker light={light}>{kicker}</Kicker>
      <h2 className={`mt-3 text-3xl font-black leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-[#252525]"}`}>{title}</h2>
      {description ? <p className={`mt-4 max-w-2xl text-sm leading-7 sm:text-[15px] ${light ? "text-white/60" : "text-zinc-600"}`}>{description}</p> : null}
    </div>
  );
}

function heroFallback(pageKey: PageKey) {
  if (pageKey === "home") return {
    kicker: "Construction · Renovation · Interior",
    title: "Build with a clearer plan from the first discussion to final handover.",
    description: "Lunar Konstruksi membantu perencanaan, pembangunan, renovasi, dan interior dengan proses kerja yang terukur, komunikasi yang jelas, serta koordinasi lapangan yang rapi.",
  };
  if (pageKey === "services") return { kicker: "Our services", title: "Construction services organized around real project needs.", description: "Pilih layanan sesuai kebutuhan proyek, lalu tim Lunar membantu merapikan scope, prioritas, dan jalur pengerjaannya." };
  if (pageKey === "projects") return { kicker: "Selected projects", title: "Built work, documented through actual project outcomes.", description: "Portfolio ini menunjukkan pendekatan Lunar terhadap ruang, detail, material, dan penyelesaian proyek." };
  if (pageKey === "about") return { kicker: "About Lunar", title: "A construction partner that keeps design decisions and site execution connected.", description: "Lunar bekerja dengan pendekatan yang menempatkan fungsi, kualitas detail, dokumentasi, dan komunikasi dalam satu alur proyek." };
  return { kicker: "Project inquiry", title: "Tell us what you need to build, improve, or renovate.", description: "Mulai dari kebutuhan utama proyek. Tim Lunar akan meninjau ruang lingkup, lokasi, dan target pengerjaan sebelum melanjutkan diskusi." };
}

function SectionHero({ context, pageKey, section }: { context: PublicPageContext; pageKey: PageKey; section: HydratedCmsSection }) {
  const fallback = heroFallback(pageKey);
  const content = section.content;
  const projectImage = context.sections
    .filter((item) => item.type === "projects")
    .flatMap((item) => item.data)
    .map(asRecord)
    .map((item) => pickImage(item, ""))
    .find(Boolean);
  const image = sectionContentText(content, "imageUrl", projectImage || surfaceImage(`${pageKey}-construction-project`));
  const title = sectionContentText(content, "title", fallback.title);
  const description = sectionContentText(content, "description", fallback.description);
  const kicker = sectionContentText(content, "eyebrow", fallback.kicker);
  const ctaLabel = sectionContentText(content, "ctaLabel", pageKey === "home" ? "Explore our projects" : "Start a discussion");
  const ctaHref = sectionContentText(content, "ctaHref", pageKey === "home" ? "/projects" : "/contact");

  return (
    <section className="relative overflow-hidden bg-[#252525]">
      <div className="grid min-h-[620px] lg:grid-cols-[0.46fr_0.54fr]">
        <div className="relative flex items-center bg-[#252525] px-5 py-16 text-white sm:px-8 lg:px-[max(2rem,calc((100vw-1440px)/2+2rem))] lg:py-20">
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="relative max-w-[650px]">
            <Kicker light>{kicker}</Kicker>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[68px]">{title}</h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={ctaHref} className="inline-flex h-12 items-center gap-3 bg-[#F26722] px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#D95113]">
                {ctaLabel}<ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex h-12 items-center border border-white/20 px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#252525]">View services</Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[620px]">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#252525]/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 grid w-full grid-cols-2 border-t border-white/20 bg-white/92 backdrop-blur md:grid-cols-4 lg:w-[92%]">
            {[
              [sectionContentText(content, "statOneValue", "08+"), "Years experience"],
              [sectionContentText(content, "statTwoValue", "120+"), "Projects completed"],
              [sectionContentText(content, "statThreeValue", "98%"), "Client satisfaction"],
              [sectionContentText(content, "statFourValue", "Integrated"), "Project workflow"],
            ].map(([value, label], index) => (
              <div key={label} className={`min-h-24 px-4 py-4 ${index % 2 ? "border-l border-black/8" : ""} md:border-l md:first:border-l-0`}>
                <p className="text-2xl font-black tracking-[-0.03em] text-[#F26722]">{value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "We build what the project actually needs — with clearer coordination.");
  const description = sectionContentText(content, "description", "Kebutuhan ruang, keputusan desain, dokumentasi, dan pelaksanaan harus bergerak dalam arah yang sama. Itu yang kami jaga dari awal proyek sampai penyelesaian.");
  const points = readList(content.points).length ? readList(content.points) : ["Clear project scope before execution", "Technical decisions documented before site work", "Communication and checkpoints throughout delivery"];
  const image = sectionContentText(content, "imageUrl", neutralImage("construction team planning"));

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <BlueprintBackground />
      <Wrap className="relative grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative">
          <img src={image} alt={title} className="h-[480px] w-full object-cover" />
          <div className="absolute -bottom-8 right-0 w-[190px] bg-[#F26722] px-6 py-7 text-white sm:w-[230px]">
            <strong className="block text-4xl font-black">1.2k+</strong>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-white/75">Project interactions managed</span>
          </div>
        </div>
        <div className="lg:pl-8">
          <HeadingBlock kicker="About our work" title={title} description={description} />
          <div className="mt-8 space-y-4">
            {points.map((point) => (
              <div key={point} className="flex gap-4 border-b border-black/8 pb-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F26722]" />
                <p className="text-sm leading-7 text-zinc-700">{point}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="mt-8 inline-flex h-11 items-center gap-3 bg-[#252525] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#F26722]">About Lunar <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Wrap>
    </section>
  );
}

function SectionStats({ section }: { section: HydratedCmsSection }) {
  const custom = readArray<Record<string, unknown>>(section.content.items);
  const items = custom.length ? custom.map((item) => ({ value: readString(item.value, "—"), label: readString(item.label, "Metric") })) : [
    { value: readString(section.content.statOneValue, "08+"), label: "Years of practice" },
    { value: readString(section.content.statTwoValue, "120+"), label: "Projects completed" },
    { value: readString(section.content.statThreeValue, "98%"), label: "Client satisfaction" },
    { value: readString(section.content.statFourValue, "Integrated"), label: "Design-build workflow" },
  ];
  return (
    <section className="bg-[#F5F5F3] py-10">
      <Wrap>
        <div className="grid border-y border-black/8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.label} className={`py-7 ${index ? "lg:border-l lg:border-black/8 lg:px-7" : ""}`}>
              <strong className="block text-4xl font-black tracking-[-0.04em] text-[#F26722]">{item.value}</strong>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">{item.label}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

const serviceIcons = [Building2, HardHat, DraftingCompass, Wrench, ClipboardCheck, Hammer];

function SectionServices({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] py-20 lg:py-24">
      <BlueprintBackground />
      <Wrap className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-end">
          <HeadingBlock kicker="Our services" title="Services that support the project from planning to execution." />
          <p className="max-w-2xl text-sm leading-7 text-zinc-600 lg:justify-self-end">Setiap layanan dapat berdiri sendiri atau digabung sesuai kebutuhan proyek. Scope tetap dirapikan agar tidak tumpang tindih di tahap pengerjaan.</p>
        </div>
        <div className="mt-12 grid gap-px bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
            const summary = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Detail layanan tersedia pada halaman layanan.");
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/services", item, "/services")} className="group min-h-[250px] bg-white p-7 transition hover:bg-[#FFF5EF]">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center bg-[#FFF0E8] text-[#F26722]"><Icon className="h-5 w-5" /></span>
                  <span className="text-[10px] font-bold text-zinc-300">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 text-xl font-black tracking-[-0.025em] text-[#252525]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F26722]">View service <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
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
    { title: "Consult", description: "Memahami kebutuhan, lokasi, target, budget direction, dan batasan proyek." },
    { title: "Plan", description: "Menyusun scope, konsep, layout, serta keputusan teknis yang diperlukan." },
    { title: "Prepare", description: "Merinci kebutuhan material, dokumentasi, timeline, dan koordinasi lapangan." },
    { title: "Build", description: "Pelaksanaan dipantau melalui checkpoint dan komunikasi progres yang jelas." },
    { title: "Handover", description: "Pemeriksaan hasil, perapihan detail, dan penyelesaian pekerjaan sebelum serah terima." },
  ];

  return (
    <section className="bg-[#252525] py-20 text-white lg:py-24">
      <Wrap>
        <HeadingBlock kicker="How a project moves" title="A practical workflow with visible checkpoints." description="Tahap kerja dibuat mudah dipahami supaya keputusan desain, pekerjaan lapangan, dan tanggung jawab tim tidak kabur." light />
        <div className="mt-12 grid gap-px bg-white/10 lg:grid-cols-5">
          {items.map((item, index) => (
            <div key={item.title} className="bg-[#252525] p-6 lg:min-h-[260px]">
              <span className="text-4xl font-black text-[#F26722]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{item.description}</p>
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
    <section className="bg-white py-20 lg:py-24">
      <Wrap>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <HeadingBlock kicker="Latest projects" title="Selected project work." description="Lihat bagaimana keputusan ruang, material, dan detail dibawa sampai tahap hasil akhir." />
          <Link href="/projects" className="inline-flex h-11 shrink-0 items-center gap-3 bg-[#252525] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#F26722]">All projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Project ${index + 1}`);
            const image = pickImage(item, index % 2 ? neutralImage(title) : surfaceImage(title));
            const cls = index === 0 ? "lg:col-span-6 lg:row-span-2" : index < 3 ? "lg:col-span-3" : "lg:col-span-4";
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/projects", item, "/projects")} className={`group relative min-h-[280px] overflow-hidden bg-zinc-200 ${cls}`}>
                <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">{joinLocation(item) || pickText(item, ["category", "projectType"], "Project")}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.025em]">{title}</h3>
                </div>
                <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center bg-[#F26722] text-white opacity-0 transition group-hover:opacity-100"><ArrowRight className="h-4 w-4" /></span>
              </Link>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

function SectionTeam({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] py-20 lg:py-24">
      <BlueprintBackground />
      <Wrap className="relative">
        <HeadingBlock kicker="People behind the work" title="A team built around coordination and delivery." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const name = pickText(item, ["name", "title"], `Team ${index + 1}`);
            const role = pickText(item, ["role", "position"], "Team member");
            const image = pickImage(item, neutralImage(name));
            return (
              <article key={`${name}-${index}`} className="bg-white">
                <img src={image} alt={name} className="h-72 w-full object-cover" />
                <div className="border-b-4 border-[#F26722] p-5">
                  <h3 className="text-lg font-black tracking-[-0.02em] text-[#252525]">{name}</h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">{role}</p>
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
  const items = section.data.map(asRecord).slice(0, 3);
  return (
    <section className="bg-[#F26722] py-16 text-white lg:py-20">
      <Wrap>
        <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <Kicker light>Client feedback</Kicker>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em]">What clients value after the work is done.</h2>
          </div>
          <div className="grid gap-px bg-white/20 md:grid-cols-3">
            {items.map((item, index) => {
              const quote = pickText(item, ["quote", "message", "content", "testimonial"], "Client feedback will appear here.");
              const name = pickText(item, ["authorName", "name", "clientName"], `Client ${index + 1}`);
              return <div key={`${name}-${index}`} className="bg-[#F26722] p-6"><p className="text-sm leading-7 text-white/85">“{quote}”</p><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white/60">{name}</p></div>;
            })}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function SectionFaq({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <section className="bg-white py-20 lg:py-24">
      <Wrap className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr]">
        <HeadingBlock kicker="Common questions" title="What clients usually ask before starting." />
        <div className="border-t border-black/10">
          {items.map((item, index) => {
            const q = pickText(item, ["question", "title"], `Question ${index + 1}`);
            const a = pickText(item, ["answer", "description", "content"], "Jawaban akan tampil di sini.");
            return <div key={`${q}-${index}`} className="border-b border-black/10 py-6"><h3 className="font-bold text-[#252525]">{q}</h3><p className="mt-3 text-sm leading-7 text-zinc-600">{a}</p></div>;
          })}
        </div>
      </Wrap>
    </section>
  );
}

function SectionCta({ context, section }: { context: PublicPageContext; section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "Have a project in mind?");
  const description = sectionContentText(content, "description", "Kirimkan kebutuhan awal proyek. Tim Lunar akan membantu merapikan scope dan langkah berikutnya sebelum masuk ke diskusi teknis lebih jauh.");
  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] py-16 lg:py-20">
      <BlueprintBackground />
      <Wrap className="relative grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
        <div>
          <Kicker>Project inquiry</Kicker>
          <h2 className="mt-3 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#252525]">{title}</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600">{description}</p>
          <div className="mt-8 grid grid-cols-2 gap-px bg-black/8">
            {[{ icon: Ruler, label: "Clear scope" }, { icon: ShieldCheck, label: "Visible checkpoints" }, { icon: HardHat, label: "Site coordination" }, { icon: ClipboardCheck, label: "Documented decisions" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-h-24 items-center gap-3 bg-white p-4"><Icon className="h-5 w-5 text-[#F26722]" /><span className="text-xs font-bold uppercase tracking-[0.08em] text-zinc-700">{label}</span></div>
            ))}
          </div>
        </div>
        <PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} />
      </Wrap>
    </section>
  );
}

function ContactOnly({ context }: { context: PublicPageContext }) {
  return (
    <section className="relative overflow-hidden bg-[#F7F7F5] py-20 lg:py-24">
      <BlueprintBackground />
      <Wrap className="relative grid gap-12 lg:grid-cols-[0.4fr_0.6fr]">
        <div>
          <HeadingBlock kicker="Start a conversation" title="Share the project brief. We will help clarify the next step." description="Informasi awal tidak perlu sempurna. Cukup jelaskan kebutuhan, lokasi, jenis proyek, dan target utama." />
          <div className="mt-8 space-y-4 text-sm text-zinc-600">
            {context.settings.contact.email ? <p><strong className="text-zinc-900">Email:</strong> {context.settings.contact.email}</p> : null}
            {context.settings.contact.phone ? <p><strong className="text-zinc-900">Phone:</strong> {context.settings.contact.phone}</p> : null}
            {[context.settings.contact.address, context.settings.contact.city, context.settings.contact.province].filter(Boolean).length ? <p><strong className="text-zinc-900">Office:</strong> {[context.settings.contact.address, context.settings.contact.city, context.settings.contact.province].filter(Boolean).join(", ")}</p> : null}
          </div>
        </div>
        <PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} />
      </Wrap>
    </section>
  );
}

export function PublicPageRenderer({ context, pageKey }: { context: PublicPageContext; pageKey: PageKey }) {
  return (
    <main className="bg-white text-zinc-950">
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
          case "cta": return pageKey === "contact" ? null : <SectionCta key={section.id} context={context} section={section} />;
          case "gallery": return <SectionProjects key={section.id} section={section} />;
          default: return null;
        }
      })}
      {pageKey === "contact" ? <ContactOnly context={context} /> : null}
    </main>
  );
}

export default PublicPageRenderer;
