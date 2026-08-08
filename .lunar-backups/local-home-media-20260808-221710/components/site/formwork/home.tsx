import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
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

function projectHref(slug: string) {
  return slug ? `/projects/${slug}` : "/projects";
}

export function FormworkHome({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const services = data.services.map(serviceModel);
  const team = data.team.map(teamModel);
  const testimonials = data.testimonials.map(testimonialModel).filter((item) => item.quote);

  const projectImages = distinctImages(projects);
  const serviceImages = distinctImages(services);
  const teamImages = distinctImages(team);

  const hero = projects[0];
  const quote = testimonials[0];

  const heroImage = LOCAL_MEDIA.hero || projectImages[0] || "";
  const heroInset = projectImages.find((image) => image && image !== heroImage) || teamImages[0] || localMediaAt(1);
  const capabilityPrimary = serviceImages[0] || projectImages[1] || localMediaAt(2);
  const capabilitySecondary = projectImages.find((image) => image && image !== heroImage && image !== capabilityPrimary) || teamImages[1] || localMediaAt(3);
  const capabilityDetail = teamImages.find((image) => image && image !== heroInset && image !== capabilitySecondary) || serviceImages[1] || localMediaAt(4);

  const processPrimary = LOCAL_MEDIA.processPlanning || localMediaAt(0);
  const processSecondary = LOCAL_MEDIA.processNote || localMediaAt(5);

  const featuredProject = projects[0];
  const registerProjects = projects.slice(1, 4);
  const lowerProjects = projects.slice(4, 7);

  return (
    <div className="overflow-hidden bg-[#f2eee7] text-[#22292a]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d8d1c6]">
          <BlueprintLayer className="opacity-[0.09]" />
          <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[.78fr_1.22fr] lg:min-h-[850px]">
            <div className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
              <div className="max-w-[610px]">
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#e36c2f]" /><MicroLabel>General contracting / field coordination</MicroLabel></div>
                <h1 className={`${displayFont} mt-9 text-[clamp(3.35rem,6.15vw,6.65rem)] font-black uppercase leading-[.87] tracking-[-.052em] text-[#202829]`}>
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
              <div className="absolute inset-y-[4%] right-0 w-[92%] overflow-hidden [border-bottom-left-radius:46%_24%] [border-top-left-radius:58%_44%] lg:w-[94%]">
                <DatabaseImage
                  src={heroImage}
                  alt="Lunar Konstruksi — construction field"
                  className="h-full w-full object-cover"
                  placeholderLabel="Tambahkan foto hero lokal di public/"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
              </div>

              <div className="absolute left-[5%] top-[14%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-6 top-[30%] hidden flex-col gap-12 font-mono text-[9px] font-semibold text-white/80 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>

              <div className="absolute bottom-[8%] left-[2%] h-[220px] w-[220px] overflow-hidden rounded-full border-[9px] border-[#f2eee7] sm:h-[255px] sm:w-[255px] lg:left-[4%] lg:h-[285px] lg:w-[285px]">
                <DatabaseImage src={heroInset} fallbackSrc={localMediaAt(1)} alt="Project detail" className="h-full w-full object-cover" />
              </div>

              <TechnicalArc className="bottom-[-5%] left-[20%] hidden h-[360px] w-[520px] rotate-[11deg] lg:block" />
              <div className="absolute left-[40%] top-[74%] hidden lg:block"><MicroLabel>REBAR / FORMWORK / CONCRETE</MicroLabel></div>
              <div className="absolute bottom-[5%] right-[5%] hidden gap-7 xl:grid xl:grid-cols-1">
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
          <BlueprintLayer className="opacity-[0.06]" />
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
                <figure className="absolute right-[2%] top-[0%] w-[58%] rotate-[1.5deg]">
                  <div className="overflow-hidden [border-radius:46%_54%_40%_60%/34%_48%_52%_66%]">
                    <DatabaseImage src={capabilityPrimary} fallbackSrc={localMediaAt(2)} alt="Capability visual" className="h-[330px] w-full object-cover sm:h-[390px]" />
                  </div>
                  <figcaption className="mt-3 flex justify-between"><MicroLabel>Field / capability</MicroLabel><MicroLabel>01</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[5%] left-[1%] w-[47%] -rotate-[4deg]">
                  <div className="overflow-hidden [border-radius:54%_46%_58%_42%/44%_52%_48%_56%]">
                    <DatabaseImage src={capabilitySecondary} fallbackSrc={localMediaAt(3)} alt="Project documentation" className="h-[280px] w-full object-cover sm:h-[330px]" />
                  </div>
                  <figcaption className="mt-3"><MicroLabel>Documented work / 02</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[16%] right-[2%] w-[32%] rotate-[5deg]">
                  <div className="overflow-hidden [border-radius:62%_38%_50%_50%/40%_60%_40%_60%]">
                    <DatabaseImage src={capabilityDetail} fallbackSrc={localMediaAt(4)} alt="Site detail" className="h-[205px] w-full object-cover sm:h-[245px]" />
                  </div>
                </figure>

                <TechnicalArc className="left-[25%] top-[14%] h-[500px] w-[520px] rotate-[30deg] opacity-65" />
                <div className="absolute left-[33%] top-[10%] hidden lg:block"><MicroLabel>SHOP DRAWING</MicroLabel></div>
                <div className="absolute left-[21%] top-[44%] hidden lg:block"><MicroLabel>MATERIAL TAKE OFF</MicroLabel></div>
                <div className="absolute right-[8%] bottom-[8%] hidden lg:block"><MicroLabel>SITE CONTROL / DETAIL 03</MicroLabel></div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-end gap-10 lg:grid-cols-[.62fr_1.38fr]">
              <div>
                <MicroLabel>Selected work / project register</MicroLabel>
                <h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Project dibaca sebagai rangkaian keputusan.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#5f5b55] lg:justify-self-end">Register di bawah menampilkan proyek secara lebih editorial: satu proyek utama, indeks proyek lain, dan kartu proyek sekunder tanpa crop janggal.</p>
            </div>

            {featuredProject ? (
              <>
                <div className="mt-14 grid gap-6 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
                  <Link href={projectHref(featuredProject.slug)} className="group overflow-hidden border border-[#d8d1c6] bg-[#e5dfd4]">
                    <div className="overflow-hidden">
                      <DatabaseImage
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-[400px] lg:h-[440px]"
                        placeholderLabel="Media project utama belum diisi"
                      />
                    </div>
                    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e36c2f]">Featured record / {featuredProject.location} {featuredProject.year ? `/ ${featuredProject.year}` : ""}</p>
                        <h3 className={`${displayFont} mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-black uppercase leading-[.95]`}>{featuredProject.title}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f5b55]">{featuredProject.description || "Dokumentasi proyek ini mewakili bagaimana keputusan lapangan, material, dan eksekusi dirapikan menjadi satu paket kerja yang utuh."}</p>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#22292a]">Open record →</span>
                    </div>
                  </Link>

                  <div className="grid gap-5">
                    <div className="border border-[#d8d1c6] bg-[#f5f1ea] p-5 sm:p-6">
                      <div className="flex items-center justify-between border-b border-[#d8d1c6] pb-3">
                        <MicroLabel>Project index</MicroLabel>
                        <MicroLabel>{String(projects.length).padStart(2, "0")} records</MicroLabel>
                      </div>
                      <div className="mt-4 space-y-4">
                        {(registerProjects.length ? registerProjects : projects.slice(0, 3)).map((project, index) => (
                          <Link key={project.id} href={projectHref(project.slug)} className="group grid grid-cols-[32px_1fr_auto] items-start gap-3 border-b border-dashed border-[#d8d1c6] pb-4 last:border-b-0 last:pb-0">
                            <span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e36c2f]">0{index + 2}</span>
                            <div>
                              <p className={`${displayFont} text-[1.2rem] font-black uppercase leading-none`}>{project.title}</p>
                              <p className="mt-2 text-xs leading-6 text-[#6a6660]">{project.location}{project.year ? ` / ${project.year}` : ""}</p>
                            </div>
                            <span className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#8b857b] group-hover:text-[#e36c2f]">view</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-[1.05fr_.95fr]">
                      {projects.slice(1, 3).map((project, index) => (
                        <Link key={project.id} href={projectHref(project.slug)} className={`group overflow-hidden border border-[#d8d1c6] bg-[#e5dfd4] ${index === 0 ? "sm:translate-y-4" : ""}`}>
                          <DatabaseImage
                            src={project.image}
                            alt={project.title}
                            className={`w-full object-cover ${index === 0 ? "h-[240px]" : "h-[200px] sm:h-[260px]"}`}
                            placeholderLabel={`Media project ${String(index + 2).padStart(2, "0")} belum diisi`}
                          />
                          <div className="p-4">
                            <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e36c2f]">{project.category}</p>
                            <p className={`${displayFont} mt-2 text-xl font-black uppercase leading-none`}>{project.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {lowerProjects.length > 0 && (
                  <div className="mt-6 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
                    <Link href={projectHref(lowerProjects[0].slug)} className="group overflow-hidden border border-[#d8d1c6] bg-[#f5f1ea]">
                      <DatabaseImage src={lowerProjects[0].image} alt={lowerProjects[0].title} className="h-[260px] w-full object-cover sm:h-[300px]" placeholderLabel="Media project belum diisi" />
                      <div className="p-4">
                        <MicroLabel>Supplementary record / 05</MicroLabel>
                        <p className={`${displayFont} mt-2 text-2xl font-black uppercase leading-none`}>{lowerProjects[0].title}</p>
                      </div>
                    </Link>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {lowerProjects.slice(1).map((project, index) => (
                        <Link key={project.id} href={projectHref(project.slug)} className="group overflow-hidden border border-[#d8d1c6] bg-[#efe9df]">
                          <DatabaseImage src={project.image} alt={project.title} className="h-[220px] w-full object-cover" placeholderLabel={`Media project ${String(index + 6).padStart(2, "0")} belum diisi`} />
                          <div className="p-4">
                            <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e36c2f]">{project.location}</p>
                            <p className={`${displayFont} mt-2 text-[1.15rem] font-black uppercase leading-none`}>{project.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-12 border border-dashed border-[#bdb6ac] px-6 py-16 text-center"><MicroLabel>Belum ada project published</MicroLabel></div>
            )}
          </div>
        </section>

        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.72fr_.64fr_.64fr] lg:items-start">
              <div>
                <MicroLabel>Site sequence / work logic</MicroLabel>
                <h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl lg:text-7xl`}>Rencana harus bisa dibangun.</h2>
                <p className="mt-6 max-w-sm text-[15px] leading-8 text-[#5f5b55]">Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.</p>
              </div>

              <div className="relative border-l border-[#b8b1a7] pl-8">
                {[
                  ["01", "PLAN", "Survey lokasi, kebutuhan, risiko, dan baseline scope."],
                  ["02", "COORDINATE", "Desain, estimasi, material, dan shop drawing diselaraskan."],
                  ["03", "BUILD", "Eksekusi bergerak bersama kontrol mutu dan catatan perubahan."],
                  ["04", "DELIVER", "Inspection, close-out, dan handover dirapikan sebagai satu record."],
                ].map(([number, title, text]) => (
                  <div key={number} className="relative pb-9 last:pb-0">
                    <span className="absolute -left-[35px] top-2 h-2.5 w-2.5 rounded-full bg-[#e36c2f]" />
                    <div className="grid gap-2 sm:grid-cols-[110px_1fr]">
                      <div className="flex items-baseline gap-3">
                        <span className={`${displayFont} text-2xl font-black text-[#1d282a]`}>{number}</span>
                        <span className={`${displayFont} text-[1.15rem] font-black uppercase`}>{title}</span>
                      </div>
                      <p className="max-w-md text-[15px] leading-8 text-[#5e5953]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-5">
                <div className="overflow-hidden rounded-[36%] border border-[#d8d1c6] bg-[#e6dfd3]">
                  <DatabaseImage src={processPrimary} alt="Rencana kerja lapangan" className="h-[330px] w-full object-cover" placeholderLabel="Tambahkan gambar statis perencanaan" />
                </div>
                <div className="border-l-2 border-[#e36c2f] bg-[#ece6dc] p-5">
                  <MicroLabel>Site note / QC-04</MicroLabel>
                  <p className={`${displayFont} mt-4 max-w-[280px] text-[2rem] font-black uppercase leading-[.95]`}>Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.</p>
                </div>
              </div>
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

        {team.length > 0 && (
          <section className="relative border-b border-[#d8d1c6] py-20 sm:py-24">
            <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="grid items-end gap-8 lg:grid-cols-[.62fr_1.38fr]">
                <div>
                  <MicroLabel>Field crew / personnel</MicroLabel>
                  <h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-6xl`}>Tim lapangan dan koordinasi.</h2>
                </div>
                <p className="max-w-lg text-sm leading-7 text-[#5f5b55] lg:justify-self-end">Orang yang menggerakkan proses bukan sekadar pelengkap foto. Karena itu, data team tetap dibaca sebagai bagian dari presentasi halaman depan.</p>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {team.slice(0, 3).map((member, index) => (
                  <article key={member.id} className={`${index === 1 ? "md:translate-y-6" : ""} overflow-hidden border border-[#d8d1c6] bg-[#efe9df]`}>
                    <DatabaseImage src={member.image} fallbackSrc={processSecondary} alt={member.name} className={`w-full object-cover ${index === 0 ? "h-[360px]" : index === 1 ? "h-[300px]" : "h-[330px]"}`} placeholderLabel={`Media team ${index + 1} belum diisi`} />
                    <div className="p-4 sm:p-5">
                      <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e36c2f]">Personnel / {String(index + 1).padStart(2, "0")}</p>
                      <p className={`${displayFont} mt-2 text-[1.4rem] font-black uppercase leading-none`}>{member.name}</p>
                      <p className="mt-2 text-sm text-[#5e5953]">{member.position}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1160px] gap-8 px-5 sm:px-8 lg:grid-cols-[140px_1fr] lg:px-10">
            <Quote className="h-20 w-20 text-[#c9c2b8] lg:h-28 lg:w-28" />
            <div>
              <blockquote className="max-w-3xl text-2xl leading-[1.48] text-[#2a3031] sm:text-3xl">“{quote?.quote || "Koordinasi yang baik membuat pekerjaan lapangan jauh lebih tenang karena keputusan penting sudah dibahas sebelum menjadi masalah."}”</blockquote>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[.16em] text-[#e36c2f]">— {quote?.name || "Project Client"}{quote?.role ? ` / ${quote.role}` : ""}</p>
            </div>
          </div>
        </section>

        <section className="relative border-t border-[#d8d1c6] py-20 sm:py-24">
          <div className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <MicroLabel>Closing note / next project</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[760px] text-6xl font-black uppercase leading-[.88] tracking-[-.045em] sm:text-7xl lg:text-8xl`}>Mari bangun sesuatu yang bertahan.</h2>
            </div>
            <Link href="/contact" className="mb-2 inline-flex items-center gap-5 font-mono text-[10px] font-semibold uppercase tracking-[.08em]">Talk to our team <span className="h-px w-12 bg-[#e36c2f]" />→</Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
