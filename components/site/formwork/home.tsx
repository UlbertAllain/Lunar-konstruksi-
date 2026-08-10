import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { BlueprintLayer, MicroLabel, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { ServiceStaggeredCarousel } from "./service-staggered-carousel";
import {
  faqModel,
  projectModel,
  serviceModel,
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
  const faqs = data.faqs.map(faqModel);
  const testimonials = data.testimonials.map(testimonialModel).filter((item) => item.quote);

  const quote = testimonials[0];
  const processPrimary = LOCAL_MEDIA.processPlanning;

  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1, 3);

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        {/* HERO — dipertahankan, hanya typography/detail dipoles */}
        <section className="relative overflow-hidden border-b border-[#ded7cb] bg-[#f5f1e8]">
  <BlueprintLayer className="opacity-[0.035]" />

  <div className="relative mx-auto grid w-full max-w-[1480px] lg:min-h-[740px] lg:grid-cols-[0.9fr_1.1fr]">
    <div className="relative z-20 flex flex-col justify-between px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:px-10 lg:py-20">
      <div className="max-w-[610px]">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-[#dcb458]" />
          <MicroLabel>01 / Perencanaan / konstruksi / koordinasi</MicroLabel>
        </div>

        <h1 className={`${displayFont} mt-9 text-[clamp(2.35rem,10.5vw,4.8rem)] font-black uppercase leading-[0.87] tracking-[-0.05em] text-[#14243f]`}>
          Kami membangun dari dasar yang jelas.
        </h1>

        <p className="mt-7 max-w-[470px] text-[15px] leading-8 text-[#5d6877]">
          Dari perencanaan sampai pekerjaan selesai, setiap tahap kami susun agar keputusan lebih jelas, koordinasi lebih rapi, dan pekerjaan di lapangan tetap terarah.
        </p>

        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#14243f]"
        >
          Lihat pekerjaan kami
          <span className="h-px w-11 bg-[#dcb458]" />
          <ArrowRight className="h-4 w-4 text-[#dcb458]" />
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#d9d1c4] pt-5 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092] lg:mt-0">
        <span>Planning</span>
        <span>Coordination</span>
        <span>Execution</span>
        <span>Handover</span>
      </div>
    </div>

    <div className="relative min-h-[330px] sm:min-h-[470px] lg:min-h-full">
      <div
        className="absolute inset-y-[10%] right-[1%] w-[90%] overflow-hidden lg:inset-y-[9%] lg:right-[2%] lg:w-[91%]"
        style={{ borderRadius: "44% 56% 34% 66% / 22% 30% 70% 78%" }}
      >
        <DatabaseImage
          src={LOCAL_MEDIA.hero}
          alt="Lunar Konstruksi"
          className="h-full w-full object-cover object-center mix-blend-multiply"
          preload={true}
          sizes="(max-width: 1023px) 94vw, 50vw"
          placeholderLabel="Tambahkan home-hero.png"
        quality={95}
          />
      </div>

      <div
        className="absolute bottom-[10%] left-[5%] z-20 hidden h-[185px] w-[205px] overflow-hidden border-[6px] border-[#f5f1e8] bg-[#f8f4ec] shadow-[0_20px_50px_rgba(20,36,63,0.12)] sm:block lg:left-[7%] lg:h-[215px] lg:w-[238px]"
        style={{ borderRadius: "60% 40% 64% 36% / 38% 58% 42% 62%" }}
      >
        <DatabaseImage
          src={LOCAL_MEDIA.heroEngineer}
          alt="Engineer reviewing project plan"
          className="h-full w-full object-cover object-center"
          placeholderLabel="Tambahkan home-hero-engineer.png"
        quality={95}
          />
      </div>

      <div className="absolute right-[4%] top-[14%] z-20 hidden w-[188px] -rotate-[3deg] border border-[#ded5c7] bg-[#faf7f0]/95 px-4 py-3.5 shadow-[0_18px_44px_rgba(20,36,63,0.10)] lg:block">
        <MicroLabel>Field register / 01</MicroLabel>
        <p className="mt-3 text-[11px] leading-5 text-[#596474]">
          Perencanaan, urutan pekerjaan, dan kontrol lapangan kami susun agar setiap keputusan mudah dipahami.
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[#e4dccf] pt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7a8492]">
          <span>Grid B / 04</span>
          <span className="text-[#d1a849]">Active</span>
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 700 280"
        className="pointer-events-none absolute bottom-[7%] right-[4%] hidden h-[205px] w-[68%] overflow-visible lg:block"
        fill="none"
      >
        <path d="M12 205C102 248 160 74 286 124C394 167 415 245 520 182C591 140 611 65 688 89" stroke="#dcb458" strokeWidth="1.2" />
        <path d="M18 220C105 260 171 91 292 140C394 181 432 249 530 198C598 161 626 88 694 104" stroke="#182d4d" strokeOpacity="0.2" strokeDasharray="5 10" />
        <circle cx="160" cy="103" r="4" fill="#dcb458" />
        <circle cx="520" cy="182" r="4" fill="#dcb458" />
        <circle cx="688" cy="89" r="3" fill="#182d4d" />
      </svg>

      <div className="absolute bottom-[6%] right-[7%] hidden grid-cols-3 gap-5 xl:grid">
        {metric("08", "tahun pengalaman")}
        {metric(`${projects.length || 0}+`, "proyek terdokumentasi")}
        {metric("97%", "pekerjaan terkoordinasi")}
      </div>
    </div>
  </div>
</section>

        {/* CAPABILITIES — dipertahankan */}
                        <ServiceStaggeredCarousel services={services} />

<section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
  <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
    <div className="grid gap-10 xl:grid-cols-[1.16fr_.84fr] xl:gap-16 xl:items-center">
      <div>
        <MicroLabel>03 / Proyek pilihan</MicroLabel>

        {featuredProject ? (
          <div className="relative mt-7 sm:min-h-[570px]">
            <Link
              href={projectHref(featuredProject.slug)}
              className="group relative block overflow-hidden border border-[#d8d1c6] bg-[#e7e0d5] shadow-[0_16px_34px_rgba(20,36,63,.07)] sm:absolute sm:inset-x-0 sm:top-0 sm:right-[16%]"
              style={{ clipPath: "polygon(0% 0%,92% 0%,100% 10%,100% 88%,92% 100%,8% 100%,0% 90%)" }}
            >
              <DatabaseImage
                src={featuredProject.image}
                alt={featuredProject.title}
                className="h-[250px] w-full object-cover transition duration-700 group-hover:scale-[1.015] sm:h-[420px]"
                placeholderLabel="Foto proyek belum tersedia"
              />
              <div className="border-t border-[#ddd5c8] bg-[#f8f4ec] px-5 py-5">
                <MicroLabel>Proyek pilihan / 01</MicroLabel>
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
                  placeholderLabel="Foto proyek belum tersedia"
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
            <MicroLabel>Belum ada proyek yang ditampilkan</MicroLabel>
          </div>
        )}
      </div>

      <div className="xl:pl-4">
        <div className="border-t border-[#cfc8bd] pt-6">
          <MicroLabel>Proyek pilihan</MicroLabel>
          <h2 className={`${displayFont} mt-5 max-w-[520px] text-[clamp(2.25rem,3.35vw,3.45rem)] font-black uppercase leading-[.89] tracking-[-.04em] text-[#14243f]`}>
            Setiap proyek dibangun dari keputusan yang tepat.
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#5f6976]">
            Lihat beberapa pekerjaan yang telah kami tangani, lengkap dengan lokasi, lingkup pekerjaan, dan dokumentasi hasilnya.
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex items-center gap-3 border-b border-[#dcb458]/75 pb-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#14243f]"
          >
            Lihat semua proyek <span className="h-px w-10 bg-[#dcb458]" /> â†’
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-y border-[#ddd5c8] py-5">
          <div>
            <MicroLabel>Proses pekerjaan</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Setiap proyek ditampilkan untuk memberikan gambaran nyata mengenai lingkup dan hasil pekerjaan kami.</p>
          </div>
          <div>
            <MicroLabel>Lihat proyek</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Lihat proyek lainnya untuk mengenal lebih jauh pengalaman dan hasil pekerjaan Lunar Konstruksi.</p>
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
              <MicroLabel>04 / Alur kerja</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[430px] text-[clamp(2.15rem,3.15vw,3.25rem)] font-black uppercase leading-[.9] tracking-[-.035em]`}>Perencanaan yang siap diterapkan di lapangan.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#657184]">Empat tahap utama membantu setiap pekerjaan tetap terarah, dari kebutuhan awal sampai serah terima.</p>
            </div>

            <div className="relative sm:border-l sm:border-[#b8b1a7] sm:pl-7">
              {[
                ["01", "SURVEI", "Kami memahami lokasi, kebutuhan, kondisi awal, dan hal penting yang perlu diperhatikan."],
                ["02", "PERENCANAAN", "Desain, estimasi, material, dan kebutuhan teknis disusun dalam satu rencana kerja."],
                ["03", "PELAKSANAAN", "Pekerjaan berjalan bersama kontrol mutu dan pemantauan perubahan di lapangan."],
                ["04", "SERAH TERIMA", "Pekerjaan diperiksa kembali, dirapikan, dan disiapkan untuk proses serah terima."],
              ].map(([number, title, text]) => (
                <div key={number} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[32px] top-2 hidden h-2.5 w-2.5 rounded-full bg-[#dcb458] sm:block" />
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
                <MicroLabel>Catatan lapangan / QC-04</MicroLabel>
                <p className={`${displayFont} mt-3 max-w-[280px] text-[1.6rem] font-black uppercase leading-[.96]`}>Keputusan teknis perlu tetap jelas dari awal sampai pekerjaan selesai.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRECISION — lebih teknis, tanpa card SaaS */}
        <section className="relative bg-[#f5f1e8] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
  <div
    className="relative mx-auto w-full max-w-[1480px] overflow-hidden bg-[#14243f] px-6 py-14 text-[#f7f3eb] shadow-[0_28px_70px_rgba(20,36,63,0.16)] sm:px-9 lg:px-12 lg:py-16"
    style={{ borderRadius: "58px 150px 62px 130px / 50px 76px 54px 82px" }}
  >
    <svg aria-hidden="true" viewBox="0 0 1200 300" className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] w-full opacity-70" fill="none">
      <path d="M-40 235C126 96 238 291 394 166C540 49 671 260 832 132C982 14 1078 198 1250 65" stroke="#dcb458" strokeWidth="1.25" />
      <path d="M-24 254C140 123 250 308 409 186C553 75 690 278 846 151C993 32 1096 216 1265 89" stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeDasharray="5 11" />
      <circle cx="394" cy="166" r="5" fill="#dcb458" />
      <circle cx="832" cy="132" r="5" fill="#dcb458" />
      <circle cx="1078" cy="198" r="4" fill="#f7f3eb" />
    </svg>

    <div className="relative z-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <MicroLabel className="!text-[#dcb458]">05 / Kontrol mutu / serah terima</MicroLabel>
        <h2 className={`${displayFont} mt-6 max-w-[670px] text-[clamp(2.2rem,3.3vw,3.4rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-[#f8f4ec]`}>
          Kontrol yang konsisten menjaga kualitas pekerjaan.
        </h2>
        <p className="mt-6 max-w-md text-[14px] leading-7 text-white/58">
          Pengendalian mutu dilakukan sepanjang proyek untuk menjaga pekerjaan tetap sesuai rencana dan mendukung proses serah terima yang tertib.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:pb-2">
        {[
          ["QC", "04", "Pemeriksaan mutu", "Keputusan mutu dicatat sebelum pekerjaan bergerak ke tahap berikutnya."],
          ["INFO", "12", "Klarifikasi teknis", "Pertanyaan teknis dibahas dan dicatat agar keputusan tidak membingungkan di lapangan."],
          ["DONE", "100%", "Serah terima", "Pekerjaan akhir diperiksa dan disiapkan agar proses serah terima lebih tertib."],
        ].map(([code, value, label, description], index) => (
          <div
            key={code}
            className={`relative border border-white/12 bg-white/[0.035] p-5 backdrop-blur-[1px] ${index === 1 ? "sm:translate-y-5" : ""}`}
            style={{ borderRadius: index === 0 ? "32px 58px 28px 64px" : index === 1 ? "60px 26px 54px 34px" : "28px 68px 34px 58px" }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[#dcb458]">{code}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">{label}</span>
            </div>
            <p className="mt-5 text-[clamp(2.2rem,3.5vw,3.6rem)] font-semibold leading-none tracking-[-0.05em] text-white">{value}</p>
            <p className="mt-4 text-[11px] leading-6 text-white/58">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* FAQ â€” dipindahkan dari halaman layanan */}
        {faqs.length ? (
          <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20">
            <BlueprintLayer className="opacity-[0.045]" />

            <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="grid gap-7 border-b border-[#cfc8bd] pb-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
                <div>
                  <MicroLabel>06 / Pertanyaan umum</MicroLabel>
                  <h2
                    className={`${displayFont} mt-4 max-w-[560px] text-[clamp(2.15rem,3.3vw,3.35rem)] font-black uppercase leading-[.92] tracking-[-.035em]`}
                  >
                    Hal yang biasanya ditanyakan sebelum proyek dimulai.
                  </h2>
                </div>

                <p className="max-w-xl text-[13px] leading-6 text-[#657184] lg:justify-self-end">
                  Beberapa jawaban singkat untuk membantu Anda memahami proses
                  awal sebelum berdiskusi lebih lanjut dengan Lunar Konstruksi.
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {faqs.slice(0, 6).map((faq, index) => (
                  <article
                    key={faq.id}
                    className="group relative min-h-[210px] overflow-hidden border border-[#cec7bc] bg-[#faf7f0] p-5 transition duration-300 hover:border-[#b89a54] sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[8px] font-semibold uppercase tracking-[.14em] text-[#b58c2f]">
                        Q-{String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-2 w-2 rounded-full border border-[#dcb458]" />
                    </div>

                    <h3
                      className={`${displayFont} mt-8 text-[1.3rem] font-black uppercase leading-[.96] tracking-[-.02em] text-[#14243f]`}
                    >
                      {faq.question}
                    </h3>

                    <p className="mt-4 text-[12px] leading-6 text-[#657184]">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* TESTIMONIAL — field memo compact */}
        <section className="relative border-b border-[#d9d4ca] py-14 sm:py-16">
          <div className="mx-auto grid w-full max-w-[1120px] gap-6 px-5 sm:px-8 lg:grid-cols-[100px_1fr_auto] lg:items-start lg:px-10">
            <Quote className="h-16 w-16 text-[#c9c2b8] lg:h-20 lg:w-20" />
            <div>
              <MicroLabel>07 / Cerita klien</MicroLabel>
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
              <MicroLabel>08 / Mulai proyek Anda</MicroLabel>
              <h2 className={`${displayFont} mt-4 max-w-[760px] text-[clamp(2.2rem,3.35vw,3.45rem)] font-black uppercase leading-[.88] tracking-[-.04em]`}>Wujudkan proyek Anda bersama Lunar Konstruksi.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#657184]">Ceritakan kebutuhan dan kondisi proyek Anda. Kami bantu menentukan langkah awal yang paling sesuai.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-4 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[.12em]">Konsultasikan proyek <ArrowRight className="h-4 w-4 text-[#dcb458]" /></Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
