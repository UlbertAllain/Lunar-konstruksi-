import Link from "next/link";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { projectModel, serviceModel, type SiteData } from "./data";

export function FormworkServices({ data }: { data: SiteData }) {
  const services = data.services.map(serviceModel);
  const projects = data.projects.map(projectModel);
  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />
      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-24">
          <BlueprintLayer />
          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-10">
            <div>
              <MicroLabel>S-01 / Capabilities / scope of work</MicroLabel>
              <h1
                className={`${displayFont} mt-8 text-[clamp(2.3rem,10vw,4.7rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}
              >
                Layanan konstruksi yang terkoordinasi dari awal sampai selesai.
              </h1>
              <p className="mt-8 max-w-lg text-[15px] leading-7 text-[#566476]">
                Ruang lingkup dapat disusun sesuai konteks proyek, dari satu
                pekerjaan teknis sampai koordinasi design-build yang lebih
                terintegrasi.
              </p>
            </div>
            <div className="relative min-h-[330px] sm:min-h-[430px] lg:min-h-[520px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(15%_0%,76%_0%,100%_17%,95%_74%,100%_86%,82%_100%,18%_95%,0%_78%,3%_18%)]">
                <DatabaseImage
                  src={
                    LOCAL_MEDIA.servicesHero ||
                    services[0]?.image ||
                    projects[0]?.image ||
                    ""
                  }
                  alt={services[0]?.name || "Capabilities"}
                  className="h-full min-h-[310px] w-full object-cover object-center sm:min-h-[410px] lg:min-h-[500px]"
                quality={95}
                  preload={true}
                  sizes="(max-width: 1023px) 94vw, 55vw"
                  />
              </div>
              {/* FLOATING-SERVICES-HERO-CARD */}
              <div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
                <div className="px-4 py-3">
                  <MicroLabel>Service scope / S-02</MicroLabel>
                  <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
                    Layanan dibaca sebagai paket kerja yang bergerak dari
                    persiapan sampai penyelesaian.
                  </p>
                </div>
                <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
                  SCOPE / PACKAGE
                </div>
              </div>
              <TechnicalArc
                label="SCOPE / FLOW"
                className="bottom-[-8%] left-[8%] h-[340px] w-[500px] rotate-[15deg]"
              />
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={
                    service.slug ? `/services/${service.slug}` : "/services"
                  }
                  className="group grid min-h-[280px] overflow-hidden border border-[#cfcac1] bg-[#efeae1] sm:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="relative min-h-[220px] overflow-hidden bg-[#ddd8cf]">
                    <DatabaseImage
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                    />
                    <span className="absolute left-4 top-4 bg-[#f5f1e8]/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[.12em]">
                      S-{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <MicroLabel>Capability / active</MicroLabel>
                      <h2
                        className={`${displayFont} mt-5 text-3xl font-black uppercase leading-[.95]`}
                      >
                        {service.name}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-[#657184]">
                        {service.shortDescription ||
                          "Ruang lingkup layanan disesuaikan dengan kebutuhan dan kondisi proyek."}
                      </p>
                    </div>
                    <span className="mt-8 font-mono text-[9px] uppercase tracking-[.12em] text-[#dcb458]">
                      View scope →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-y border-[#263b59] bg-[#14243f] py-16 text-[#f8f4ec] sm:py-20">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
              <div>
                <MicroLabel className="!text-[#dcb458]">
                  Process board / 04 stages
                </MicroLabel>
                <h2
                  className={`${displayFont} mt-5 max-w-[480px] text-[clamp(2.35rem,3.8vw,4rem)] font-black uppercase leading-[.9] tracking-[-.04em]`}
                >
                  Alur kerja yang mudah dibaca sejak awal.
                </h2>
                <p className="mt-5 max-w-md text-[13px] leading-6 text-white/55">
                  Setiap pekerjaan bergerak melalui tahapan yang jelas agar
                  keputusan, pelaksanaan, dan serah terima tetap terkontrol.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
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
                ].map((step) => (
                  <article
                    key={step.number}
                    className="group relative min-h-[250px] overflow-hidden border border-white/14 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#dcb458]/55 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[10px] font-semibold tracking-[.14em] text-[#dcb458]">
                        {step.number}
                      </span>
                      <span className="h-2 w-2 rounded-full border border-[#dcb458]/70" />
                    </div>

                    <div className="mt-16">
                      <h3
                        className={`${displayFont} text-[1.55rem] font-black uppercase leading-[.92] tracking-[-.025em]`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-4 text-[12px] leading-6 text-white/55">
                        {step.copy}
                      </p>
                    </div>

                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#dcb458] transition-all duration-500 group-hover:w-full" />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden border border-[#cfc8bd] bg-[#ece6dc] px-6 py-9 sm:px-8 sm:py-10 lg:px-10">
              <BlueprintLayer className="opacity-[0.045]" />

              <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
                <div>
                  <MicroLabel>Project intake / next step</MicroLabel>
                  <h2
                    className={`${displayFont} mt-5 max-w-[760px] text-[clamp(2.3rem,3.8vw,4.05rem)] font-black uppercase leading-[.9] tracking-[-.038em] text-[#14243f]`}
                  >
                    Pastikan kebutuhan proyek jelas sebelum pekerjaan dimulai.
                  </h2>
                </div>

                <div className="lg:justify-self-end">
                  <p className="max-w-md text-[13px] leading-6 text-[#657184]">
                    Ceritakan kebutuhan, kondisi proyek, dan hasil yang ingin
                    dicapai. Kami bantu menyusun langkah awal yang lebih terukur.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-3 border-b border-[#b58c2f] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[.13em] text-[#14243f] transition hover:gap-5"
                  >
                    Konsultasikan proyek
                    <span aria-hidden="true">â†’</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>      </main>
      <FormworkFooter />
    </div>
  );
}
