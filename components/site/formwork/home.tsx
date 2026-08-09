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
        <section className="border-t border-[#ddd6ca] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
  {(() => {
    const projectList = (projects ?? []).slice(0, 4);
    const featuredProject = projectList[0];
    const secondaryProjects = projectList.slice(1, 3);

    return (
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.9fr)] lg:items-start">
        <div className="space-y-8">
          <MicroLabel>03 / Selected work / project register</MicroLabel>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="overflow-hidden border border-[#d9d1c4] bg-[#f8f4ec] shadow-[0_16px_34px_rgba(20,36,63,0.07)]" style={{ clipPath: "polygon(0% 0%,92% 0%,100% 11%,100% 100%,8% 100%,0% 88%)" }}>
              <DatabaseImage
                src={featuredProject?.coverImage ?? featuredProject?.imageUrl ?? featuredProject?.thumbnailUrl ?? featuredProject?.image ?? LOCAL_MEDIA.projectsHero}
                alt={featuredProject?.title ?? "Selected project"}
                className="h-[380px] w-full object-cover object-center"
              />
              <div className="space-y-3 border-t border-[#e1d8ca] px-5 py-5">
                <MicroLabel>Featured register</MicroLabel>
                <p className="text-[clamp(1.6rem,2.5vw,2.5rem)] font-semibold uppercase leading-[0.96] tracking-[-0.04em] text-[#14243f]">
                  {featuredProject?.title ?? "Project utama"}
                </p>
                <p className="text-[13px] leading-7 text-[#5f6976]">
                  {featuredProject?.location ?? featuredProject?.summary ?? featuredProject?.excerpt ?? "Satu proyek utama ditampilkan sebagai focal point agar pembaca langsung memahami skala dan konteks pekerjaan."}
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {secondaryProjects.map((project, index) => (
                <Link
                  key={project?.id ?? project?.slug ?? index}
                  href={`/projects/${project?.slug ?? project?.id ?? ""}`}
                  className={`group overflow-hidden border border-[#d9d1c4] bg-[#f8f4ec] p-4 shadow-[0_12px_28px_rgba(20,36,63,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,36,63,0.09)] ${index === 0 ? "lg:translate-y-6" : "lg:-translate-y-3"}`}
                  style={{ clipPath: index % 2 === 0 ? "polygon(10% 0%,100% 0%,100% 88%,90% 100%,0% 100%,0% 14%)" : "polygon(0% 0%,90% 0%,100% 14%,100% 100%,10% 100%,0% 82%)" }}
                >
                  <DatabaseImage
                    src={project?.coverImage ?? project?.imageUrl ?? project?.thumbnailUrl ?? project?.image ?? LOCAL_MEDIA.projectsHero}
                    alt={project?.title ?? "Project"}
                    className="h-[140px] w-full object-cover object-center"
                  />
                  <div className="mt-4 space-y-2">
                    <MicroLabel>{`File / ${String(index + 2).padStart(2, "0")}`}</MicroLabel>
                    <p className="text-lg font-semibold uppercase leading-tight tracking-[-0.03em] text-[#14243f]">
                      {project?.title ?? "Project record"}
                    </p>
                    <p className="text-[12px] leading-6 text-[#5f6976]">
                      {project?.location ?? project?.summary ?? project?.excerpt ?? "Record pendukung sebagai indeks keputusan dan bukti kerja lapangan."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:pt-9">
          <div className="space-y-6 border-t border-[#ddd6ca] pt-6">
            <h2 className={`${displayFont} text-[clamp(3rem,5.1vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-[#14243f]`}>
              Project dibaca sebagai rangkaian keputusan.
            </h2>
            <p className="max-w-md text-[15px] leading-8 text-[#5f6976]">
              Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja â€” bukan dipaksa memenuhi halaman dengan grid seragam.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 border-b border-[#dcb458]/70 pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#14243f]"
            >
              Open full register <span aria-hidden>â†’</span>
            </Link>
          </div>

          <div className="border border-[#ddd5c8] bg-[#f8f4ec] px-5 py-5 shadow-[0_10px_24px_rgba(20,36,63,0.05)]">
            <MicroLabel>Project index</MicroLabel>
            <div className="mt-4 space-y-4">
              {projectList.map((project, index) => (
                <div key={project?.id ?? project?.slug ?? index} className="flex items-start justify-between gap-4 border-t border-[#e3dacb] pt-4 first:border-t-0 first:pt-0">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#dcb458]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-base font-semibold uppercase leading-tight tracking-[-0.03em] text-[#14243f]">
                      {project?.title ?? "Project record"}
                    </p>
                    <p className="mt-1 text-[12px] leading-6 text-[#5f6976]">
                      {project?.location ?? project?.summary ?? project?.excerpt ?? "Dokumentasi singkat proyek."}
                    </p>
                  </div>
                  <Link href={`/projects/${project?.slug ?? project?.id ?? ""}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#758094]">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  })()}
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
