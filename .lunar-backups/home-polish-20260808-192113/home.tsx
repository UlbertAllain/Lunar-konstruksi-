import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, HeroMeasureCurve, MicroLabel, ProcessGuide, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA, localMediaAt } from "./local-assets";
import { DatabaseImage } from "./media";
import {
  distinctImages,
  projectModel,
  serviceModel,
  teamModel,
  testimonialModel,
  type SiteData,
} from "./data";

function metric(value: string, label: string) {
  return (
    <div className="min-w-[92px]">
      <p className={`${displayFont} text-[30px] font-black leading-none tracking-[-.035em] text-[#202829] sm:text-[34px]`}>{value}</p>
      <p className="mt-1 font-mono text-[8px] uppercase leading-4 tracking-[.12em] text-[#625e58]">{label}</p>
    </div>
  );
}

function uniqueVisual(candidates: string[], used: Set<string>) {
  for (const candidate of candidates) {
    if (!candidate || used.has(candidate)) continue;
    used.add(candidate);
    return candidate;
  }
  return "";
}

export function FormworkHome({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const services = data.services.map(serviceModel);
  const team = data.team.map(teamModel);
  const testimonials = data.testimonials.map(testimonialModel).filter((item) => item.quote);

  const projectImages = distinctImages(projects);
  const serviceImages = distinctImages(services);
  const teamImages = distinctImages(team);
  const localImages = LOCAL_MEDIA.decorative.filter(Boolean);
  const used = new Set<string>();

  // One-off storytelling visuals prefer local assets. Entity cards continue to use their own database media.
  const heroImage = uniqueVisual([LOCAL_MEDIA.hero, localImages[0], projectImages[0]], used);
  const heroInset = uniqueVisual([localImages[1], teamImages[0], projectImages[1]], used);
  const capabilityPrimary = uniqueVisual([localImages[2], serviceImages[0], projectImages[1]], used);
  const capabilitySecondary = uniqueVisual([localImages[3], projectImages[2], teamImages[1]], used);
  const capabilityDetail = uniqueVisual([localImages[4], serviceImages[1], teamImages[2]], used);

  const quote = testimonials[0];

  return (
    <div className="overflow-hidden bg-[#f2eee7] text-[#22292a]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d8d1c6]">
          <BlueprintLayer />
          <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[.79fr_1.21fr] lg:min-h-[850px]">
            <div className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
              <div className="max-w-[600px]">
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#e36c2f]" /><MicroLabel>General contracting / field coordination</MicroLabel></div>
                <h1 className={`${displayFont} mt-9 text-[clamp(3.15rem,5.55vw,5.9rem)] font-black uppercase leading-[.89] tracking-[-.048em] text-[#202829]`}>
                  Kami membangun dari dasar yang jelas.
                </h1>
                <div className="mt-7 h-px w-10 bg-[#e36c2f]" />
                <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-[#474c4b]">
                  Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan perlu bergerak dalam satu alur yang mudah dibaca—bukan saling mengejar di tengah proyek.
                </p>
                <Link href="/projects" className="mt-8 inline-flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#263033]">
                  Lihat pekerjaan kami <span className="h-px w-12 bg-[#e36c2f]" /><ArrowRight className="h-4 w-4 text-[#e36c2f]" />
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#d4cec4] pt-5 font-mono text-[8px] uppercase tracking-[.12em] text-[#77716a] lg:mt-0">
                <span>Planning</span><span>Coordination</span><span>Execution</span><span>Handover</span>
              </div>
            </div>

            <div className="relative min-h-[540px] lg:min-h-full">
              <div className="absolute inset-y-[3%] right-0 w-[92%] overflow-hidden [border-bottom-left-radius:44%_23%] [border-top-left-radius:56%_42%] lg:w-[94%]">
                <DatabaseImage
                  src={heroImage}
                  alt="Lunar Konstruksi — construction field"
                  className="h-full w-full object-cover"
                  placeholderLabel="Tambahkan hero lokal: public/images/site/hero-construction.*"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
              </div>

              <div className="absolute left-[7%] top-[16%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-7 top-[31%] hidden flex-col gap-12 font-mono text-[9px] font-semibold text-white/80 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>

              <div className="absolute bottom-[8%] left-[4%] h-[205px] w-[205px] overflow-hidden rounded-full border-[9px] border-[#f2eee7] sm:h-[245px] sm:w-[245px] lg:h-[270px] lg:w-[270px]">
                <DatabaseImage src={heroInset} alt="Project coordination" className="h-full w-full object-cover" placeholderLabel="Foto engineer / blueprint belum diisi" />
              </div>

              <HeroMeasureCurve className="bottom-[-2%] left-[8%] hidden h-[710px] w-[620px] lg:block" />
              <div className="absolute bottom-[6%] right-[5%] hidden gap-6 xl:grid xl:grid-cols-1">
                {metric("08", "years / field practice")}
                {metric(`${projects.length || 0}+`, "projects / documented")}
                {metric("97%", "delivery / coordinated")}
              </div>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-[1480px] grid-cols-3 gap-4 px-5 pb-10 sm:px-8 lg:hidden">
            {metric("08", "years")}{metric(`${projects.length || 0}+`, "projects")}{metric("97%", "coordinated")}
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-28">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58%] bg-[#e9e3da] [clip-path:polygon(0_18%,42%_0,100%_15%,100%_100%,0_100%)] opacity-75" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <div className="lg:pt-12">
                <MicroLabel>Capabilities / field package</MicroLabel>
                <h2 className={`${displayFont} mt-6 max-w-[480px] text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Struktur dimulai sebelum jam pertama.</h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-[#625e58]">Layanan dibaca sebagai bagian dari satu rangkaian kerja. Karena itu, setiap scope tetap punya hubungan dengan keputusan sebelum dan sesudahnya.</p>
                <div className="mt-10 max-w-[470px] space-y-4">
                  {services.slice(0, 5).map((service, index) => (
                    <Link key={service.id} href={service.slug ? `/services/${service.slug}` : "/services"} className="group grid grid-cols-[38px_1fr_auto] items-center border-b border-[#cfc8bd] pb-4">
                      <span className="font-mono text-[8px] text-[#e36c2f]">0{index + 1}</span>
                      <span className={`${displayFont} text-[clamp(1.3rem,2vw,1.8rem)] font-black uppercase tracking-[-.02em]`}>{service.name}</span>
                      <span className="font-mono text-[9px] text-[#e36c2f] transition group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[620px] sm:min-h-[700px] lg:min-h-[760px]">
                <figure className="absolute right-[2%] top-[1%] w-[57%] rotate-[1deg]">
                  <div className="overflow-hidden [border-radius:48%_52%_38%_62%/34%_48%_52%_66%]">
                    <DatabaseImage src={capabilityPrimary} alt="Capability visual" className="h-[315px] w-full object-cover sm:h-[375px]" placeholderLabel="Foto service / capability belum diisi" />
                  </div>
                  <figcaption className="mt-3 flex justify-between"><MicroLabel>Field / capability</MicroLabel><MicroLabel>01</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[4%] left-[2%] w-[46%] -rotate-[3deg]">
                  <div className="overflow-hidden [border-radius:54%_46%_58%_42%/44%_52%_48%_56%]">
                    <DatabaseImage src={capabilitySecondary} alt="Project documentation" className="h-[270px] w-full object-cover sm:h-[320px]" placeholderLabel="Foto project / field belum diisi" />
                  </div>
                  <figcaption className="mt-3"><MicroLabel>Documented work / 02</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[19%] right-[4%] w-[29%] rotate-[4deg]">
                  <div className="overflow-hidden [border-radius:62%_38%_50%_50%/40%_60%_40%_60%]">
                    <DatabaseImage src={capabilityDetail} alt="Site detail" className="h-[185px] w-full object-cover sm:h-[220px]" placeholderLabel="Detail material / site belum diisi" />
                  </div>
                  <figcaption className="mt-3 text-right"><MicroLabel>Detail / 03</MicroLabel></figcaption>
                </figure>

                <div aria-hidden="true" className="absolute left-[43%] top-[46%] h-px w-[18%] rotate-[-22deg] bg-[#e36c2f]" />
                <div aria-hidden="true" className="absolute left-[57%] top-[37%] h-2 w-2 rounded-full bg-[#e36c2f]" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-end gap-10 lg:grid-cols-[.62fr_1.38fr]">
              <div><MicroLabel>Selected work / project register</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Pekerjaan nyata. Keputusan nyata.</h2></div>
              <p className="max-w-xl text-sm leading-7 text-[#5f5b55] lg:justify-self-end">Setiap kartu mewakili record Project. Kalau media project belum ada, sistem menampilkan placeholder—tidak meminjam foto project lain.</p>
            </div>

            {projects.length ? (
              <div className="mt-14 grid auto-rows-[165px] grid-cols-2 gap-4 md:auto-rows-[195px] md:grid-cols-6">
                {projects.slice(0, 7).map((project, index) => {
                  const layout = [
                    "col-span-2 row-span-2 md:col-span-3",
                    "col-span-2 md:col-span-3",
                    "col-span-1 row-span-2 md:col-span-2",
                    "col-span-1 md:col-span-2",
                    "col-span-2 md:col-span-2",
                    "col-span-2 row-span-2 md:col-span-3",
                    "col-span-2 md:col-span-3",
                  ][index] ?? "col-span-2";
                  return (
                    <Link key={project.id} href={project.slug ? `/projects/${project.slug}` : "/projects"} className={`group relative overflow-hidden bg-[#d8d2c8] ${layout}`}>
                      <DatabaseImage src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" placeholderLabel={`Media project ${String(index + 1).padStart(2, "0")} belum diisi`} />
                      <div className="absolute inset-x-0 bottom-0 bg-[#172124]/88 p-4 text-white backdrop-blur-[1px]">
                        <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e8915f]">{project.location} {project.year ? `/ ${project.year}` : ""}</p>
                        <p className={`${displayFont} mt-1 text-xl font-black uppercase leading-none`}>{project.title}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-12 border border-dashed border-[#bdb6ac] px-6 py-16 text-center"><MicroLabel>Belum ada project published</MicroLabel></div>
            )}
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.74fr_1.26fr] lg:items-end">
              <div><MicroLabel>Sequence / coordination</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Rencana harus bisa dibangun.</h2></div>
              <p className="max-w-lg text-sm leading-7 text-[#5e5953] lg:justify-self-end">Alur kerja dibuat cukup sederhana untuk dipahami, tetapi cukup disiplin untuk menjaga perubahan, kualitas, dan keputusan lapangan tetap terkendali.</p>
            </div>

            <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-5 md:pt-8">
              <ProcessGuide className="left-0 top-0 hidden h-[92px] w-full md:block" />
              {[
                ["01", "PLAN", "Site survey / kebutuhan / risiko"],
                ["02", "COORDINATE", "Design / estimasi / shop drawing"],
                ["03", "BUILD", "Execution / quality check"],
                ["04", "DELIVER", "Inspection / handover"],
              ].map(([number, title, text], index) => (
                <div key={number} className={`relative bg-[#f2eee7] pr-4 pt-3 ${index % 2 ? "md:mt-10" : ""}`}>
                  <p className={`${displayFont} mt-4 text-3xl font-black leading-none`}>{number}</p>
                  <p className={`${displayFont} mt-1 text-xl font-black uppercase`}>{title}</p>
                  <p className="mt-5 max-w-[230px] font-mono text-[8px] uppercase leading-5 tracking-[.1em] text-[#77716a]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#172124] py-20 text-[#f4efe7] sm:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
            <div>
              <MicroLabel>Control / tolerance / handover</MicroLabel>
              <h2 className={`${displayFont} mt-6 max-w-[720px] text-5xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Presisi menjaga semuanya tetap terhubung.</h2>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-6 lg:justify-self-end">
              <div className="relative h-[220px] w-px bg-white/25"><span className="absolute left-[-4px] top-[18%] h-2 w-2 rounded-full bg-[#e36c2f]" /><span className="absolute left-[-4px] top-[50%] h-2 w-2 rounded-full bg-[#e36c2f]" /><span className="absolute left-[-4px] top-[82%] h-2 w-2 rounded-full bg-[#e36c2f]" /></div>
              <div className="flex h-[220px] flex-col justify-around font-mono text-[10px] uppercase tracking-[.14em] text-white/75"><span>Safety</span><span>Tolerance</span><span>Handover</span></div>
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[140px_1fr] lg:px-10">
            <Quote className="h-20 w-20 text-[#c9c2b8] lg:h-28 lg:w-28" />
            <div>
              <blockquote className="max-w-3xl text-2xl leading-[1.48] text-[#2a3031] sm:text-3xl">“{quote?.quote || "Koordinasi yang baik membuat pekerjaan lapangan jauh lebih tenang karena keputusan penting sudah dibahas sebelum menjadi masalah."}”</blockquote>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[.16em] text-[#e36c2f]">— {quote?.name || "Project Client"}{quote?.role ? ` / ${quote.role}` : ""}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#d8d1c6] py-20 sm:py-24">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <div className="mb-6 h-px w-12 bg-[#e36c2f]" />
              <h2 className={`${displayFont} max-w-[720px] text-5xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Mari bangun sesuatu yang bertahan.</h2>
            </div>
            <Link href="/contact" className="mb-2 inline-flex items-center gap-5 font-mono text-[10px] font-semibold uppercase tracking-[.08em]">Talk to our team <span className="h-px w-12 bg-[#e36c2f]" />→</Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
