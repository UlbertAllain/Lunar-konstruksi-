import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA, localMediaAt } from "./local-assets";
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
    <div className="min-w-[92px]">
      <p className={`${displayFont} text-[30px] font-black leading-none tracking-[-.03em] text-[#182d4d] sm:text-[34px]`}>{value}</p>
      <p className="mt-1 font-mono text-[8px] uppercase leading-4 tracking-[.12em] text-[#657184]">{label}</p>
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

  const quote = testimonials[0];

  const heroImage = LOCAL_MEDIA.hero;
  const heroInset = LOCAL_MEDIA.heroEngineer;
  const capabilityPrimary = LOCAL_MEDIA.capabilityStructure;
  const capabilitySecondary = LOCAL_MEDIA.capabilityBuilding;
  const capabilityDetail = LOCAL_MEDIA.capabilityDetail;

  const processPrimary = LOCAL_MEDIA.processPlanning;

  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1, 3);
  const registerProjects = projects.slice(3, 6);

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        {/* HERO — dipertahankan, hanya typography/detail dipoles */}
        <section className="relative border-b border-[#d9d4ca]">
          <BlueprintLayer className="opacity-[0.07]" />
          <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[.78fr_1.22fr] lg:min-h-[850px]">
            <div className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
              <div className="max-w-[610px]">
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#dcb458]" /><MicroLabel>01 / General contracting / field coordination</MicroLabel></div>
                <h1 className={`${displayFont} mt-9 text-[clamp(3.2rem,5.75vw,6.25rem)] font-black uppercase leading-[.88] tracking-[-.045em] text-[#182d4d]`}>
                  Kami membangun dari dasar yang jelas.
                </h1>
                <div className="mt-7 h-px w-10 bg-[#dcb458]" />
                <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-[#526174]">
                  Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan perlu bergerak dalam satu alur yang mudah dibaca—bukan saling mengejar di tengah proyek.
                </p>
                <Link href="/projects" className="mt-8 inline-flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#263033]">
                  Lihat pekerjaan kami <span className="h-px w-12 bg-[#dcb458]" /><ArrowRight className="h-4 w-4 text-[#dcb458]" />
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#d4cec4] pt-5 font-mono text-[8px] uppercase tracking-[.12em] text-[#7c8592] lg:mt-0">
                <span>Planning</span><span>Coordination</span><span>Execution</span><span>Handover</span>
              </div>
            </div>

            <div className="relative min-h-[540px] lg:min-h-full">
              <div className="absolute inset-y-[3%] right-[-4%] w-[104%] overflow-visible lg:w-[106%]">
                <DatabaseImage src={heroImage} alt="Lunar Konstruksi — construction field" className="h-full w-full object-contain" placeholderLabel="Tambahkan foto hero lokal di public/" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
              </div>

              <div className="absolute left-[5%] top-[14%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-6 top-[30%] hidden flex-col gap-12 font-mono text-[9px] font-semibold text-white/80 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>

              <div className="absolute bottom-[8%] left-[2%] h-[220px] w-[220px] overflow-hidden rounded-full border-[9px] border-[#f5f1e8] sm:h-[255px] sm:w-[255px] lg:left-[4%] lg:h-[285px] lg:w-[285px]">
                <DatabaseImage src={heroInset} fallbackSrc={localMediaAt(1)} alt="Project detail" className="h-full w-full object-cover" />
              </div>

              <TechnicalArc label="FIELD / STRUCTURE" className="bottom-[-2%] left-[17%] hidden h-[340px] w-[560px] rotate-[5deg] lg:block" />
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

        {/* CAPABILITIES — dipertahankan */}
        <section className="relative border-b border-[#d9d4ca] py-20 sm:py-24">
          <BlueprintLayer className="opacity-[0.045]" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <div className="lg:pt-10">
                <MicroLabel>02 / Capabilities / field package</MicroLabel>
                <h2 className={`${displayFont} mt-6 max-w-[480px] text-[clamp(2.85rem,4.9vw,5rem)] font-black uppercase leading-[.9] tracking-[-.038em]`}>Struktur dimulai sebelum jam pertama.</h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-[#657184]">Layanan dibaca sebagai bagian dari satu rangkaian kerja. Karena itu, setiap scope tetap punya hubungan dengan keputusan sebelum dan sesudahnya.</p>
                <div className="mt-10 max-w-[470px] space-y-4">
                  {services.slice(0, 5).map((service, index) => (
                    <Link key={service.id} href={service.slug ? `/services/${service.slug}` : "/services"} className="group grid grid-cols-[38px_1fr_auto] items-center border-b border-[#cfcac1] pb-4">
                      <span className="font-mono text-[8px] text-[#dcb458]">0{index + 1}</span>
                      <span className={`${displayFont} text-[clamp(1.2rem,1.7vw,1.65rem)] font-black uppercase tracking-[-.018em]`}>{service.name}</span>
                      <span className="font-mono text-[9px] text-[#dcb458] transition group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[610px] sm:min-h-[680px] lg:min-h-[720px]">
                <figure className="absolute right-[2%] top-[0%] w-[58%] rotate-[1.5deg]">
                  <div className="overflow-hidden [border-radius:46%_54%_40%_60%/34%_48%_52%_66%]">
                    <DatabaseImage src={capabilityPrimary} fallbackSrc={localMediaAt(2)} alt="Capability visual" className="h-[320px] w-full object-cover sm:h-[380px]" />
                  </div>
                  <figcaption className="mt-3 flex justify-between"><MicroLabel>Field / capability</MicroLabel><MicroLabel>01</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[5%] left-[1%] w-[47%] -rotate-[4deg]">
                  <div className="overflow-hidden [border-radius:54%_46%_58%_42%/44%_52%_48%_56%]">
                    <DatabaseImage src={capabilitySecondary} fallbackSrc={localMediaAt(3)} alt="Project documentation" className="h-[270px] w-full object-cover sm:h-[320px]" />
                  </div>
                  <figcaption className="mt-3"><MicroLabel>Documented work / 02</MicroLabel></figcaption>
                </figure>

                <figure className="absolute bottom-[16%] right-[2%] w-[32%] rotate-[5deg]">
                  <div className="overflow-hidden [border-radius:62%_38%_50%_50%/40%_60%_40%_60%]">
                    <DatabaseImage src={capabilityDetail} fallbackSrc={localMediaAt(4)} alt="Site detail" className="h-[195px] w-full object-cover sm:h-[235px]" />
                  </div>
                </figure>

                <TechnicalArc className="left-[25%] top-[14%] h-[480px] w-[500px] rotate-[30deg] opacity-55" />
                <div className="absolute left-[33%] top-[10%] hidden lg:block"><MicroLabel>SHOP DRAWING</MicroLabel></div>
                <div className="absolute left-[22%] top-[44%] hidden lg:block"><MicroLabel>MATERIAL TAKE OFF</MicroLabel></div>
                <div className="absolute right-[7%] bottom-[9%] hidden lg:block"><MicroLabel>SITE CONTROL / DETAIL 03</MicroLabel></div>
              </div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK — editorial spread, bukan grid berulang */}
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.58fr_1.42fr] lg:items-end">
              <div>
                <MicroLabel>03 / Selected work / project register</MicroLabel>
                <h2 className={`${displayFont} mt-4 max-w-[470px] text-[clamp(2.9rem,4.6vw,4.8rem)] font-black uppercase leading-[.9] tracking-[-.035em]`}>Project dibaca sebagai rangkaian keputusan.</h2>
              </div>
              <div className="grid gap-5 border-t border-[#cfcac1] pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-xl text-sm leading-7 text-[#657184]">Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja—bukan dipaksa memenuhi halaman dengan grid seragam.</p>
                <Link href="/projects" className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.12em] text-[#182d4d]">Open full register <span className="h-px w-9 bg-[#dcb458]" />→</Link>
              </div>
            </div>

            {featuredProject ? (
              <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <Link href={projectHref(featuredProject.slug)} className="group relative overflow-hidden bg-[#ddd6ca]">
                  <DatabaseImage src={featuredProject.image} alt={featuredProject.title} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.018]" placeholderLabel="Media project utama belum diisi" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14243f]/92 via-[#14243f]/55 to-transparent px-5 pb-5 pt-16 text-white sm:px-6 sm:pb-6">
                    <MicroLabel className="text-[#f0a16f]">Featured record / {featuredProject.location}{featuredProject.year ? ` / ${featuredProject.year}` : ""}</MicroLabel>
                    <h3 className={`${displayFont} mt-2 max-w-[620px] text-[clamp(2rem,3vw,3.1rem)] font-black uppercase leading-[.92]`}>{featuredProject.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">{featuredProject.description || "Dokumentasi utama untuk melihat bagaimana scope, material, dan keputusan lapangan bergerak dalam satu record proyek."}</p>
                  </div>
                </Link>

                <div className="grid content-start gap-6">
                  <div className="border-y border-[#cfcac1] py-4">
                    <div className="flex items-center justify-between"><MicroLabel>Project index</MicroLabel><MicroLabel>{String(projects.length).padStart(2, "0")} files</MicroLabel></div>
                    <div className="mt-4 space-y-4">
                      {(registerProjects.length ? registerProjects : projects.slice(1, 4)).map((project, index) => (
                        <Link key={project.id} href={projectHref(project.slug)} className="group grid grid-cols-[34px_1fr_auto] gap-3 border-b border-dashed border-[#d9d4ca] pb-4 last:border-b-0 last:pb-0">
                          <span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#dcb458]">0{index + 2}</span>
                          <div>
                            <p className={`${displayFont} text-[1.12rem] font-black uppercase leading-none`}>{project.title}</p>
                            <p className="mt-2 text-xs leading-5 text-[#6d6861]">{project.location}{project.year ? ` / ${project.year}` : ""}</p>
                          </div>
                          <span className="font-mono text-[8px] uppercase tracking-[.12em] text-[#827c73] group-hover:text-[#dcb458]">View</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1.08fr_.92fr]">
                    {secondaryProjects.map((project, index) => (
                      <Link key={project.id} href={projectHref(project.slug)} className={`${index === 1 ? "sm:mt-12" : ""} group overflow-hidden border border-[#d9d4ca] bg-[#e7e0d5]`}>
                        <DatabaseImage src={project.image} alt={project.title} className={`w-full object-cover ${index === 0 ? "aspect-[5/4]" : "aspect-[4/5]"}`} placeholderLabel={`Media project ${String(index + 2).padStart(2, "0")} belum diisi`} />
                        <div className="p-4">
                          <MicroLabel>{project.category} / {String(index + 2).padStart(2, "0")}</MicroLabel>
                          <p className={`${displayFont} mt-2 text-[1.25rem] font-black uppercase leading-[.95]`}>{project.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10 border border-dashed border-[#bdb6ac] px-6 py-12 text-center"><MicroLabel>Belum ada project published</MicroLabel></div>
            )}
          </div>
        </section>

        {/* PROCESS — compact, image statis lokal */}
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.66fr_.72fr_.62fr] lg:px-10">
            <div>
              <MicroLabel>04 / Site sequence / work logic</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[430px] text-[clamp(2.9rem,4.5vw,4.7rem)] font-black uppercase leading-[.9] tracking-[-.035em]`}>Rencana harus bisa dibangun.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#657184]">Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.</p>
            </div>

            <div className="relative border-l border-[#b8b1a7] pl-7">
              {[
                ["01", "PLAN", "Survey lokasi, kebutuhan, risiko, dan baseline scope."],
                ["02", "COORDINATE", "Desain, estimasi, material, dan shop drawing diselaraskan."],
                ["03", "BUILD", "Eksekusi bergerak bersama kontrol mutu dan catatan perubahan."],
                ["04", "DELIVER", "Inspection, close-out, dan handover dirapikan sebagai satu record."],
              ].map(([number, title, text]) => (
                <div key={number} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[32px] top-2 h-2.5 w-2.5 rounded-full bg-[#dcb458]" />
                  <div className="flex items-baseline gap-3"><span className={`${displayFont} text-xl font-black`}>{number}</span><span className={`${displayFont} text-[1.05rem] font-black uppercase`}>{title}</span></div>
                  <p className="mt-2 max-w-sm text-[13px] leading-6 text-[#657184]">{text}</p>
                </div>
              ))}
            </div>

            <div className="grid content-start gap-4">
              <div className="overflow-hidden [border-radius:42%_58%_52%_48%/48%_42%_58%_52%] border border-[#d9d4ca] bg-[#e6dfd3]">
                <DatabaseImage src={processPrimary} alt="Perencanaan dan koordinasi proyek" className="aspect-[4/3] w-full object-cover" placeholderLabel="Tambahkan gambar statis perencanaan" />
              </div>
              <div className="border-l-2 border-[#dcb458] bg-[#ece7df] p-4">
                <MicroLabel>Site note / QC-04</MicroLabel>
                <p className={`${displayFont} mt-3 max-w-[280px] text-[1.6rem] font-black uppercase leading-[.96]`}>Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRECISION — lebih teknis, tanpa card SaaS */}
        <section className="relative overflow-hidden bg-[#14243f] py-16 text-[#f8f4ec] sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-8 px-5 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:items-end lg:px-10">
            <div>
              <MicroLabel className="text-white/48">Control / tolerance / handover</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[650px] text-[clamp(3rem,4.8vw,5rem)] font-black uppercase leading-[.9] tracking-[-.035em]`}>Presisi menjaga semuanya tetap terhubung.</h2>
            </div>

            <div className="grid gap-0 border-y border-white/15 sm:grid-cols-3">
              {[
                ["QC", "CHECK / RECORD", "Keputusan mutu dicatat sebelum pekerjaan bergerak ke tahap berikutnya."],
                ["RFI", "CLARIFY / CLOSE", "Pertanyaan teknis ditutup dengan jawaban yang bisa dirujuk kembali."],
                ["H/O", "VERIFY / HANDOVER", "Pemeriksaan akhir dirapikan menjadi close-out yang mudah dibaca."],
              ].map(([code, label, text], index) => (
                <div key={code} className={`py-5 sm:px-5 ${index > 0 ? "border-t border-white/15 sm:border-l sm:border-t-0" : ""}`}>
                  <p className={`${displayFont} text-3xl font-black text-[#dcb458]`}>{code}</p>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[.15em] text-white/68">{label}</p>
                  <p className="mt-4 max-w-[260px] text-[13px] leading-6 text-white/58">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM — adaptif, tidak menyisakan ruang kosong */}
        {team.length > 0 && (
          <section className="relative border-b border-[#d9d4ca] py-14 sm:py-18">
            <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="grid gap-7 lg:grid-cols-[.52fr_1.48fr] lg:items-end">
                <div>
                  <MicroLabel>06 / Field crew / personnel</MicroLabel>
                  <h2 className={`${displayFont} mt-4 max-w-[390px] text-[clamp(2.5rem,3.7vw,4rem)] font-black uppercase leading-[.91] tracking-[-.03em]`}>Tim lapangan dan koordinasi.</h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[#657184] lg:justify-self-end">Tim tidak dipajang sebagai filler. Setiap personel tampil sebagai bagian dari proses koordinasi dan delivery proyek.</p>
              </div>

              {team.length === 1 ? (
                <article className="mt-9 grid gap-6 border-y border-[#cfcac1] py-6 sm:grid-cols-[180px_1fr_auto] sm:items-center">
                  <DatabaseImage src={team[0].image} alt={team[0].name} className="aspect-square w-full object-cover sm:h-[180px]" placeholderLabel="Foto team belum diisi" />
                  <div>
                    <MicroLabel>Personnel / 01</MicroLabel>
                    <p className={`${displayFont} mt-2 text-[2rem] font-black uppercase leading-none`}>{team[0].name}</p>
                    <p className="mt-2 text-sm text-[#657184]">{team[0].position}</p>
                    {team[0].description ? <p className="mt-4 max-w-xl text-sm leading-7 text-[#67625b]">{team[0].description}</p> : null}
                  </div>
                  <div className="grid gap-2 font-mono text-[8px] uppercase tracking-[.14em] text-[#848d99]"><span>Field coordination</span><span>Site communication</span><span>Delivery support</span></div>
                </article>
              ) : (
                <div className="mt-9 grid gap-5 md:grid-cols-3">
                  {team.slice(0, 3).map((member, index) => (
                    <article key={member.id} className={`${index === 1 ? "md:mt-8" : ""} overflow-hidden border border-[#d9d4ca] bg-[#eee7dc]`}>
                      <DatabaseImage src={member.image} alt={member.name} className={`w-full object-cover ${index === 1 ? "aspect-[4/5]" : "aspect-[5/4]"}`} placeholderLabel={`Foto team ${index + 1} belum diisi`} />
                      <div className="p-4">
                        <MicroLabel>Personnel / {String(index + 1).padStart(2, "0")}</MicroLabel>
                        <p className={`${displayFont} mt-2 text-[1.3rem] font-black uppercase leading-none`}>{member.name}</p>
                        <p className="mt-2 text-xs text-[#657184]">{member.position}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TESTIMONIAL — field memo compact */}
        <section className="relative border-b border-[#d9d4ca] py-14 sm:py-16">
          <div className="mx-auto grid w-full max-w-[1120px] gap-6 px-5 sm:px-8 lg:grid-cols-[100px_1fr_auto] lg:items-start lg:px-10">
            <Quote className="h-16 w-16 text-[#c9c2b8] lg:h-20 lg:w-20" />
            <div>
              <MicroLabel>07 / Field memo / client record</MicroLabel>
              <blockquote className="mt-4 max-w-3xl text-xl leading-[1.5] text-[#263b58] sm:text-2xl">“{quote?.quote || "Koordinasi yang baik membuat pekerjaan lapangan jauh lebih tenang karena keputusan penting sudah dibahas sebelum menjadi masalah."}”</blockquote>
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[.15em] text-[#dcb458]">— {quote?.name || "Project Client"}{quote?.role ? ` / ${quote.role}` : ""}</p>
            </div>
            <div className="hidden border-l border-[#cfcac1] pl-5 font-mono text-[8px] uppercase leading-6 tracking-[.14em] text-[#848d99] lg:block"><span className="block">Record / TM-01</span><span className="block">Status / Filed</span><span className="block">Source / Client</span></div>
          </div>
        </section>

        {/* CTA — lebih pendek, hierarchy jelas */}
        <section className="relative py-14 sm:py-16">
          <div className="mx-auto grid w-full max-w-[1480px] gap-7 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
            <div>
              <MicroLabel>08 / Closing note / next project</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[760px] text-[clamp(3.2rem,5.2vw,5.6rem)] font-black uppercase leading-[.88] tracking-[-.04em]`}>Mari bangun sesuatu yang bertahan.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#657184]">Mulai dari kebutuhan, kondisi lapangan, dan keputusan yang benar-benar perlu diselesaikan terlebih dahulu.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-4 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[.12em]">Talk to our team <ArrowRight className="h-4 w-4 text-[#dcb458]" /></Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
