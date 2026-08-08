import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, Crosshair, HeroMeasureCurve, MicroLabel, TechnicalStamp, displayFont } from "./decor";
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
      <p className={`${displayFont} text-[30px] font-black leading-none tracking-[-.025em] text-[#202829] sm:text-[34px]`}>{value}</p>
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

function ProjectPlaceholder({ index }: { index: number }) {
  return (
    <div className="flex h-full min-h-[160px] items-center justify-center border border-dashed border-[#bcb4a8] bg-[#ebe5dc]">
      <div className="text-center">
        <p className={`${displayFont} text-xl font-black uppercase text-[#3a4141]`}>Project slot {String(index + 1).padStart(2, "0")}</p>
        <p className="mt-2 font-mono text-[8px] uppercase tracking-[.14em] text-[#77716a]">media belum diisi</p>
      </div>
    </div>
  );
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

  const heroImage = uniqueVisual([LOCAL_MEDIA.hero, localImages[0], projectImages[0]], used);
  const heroInset = uniqueVisual([localImages[1], teamImages[0], projectImages[1]], used);
  const capabilityPrimary = uniqueVisual([localImages[2], serviceImages[0], projectImages[1]], used);
  const capabilitySecondary = uniqueVisual([localImages[3], projectImages[2], teamImages[1]], used);
  const capabilityDetail = uniqueVisual([localImages[4], serviceImages[1], teamImages[2]], used);
  const processVisual = uniqueVisual([localImages[5], projectImages[3], serviceImages[2]], used);
  const fieldNoteVisual = uniqueVisual([localImages[6], teamImages[3], projectImages[4]], used);

  const quote = testimonials[0];
  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1, 5);

  return (
    <div className="overflow-hidden bg-[#f2eee7] text-[#22292a]">
      <FormworkHeader />
      <main>
        {/* 01 — HERO: retained, refined */}
        <section className="relative border-b border-[#d8d1c6]">
          <BlueprintLayer />
          <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[.79fr_1.21fr] lg:min-h-[850px]">
            <div className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
              <div className="max-w-[600px]">
                <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#e36c2f]" /><MicroLabel>General contracting / field coordination</MicroLabel></div>
                <h1 className={`${displayFont} mt-9 text-[clamp(3.15rem,5.35vw,5.7rem)] font-black uppercase leading-[.88] tracking-[-.035em] text-[#202829]`}>
                  Kami membangun dari dasar yang jelas.
                </h1>
                <div className="mt-7 h-px w-10 bg-[#e36c2f]" />
                <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-[#474c4b]">
                  Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan perlu bergerak dalam satu alur yang mudah dibaca—bukan saling mengejar di tengah proyek.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  <TechnicalStamp>Package / S-02</TechnicalStamp>
                  <TechnicalStamp>Field / Active</TechnicalStamp>
                </div>
                <Link href="/projects" className="mt-8 inline-flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#263033]">
                  Lihat pekerjaan kami <span className="h-px w-12 bg-[#e36c2f]" /><ArrowRight className="h-4 w-4 text-[#e36c2f]" />
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[#d4cec4] pt-5 font-mono text-[8px] uppercase tracking-[.12em] text-[#77716a] sm:grid-cols-4 lg:mt-0">
                <span>Rebar / 01</span><span>Formwork / 02</span><span>Concrete / 03</span><span>Handover / 04</span>
              </div>
            </div>

            <div className="relative min-h-[540px] lg:min-h-full">
              <div className="absolute inset-y-[3%] right-0 w-[92%] overflow-hidden [border-bottom-left-radius:44%_23%] [border-top-left-radius:56%_42%] lg:w-[94%]">
                <DatabaseImage src={heroImage} alt="Lunar Konstruksi — construction field" className="h-full w-full object-cover" placeholderLabel="Tambahkan hero lokal: public/images/site/hero-construction.*" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
              </div>
              <div className="absolute left-[7%] top-[16%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-7 top-[31%] hidden flex-col gap-12 font-mono text-[9px] font-semibold text-white/80 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>
              <div className="absolute bottom-[8%] left-[4%] h-[205px] w-[205px] overflow-hidden rounded-full border-[9px] border-[#f2eee7] sm:h-[245px] sm:w-[245px] lg:h-[270px] lg:w-[270px]">
                <DatabaseImage src={heroInset} alt="Project coordination" className="h-full w-full object-cover" placeholderLabel="Foto engineer / blueprint belum diisi" />
              </div>
              <HeroMeasureCurve className="bottom-[-2%] left-[8%] hidden h-[710px] w-[620px] lg:block" />
              <Crosshair className="absolute bottom-[9%] right-[31%] hidden lg:block" />
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

        {/* 02 — CAPABILITIES: retained, refined */}
        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-28">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58%] bg-[#e9e3da] [clip-path:polygon(0_18%,42%_0,100%_15%,100%_100%,0_100%)] opacity-75" />
          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <div className="lg:pt-12">
                <MicroLabel>Capabilities / field package</MicroLabel>
                <h2 className={`${displayFont} mt-6 max-w-[480px] text-5xl font-black uppercase leading-[.9] tracking-[-.03em] sm:text-6xl lg:text-7xl`}>Struktur dimulai sebelum jam pertama.</h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-[#625e58]">Layanan dibaca sebagai bagian dari satu rangkaian kerja. Karena itu, setiap scope tetap punya hubungan dengan keputusan sebelum dan sesudahnya.</p>
                <div className="mt-8 flex flex-wrap gap-2"><TechnicalStamp>Scope / Coordinated</TechnicalStamp><TechnicalStamp>Revision / 01</TechnicalStamp></div>
                <div className="mt-10 max-w-[470px] space-y-4">
                  {services.slice(0, 5).map((service, index) => (
                    <Link key={service.id} href={service.slug ? `/services/${service.slug}` : "/services"} className="group grid grid-cols-[38px_1fr_auto] items-center border-b border-[#cfc8bd] pb-4">
                      <span className="font-mono text-[8px] text-[#e36c2f]">0{index + 1}</span>
                      <span className={`${displayFont} text-[clamp(1.3rem,2vw,1.8rem)] font-black uppercase tracking-[-.015em]`}>{service.name}</span>
                      <span className="font-mono text-[9px] text-[#e36c2f] transition group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[620px] sm:min-h-[700px] lg:min-h-[760px]">
                <figure className="absolute right-[2%] top-[1%] w-[57%] rotate-[1deg]">
                  <div className="overflow-hidden [border-radius:48%_52%_38%_62%/34%_48%_52%_66%]"><DatabaseImage src={capabilityPrimary} alt="Capability visual" className="h-[315px] w-full object-cover sm:h-[375px]" placeholderLabel="Foto service / capability belum diisi" /></div>
                  <figcaption className="mt-3 flex justify-between"><MicroLabel>Field / capability</MicroLabel><MicroLabel>01</MicroLabel></figcaption>
                </figure>
                <figure className="absolute bottom-[4%] left-[2%] w-[46%] -rotate-[3deg]">
                  <div className="overflow-hidden [border-radius:54%_46%_58%_42%/44%_52%_48%_56%]"><DatabaseImage src={capabilitySecondary} alt="Project documentation" className="h-[270px] w-full object-cover sm:h-[320px]" placeholderLabel="Foto project / field belum diisi" /></div>
                  <figcaption className="mt-3"><MicroLabel>Documented work / 02</MicroLabel></figcaption>
                </figure>
                <figure className="absolute bottom-[19%] right-[4%] w-[29%] rotate-[4deg]">
                  <div className="overflow-hidden [border-radius:62%_38%_50%_50%/40%_60%_40%_60%]"><DatabaseImage src={capabilityDetail} alt="Site detail" className="h-[185px] w-full object-cover sm:h-[220px]" placeholderLabel="Detail material / site belum diisi" /></div>
                  <figcaption className="mt-3 text-right"><MicroLabel>Detail / 03</MicroLabel></figcaption>
                </figure>
                <div aria-hidden="true" className="absolute left-[43%] top-[46%] h-px w-[18%] rotate-[-22deg] bg-[#e36c2f]" />
                <div aria-hidden="true" className="absolute left-[57%] top-[37%] h-2 w-2 rounded-full bg-[#e36c2f]" />
              </div>
            </div>
          </div>
        </section>

        {/* 03 — PROJECT DOSSIER */}
        <section className="relative border-b border-[#d8d1c6] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <MicroLabel>Selected work / project dossier</MicroLabel>
                <h2 className={`${displayFont} mt-5 max-w-[630px] text-5xl font-black uppercase leading-[.9] tracking-[-.03em] sm:text-6xl lg:text-7xl`}>Project dibaca sebagai rangkaian keputusan.</h2>
              </div>
              <div className="lg:justify-self-end lg:max-w-[520px]">
                <p className="text-sm leading-7 text-[#5f5b55]">Bukan katalog foto. Setiap project membawa lokasi, scope, urutan kerja, dan keputusan teknis yang berbeda.</p>
                <div className="mt-5 flex items-center gap-3"><span className="h-px w-14 bg-[#e36c2f]" /><MicroLabel>Register / {String(projects.length).padStart(2, "0")} records</MicroLabel></div>
              </div>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
              <article className="relative min-h-[540px] overflow-hidden bg-[#d9d2c7] lg:min-h-[680px]">
                {featuredProject ? (
                  <>
                    <DatabaseImage src={featuredProject.image} alt={featuredProject.title} className="absolute inset-0 h-full w-full object-cover" placeholderLabel="Media featured project belum diisi" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172124]/85 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 grid gap-5 p-6 text-white sm:grid-cols-[1fr_auto] sm:p-8">
                      <div>
                        <MicroLabel light>Featured / P-01</MicroLabel>
                        <h3 className={`${displayFont} mt-3 max-w-2xl text-4xl font-black uppercase leading-[.9] sm:text-5xl`}>{featuredProject.title}</h3>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">{featuredProject.description || "Project record yang mewakili proses koordinasi, pelaksanaan, dan penyelesaian lapangan."}</p>
                      </div>
                      <div className="self-end text-right font-mono text-[8px] uppercase leading-5 tracking-[.12em] text-white/70">
                        <p>{featuredProject.location}</p><p>{featuredProject.category}</p>{featuredProject.year ? <p>{featuredProject.year}</p> : null}
                      </div>
                    </div>
                  </>
                ) : <ProjectPlaceholder index={0} />}
              </article>

              <aside className="flex flex-col justify-between border-y border-[#c8c0b5] py-2">
                <div>
                  <div className="flex items-center justify-between border-b border-[#c8c0b5] py-4"><MicroLabel>Project index</MicroLabel><TechnicalStamp>Live records</TechnicalStamp></div>
                  {(projects.length ? projects : Array.from({ length: 4 }).map((_, index) => ({ id: `empty-${index}`, title: `Project slot ${index + 1}`, location: "Media belum diisi", slug: "", year: "" }))).slice(0, 6).map((project, index) => (
                    <Link key={project.id} href={"slug" in project && project.slug ? `/projects/${project.slug}` : "/projects"} className="group grid grid-cols-[46px_1fr_auto] items-center gap-3 border-b border-[#d6cfc5] py-5">
                      <span className="font-mono text-[8px] text-[#e36c2f]">P-{String(index + 1).padStart(2, "0")}</span>
                      <div><p className={`${displayFont} text-2xl font-black uppercase leading-none`}>{project.title}</p><p className="mt-2 font-mono text-[8px] uppercase tracking-[.11em] text-[#77716a]">{project.location}{"year" in project && project.year ? ` / ${project.year}` : ""}</p></div>
                      <ArrowRight className="h-4 w-4 text-[#e36c2f] transition group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
                <Link href="/projects" className="mt-8 inline-flex items-center gap-3 self-start border-b border-[#e36c2f] pb-2 font-mono text-[9px] uppercase tracking-[.12em]">Open full register <ArrowRight className="h-3.5 w-3.5" /></Link>
              </aside>
            </div>

            <div className="relative mt-8 min-h-[360px] lg:min-h-[420px]">
              {secondaryProjects[0] ? <Link href={secondaryProjects[0].slug ? `/projects/${secondaryProjects[0].slug}` : "/projects"} className="absolute left-0 top-2 w-[53%] overflow-hidden [clip-path:polygon(0_0,100%_0,88%_100%,0_86%)]"><DatabaseImage src={secondaryProjects[0].image} alt={secondaryProjects[0].title} className="h-[300px] w-full object-cover lg:h-[350px]" placeholderLabel="Media project 02 belum diisi" /><span className="absolute bottom-5 left-5 bg-[#f2eee7] px-3 py-2 font-mono text-[8px] uppercase tracking-[.12em]">P-02 / {secondaryProjects[0].title}</span></Link> : <div className="absolute left-0 top-2 w-[53%]"><ProjectPlaceholder index={1} /></div>}
              {secondaryProjects[1] ? <Link href={secondaryProjects[1].slug ? `/projects/${secondaryProjects[1].slug}` : "/projects"} className="absolute right-[18%] top-[14%] w-[29%] overflow-hidden rounded-[48%_52%_44%_56%/55%_42%_58%_45%]"><DatabaseImage src={secondaryProjects[1].image} alt={secondaryProjects[1].title} className="h-[235px] w-full object-cover lg:h-[275px]" placeholderLabel="Media project 03 belum diisi" /></Link> : null}
              {secondaryProjects[2] ? <Link href={secondaryProjects[2].slug ? `/projects/${secondaryProjects[2].slug}` : "/projects"} className="absolute bottom-0 right-0 w-[26%] overflow-hidden [clip-path:polygon(18%_0,100%_12%,100%_100%,0_100%)]"><DatabaseImage src={secondaryProjects[2].image} alt={secondaryProjects[2].title} className="h-[210px] w-full object-cover lg:h-[250px]" placeholderLabel="Media project 04 belum diisi" /></Link> : null}
              <div className="absolute bottom-4 left-[49%] hidden lg:block"><Crosshair /><MicroLabel>Survey point / 07</MicroLabel></div>
            </div>
          </div>
        </section>

        {/* 04 — SITE SEQUENCE */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div aria-hidden="true" className="absolute right-0 top-0 h-full w-[42%] bg-[#e8e1d7] [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.72fr_.68fr_.6fr] lg:px-10">
            <div>
              <MicroLabel>Site sequence / work logic</MicroLabel>
              <h2 className={`${displayFont} mt-5 max-w-[500px] text-5xl font-black uppercase leading-[.9] tracking-[-.03em] sm:text-6xl lg:text-7xl`}>Rencana harus bisa dibangun.</h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-[#5e5953]">Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.</p>
            </div>

            <div className="relative border-l border-[#bdb5aa] pl-8">
              {[
                ["01", "PLAN", "Survey lokasi, kebutuhan, risiko, dan baseline scope."],
                ["02", "COORDINATE", "Desain, estimasi, material, dan shop drawing diselaraskan."],
                ["03", "BUILD", "Eksekusi bergerak bersama kontrol mutu dan catatan perubahan."],
                ["04", "DELIVER", "Inspection, close-out, dan handover dirapikan sebagai satu record."],
              ].map(([number, title, text], index) => (
                <article key={number} className={`relative pb-9 ${index === 3 ? "pb-0" : ""}`}>
                  <span className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-4 border-[#f2eee7] bg-[#e36c2f]" />
                  <div className="flex items-baseline gap-4"><span className={`${displayFont} text-3xl font-black`}>{number}</span><h3 className={`${displayFont} text-2xl font-black uppercase tracking-[-.01em]`}>{title}</h3></div>
                  <p className="mt-3 max-w-[360px] text-sm leading-6 text-[#66615b]">{text}</p>
                </article>
              ))}
            </div>

            <div className="relative min-h-[480px]">
              <div className="absolute right-0 top-0 w-[92%] overflow-hidden [border-radius:52%_48%_42%_58%/38%_44%_56%_62%]">
                <DatabaseImage src={processVisual} alt="Site sequence" className="h-[330px] w-full object-cover" placeholderLabel="Tambahkan visual proses / site sequence" />
              </div>
              <div className="absolute bottom-4 left-0 max-w-[260px] border-l-2 border-[#e36c2f] bg-[#f2eee7]/92 px-5 py-4">
                <MicroLabel>Site note / QC-04</MicroLabel>
                <p className={`${displayFont} mt-3 text-2xl font-black uppercase leading-[.95]`}>Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.</p>
              </div>
              <Crosshair className="absolute bottom-[18%] right-[8%]" />
            </div>
          </div>
        </section>

        {/* 05 — PRECISION CONTROL PANEL */}
        <section className="relative overflow-hidden bg-[#172124] py-20 text-[#f4efe7] sm:py-24">
          <div className="absolute inset-y-0 right-[12%] hidden w-px bg-white/10 lg:block" />
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
            <div>
              <MicroLabel light>Control / tolerance / handover</MicroLabel>
              <h2 className={`${displayFont} mt-6 max-w-[720px] text-5xl font-black uppercase leading-[.88] tracking-[-.025em] sm:text-6xl lg:text-7xl`}>Presisi menjaga semuanya tetap terhubung.</h2>
              <p className="mt-7 max-w-xl text-sm leading-7 text-white/55">Kontrol tidak harus terlihat rumit. Yang penting: standar jelas, toleransi tercatat, dan perubahan dapat ditelusuri sampai serah terima.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 lg:self-end">
              {[
                ["S", "Safety", "Field control", "01"],
                ["T", "Tolerance", "Measured work", "±3mm"],
                ["H", "Handover", "Close-out", "100%"],
              ].map(([code, title, subtitle, value]) => (
                <article key={title} className="border-t border-white/20 pt-5">
                  <span className="inline-flex h-8 w-8 items-center justify-center border border-[#e36c2f]/70 font-mono text-[9px] font-semibold text-[#f0a06d]">{code}</span>
                  <p className={`${displayFont} mt-6 text-3xl font-black uppercase`}>{title}</p>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[.13em] text-white/45">{subtitle}</p>
                  <p className={`${displayFont} mt-7 text-4xl font-black text-[#f0a06d]`}>{value}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-14 flex w-full max-w-[1480px] items-center gap-4 px-5 sm:px-8 lg:px-10"><span className="h-px flex-1 bg-white/15" /><span className="font-mono text-[8px] uppercase tracking-[.14em] text-white/35">0 — 250 — 500 — 750 — 1000 mm</span></div>
        </section>

        {/* 06 — FIELD CREW */}
        {team.length ? (
          <section className="border-b border-[#d8d1c6] py-20 sm:py-24">
            <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="grid gap-8 lg:grid-cols-[.55fr_1.45fr] lg:items-end">
                <div><MicroLabel>Field crew / personnel record</MicroLabel><h2 className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-.03em] sm:text-6xl`}>Orang di balik koordinasi.</h2></div>
                <p className="max-w-lg text-sm leading-7 text-[#625e58] lg:justify-self-end">Foto dan data personel diambil langsung dari record Team. Setiap orang tampil sebagai bagian dari proses, bukan sekadar kartu profil.</p>
              </div>
              <div className="mt-12 grid auto-rows-[145px] grid-cols-2 gap-3 md:grid-cols-8 md:auto-rows-[170px]">
                {team.slice(0, 6).map((member, index) => {
                  const layout = ["col-span-2 row-span-2 md:col-span-3", "col-span-2 md:col-span-3", "col-span-1 row-span-2 md:col-span-2", "col-span-1 md:col-span-2", "col-span-2 md:col-span-3", "col-span-2 md:col-span-3"][index % 6];
                  return (
                    <article key={member.id} className={`group relative overflow-hidden bg-[#d9d3c9] ${layout}`}>
                      <DatabaseImage src={member.image} alt={member.name} className="h-full w-full object-cover grayscale-[15%] transition duration-500 group-hover:grayscale-0" placeholderLabel={`Foto ${member.name} belum diisi`} />
                      <div className="absolute inset-x-0 bottom-0 bg-[#172124]/88 px-4 py-3 text-white">
                        <p className={`${displayFont} text-xl font-black uppercase leading-none`}>{member.name}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[.12em] text-[#e8915f]">{member.position}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* 07 — FIELD NOTE TESTIMONIAL */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-10">
            <div className="relative min-h-[280px]">
              <div className="absolute left-0 top-0 w-[82%] -rotate-2 overflow-hidden bg-[#d7d0c5]">
                <DatabaseImage src={quote?.image || fieldNoteVisual} alt={quote?.name || "Project field note"} className="h-[260px] w-full object-cover" placeholderLabel="Foto testimonial / project note belum diisi" />
              </div>
              <TechnicalStamp className="absolute bottom-0 right-2 rotate-[3deg]">Filed / approved</TechnicalStamp>
            </div>
            <div className="relative border-l border-[#c9c2b8] pl-8 sm:pl-12">
              <Quote className="h-16 w-16 text-[#c9c2b8] sm:h-20 sm:w-20" />
              <blockquote className="mt-4 max-w-3xl text-2xl leading-[1.45] text-[#2a3031] sm:text-3xl">“{quote?.quote || "Koordinasi yang baik membuat pekerjaan lapangan jauh lebih tenang karena keputusan penting sudah dibahas sebelum menjadi masalah."}”</blockquote>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#e36c2f]">— {quote?.name || "Project Client"}{quote?.role ? ` / ${quote.role}` : ""}</p><MicroLabel>Field memo / client record</MicroLabel></div>
            </div>
          </div>
        </section>

        {/* 08 — CLOSING CTA */}
        <section className="relative border-t border-[#d8d1c6] py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:px-10">
            <div>
              <MicroLabel>Next / project discussion</MicroLabel>
              <h2 className={`${displayFont} mt-5 max-w-[820px] text-[clamp(3.3rem,6vw,6.8rem)] font-black uppercase leading-[.86] tracking-[-.035em]`}>Mari bangun sesuatu yang bertahan.</h2>
              <div className="mt-8 flex items-center gap-4"><span className="h-px w-16 bg-[#e36c2f]" /><TechnicalStamp>Ready / discuss</TechnicalStamp></div>
            </div>
            <div className="border-l border-[#c7bfb4] pl-7 lg:justify-self-end">
              <p className="max-w-sm text-sm leading-7 text-[#625e58]">Mulai dari konteks proyek, kebutuhan ruang, dan kondisi lapangan. Pembahasan pertama cukup untuk menentukan langkah berikutnya.</p>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-5 border-b border-[#e36c2f] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[.08em]">Talk to our team <span className="h-px w-10 bg-[#e36c2f]" /><ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
