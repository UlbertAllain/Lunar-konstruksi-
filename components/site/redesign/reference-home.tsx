import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  DraftingCompass,
  HardHat,
  Hammer,
  ShieldCheck,
  Users2,
  Wrench,
} from "lucide-react";

import type { PublicOverviewData, PublicPageContext } from "@/features/public-site/public-site.types";

import { PublicContactForm } from "./public-contact-form";
import { asRecord, joinLocation, neutralImage, pickImage, pickText, slugToHref, surfaceImage } from "./public-helpers";

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-7 lg:px-8 ${className}`}>{children}</div>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[2px] w-8 bg-[#F26422]" />
      <p className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-zinc-500"}`}>{children}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="max-w-[570px]">
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 className={`mt-4 text-[34px] font-black leading-[1.08] tracking-[-0.04em] sm:text-[42px] ${light ? "text-white" : "text-[#262626]"}`}>{title}</h2>
      {description ? <p className={`mt-4 text-[14px] leading-7 ${light ? "text-white/60" : "text-zinc-600"}`}>{description}</p> : null}
    </div>
  );
}

function Hero({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  const firstProject = asRecord(data.projects[0]);
  const heroSection = context.sections.find((section) => section.type === "hero");
  const content = heroSection?.content ?? {};
  const image = typeof content.imageUrl === "string" && content.imageUrl.trim() ? content.imageUrl : pickImage(firstProject, "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=88");
  const title = typeof content.title === "string" && content.title.trim() ? content.title : "Build your project with a clearer plan and controlled execution.";
  const description = typeof content.description === "string" && content.description.trim() ? content.description : "Lunar Konstruksi menangani pembangunan, renovasi, interior, dan koordinasi proyek dengan proses kerja yang jelas dari pembahasan awal sampai serah terima.";

  const stats = [
    [typeof content.statOneValue === "string" ? content.statOneValue : "08+", "Years experience"],
    [typeof content.statTwoValue === "string" ? content.statTwoValue : "120+", "Projects completed"],
    [typeof content.statThreeValue === "string" ? content.statThreeValue : "98%", "Client satisfaction"],
  ];

  return (
    <section className="relative bg-white pb-16 lg:pb-24">
      <div className="grid min-h-[590px] lg:grid-cols-[45%_55%]">
        <div className="relative flex items-center overflow-hidden bg-[#29292B] text-white">
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(135deg,transparent_0_48%,white_49%_50%,transparent_51%_100%)] [background-size:70px_70px]" />
          <div className="relative z-10 w-full px-6 py-16 sm:px-10 lg:ml-auto lg:max-w-[530px] lg:pl-8 lg:pr-12">
            <Eyebrow light>Construction · renovation · interior</Eyebrow>
            <h1 className="mt-5 text-[44px] font-black leading-[0.98] tracking-[-0.052em] sm:text-[58px] lg:text-[64px]">{title}</h1>
            <p className="mt-6 max-w-[470px] text-[14px] leading-7 text-white/66">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="inline-flex h-12 items-center gap-3 bg-[#F26422] px-6 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#db541a]">
                Explore projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center border border-white/25 px-6 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#29292B]">Start a project</Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[440px] lg:min-h-[590px]">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        </div>
      </div>

      <Container className="relative -mt-10 lg:-mt-14">
        <div className="grid items-stretch shadow-[0_18px_46px_rgba(0,0,0,0.11)] lg:grid-cols-[0.36fr_0.64fr]">
          <div className="relative overflow-hidden bg-white px-8 py-7 lg:px-10">
            <div className="absolute right-0 top-0 h-full w-[46%] opacity-[0.08] [background-image:linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] [background-size:24px_24px]" />
            <p className="text-[44px] font-black leading-none tracking-[-0.06em] text-[#F26422]">40+</p>
            <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-500">Project milestones</p>
          </div>
          <div className="grid bg-[#F4F4F2] sm:grid-cols-3">
            {stats.map(([value, label], index) => (
              <div key={label} className={`px-6 py-6 ${index ? "border-t border-black/7 sm:border-l sm:border-t-0" : ""}`}>
                <p className="text-[24px] font-black tracking-[-0.04em] text-[#29292B]">{value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CompanyIntro() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[42%] opacity-[0.035] [background-image:linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] [background-size:42px_42px]" />
      <Container className="relative grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative pr-4 sm:pr-12">
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=88" alt="Construction team planning" className="h-[480px] w-full object-cover" />
          <div className="absolute bottom-[-36px] right-0 w-[190px] bg-[#F26422] px-6 py-8 text-white sm:w-[230px]">
            <p className="text-[42px] font-black leading-none tracking-[-0.05em]">1.2k+</p>
            <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80">Project discussions & checkpoints handled</p>
          </div>
        </div>

        <div className="lg:pl-5">
          <SectionHeading eyebrow="About Lunar" title="We keep design decisions and field execution connected." description="Kualitas proyek tidak hanya ditentukan oleh tampilan akhir. Yang lebih penting adalah bagaimana scope, keputusan teknis, material, koordinasi, dan pekerjaan lapangan bergerak tanpa kehilangan arah." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              [DraftingCompass, "Clear planning", "Scope, fungsi ruang, dan keputusan desain dirapikan sebelum pekerjaan bergerak terlalu jauh."],
              [ClipboardCheck, "Controlled execution", "Progress, checkpoint, dan kebutuhan lapangan dicatat agar koordinasi tidak hanya mengandalkan percakapan."],
              [ShieldCheck, "Quality checks", "Detail penting diperiksa pada tahapan yang relevan sebelum masuk ke penyelesaian akhir."],
              [Users2, "Direct communication", "Klien mendapatkan jalur komunikasi yang jelas untuk keputusan, perubahan, dan tindak lanjut proyek."],
            ].map(([Icon, title, body]) => {
              const C = Icon as typeof DraftingCompass;
              return (
                <div key={String(title)} className="flex gap-4 border-t border-black/8 pt-5">
                  <C className="mt-1 h-5 w-5 shrink-0 text-[#F26422]" />
                  <div>
                    <h3 className="text-[14px] font-extrabold text-[#29292B]">{String(title)}</h3>
                    <p className="mt-2 text-[12px] leading-6 text-zinc-500">{String(body)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/about" className="mt-8 inline-flex h-11 items-center gap-3 bg-[#29292B] px-5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white hover:bg-[#F26422]">Explore our company <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Container>
    </section>
  );
}

const serviceIcons = [Building2, HardHat, DraftingCompass, Wrench, ClipboardCheck, Hammer];

function Services({ data }: { data: PublicOverviewData }) {
  const items = data.services.map(asRecord).slice(0, 6);
  return (
    <section className="relative overflow-hidden bg-[#F6F6F4] py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] [background-size:48px_48px]" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <SectionHeading eyebrow="Our services" title="Services we provide." />
          <p className="max-w-[560px] text-[13px] leading-7 text-zinc-500 lg:justify-self-end">Setiap layanan bisa berdiri sendiri atau digabung sesuai kebutuhan proyek. Scope dibahas lebih dulu supaya tanggung jawab, output, dan batas pekerjaan tetap jelas.</p>
        </div>
        <div className="mt-12 grid gap-[1px] bg-black/7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
            const summary = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Detail layanan tersedia pada halaman layanan.");
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/services", item, "/services")} className="group min-h-[230px] bg-white p-7 transition hover:bg-[#FFF4EE]">
                <Icon className="h-7 w-7 text-[#F26422]" />
                <h3 className="mt-8 text-[18px] font-black tracking-[-0.025em] text-[#29292B]">{title}</h3>
                <p className="mt-3 text-[12px] leading-6 text-zinc-500">{summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#F26422]">View details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function QuickInquiry({ context }: { context: PublicPageContext }) {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%] bg-[#F6F6F4]" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
        <div>
          <SectionHeading eyebrow="Have a project in mind?" title="Start with the essentials." description="Sampaikan kebutuhan utama proyek. Tim Lunar akan meninjau scope awal, lokasi, dan jenis pekerjaan sebelum masuk ke pembahasan yang lebih rinci." />
          <div className="mt-8 max-w-[640px]">
            <PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} />
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=88" alt="Construction site" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-[#29292B]/92 px-7 py-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF9A68]">Before execution</p>
            <p className="mt-2 text-[14px] leading-6 text-white/75">Scope, material direction, timeline, and decision points should be clear enough to manage before site work accelerates.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[150px] font-black tracking-[-0.06em] text-black/[0.025] sm:text-[210px] lg:text-[260px]">WHY US</div>
      <Container className="relative grid gap-10 lg:grid-cols-[0.32fr_0.36fr_0.32fr] lg:items-center">
        <div className="space-y-7 text-right lg:pr-5">
          {[
            ["Technical planning", "Keputusan penting tidak dibiarkan terlalu lama tanpa arah."],
            ["Clear checkpoints", "Progress proyek dibagi ke titik evaluasi yang mudah dipantau."],
            ["Project result", "Hasil akhir tetap dikaitkan dengan fungsi, kualitas, dan kebutuhan pengguna ruang."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="text-[14px] font-extrabold text-[#29292B]">{title}</h3>
              <p className="mt-2 text-[12px] leading-6 text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
        <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=88" alt="Construction engineer" className="mx-auto h-[460px] w-full max-w-[360px] object-cover object-top" />
        <div className="space-y-7 lg:pl-5">
          {[
            ["Trusted coordination", "Perubahan dan kebutuhan lapangan dibahas melalui jalur komunikasi yang lebih tertata."],
            ["Skilled execution", "Pekerjaan teknis diarahkan sesuai scope dan kebutuhan proyek yang sudah disepakati."],
            ["Cost awareness", "Keputusan proyek mempertimbangkan prioritas agar anggaran tidak habis pada hal yang tidak penting."],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F26422]" />
              <div>
                <h3 className="text-[14px] font-extrabold text-[#29292B]">{title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-zinc-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function DarkProcess() {
  const items = [
    ["01", "Consult", "Memahami kebutuhan, lokasi, target, dan batas proyek."],
    ["02", "Plan", "Menyusun scope, layout, detail, dan keputusan teknis."],
    ["03", "Prepare", "Merapikan material, timeline, dan kebutuhan lapangan."],
    ["04", "Build", "Pelaksanaan berjalan dengan checkpoint dan koordinasi."],
    ["05", "Handover", "Pemeriksaan hasil dan penyelesaian sebelum serah terima."],
  ];
  return (
    <section className="bg-[#29292B] py-16 text-white lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.3fr_0.7fr]">
          <SectionHeading eyebrow="How we work" title="A practical project workflow." light />
          <div className="grid gap-[1px] bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {items.map(([num, title, body]) => (
              <div key={num} className="bg-[#29292B] px-5 py-6">
                <span className="text-[28px] font-black text-[#F26422]">{num}</span>
                <h3 className="mt-5 text-[14px] font-extrabold">{title}</h3>
                <p className="mt-2 text-[11px] leading-6 text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Projects({ data }: { data: PublicOverviewData }) {
  const items = data.projects.map(asRecord).slice(0, 5);
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Latest projects" title="Selected work." description="Portfolio berikut menunjukkan cara Lunar membawa keputusan ruang, material, detail, dan penyelesaian ke hasil proyek yang bisa dilihat secara nyata." />
          <Link href="/projects" className="inline-flex h-11 shrink-0 items-center gap-3 bg-[#29292B] px-5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white hover:bg-[#F26422]">All projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Project ${index + 1}`);
            const image = pickImage(item, index % 2 ? neutralImage(title) : surfaceImage(title));
            const location = joinLocation(item) || pickText(item, ["category", "projectType"], "Project");
            const className = index === 0 ? "lg:col-span-6 lg:row-span-2" : index < 3 ? "lg:col-span-3" : "lg:col-span-6";
            return (
              <Link key={`${title}-${index}`} href={slugToHref("/projects", item, "/projects")} className={`group relative min-h-[260px] overflow-hidden ${className}`}>
                <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">{location}</p>
                  <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em]">{title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Team({ data }: { data: PublicOverviewData }) {
  const people = data.team.map(asRecord).slice(0, 4);
  if (!people.length) return null;
  return (
    <section className="bg-[#F6F6F4] py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Leadership" title="People responsible for the work." />
          <p className="max-w-[480px] text-[13px] leading-7 text-zinc-500">Struktur tim dibuat jelas agar klien tahu siapa yang mengarahkan keputusan dan siapa yang menjaga koordinasi proyek.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((person, index) => {
            const name = pickText(person, ["name", "title"], `Team ${index + 1}`);
            const role = pickText(person, ["role", "position"], "Team member");
            const image = pickImage(person, "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=85");
            return (
              <article key={name}>
                <img src={image} alt={name} className="h-[320px] w-full object-cover object-top" />
                <h3 className="mt-4 text-[15px] font-extrabold text-[#29292B]">{name}</h3>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#F26422]">{role}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Testimonial({ data }: { data: PublicOverviewData }) {
  const item = asRecord(data.testimonials[0]);
  const quote = pickText(item, ["quote", "message", "content", "testimonial"], "Tim Lunar menjaga komunikasi dan progres pekerjaan tetap jelas sehingga keputusan proyek lebih mudah diikuti dari awal sampai penyelesaian.");
  const name = pickText(item, ["authorName", "clientName", "name"], "Project Client");
  const role = pickText(item, ["authorRole", "company", "role"], "Client");
  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        <div className="grid border-y border-black/8 py-12 lg:grid-cols-[0.25fr_0.75fr]">
          <Eyebrow>Client feedback</Eyebrow>
          <div>
            <blockquote className="max-w-[780px] text-[24px] font-bold leading-[1.4] tracking-[-0.025em] text-[#29292B] sm:text-[30px]">“{quote}”</blockquote>
            <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#F26422]">{name} · {role}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ReferenceHome({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  return (
    <div className="bg-white text-[#29292B]">
      <Hero context={context} data={data} />
      <CompanyIntro />
      <Services data={data} />
      <QuickInquiry context={context} />
      <WhyUs />
      <DarkProcess />
      <Projects data={data} />
      <Team data={data} />
      <Testimonial data={data} />
    </div>
  );
}
