import Link from "next/link";

import { ArrowRight, ChevronRight, Mail, MapPin, Phone, Quote, Star } from "lucide-react";

import type { HydratedCmsSection, PublicPageContext } from "@/features/public-site/public-site.types";

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

function SectionShell({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "light" | "dark" | "ivory";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[#0C0C0B] text-white"
      : tone === "ivory"
        ? "bg-[#F6F1EA] text-zinc-950"
        : "bg-white text-zinc-950";

  return (
    <section className={`${toneClass}`}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl">
          {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B88B5A]">{eyebrow}</p> : null}
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
          {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-current/70 sm:text-base">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function SectionHero({ context, pageKey, section }: { context: PublicPageContext; pageKey: PageKey; section: HydratedCmsSection }) {
  const content = section.content;
  const title =
    sectionContentText(
      content,
      "title",
      pageKey === "home"
        ? "Architecture, interior, and construction delivered with technical clarity."
        : `${context.page?.title || "Lunar Konstruksi"}`,
    );
  const eyebrow = sectionContentText(content, "eyebrow", pageKey === "home" ? "Design & Build" : context.page?.title || "Lunar Konstruksi");
  const description = sectionContentText(
    content,
    "description",
    pageKey === "home"
      ? "Lunar Konstruksi membantu klien merancang, membangun, dan menyempurnakan ruang dengan proses yang jelas, komunikasi yang rapi, dan eksekusi yang terukur."
      : "Pendekatan yang bersih, teknis, dan fokus pada hasil yang relevan dengan kebutuhan ruang serta operasional klien.",
  );
  const ctaLabel = sectionContentText(content, "ctaLabel", pageKey === "contact" ? "Send project inquiry" : "Explore our work");
  const ctaHref = sectionContentText(content, "ctaHref", pageKey === "home" ? "/projects" : "/contact");
  const imageUrl = sectionContentText(content, "imageUrl", surfaceImage(`${context.settings.identity.companyName}-${pageKey}`));

  const statCards = [
    { label: "Years of experience", value: sectionContentText(content, "statOneValue", "08+") },
    { label: "Projects completed", value: sectionContentText(content, "statTwoValue", "120+") },
    { label: "Client satisfaction", value: sectionContentText(content, "statThreeValue", "98%") },
    { label: "Design-build focus", value: sectionContentText(content, "statFourValue", "Integrated") },
  ];

  return (
    <section className="bg-[#0B0B0A] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8 lg:px-8 lg:py-18">
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C7A878]">{eyebrow}</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-[#FAF6F0] sm:text-5xl lg:text-7xl lg:leading-[1.02]">{title}</h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-white/75 sm:text-base">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={ctaHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#B88B5A] px-6 text-sm font-medium text-[#16120F] transition hover:bg-[#C79964]">
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="inline-flex min-h-12 items-center rounded-full border border-white/10 px-6 text-sm font-medium text-white/90 transition hover:bg-white/8">
              View services
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#171412] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
          <img src={imageUrl} alt={title} className="h-[520px] w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,12,11,0.78)_0%,rgba(12,12,11,0.28)_42%,rgba(184,139,90,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-semibold tracking-tight text-[#F3E6D4]">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "A focused partner for spaces that must work as well as they look.");
  const description = sectionContentText(
    content,
    "description",
    "Kami tidak mengejar kemewahan kosong. Fokus Lunar ada pada ruang yang matang secara fungsi, rapi secara detail, dan relevan dengan kebutuhan klien dari tahap konsep sampai penyelesaian.",
  );
  const points = readList(content.points).length
    ? readList(content.points)
    : [
        "Design, build, and project coordination dalam satu alur kerja yang jelas.",
        "Komunikasi, dokumentasi, dan keputusan teknis dibuat ringkas dan transparan.",
        "Kualitas ruang dipikirkan bersama efisiensi eksekusi di lapangan.",
      ];

  return (
    <SectionShell eyebrow="Approach" title={title} description={description} tone="ivory">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          <img src={neutralImage(title)} alt={title} className="h-[420px] w-full object-cover" />
        </div>
        <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="space-y-5">
            {points.map((point, index) => (
              <div key={`${point}-${index}`} className="flex gap-4 border-b border-black/6 pb-5 last:border-none last:pb-0">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFE2D4] text-xs font-semibold text-[#8D6A47]">
                  0{index + 1}
                </span>
                <p className="text-sm leading-7 text-zinc-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function SectionStats({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const items = readArray<Record<string, unknown>>(content.items);
  const stats = items.length
    ? items.map((item) => ({ value: readString(item.value, "0"), label: readString(item.label, "Metric") }))
    : [
        { value: readString(content.statOneValue, "08+"), label: "Years of practice" },
        { value: readString(content.statTwoValue, "120+"), label: "Projects delivered" },
        { value: readString(content.statThreeValue, "98%"), label: "Client satisfaction" },
        { value: readString(content.statFourValue, "End-to-end"), label: "Integrated workflow" },
      ];

  return (
    <SectionShell eyebrow="Credentials" title="Measured by delivery, not by promises." description="Angka berikut membantu menggambarkan kapasitas kerja, pengalaman lapangan, dan kualitas koordinasi proyek Lunar." tone="light">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-black/8 bg-[#0F0F0E] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <p className="text-4xl font-semibold tracking-tight text-[#F3E6D4]">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{item.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function SectionServices({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);

  return (
    <SectionShell eyebrow="Services" title="Integrated solutions from planning to execution." description="Layanan disusun untuk menjawab kebutuhan ruang secara menyeluruh — bukan sekadar daftar pekerjaan terpisah." tone="light">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/8 bg-[#0F0F0E] p-7 text-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C7A878]">End-to-end support</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAF6F0]">Strategi ruang, dokumentasi, dan eksekusi yang bergerak dalam satu arah.</h3>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Kami menyatukan desain, koordinasi, dan pekerjaan lapangan agar keputusan penting tidak terputus di tengah proses.
          </p>
          <Link href="/contact" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#B88B5A]/45 px-5 text-sm font-medium text-[#F3E6D4] transition hover:bg-[#B88B5A] hover:text-[#16120F]">
            Discuss your project
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Service ${index + 1}`);
            const summary = pickText(item, ["summary", "excerpt", "description", "shortDescription"], "Deskripsi layanan akan ditampilkan di sini.");
            const href = slugToHref("/services", item, "/services");
            return (
              <article key={`${title}-${index}`} className="group rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE2D4] text-sm font-semibold text-[#8D6A47]">0{index + 1}</span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-zinc-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{summary}</p>
                <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 transition group-hover:text-[#8D6A47]">
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function SectionProcess({ section }: { section: HydratedCmsSection }) {
  const content = section.content;
  const items = readArray<Record<string, unknown>>(content.items);
  const steps = items.length
    ? items.map((item, index) => ({
        title: readString(item.title, `Step ${index + 1}`),
        description: readString(item.description, ""),
      }))
    : [
        { title: "Consult", description: "Memahami kebutuhan ruang, target penggunaan, prioritas anggaran, dan konteks proyek." },
        { title: "Draft", description: "Menyusun konsep, layout, dan arah visual yang cukup jelas untuk dibahas secara teknis." },
        { title: "Develop", description: "Mematangkan detail, material, dan keputusan teknis agar siap diterjemahkan ke tahap berikutnya." },
        { title: "Document", description: "Merapikan dokumen kerja, gambar, dan kebutuhan koordinasi agar pelaksanaan tetap terkontrol." },
        { title: "Deliver", description: "Menjalankan pekerjaan dan penutupan proyek dengan perhatian pada kualitas akhir serta pengalaman pengguna ruang." },
      ];

  return (
    <SectionShell eyebrow="Process" title="A clean workflow from concept to completion." description="Setiap tahap dirancang untuk membantu klien melihat progres, keputusan, dan risiko proyek secara lebih terang." tone="ivory">
      <div className="grid gap-4 lg:grid-cols-5">
        {steps.map((step, index) => (
          <article key={`${step.title}-${index}`} className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE2D4] text-sm font-semibold text-[#8D6A47]">0{index + 1}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Stage</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{step.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function SectionProjects({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  const featured = items.slice(0, 6);

  return (
    <SectionShell eyebrow="Projects" title="Selected work that reflects our design-build language." description="Koleksi proyek dipilih untuk menunjukkan cara Lunar menyeimbangkan estetika, kebutuhan fungsi, dan kedisiplinan eksekusi." tone="light">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[2rem] border border-black/8 bg-[#121211] p-7 text-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <p className="text-sm leading-7 text-white/70">
            Portfolio Lunar bukan tentang jumlah gambar, tetapi tentang cara kami merancang ruang yang masuk akal untuk dipakai, dibangun, dan dirawat.
          </p>
          <Link href="/projects" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#B88B5A] px-5 text-sm font-medium text-[#16120F] transition hover:bg-[#C79964]">
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((item, index) => {
            const title = pickText(item, ["title", "name"], `Project ${index + 1}`);
            const image = pickImage(item, surfaceImage(title));
            const href = slugToHref("/projects", item, "/projects");
            const location = joinLocation(item);
            return (
              <article key={`${title}-${index}`} className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                <div className="relative">
                  <img src={image} alt={title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_25%,rgba(15,23,42,0.55)_100%)]" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{location || pickText(item, ["category", "projectType"], "Project detail")}</p>
                    </div>
                    <Link href={href} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-zinc-900 transition hover:bg-zinc-950 hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function SectionTeam({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <SectionShell eyebrow="Team" title="The people behind the process." description="Tim yang baik membantu keputusan bergerak lebih cepat, koordinasi lebih rapi, dan hasil akhir lebih terjaga." tone="ivory">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => {
          const name = pickText(item, ["name", "title"], `Team ${index + 1}`);
          const role = pickText(item, ["role", "position"], "Team member");
          const image = pickImage(item, neutralImage(name));
          return (
            <article key={`${name}-${index}`} className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <img src={image} alt={name} className="h-72 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{role}</p>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function SectionTestimonials({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <SectionShell eyebrow="Testimonials" title="What clients remember after the project is delivered." description="Kepercayaan dibangun lewat proses yang tenang, respons yang jelas, dan hasil yang bisa dipertanggungjawabkan." tone="dark">
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item, index) => {
          const quote = pickText(item, ["quote", "message", "content", "testimonial"], "Pengalaman kerja akan tampil di sini.");
          const name = pickText(item, ["authorName", "name", "clientName"], `Client ${index + 1}`);
          const role = pickText(item, ["authorRole", "company", "role"], "Client");
          return (
            <article key={`${name}-${index}`} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm">
              <Quote className="h-7 w-7 text-[#D8B07A]" />
              <p className="mt-5 text-sm leading-7 text-white/78">“{quote}”</p>
              <div className="mt-6 flex items-center gap-3 text-sm text-white/72">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1714] text-[#E6C699]">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">{role}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function SectionFaq({ section }: { section: HydratedCmsSection }) {
  const items = section.data.map(asRecord);
  return (
    <SectionShell eyebrow="FAQ" title="Questions we often receive before a project begins." description="Ringkasan ini membantu calon klien memahami cara Lunar bekerja, ruang lingkup layanan, dan ekspektasi awal sebelum diskusi lebih lanjut." tone="light">
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => {
          const question = pickText(item, ["question", "title"], `Question ${index + 1}`);
          const answer = pickText(item, ["answer", "description", "content"], "Jawaban akan muncul di sini.");
          return (
            <article key={`${question}-${index}`} className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.04)]">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{answer}</p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function SectionCta({ context, section }: { context: PublicPageContext; section: HydratedCmsSection }) {
  const content = section.content;
  const title = sectionContentText(content, "title", "Ready to move the project forward with more structure?");
  const description = sectionContentText(
    content,
    "description",
    "Jika kamu membutuhkan partner yang bisa merapikan arah desain, dokumentasi, koordinasi, dan eksekusi, tim Lunar siap memulai dari diskusi kebutuhan yang paling mendasar terlebih dahulu.",
  );
  const primaryLabel = sectionContentText(content, "ctaLabel", "Start your project");
  const primaryHref = sectionContentText(content, "ctaHref", "/contact");
  const secondaryLabel = sectionContentText(content, "secondaryCtaLabel", "Browse projects");
  const secondaryHref = sectionContentText(content, "secondaryCtaHref", "/projects");
  const imageUrl = sectionContentText(content, "imageUrl", neutralImage(title));

  return (
    <section className="bg-[#0B0B0A] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#131210] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.24)] sm:p-10 lg:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C7A878]">Next conversation</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#FAF6F0] sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/72 sm:text-base">{description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={primaryHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#B88B5A] px-6 text-sm font-medium text-[#16120F] transition hover:bg-[#C79964]">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={secondaryHref} className="inline-flex min-h-12 items-center rounded-full border border-white/10 px-6 text-sm font-medium text-white/90 transition hover:bg-white/8">
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#161311] shadow-[0_32px_80px_rgba(0,0,0,0.24)]">
          <img src={imageUrl} alt={title} className="h-full min-h-[320px] w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function ContactInformation({ context }: { context: PublicPageContext }) {
  const { contact } = context.settings;

  return (
    <section className="bg-[#F6F1EA] text-zinc-950">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:py-24">
        <div className="space-y-6 rounded-[2rem] border border-black/8 bg-[#0F0F0E] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C7A878]">Direct contact</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#FAF6F0] sm:text-4xl">Tell us what needs to be built, improved, or clarified.</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Sebelum masuk ke tahap detail, biasanya kami perlu memahami tipe proyek, konteks lokasi, target hasil, dan hal-hal yang ingin kamu prioritaskan.
            </p>
          </div>

          <div className="space-y-4">
            {contact.email ? (
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Mail className="mt-1 h-5 w-5 text-[#E6C699]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Email</p>
                  <p className="mt-1 text-sm text-white/85">{contact.email}</p>
                </div>
              </div>
            ) : null}
            {contact.phone ? (
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Phone className="mt-1 h-5 w-5 text-[#E6C699]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Phone</p>
                  <p className="mt-1 text-sm text-white/85">{contact.phone}</p>
                </div>
              </div>
            ) : null}
            {[contact.address, contact.city, contact.province].filter(Boolean).length ? (
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <MapPin className="mt-1 h-5 w-5 text-[#E6C699]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Location</p>
                  <p className="mt-1 text-sm leading-7 text-white/85">{[contact.address, contact.city, contact.province].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <PublicContactForm settings={{ whatsapp: contact.whatsapp, email: contact.email, phone: contact.phone }} />
      </div>
    </section>
  );
}

export function PublicPageRenderer({ context, pageKey }: { context: PublicPageContext; pageKey: PageKey }) {
  const sections = context.sections;

  return (
    <div className="bg-white text-zinc-950">
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <SectionHero key={section.id} context={context} pageKey={pageKey} section={section} />;
          case "intro":
            return <SectionIntro key={section.id} section={section} />;
          case "stats":
            return <SectionStats key={section.id} section={section} />;
          case "services":
            return <SectionServices key={section.id} section={section} />;
          case "process":
            return <SectionProcess key={section.id} section={section} />;
          case "projects":
            return <SectionProjects key={section.id} section={section} />;
          case "team":
            return <SectionTeam key={section.id} section={section} />;
          case "testimonials":
            return <SectionTestimonials key={section.id} section={section} />;
          case "faq":
            return <SectionFaq key={section.id} section={section} />;
          case "cta":
            return <SectionCta key={section.id} context={context} section={section} />;
          case "gallery":
            return <SectionProjects key={section.id} section={{ ...section, data: section.data.length ? section.data : [] }} />;
          default:
            return null;
        }
      })}

      {pageKey === "contact" ? <ContactInformation context={context} /> : null}
    </div>
  );
}
