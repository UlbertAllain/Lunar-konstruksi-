"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Quote,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { usePublicOverview } from "./use-public-overview";

export default function HomePage() {
  const { data } = usePublicOverview();
  const featuredServices = data.services.filter((item) => item.isFeatured).slice(0, 4);
  const services = featuredServices.length ? featuredServices : data.services.slice(0, 4);
  const featuredProjects = data.projects.filter((item) => item.isFeatured).slice(0, 3);
  const projects = featuredProjects.length ? featuredProjects : data.projects.slice(0, 3);
  const heroProject = projects[0] ?? data.projects[0];

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-slate-300">
          <div className="absolute inset-0 site-hero-grid opacity-40" />
          <div className="site-container relative grid min-h-[760px] items-stretch lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between border-slate-300 py-16 lg:border-r lg:py-20 lg:pr-12">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-orange-600" />
                  <span className="site-kicker text-slate-600">Construction / Renovation / Project Control</span>
                </div>
                <h1 className="mt-10 max-w-4xl text-[clamp(3.6rem,7vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                  Build with
                  <span className="block text-orange-600">clarity.</span>
                </h1>
                <p className="mt-9 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Lunar Konstruksi merancang dan membangun ruang melalui proses yang transparan, keputusan teknis yang terukur, dan eksekusi lapangan yang disiplin.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/contact" className="site-button-dark">Diskusikan Proyek <ArrowUpRight size={17} /></Link>
                  <Link href="/projects" className="site-button-light">Lihat Portfolio <ArrowRight size={17} /></Link>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-300 bg-slate-300">
                {[
                  ["08+", "Tahun pengalaman"],
                  [`${data.projects.length}+`, "Project terdokumentasi"],
                  ["100%", "Proses terukur"],
                ].map(([value, label]) => (
                  <div key={label} className="bg-[#f4f1ea] p-4 sm:p-5">
                    <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
                    <p className="mt-2 text-[10px] uppercase leading-4 tracking-[0.14em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-end py-10 lg:pl-10 lg:py-20">
              <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-900 shadow-2xl shadow-slate-950/15">
                {heroProject ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroProject.coverImage.url} alt={heroProject.title} className="h-[560px] w-full object-cover opacity-90" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/5 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">Selected work</div>
                {heroProject ? (
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-orange-400">{heroProject.location} · {heroProject.year}</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{heroProject.title}</h2>
                      </div>
                      <Link href={`/projects/${heroProject.slug}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition hover:bg-orange-400"><ArrowUpRight /></Link>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="absolute -left-2 top-28 hidden -rotate-90 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 lg:block">Coordinates / Indonesia</div>
            </div>
          </div>
        </section>

        <section id="services" className="site-section">
          <div className="site-container">
            <div className="site-heading-grid">
              <div>
                <span className="site-kicker">01 / Services</span>
                <h2 className="site-title mt-5">Satu tim untuk keputusan teknis dan eksekusi.</h2>
              </div>
              <p className="site-lead">Kami menyusun layanan sebagai sistem kerja yang saling terhubung—bukan daftar pekerjaan terpisah—agar kualitas desain, biaya, waktu, dan pelaksanaan tetap searah.</p>
            </div>

            <div className="mt-14 border-t border-slate-300">
              {services.map((service, index) => (
                <Link key={service.id ?? service.slug} href={`/services/${service.slug}`} className="group grid gap-6 border-b border-slate-300 py-7 transition hover:bg-white/50 sm:grid-cols-[70px_1fr_auto] sm:items-center sm:px-4">
                  <span className="font-mono text-xs text-orange-600">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{service.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{service.shortDescription}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 transition group-hover:rotate-45 group-hover:border-orange-500 group-hover:bg-orange-500"><ArrowUpRight size={18} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#15181e] py-20 text-white sm:py-28">
          <div className="site-container">
            <div className="site-heading-grid border-b border-white/10 pb-12">
              <div>
                <span className="site-kicker text-orange-400">02 / How we work</span>
                <h2 className="site-title mt-5 text-white">Proses yang bisa dilihat, diuji, dan dipertanggungjawabkan.</h2>
              </div>
              <p className="site-lead text-slate-400">Setiap tahap memiliki keluaran yang jelas. Anda mengetahui apa yang sedang dikerjakan, keputusan apa yang dibutuhkan, dan dampaknya terhadap proyek.</p>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
              {[
                [Ruler, "Survey & Brief", "Memahami kondisi lokasi, kebutuhan, risiko, dan prioritas."],
                [Sparkles, "Design & Plan", "Menyusun solusi teknis, visual, biaya, dan tahapan kerja."],
                [ShieldCheck, "Build & Control", "Menjalankan konstruksi dengan kontrol mutu dan dokumentasi."],
                [Check, "Handover", "Pemeriksaan akhir, penyelesaian catatan, dan serah terima."],
              ].map(([Icon, title, description], index) => {
                const IconComponent = Icon as typeof Ruler;
                return (
                  <div key={title as string} className="bg-[#15181e] p-6 sm:p-8">
                    <div className="flex items-center justify-between"><IconComponent className="text-orange-400" /><span className="font-mono text-xs text-slate-600">0{index + 1}</span></div>
                    <h3 className="mt-14 text-lg font-semibold">{title as string}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{description as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="site-section">
          <div className="site-container">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="site-kicker">03 / Selected projects</span>
                <h2 className="site-title mt-5 max-w-3xl">Portfolio yang menunjukkan cara kami berpikir dan membangun.</h2>
              </div>
              <Link href="/projects" className="site-button-light self-start sm:self-auto">Semua Project <ArrowRight size={17} /></Link>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-12">
              {projects.map((project, index) => (
                <Link key={project.id ?? project.slug} href={`/projects/${project.slug}`} className={`group relative overflow-hidden rounded-[26px] bg-slate-900 ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage.url} alt={project.title} className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${index === 0 ? "h-[560px]" : "h-[400px]"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-orange-300"><MapPin size={13} /> {project.location} · {project.year}</p>
                    <div className="mt-3 flex items-end justify-between gap-4"><h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h3><ArrowUpRight className="transition group-hover:rotate-45" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-300 bg-white/45 py-20 sm:py-24">
          <div className="site-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className="site-kicker">04 / Client voice</span>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em]">Kepercayaan dibangun dari proses yang konsisten.</h2>
              <Quote className="mt-10 text-orange-600" size={42} strokeWidth={1.5} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.testimonials.slice(0, 4).map((testimonial) => (
                <article key={testimonial.id ?? testimonial.clientName} className="rounded-2xl border border-slate-300 bg-[#f4f1ea] p-6">
                  <div className="text-sm tracking-[0.2em] text-orange-600">{"★".repeat(testimonial.rating)}</div>
                  <p className="mt-6 text-lg leading-8 text-slate-800">“{testimonial.message}”</p>
                  <div className="mt-8 border-t border-slate-300 pt-4">
                    <p className="font-semibold">{testimonial.clientName}</p>
                    <p className="mt-1 text-xs text-slate-500">{testimonial.clientPosition || testimonial.projectName || "Klien Lunar Konstruksi"}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="site-section">
          <div className="site-container">
            <div className="site-heading-grid">
              <div><span className="site-kicker">05 / Team</span><h2 className="site-title mt-5">Orang yang mengawal detail di balik setiap hasil.</h2></div>
              <p className="site-lead">Kolaborasi lintas fungsi memastikan keputusan desain tetap dapat dibangun, dan pekerjaan lapangan tetap sesuai intensi awal.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.team.slice(0, 6).map((member) => (
                <article key={member.id ?? member.name} className="group">
                  <div className="overflow-hidden rounded-[24px] bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.photo.url} alt={member.name} className="h-[420px] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div><h3 className="text-xl font-semibold">{member.name}</h3><p className="mt-1 text-sm text-slate-500">{member.position}</p></div>
                    <ArrowDownRight className="text-orange-600" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-orange-500 py-20 text-slate-950 sm:py-24">
          <div className="site-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div><span className="site-kicker">06 / FAQ</span><h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em]">Pertanyaan sebelum memulai.</h2></div>
            <div className="border-t border-slate-950/20">
              {data.faqs.slice(0, 8).map((faq, index) => (
                <details key={faq.id ?? faq.question} className="group border-b border-slate-950/20 py-5">
                  <summary className="flex cursor-pointer list-none items-start gap-5 font-semibold"><span className="font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span><span className="flex-1 text-lg">{faq.question}</span><span className="text-2xl transition group-open:rotate-45">+</span></summary>
                  <p className="ml-11 mt-4 max-w-2xl text-sm leading-7 text-slate-800">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
