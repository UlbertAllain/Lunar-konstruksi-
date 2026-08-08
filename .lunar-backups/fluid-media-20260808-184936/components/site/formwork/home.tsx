import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { DatabaseImage } from "./media";
import {
  projectModel,
  serviceModel,
  teamModel,
  testimonialModel,
  type SiteData,
} from "./data";

function metric(value: string, label: string) {
  return (
    <div className="min-w-[100px]">
      <p className={`${displayFont} text-[34px] font-black leading-none tracking-[-.04em] text-[#202829]`}>{value}</p>
      <p className="mt-1 font-mono text-[8px] uppercase leading-4 tracking-[.12em] text-[#625e58]">{label}</p>
    </div>
  );
}

export function FormworkHome({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const services = data.services.map(serviceModel);
  const team = data.team.map(teamModel);
  const testimonials = data.testimonials.map(testimonialModel).filter((item) => item.quote);
  const hero = projects[0];
  const secondary = projects[1] ?? projects[0];
  const tertiary = projects[2] ?? projects[1] ?? projects[0];
  const crew = team[0];
  const quote = testimonials[0];

  return (
    <div className="overflow-hidden bg-[#f2eee7] text-[#22292a]">
      <FormworkHeader />
      <main>
        <section className="relative min-h-[820px] border-b border-[#d8d1c6] lg:min-h-[900px]">
          <BlueprintLayer />
          <div className="relative mx-auto grid min-h-[820px] w-full max-w-[1480px] lg:min-h-[900px] lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
              <div>
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#e36c2f]" /><MicroLabel>General contracting / 2026</MicroLabel></div>
                <h1 className={`${displayFont} mt-10 max-w-[540px] text-[clamp(3.5rem,7vw,7.4rem)] font-black uppercase leading-[.84] tracking-[-.055em] text-[#202829]`}>
                  Kami membangun dari dasar yang jelas.
                </h1>
                <div className="mt-8 h-px w-10 bg-[#e36c2f]" />
                <p className="mt-5 max-w-md text-[15px] leading-7 text-[#474c4b]">
                  Proyek konstruksi membutuhkan lebih dari pekerjaan lapangan. Perencanaan, koordinasi, kontrol mutu, dan keputusan teknis harus bergerak sebagai satu sistem.
                </p>
                <Link href="/projects" className="mt-8 inline-flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#263033]">
                  Lihat pekerjaan kami <span className="h-px w-12 bg-[#e36c2f]" /><ArrowRight className="h-4 w-4 text-[#e36c2f]" />
                </Link>
              </div>

              <div className="mt-12 grid max-w-[390px] grid-cols-2 gap-x-8 gap-y-5 border-t border-[#d4cec4] pt-6 font-mono text-[9px] uppercase tracking-[.1em] text-[#77716a] sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
                <span>Rebar</span><span>Formwork</span><span>Concrete</span>
              </div>
            </div>

            <div className="relative min-h-[560px] lg:min-h-full">
              <div className="absolute inset-y-0 right-0 w-[92%] overflow-hidden [border-bottom-left-radius:52%_26%] [border-top-left-radius:62%_48%] lg:w-[94%]">
                <DatabaseImage src={hero?.image ?? ""} alt={hero?.title ?? "Project Lunar Konstruksi"} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="absolute left-[3%] top-[12%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-7 top-[34%] hidden flex-col gap-9 font-mono text-[10px] font-semibold text-white/85 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>

              <div className="absolute bottom-[6%] left-[3%] h-[235px] w-[235px] overflow-hidden rounded-full border-[10px] border-[#f2eee7] sm:h-[280px] sm:w-[280px] lg:bottom-[8%] lg:left-[5%] lg:h-[320px] lg:w-[320px]">
                <DatabaseImage src={crew?.image || secondary?.image || ""} alt={crew?.name || secondary?.title || "Site coordination"} className="h-full w-full object-cover" />
              </div>

              <TechnicalArc className="bottom-[-4%] left-[20%] hidden h-[390px] w-[540px] rotate-[11deg] lg:block" />
              <div className="absolute bottom-[5%] right-[5%] grid gap-7 sm:grid-cols-3 lg:grid-cols-1">
                {metric("08", "years / field practice")}
                {metric(`${projects.length || 0}+`, "projects / documented")}
                {metric("97%", "delivery / coordinated")}
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-28">
          <BlueprintLayer className="opacity-[0.1]" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr]">
              <div>
                <MicroLabel>Capabilities / field package</MicroLabel>
                <h2 className={`${displayFont} mt-6 max-w-[450px] text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl`}>Struktur dimulai sebelum jam pertama.</h2>
                <div className="mt-10 space-y-5">
                  {services.slice(0, 5).map((service, index) => (
                    <Link key={service.id} href={service.slug ? `/services/${service.slug}` : "/services"} className="group flex max-w-[420px] items-center justify-between border-b border-[#cfc8bd] pb-4">
                      <span className={`${displayFont} text-2xl font-black uppercase tracking-[-.02em]`}>{service.name}</span>
                      <span className="font-mono text-[9px] text-[#e36c2f]">0{index + 1} →</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[720px]">
                <div className="absolute right-[3%] top-[2%] w-[56%]">
                  <div className="overflow-hidden [border-radius:48%_52%_46%_54%/38%_46%_54%_62%]">
                    <DatabaseImage src={secondary?.image ?? ""} alt={secondary?.title ?? "Selected project"} className="h-[390px] w-full object-cover" />
                  </div>
                  <div className="mt-4 flex justify-between"><MicroLabel>Sector / {secondary?.category ?? "Construction"}</MicroLabel><MicroLabel>{secondary?.year || "On site"}</MicroLabel></div>
                </div>

                <div className="absolute bottom-[14%] left-[0%] w-[46%] -rotate-6 overflow-hidden [border-radius:42%_58%_44%_56%/56%_40%_60%_44%]">
                  <DatabaseImage src={tertiary?.image ?? ""} alt={tertiary?.title ?? "Construction work"} className="h-[330px] w-full object-cover" />
                </div>

                <div className="absolute bottom-[5%] right-[7%] w-[35%] rotate-3 overflow-hidden [border-radius:64%_36%_53%_47%/40%_52%_48%_60%]">
                  <DatabaseImage src={hero?.image ?? ""} alt={hero?.title ?? "Project detail"} className="h-[270px] w-full object-cover" />
                </div>

                <div className="absolute left-[43%] top-[44%] h-[150px] w-[150px] overflow-hidden rounded-full border-[8px] border-[#f2eee7]">
                  <DatabaseImage src={crew?.image ?? ""} alt={crew?.name ?? "Project team"} className="h-full w-full object-cover" />
                </div>

                <div className="absolute bottom-[1%] left-[2%]"><MicroLabel>Pour sequence / 03</MicroLabel></div>
                <TechnicalArc className="left-[31%] top-[16%] h-[520px] w-[520px] rotate-[37deg] opacity-70" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-end gap-10 lg:grid-cols-[.6fr_1.4fr]">
              <div><MicroLabel>Selected work / project register</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl`}>Pekerjaan nyata. Keputusan nyata.</h2></div>
              <p className="max-w-xl text-sm leading-7 text-[#5f5b55] lg:justify-self-end">Portfolio menampilkan pekerjaan yang tercatat di database Lunar. Tidak ada gambar pengganti ketika media proyek memang sudah tersedia.</p>
            </div>

            <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-6">
              {projects.slice(0, 6).map((project, index) => {
                const layout = ["col-span-2 row-span-2 md:col-span-3", "col-span-2 md:col-span-3", "col-span-1 row-span-2 md:col-span-2", "col-span-1 md:col-span-2", "col-span-2 md:col-span-2", "col-span-2 md:col-span-3"][index] ?? "col-span-2";
                return (
                  <Link key={project.id} href={project.slug ? `/projects/${project.slug}` : "/projects"} className={`group relative overflow-hidden bg-[#d8d2c8] ${layout}`}>
                    <DatabaseImage src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                    <div className="absolute inset-x-0 bottom-0 bg-[#172124]/90 p-4 text-white">
                      <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e8915f]">{project.location} {project.year ? `/ ${project.year}` : ""}</p>
                      <p className={`${displayFont} mt-1 text-xl font-black uppercase leading-none`}>{project.title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-24">
          <BlueprintLayer className="opacity-[0.08]" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div><MicroLabel>Sequence / coordination</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl`}>Rencana harus bisa dibangun.</h2></div>
              <p className="max-w-lg text-sm leading-7 text-[#5e5953] lg:justify-self-end">Alur kerja dibuat untuk mengurangi keputusan yang terlambat, miskomunikasi, dan perubahan yang tidak terkendali di lapangan.</p>
            </div>

            <div className="relative mt-20 grid gap-12 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-[19px] hidden h-px bg-[#aaa39a] md:block" />
              {[
                ["01", "PLAN", "Site survey / kebutuhan / risiko"],
                ["02", "COORDINATE", "Design / estimasi / shop drawing"],
                ["03", "BUILD", "Execution / quality check"],
                ["04", "DELIVER", "Inspection / handover"],
              ].map(([number, title, text]) => (
                <div key={number} className="relative bg-[#f2eee7] pr-5">
                  <span className="block h-3 w-3 rounded-full bg-[#e36c2f]" />
                  <p className={`${displayFont} mt-4 text-3xl font-black leading-none`}>{number}</p>
                  <p className={`${displayFont} mt-1 text-xl font-black uppercase`}>{title}</p>
                  <p className="mt-5 font-mono text-[8px] uppercase leading-5 tracking-[.1em] text-[#77716a]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#172124] py-20 text-[#f4efe7] sm:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10">
            <div>
              <MicroLabel>Control / tolerance / handover</MicroLabel>
              <h2 className={`${displayFont} mt-6 max-w-[700px] text-5xl font-black uppercase leading-[.88] tracking-[-.045em] sm:text-7xl`}>Presisi menjaga semuanya tetap terhubung.</h2>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-6 lg:justify-self-end">
              <div className="relative h-[250px] w-px bg-white/25"><span className="absolute left-[-4px] top-[18%] h-2 w-2 rounded-full bg-[#e36c2f]" /><span className="absolute left-[-4px] top-[50%] h-2 w-2 rounded-full bg-[#e36c2f]" /><span className="absolute left-[-4px] top-[82%] h-2 w-2 rounded-full bg-[#e36c2f]" /></div>
              <div className="flex h-[250px] flex-col justify-around font-mono text-[10px] uppercase tracking-[.14em] text-white/75"><span>Safety</span><span>Tolerance</span><span>Handover</span></div>
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 sm:px-8 lg:grid-cols-[160px_1fr] lg:px-10">
            <Quote className="h-24 w-24 text-[#c9c2b8] lg:h-32 lg:w-32" />
            <div>
              <blockquote className="max-w-3xl text-2xl leading-[1.45] text-[#2a3031] sm:text-3xl">“{quote?.quote || "Koordinasi yang baik membuat pekerjaan lapangan jauh lebih tenang karena keputusan penting sudah dibahas sebelum menjadi masalah."}”</blockquote>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[.16em] text-[#e36c2f]">— {quote?.name || "Project Client"}{quote?.role ? ` / ${quote.role}` : ""}</p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-[#d8d1c6] py-20 sm:py-24">
          <TechnicalArc className="-bottom-[280px] left-[-10%] h-[500px] w-[120%]" />
          <div className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <h2 className={`${displayFont} max-w-[760px] text-6xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-8xl`}>Mari bangun sesuatu yang bertahan.</h2>
            <Link href="/contact" className="mb-2 inline-flex items-center gap-5 font-mono text-[10px] font-semibold uppercase tracking-[.08em]">Talk to our team <span className="h-px w-12 bg-[#e36c2f]" />→</Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
