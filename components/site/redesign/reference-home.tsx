import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  DraftingCompass,
  HardHat,
  MessageSquareQuote,
  ShieldCheck,
  Users2,
  Wrench,
} from "lucide-react";

import type { PublicOverviewData, PublicPageContext } from "@/modules/public-site/public-site.types";

import { PublicContactForm } from "./public-contact-form";
import {
  asRecord,
  initials,
  joinLocation,
  pickImage,
  pickText,
  slugToHref,
  technicalPlaceholder,
} from "./public-helpers";

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1220px] px-5 sm:px-7 lg:px-8 ${className}`}>{children}</div>;
}

function MicroLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${light ? "text-white/45" : "text-zinc-400"}`}>
      {children}
    </p>
  );
}

function SectionTitle({ label, title, copy, center = false }: { label: string; title: string; copy?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-[720px] text-center" : "max-w-[620px]"}>
      <MicroLabel>{label}</MicroLabel>
      <h2 className="mt-3 text-[34px] font-black uppercase leading-[0.98] tracking-[-0.055em] text-[#161616] sm:text-[45px]">{title}</h2>
      {copy ? <p className="mt-4 text-[13px] leading-7 text-zinc-500">{copy}</p> : null}
    </div>
  );
}

function projectTitle(item: Record<string, unknown>, index: number) {
  return pickText(item, ["title", "name", "projectName"], `Project ${index + 1}`);
}

function projectImage(item: Record<string, unknown>, title: string) {
  return pickImage(item, technicalPlaceholder(title, "dark"));
}

function teamImage(item: Record<string, unknown>, name: string) {
  return pickImage(item, technicalPlaceholder(name, "light"));
}

function Hero({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  const project = asRecord(data.projects[0]);
  const heroSection = context.sections.find((section) => section.type === "hero");
  const content = heroSection?.content ?? {};
  const title = typeof content.title === "string" && content.title.trim()
    ? content.title.trim()
    : "Build, renovate, and improve spaces with a clear construction process.";
  const description = typeof content.description === "string" && content.description.trim()
    ? content.description.trim()
    : "Lunar Konstruksi menangani proyek konstruksi, renovasi, interior, dan koordinasi pekerjaan dengan alur yang jelas dari pembahasan awal sampai serah terima.";
  const cmsImage = typeof content.imageUrl === "string" && content.imageUrl.trim() ? content.imageUrl.trim() : "";
  const image = pickImage(project, cmsImage || technicalPlaceholder(projectTitle(project, 0), "dark"));

  const stats = [
    { value: String(data.projects.length).padStart(2, "0"), label: "Published projects" },
    { value: String(data.services.length).padStart(2, "0"), label: "Active services" },
    { value: String(data.team.length).padStart(2, "0"), label: "Team profiles" },
  ];

  return (
    <section className="bg-[#F3F3F0] pb-16 pt-6 lg:pb-24 lg:pt-8">
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[#0A0A0A] text-white shadow-[0_30px_80px_rgba(0,0,0,0.14)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[500px] flex-col justify-between overflow-hidden p-7 sm:p-10 lg:min-h-[590px] lg:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7200]" />
                  <MicroLabel light>Construction / renovation / interior</MicroLabel>
                </div>
                <h1 className="mt-7 max-w-[590px] text-[43px] font-black uppercase leading-[0.91] tracking-[-0.065em] sm:text-[60px] lg:text-[70px]">{title}</h1>
                <p className="mt-6 max-w-[510px] text-[13px] leading-7 text-white/57">{description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Link href="/projects" className="inline-flex h-11 items-center gap-3 bg-[#FF7200] px-5 text-[9px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#e96700]">
                    View projects <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex h-11 items-center border border-white/18 px-5 text-[9px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black">
                    Start discussion
                  </Link>
                </div>
              </div>

              <div className="relative mt-12 flex flex-wrap gap-7 border-t border-white/10 pt-6">
                {stats.map((item) => (
                  <div key={item.label}>
                    <p className="text-[25px] font-black tracking-[-0.05em]">{item.value}</p>
                    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/35">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px] bg-[#151515] lg:min-h-[590px]">
              <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.12)_55%,rgba(0,0,0,0.65))]" />
              <div className="absolute left-6 top-6 bg-white px-4 py-3 text-black sm:left-8 sm:top-8">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-400">Current highlight</p>
                <p className="mt-1 max-w-[230px] text-[13px] font-black uppercase tracking-[-0.02em]">{projectTitle(project, 0)}</p>
              </div>
              <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-[1px] bg-white/15 sm:bottom-8 sm:right-8">
                <div className="bg-black/75 px-5 py-4 backdrop-blur-sm">
                  <p className="text-[22px] font-black text-white">{String(data.projects.length).padStart(2, "0")}</p>
                  <p className="text-[7px] font-black uppercase tracking-[0.14em] text-white/40">Projects</p>
                </div>
                <div className="bg-[#FF7200] px-5 py-4">
                  <p className="text-[22px] font-black text-white">{String(data.services.length).padStart(2, "0")}</p>
                  <p className="text-[7px] font-black uppercase tracking-[0.14em] text-white/70">Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BuiltForClients({ data }: { data: PublicOverviewData }) {
  const visualProject = asRecord(data.projects[1] ?? data.projects[0]);
  const title = projectTitle(visualProject, 1);
  const image = projectImage(visualProject, title);
  const metrics = [
    [String(data.projects.length), "Projects available"],
    [String(data.services.length), "Service scopes"],
    [String(data.team.length), "Team profiles"],
  ];

  return (
    <section className="bg-white py-18 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="grid grid-cols-[0.72fr_0.28fr] gap-3">
            <div className="overflow-hidden rounded-[18px] bg-[#ECEBE8]">
              <img src={image} alt={title} className="h-[360px] w-full object-cover" />
            </div>
            <div className="flex flex-col justify-between gap-3">
              <div className="rounded-[16px] bg-[#101010] p-4 text-white">
                <MicroLabel light>Database</MicroLabel>
                <p className="mt-7 text-[36px] font-black tracking-[-0.06em]">{String(data.projects.length).padStart(2, "0")}</p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/40">Published work</p>
              </div>
              <div className="rounded-[16px] bg-[#FF7200] p-4 text-white">
                <CheckCircle2 className="h-5 w-5" />
                <p className="mt-10 text-[10px] font-black uppercase leading-5 tracking-[0.08em]">CMS content is used directly on the public site.</p>
              </div>
            </div>
          </div>

          <div className="lg:pl-10">
            <MicroLabel>About Lunar</MicroLabel>
            <h2 className="mt-4 max-w-[650px] text-[38px] font-black uppercase leading-[0.98] tracking-[-0.055em] text-[#161616] sm:text-[50px]">Built for clients who want decisions, progress, and responsibility to stay visible.</h2>
            <p className="mt-5 max-w-[620px] text-[13px] leading-7 text-zinc-500">Lunar menghubungkan kebutuhan desain dengan pekerjaan lapangan. Scope, komunikasi, media proyek, dan konten perusahaan dikelola dari CMS supaya website menampilkan data yang benar-benar dimiliki bisnis.</p>
            <div className="mt-8 grid grid-cols-3 border-y border-black/8 py-6">
              {metrics.map(([value, label], index) => (
                <div key={label} className={index ? "border-l border-black/8 pl-5" : "pr-5"}>
                  <p className="text-[28px] font-black tracking-[-0.05em] text-[#161616]">{value}</p>
                  <p className="mt-1 text-[8px] font-black uppercase tracking-[0.13em] text-zinc-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProjectBrowser({ data }: { data: PublicOverviewData }) {
  const projects = data.projects.map(asRecord).slice(0, 5);
  if (!projects.length) return null;
  const lead = projects[0];
  const leadTitle = projectTitle(lead, 0);
  const leadImage = projectImage(lead, leadTitle);

  return (
    <section className="bg-[#F3F3F0] py-20 lg:py-24">
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[#090909] text-white">
          <div className="grid lg:grid-cols-[0.44fr_0.56fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <MicroLabel light>Selected projects</MicroLabel>
                <h2 className="mt-4 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-[55px]">Browse our latest work.</h2>
                <p className="mt-5 max-w-[430px] text-[12px] leading-7 text-white/50">Setiap project card di bawah berasal dari koleksi Projects yang sudah published. Gambar yang tampil adalah media yang tersimpan pada record project tersebut.</p>
                <Link href="/projects" className="mt-7 inline-flex h-10 items-center gap-3 bg-white px-4 text-[8px] font-black uppercase tracking-[0.15em] text-black transition hover:bg-[#FF7200] hover:text-white">Browse all <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>

              <div className="mt-10 space-y-2">
                {projects.slice(1).map((item, index) => {
                  const title = projectTitle(item, index + 1);
                  const image = projectImage(item, title);
                  return (
                    <Link href={slugToHref("/projects", item, "/projects")} key={`${title}-${index}`} className="group flex items-center gap-3 border-t border-white/10 py-3">
                      <img src={image} alt={title} className="h-12 w-16 shrink-0 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-black uppercase tracking-[0.03em] text-white/85">{String(index + 2).padStart(2, "0")} — {title}</p>
                        <p className="mt-1 truncate text-[8px] uppercase tracking-[0.1em] text-white/30">{joinLocation(item) || pickText(item, ["category", "projectType"], "Project")}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#FF7200] transition group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link href={slugToHref("/projects", lead, "/projects")} className="group relative min-h-[510px] overflow-hidden lg:min-h-[620px]">
              <img src={leadImage} alt={leadTitle} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#FF9B55]">Featured project</p>
                <h3 className="mt-2 max-w-[560px] text-[30px] font-black uppercase leading-[0.96] tracking-[-0.05em] sm:text-[40px]">{leadTitle}</h3>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/45">{joinLocation(lead) || pickText(lead, ["category", "projectType"], "Project detail")}</p>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

const capabilityIcons = [Building2, DraftingCompass, HardHat, Wrench, ShieldCheck, CircleDollarSign];

function Capabilities({ data }: { data: PublicOverviewData }) {
  const services = data.services.map(asRecord).slice(0, 6);
  if (!services.length) return null;
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr]">
          <SectionTitle label="Services" title="Everything we do is built around the project." copy="Data layanan diambil langsung dari Services collection. Tidak ada service card palsu yang dibuat hanya untuk memenuhi layout." />
          <div className="grid gap-[1px] bg-black/8 sm:grid-cols-2">
            {services.map((item, index) => {
              const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
              const summary = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Informasi layanan tersedia di halaman detail.");
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return (
                <Link key={`${title}-${index}`} href={slugToHref("/services", item, "/services")} className="group min-h-[230px] bg-[#F7F7F4] p-6 transition hover:bg-[#101010]">
                  <div className="flex items-start justify-between">
                    <Icon className="h-6 w-6 text-[#FF7200]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.13em] text-zinc-300 transition group-hover:text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-12 text-[19px] font-black uppercase leading-[1.05] tracking-[-0.04em] text-[#161616] transition group-hover:text-white">{title}</h3>
                  <p className="mt-3 line-clamp-3 text-[11px] leading-6 text-zinc-500 transition group-hover:text-white/45">{summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#FF7200]">View service <ArrowRight className="h-3.5 w-3.5" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function TeamDatabase({ data }: { data: PublicOverviewData }) {
  const team = data.team.map(asRecord).slice(0, 6);
  if (!team.length) return null;

  return (
    <section className="bg-[#F3F3F0] py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle label="Team" title="Actual people from the CMS." copy="Foto di section ini dibaca dari record Team. Jika record mempunyai media Cloudinary, media itu selalu diprioritaskan." />
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-[#FF7200]"><Users2 className="h-4 w-4" /> {team.length} active profiles</div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, index) => {
            const name = pickText(person, ["name", "title", "fullName"], `Team ${index + 1}`);
            const role = pickText(person, ["role", "position", "jobTitle"], "Team member");
            const image = teamImage(person, name);
            return (
              <article key={`${name}-${index}`} className="group overflow-hidden bg-white">
                <div className="relative h-[330px] overflow-hidden bg-[#E6E5E1]">
                  <img src={image} alt={name} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]" />
                  <span className="absolute bottom-3 left-3 bg-[#FF7200] px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white">{initials(name)}</span>
                </div>
                <div className="border-x border-b border-black/7 p-5">
                  <h3 className="text-[15px] font-black uppercase tracking-[-0.02em] text-[#161616]">{name}</h3>
                  <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-zinc-400">{role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ClientStories({ data }: { data: PublicOverviewData }) {
  const testimonials = data.testimonials.map(asRecord).slice(0, 4);
  if (!testimonials.length) return null;

  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[#0A0A0A] p-7 text-white sm:p-10 lg:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[630px]">
              <MicroLabel light>Client stories</MicroLabel>
              <h2 className="mt-4 text-[38px] font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-[50px]">Every review is attached to real testimonial data.</h2>
            </div>
            <MessageSquareQuote className="h-12 w-12 text-[#FF7200]" />
          </div>

          <div className="mt-10 grid gap-3 lg:grid-cols-4">
            {testimonials.map((item, index) => {
              const quote = pickText(item, ["quote", "message", "content", "testimonial"], "Testimonial content");
              const name = pickText(item, ["authorName", "clientName", "name"], `Client ${index + 1}`);
              const role = pickText(item, ["authorRole", "company", "role"], "Client");
              return (
                <article key={`${name}-${index}`} className="flex min-h-[240px] flex-col justify-between bg-white/[0.06] p-5">
                  <p className="text-[11px] leading-6 text-white/62">“{quote}”</p>
                  <div className="mt-8 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.06em]">{name}</p>
                    <p className="mt-1 text-[7px] font-black uppercase tracking-[0.13em] text-[#FF8D36]">{role}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-[1px] bg-white/10 sm:grid-cols-4">
            {[
              [data.projects.length, "Projects"],
              [data.services.length, "Services"],
              [data.team.length, "Team"],
              [data.testimonials.length, "Reviews"],
            ].map(([value, label]) => (
              <div key={String(label)} className="bg-[#0A0A0A] px-5 py-5">
                <p className="text-[26px] font-black tracking-[-0.05em]">{String(value).padStart(2, "0")}</p>
                <p className="mt-1 text-[7px] font-black uppercase tracking-[0.14em] text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Inquiry({ context }: { context: PublicPageContext }) {
  return (
    <section className="bg-[#F3F3F0] py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.36fr_0.64fr]">
          <div>
            <MicroLabel>Project inquiry</MicroLabel>
            <h2 className="mt-4 text-[38px] font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#161616] sm:text-[50px]">Let us clear things up before work starts.</h2>
            <p className="mt-5 text-[12px] leading-7 text-zinc-500">Form ini terhubung ke Leads Flow. Data inquiry tersimpan lebih dulu, lalu WhatsApp menjadi opsi follow-up.</p>
            <div className="mt-7 space-y-3">
              {["Scope dan kebutuhan awal", "Lokasi dan tipe proyek", "Jalur follow-up yang jelas"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500"><BadgeCheck className="h-4 w-4 text-[#FF7200]" />{item}</div>
              ))}
            </div>
          </div>
          <PublicContactForm settings={{ whatsapp: context.settings.contact.whatsapp, email: context.settings.contact.email, phone: context.settings.contact.phone }} />
        </div>
      </Container>
    </section>
  );
}

export function ReferenceHome({ context, data }: { context: PublicPageContext; data: PublicOverviewData }) {
  return (
    <div className="bg-white text-[#161616]">
      <Hero context={context} data={data} />
      <BuiltForClients data={data} />
      <ProjectBrowser data={data} />
      <Capabilities data={data} />
      <TeamDatabase data={data} />
      <ClientStories data={data} />
      <Inquiry context={context} />
    </div>
  );
}
