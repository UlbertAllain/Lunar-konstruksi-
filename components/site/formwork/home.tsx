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
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,81%_0%,100%_13%,100%_72%,92%_72%,84%_100%,19%_100%,0%_80%,0%_20%)]">
                <DatabaseImage src={heroImage} alt="Lunar Konstruksi — construction field" className="h-full w-full object-contain" placeholderLabel="Tambahkan foto hero lokal di public/" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
              </div>

              <div className="absolute left-[5%] top-[14%] hidden -rotate-55 lg:block"><MicroLabel>Phase 02 / Structure</MicroLabel></div>
              <div className="absolute right-6 top-[30%] hidden flex-col gap-12 font-mono text-[9px] font-semibold text-white/80 lg:flex"><span>+12.400</span><span>+09.600</span><span>+06.800</span></div>

              <div className="absolute bottom-[9%] left-[4%] h-[205px] w-[225px] -rotate-[7deg] overflow-hidden border-[7px] border-[#f5f1e8] bg-[#f8f4ed] shadow-[0_18px_46px_rgba(20,36,63,0.13)] [clip-path:polygon(18%_0%,100%_7%,92%_100%,0%_88%,4%_20%)] sm:h-[235px] sm:w-[255px] lg:left-[5%] lg:h-[265px] lg:w-[290px]">
                <DatabaseImage src={heroInset} fallbackSrc={localMediaAt(1)} alt="Project detail" className="h-full w-full object-cover" />
              </div>

              {/* FLOATING-HERO-FIELD-CARD */}
<div className="absolute right-[5%] top-[13%] z-30 hidden w-[218px] rotate-[5deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_52px_rgba(20,36,63,0.14)] backdrop-blur-[2px] [clip-path:polygon(10%_0%,100%_0%,94%_88%,84%_100%,0%_91%,0%_16%)] lg:block">
  <div className="border-b border-[#e5ddd1] px-4 py-3">
    <MicroLabel>Field note / 01</MicroLabel>
    <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
      Struktur, urutan kerja, dan koordinasi dibaca sebagai satu rangkaian.
    </p>
  </div>
  <div className="grid grid-cols-2 text-[10px] text-[#566171]">
    <div className="border-r border-[#e5ddd1] px-4 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#d2aa4d]">Phase</p>
      <p className="mt-1 font-semibold">Structure</p>
    </div>
    <div className="px-4 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#d2aa4d]">Scope</p>
      <p className="mt-1 font-semibold">Execution</p>
    </div>
  </div>
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
        <section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
  <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
    <div className="grid gap-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
      <div className="lg:pt-4">
        <MicroLabel>02 / Capabilities / field package</MicroLabel>
        <h2 className={`${displayFont} mt-5 max-w-[520px] text-[clamp(2.9rem,4.8vw,5.4rem)] font-black uppercase leading-[.9] tracking-[-.038em] text-[#14243f]`}>
          Layanan harus langsung terbaca.
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-8 text-[#5f6976]">
          Capabilities sekarang berfungsi sebagai service showcase. Pengguna bisa langsung melihat apa yang Lunar kerjakan tanpa harus membaca collage visual terlebih dahulu.
        </p>

        <div className="mt-8 hidden max-w-[300px] border-l-2 border-[#dcb458] bg-[#f8f4ec] px-4 py-4 lg:block">
          <MicroLabel>Scope reading / 02</MicroLabel>
          <p className="mt-3 text-[12px] leading-6 text-[#5f6976]">
            Tiap layanan diposisikan sebagai bagian dari alur kerja: persiapan, struktur, instalasi, finishing, sampai handover.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(92px,auto)]">
        {services.slice(0, 6).map((service, index) => {
          const layout = [
            "lg:col-span-7 lg:row-span-2 min-h-[235px]",
            "lg:col-span-5 min-h-[170px] lg:translate-y-5",
            "lg:col-span-4 min-h-[180px]",
            "lg:col-span-8 min-h-[180px] lg:-translate-y-3",
            "lg:col-span-5 min-h-[165px] lg:translate-y-3",
            "lg:col-span-7 min-h-[170px]",
          ][index] ?? "lg:col-span-6 min-h-[170px]";

          const shapes = [
            "polygon(8% 0%,100% 0%,100% 86%,92% 100%,0% 100%,0% 14%)",
            "polygon(0% 0%,92% 0%,100% 15%,100% 100%,10% 100%,0% 82%)",
            "polygon(10% 0%,100% 0%,92% 100%,0% 100%,0% 12%)",
          ];

          return (
            <Link
              key={service.id}
              href={service.slug ? `/services/${service.slug}` : "/services"}
              className={`group relative flex overflow-hidden border border-[#d9d1c4] bg-[#f8f4ec] p-5 shadow-[0_12px_30px_rgba(20,36,63,.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,36,63,.09)] ${layout}`}
              style={{ clipPath: shapes[index % shapes.length] }}
            >
              <span className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full border border-[#dcb458]/35 bg-[#dcb458]/10" />

              <div className="relative flex w-full flex-col justify-between gap-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <MicroLabel>{`SRV-${String(index + 1).padStart(2, "0")}`}</MicroLabel>
                    <span className="font-mono text-[8px] uppercase tracking-[.15em] text-[#7c8593]">Field package</span>
                  </div>

                  <h3 className="mt-6 max-w-[13ch] text-[clamp(1.55rem,2.35vw,2.65rem)] font-semibold uppercase leading-[.94] tracking-[-.04em] text-[#14243f]">
                    {service.name}
                  </h3>

                  <p className="mt-4 max-w-[34ch] text-[12px] leading-6 text-[#5f6976]">
                    Ruang lingkup, koordinasi, dan eksekusi layanan dirapikan sebagai satu paket kerja yang mudah dibaca.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#e3dacb] pt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[.16em] text-[#7c8593]">Scope / detail / delivery</span>
                  <span className="text-sm text-[#14243f] transition group-hover:translate-x-1">â†’</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
</section>

        {/* SELECTED WORK — editorial spread, bukan grid berulang */}
        <section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
  <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
    <div className="grid gap-10 xl:grid-cols-[1.16fr_.84fr] xl:gap-16 xl:items-center">
      <div>
        <MicroLabel>03 / Selected work / project register</MicroLabel>

        {featuredProject ? (
          <div className="relative mt-7 min-h-[520px] sm:min-h-[570px]">
            <Link
              href={projectHref(featuredProject.slug)}
              className="group absolute inset-x-0 top-0 overflow-hidden border border-[#d8d1c6] bg-[#e7e0d5] shadow-[0_16px_34px_rgba(20,36,63,.07)] sm:right-[16%]"
              style={{ clipPath: "polygon(0% 0%,92% 0%,100% 10%,100% 88%,92% 100%,8% 100%,0% 90%)" }}
            >
              <DatabaseImage
                src={featuredProject.image}
                alt={featuredProject.title}
                className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-[1.015] sm:h-[420px]"
                placeholderLabel="Media project utama belum diisi"
              />
              <div className="border-t border-[#ddd5c8] bg-[#f8f4ec] px-5 py-5">
                <MicroLabel>Featured record / 01</MicroLabel>
                <h3 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold uppercase leading-[.95] tracking-[-.04em] text-[#14243f]">
                  {featuredProject.title}
                </h3>
                <p className="mt-3 max-w-xl text-[12px] leading-6 text-[#5f6976]">
                  {featuredProject.location}{featuredProject.year ? ` / ${featuredProject.year}` : ""}
                </p>
              </div>
            </Link>

            {secondaryProjects[0] ? (
              <Link
                href={projectHref(secondaryProjects[0].slug)}
                className="group absolute bottom-0 right-0 hidden w-[36%] overflow-hidden border border-[#d8d1c6] bg-[#f8f4ec] shadow-[0_16px_34px_rgba(20,36,63,.09)] sm:block"
                style={{ clipPath: "polygon(10% 0%,100% 0%,100% 90%,90% 100%,0% 100%,0% 14%)" }}
              >
                <DatabaseImage
                  src={secondaryProjects[0].image}
                  alt={secondaryProjects[0].title}
                  className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  placeholderLabel="Media project pendukung belum diisi"
                />
                <div className="px-4 py-4">
                  <MicroLabel>File / 02</MicroLabel>
                  <p className="mt-2 text-[1.05rem] font-semibold uppercase leading-[.95] tracking-[-.025em] text-[#14243f]">
                    {secondaryProjects[0].title}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-[#bdb6ac] px-6 py-12 text-center">
            <MicroLabel>Belum ada project published</MicroLabel>
          </div>
        )}
      </div>

      <div className="xl:pl-4">
        <div className="border-t border-[#cfc8bd] pt-6">
          <MicroLabel>Selected record / editorial note</MicroLabel>
          <h2 className={`${displayFont} mt-5 max-w-[520px] text-[clamp(3rem,4.7vw,5.3rem)] font-black uppercase leading-[.89] tracking-[-.04em] text-[#14243f]`}>
            Project dibaca sebagai rangkaian keputusan.
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#5f6976]">
            Satu proyek utama menjadi focal point. Project kedua cukup hadir sebagai record pendukungâ€”tanpa daftar judul yang mengulang informasi yang sudah tampil di visual.
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex items-center gap-3 border-b border-[#dcb458]/75 pb-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#14243f]"
          >
            Open full register <span className="h-px w-10 bg-[#dcb458]" /> â†’
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-y border-[#ddd5c8] py-5">
          <div>
            <MicroLabel>Record logic</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Featured work menjadi bukti utama, bukan sekadar thumbnail katalog.</p>
          </div>
          <div>
            <MicroLabel>Archive route</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Semua record lengkap tetap tersedia di halaman Projects.</p>
          </div>
        </div>
      </div>
    </div>
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
