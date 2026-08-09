import Link from "next/link";

import { BlueprintLayer, MicroLabel, TechnicalArc, displayFont } from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { faqModel, serviceModel, type SiteData } from "./data";

export function FormworkServices({ data }: { data: SiteData }) {
  const services = data.services.map(serviceModel);
  const faqs = data.faqs.map(faqModel);

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
                className={`${displayFont} mt-8 text-[clamp(3.7rem,7vw,7.6rem)] font-black uppercase leading-[.84] tracking-[-.055em]`}
              >
                Layanan harus saling terhubung.
              </h1>
              <p className="mt-8 max-w-lg text-[15px] leading-7 text-[#566476]">
                Ruang lingkup dapat disusun sesuai konteks proyek, dari satu
                pekerjaan teknis sampai koordinasi design-build yang lebih
                terintegrasi.
              </p>
            </div>
            <div className="relative min-h-[520px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(15%_0%,76%_0%,100%_17%,95%_74%,100%_86%,82%_100%,18%_95%,0%_78%,3%_18%)]">
                <DatabaseImage
                  src={
                    LOCAL_MEDIA.servicesHero ||
                    services[0]?.image ||
                    projects[0]?.image ||
                    ""
                  }
                  alt={services[0]?.name || "Capabilities"}
                  className="h-full min-h-[500px] w-full object-cover object-center"
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

        <section className="bg-[#14243f] py-20 text-white sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <MicroLabel>Work sequence</MicroLabel>
                <h2
                  className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9] sm:text-7xl`}
                >
                  Dari brief ke handover.
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {[
                  ["01", "Survey / brief"],
                  ["02", "Plan / coordinate"],
                  ["03", "Build / control"],
                  ["04", "Inspect / deliver"],
                ].map(([number, label]) => (
                  <div key={number} className="border-t border-white/20 pt-4">
                    <p className="font-mono text-[9px] text-[#dcb458]">
                      {number}
                    </p>
                    <p
                      className={`${displayFont} mt-4 text-3xl font-black uppercase`}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {faqs.length ? (
          <section className="relative py-20 sm:py-24">
            <BlueprintLayer className="opacity-[0.08]" />
            <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-10">
              <div>
                <MicroLabel>FAQ / pre-project</MicroLabel>
                <h2
                  className={`${displayFont} mt-5 text-5xl font-black uppercase leading-[.9]`}
                >
                  Hal yang sering dibahas di awal.
                </h2>
              </div>
              <div className="border-t border-[#c0bbb2]">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="grid gap-4 border-b border-[#c0bbb2] py-6 sm:grid-cols-[70px_1fr]"
                  >
                    <span className="font-mono text-[9px] text-[#dcb458]">
                      Q-{String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className={`${displayFont} text-2xl font-black uppercase`}
                      >
                        {faq.question}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#657184]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-[#d9d4ca] py-20">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <h2
              className={`${displayFont} max-w-3xl text-6xl font-black uppercase leading-[.86] sm:text-8xl`}
            >
              Susun ruang lingkup yang benar sejak awal.
            </h2>
            <Link
              href="/contact"
              className="font-mono text-[10px] uppercase tracking-[.1em]"
            >
              Start a project →
            </Link>
          </div>
        </section>
      </main>
      <FormworkFooter />
    </div>
  );
}
