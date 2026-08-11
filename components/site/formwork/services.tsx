import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { projectModel, serviceModel, type SiteData } from "./data";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";

export function FormworkServices({ data }: { data: SiteData }) {
  const services = data.services.map(serviceModel);
  const projects = data.projects.map(projectModel);

  const processSteps = [
    {
      number: "01",
      title: "Survei & Kebutuhan",
      copy: "Memahami kondisi lapangan, kebutuhan, batas pekerjaan, dan target proyek.",
    },
    {
      number: "02",
      title: "Rencana & Koordinasi",
      copy: "Menyusun pendekatan kerja, detail kebutuhan, estimasi, serta koordinasi teknis.",
    },
    {
      number: "03",
      title: "Pelaksanaan & Kontrol",
      copy: "Pelaksanaan berjalan bersama kontrol mutu, progres, dan kesesuaian pekerjaan.",
    },
    {
      number: "04",
      title: "Pemeriksaan & Serah Terima",
      copy: "Pemeriksaan akhir, penyelesaian detail, dokumentasi, lalu proses serah terima.",
    },
  ];

  return (
    <div className="lunar-public-page overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader services={data.services} projects={data.projects} />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20 lg:py-24">
          <BlueprintLayer />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
            <div>
              <MicroLabel>Jasa konstruksi / Solo Raya</MicroLabel>

              <h1
                className={`${displayFont} mt-7 max-w-[720px] text-[clamp(2.3rem,7vw,4.6rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]`}
              >
                Layanan konstruksi yang terkoordinasi dari awal sampai selesai.
              </h1>

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#566476]">
                Kami menangani berbagai kebutuhan konstruksi, renovasi,
                interior, struktur, atap, dan pekerjaan bangunan lainnya dengan
                proses yang disesuaikan dengan kondisi serta kebutuhan proyek.
              </p>
            </div>

            <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[470px]">
              <div className="absolute inset-y-[2%] right-0 w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#e2ddd4] shadow-[0_22px_60px_rgba(20,36,63,0.1)] [clip-path:polygon(11%_0%,91%_0%,100%_12%,97%_91%,89%_100%,7%_96%,0%_84%,2%_14%)]">
                <DatabaseImage
                  src={
                    data.siteContent.servicesHero?.url ||
                    LOCAL_MEDIA.servicesHero ||
                    services[0]?.image ||
                    projects[0]?.image ||
                    ""
                  }
                  alt={services[0]?.name || "Layanan Lunar Konstruksi"}
                  className="h-full w-full object-cover"
                  quality={95}
                  preload
                  hero
                  sizes="(max-width: 1023px) 94vw, 55vw"
                />
              </div>

              <TechnicalArc
                label="SCOPE / FLOW"
                className="bottom-[-10%] left-[6%] h-[300px] w-[430px] rotate-[15deg]"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICES INTRO
        ====================================================== */}
        <section className="relative pt-14 sm:pt-16 lg:pt-20">
          <BlueprintLayer className="opacity-[0.025]" />

          <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-6 border-b border-[#d4cec4] pb-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <MicroLabel>Ruang lingkup pekerjaan</MicroLabel>

                <h2
                  className={`${displayFont} mt-5 max-w-[520px] text-[clamp(1.9rem,3vw,3rem)] font-black uppercase leading-[0.91] tracking-[-0.04em] text-[#14243f]`}
                >
                  Pilih layanan sesuai kebutuhan proyek.
                </h2>
              </div>

              <p className="max-w-lg text-[13px] leading-7 text-[#657184] lg:justify-self-end">
                Setiap proyek memiliki kondisi dan kebutuhan yang berbeda. Ruang
                lingkup pekerjaan dapat disesuaikan dengan kondisi lapangan,
                fungsi, serta target pengerjaan.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICES / COMPACT ALTERNATING
        ====================================================== */}
        <section className="relative pb-20">
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
            {services.map((service, index) => {
              const reversed = index % 2 === 1;

              return (
                <Link
                  key={service.id}
                  href={
                    service.slug ? `/services/${service.slug}` : "/services"
                  }
                  className="group block border-b border-[#d4cec4]"
                >
                  <article
                    className={[
                      "grid items-center gap-7 py-9",
                      "sm:py-10",
                      "lg:gap-12 lg:py-11",
                      reversed
                        ? "lg:grid-cols-[390px_minmax(0,1fr)]"
                        : "lg:grid-cols-[minmax(0,1fr)_390px]",
                      "xl:gap-14",
                      reversed
                        ? "xl:grid-cols-[410px_minmax(0,1fr)]"
                        : "xl:grid-cols-[minmax(0,1fr)_410px]",
                    ].join(" ")}
                  >
                    {/* =================================================
                        TEXT
                    ================================================== */}
                    <div
                      className={[
                        "order-1 flex min-w-0 flex-col justify-center",
                        reversed ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#b48c32]">
                          S-
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-8 bg-[#dcb458]" />
                      </div>

                      <h3
                        className={`${displayFont} mt-5 max-w-[520px] text-[clamp(1.75rem,2.35vw,2.45rem)] font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#14243f]`}
                      >
                        {service.name}
                      </h3>

                      <p className="mt-4 max-w-[520px] text-[13px] leading-7 text-[#657184]">
                        {service.shortDescription ||
                          "Ruang lingkup layanan disesuaikan dengan kebutuhan dan kondisi proyek."}
                      </p>

                      <div className="mt-6 flex items-center gap-4">
                        <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6f7987]">
                          Lihat detail layanan
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center border border-[#c9c1b5] transition duration-300 group-hover:border-[#14243f] group-hover:bg-[#14243f]">
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#14243f] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dcb458]" />
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        IMAGE
                    ================================================== */}
                    <div
                      className={[
                        "order-2 relative w-full",
                        reversed ? "lg:order-1" : "lg:order-2",
                      ].join(" ")}
                    >
                      {/* OFFSET FRAME */}
                      <span
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute hidden border border-[#c7c0b5]/65 lg:block",
                          "h-[70%] w-[68%]",
                          reversed ? "-bottom-3 -left-3" : "-bottom-3 -right-3",
                        ].join(" ")}
                      />

                      {/* IMAGE */}
                      <div
                        className={[
                          "relative h-[205px] overflow-hidden bg-[#ddd7ce]",
                          "sm:h-[220px]",
                          "lg:h-[225px]",
                          "xl:h-[235px]",
                          reversed
                            ? "[clip-path:polygon(0%_0%,94%_0%,100%_10%,97%_100%,5%_100%,0%_91%)]"
                            : "[clip-path:polygon(6%_0%,100%_0%,100%_91%,95%_100%,0%_100%,3%_10%)]",
                        ].join(" ")}
                      >
                        <DatabaseImage
                          src={service.image}
                          alt={service.name}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                          sizes="(max-width: 1023px) 100vw, 410px"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#14243f]/18 via-transparent to-transparent" />

                        {/* CORNER */}
                        <span
                          aria-hidden="true"
                          className={[
                            "absolute top-4 h-6 w-6 border-[#dcb458]/55 transition-all duration-500 group-hover:h-9 group-hover:w-9",
                            reversed
                              ? "right-4 border-r border-t"
                              : "left-4 border-l border-t",
                          ].join(" ")}
                        />

                        {/* GOLD LINE */}
                        <span
                          aria-hidden="true"
                          className={[
                            "absolute bottom-0 h-[3px] w-14 bg-[#dcb458] transition-all duration-500 group-hover:w-24",
                            reversed ? "left-0" : "right-0",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PROCESS
        ====================================================== */}
        <section className="relative border-y border-[#263b59] bg-[#14243f] py-16 text-[#f8f4ec] sm:py-20">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
              <div>
                <MicroLabel className="!text-[#dcb458]">
                  Alur pengerjaan
                </MicroLabel>

                <h2
                  className={`${displayFont} mt-5 max-w-[430px] text-[clamp(2.1rem,3vw,3.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]`}
                >
                  Dari perencanaan ke penyelesaian.
                </h2>

                <p className="mt-5 max-w-sm text-[13px] leading-6 text-white/55">
                  Setiap pekerjaan melalui tahapan yang terarah agar kebutuhan,
                  pelaksanaan, dan hasil akhirnya tetap terkoordinasi.
                </p>
              </div>

              <div className="overflow-hidden border-y border-white/15">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4">
                  {processSteps.map((step, index) => (
                    <article
                      key={step.number}
                      className={[
                        "group relative min-h-[240px] px-5 py-7",
                        "transition-colors duration-300",
                        "hover:bg-white/[0.035]",
                        index % 2 === 1 ? "sm:border-l sm:border-white/15" : "",
                        index >= 2 ? "sm:border-t sm:border-white/15" : "",
                        index > 0 ? "xl:border-l xl:border-white/15" : "",
                        "xl:border-t-0",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#dcb458] transition-all duration-500 group-hover:w-12" />

                        <span className="h-1.5 w-1.5 rotate-45 border border-[#dcb458]/60" />
                      </div>

                      <h3
                        className={`${displayFont} mt-9 min-h-[68px] max-w-[210px] text-[1.35rem] font-black uppercase leading-[0.93] tracking-[-0.02em]`}
                      >
                        {step.title}
                      </h3>

                      <p className="mt-4 max-w-[220px] text-[11px] leading-6 text-white/55">
                        {step.copy}
                      </p>

                      <span className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-[#dcb458]/25 transition-all duration-300 group-hover:h-5 group-hover:w-5" />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden border border-[#cfc8bd] bg-[#ece6dc] px-6 py-8 sm:px-8 sm:py-9 lg:px-10">
              <BlueprintLayer className="opacity-[0.04]" />

              <div className="relative grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <MicroLabel>Konsultasi proyek</MicroLabel>

                  <h2
                    className={`${displayFont} mt-5 max-w-[680px] text-[clamp(2rem,3vw,3.1rem)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-[#14243f]`}
                  >
                    Pastikan kebutuhan proyek jelas sebelum pekerjaan dimulai.
                  </h2>
                </div>

                <div className="lg:justify-self-end">
                  <p className="max-w-md text-[13px] leading-6 text-[#657184]">
                    Ceritakan kebutuhan, kondisi proyek, dan hasil yang ingin
                    dicapai. Kami bantu menyusun langkah awal yang lebih
                    terukur.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-3 border-b border-[#b58c2f] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f] transition hover:gap-5"
                  >
                    Konsultasikan proyek
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FormworkFooter content={data.siteContent} />
    </div>
  );
}
