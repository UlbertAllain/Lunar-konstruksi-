import Link from "next/link";
import { ArrowRight, Check, Layers3 } from "lucide-react";
import type { ConstructionService } from "@/modules/services/service.types";

import {
  BlueprintLayer,
  MicroLabel,
  displayFont,
} from "./formwork/decor";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface ServiceDetailPageProps {
  service: ConstructionService;
}

export default function ServiceDetailPage({
  service,
}: ServiceDetailPageProps) {
  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-[#d8d1c6] py-12 sm:py-16 lg:py-20">
          <BlueprintLayer className="opacity-[0.05]" />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-10 xl:gap-14">
            <div>
              <MicroLabel>S-01 / Capability detail</MicroLabel>

              <h1
                className={`${displayFont} mt-6 max-w-[720px] text-[clamp(2.2rem,9.5vw,4.6rem)] font-black uppercase leading-[0.88] tracking-[-0.048em] text-[#14243f]`}
              >
                {service.name}
              </h1>

              <p className="mt-6 max-w-[620px] text-[15px] leading-8 text-[#5f6976]">
                {service.shortDescription}
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
              >
                Konsultasikan kebutuhan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden border border-[#d5cdc0] bg-[#e8e1d6] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,92%_0%,100%_12%,96%_90%,88%_100%,8%_96%,0%_84%,3%_14%)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.coverImage.url}
                  alt={service.name}
                  className="h-[250px] w-full object-cover sm:h-[390px] lg:h-[480px]"
                />
              </div>

              <div className="absolute bottom-4 left-4 hidden border border-white/30 bg-[#14243f]/88 px-4 py-3 text-white backdrop-blur sm:block">
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#e5c775]">
                  Service scope
                </p>
                <p className="mt-1 max-w-[230px] text-[11px] leading-5 text-white/72">
                  Ruang lingkup disusun sesuai kebutuhan, kondisi, dan target
                  pekerjaan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.68fr_1.32fr] lg:px-10 xl:gap-16">
            <div>
              <MicroLabel>Approach / work method</MicroLabel>
              <h2
                className={`${displayFont} mt-5 max-w-[460px] text-[clamp(2rem,3vw,3.1rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#14243f]`}
              >
                Kebutuhan proyek diterjemahkan menjadi langkah kerja yang jelas.
              </h2>
            </div>

            <div>
              <p className="max-w-[850px] whitespace-pre-line text-[16px] leading-8 text-[#5b6776] sm:text-[17px]">
                {service.description}
              </p>

              {service.features.length ? (
                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <article
                      key={`${feature.title}-${index}`}
                      className="border border-[#d8d1c6] bg-[#faf7f0] p-5 sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Layers3 className="h-5 w-5 text-[#b58c2f]" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#8a93a0]">
                          F-{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3
                        className={`${displayFont} mt-7 text-[1.45rem] font-black uppercase leading-[0.95] text-[#14243f]`}
                      >
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-[13px] leading-6 text-[#657184]">
                        {feature.description}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative bg-[#14243f] py-16 text-[#f8f4ec] sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:px-10">
            <div>
              <MicroLabel className="!text-[#dcb458]">Scope / adaptable</MicroLabel>
              <h2
                className={`${displayFont} mt-5 max-w-[480px] text-[clamp(2.2rem,3.5vw,3.7rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]`}
              >
                Lingkup pekerjaan dapat disesuaikan dengan kebutuhan proyek.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
              {service.scopes.map((scope, index) => (
                <div
                  key={`${scope.name}-${index}`}
                  className="flex min-h-[76px] items-center gap-3 bg-[#14243f] px-5 py-4 text-[13px] leading-6 text-white/70"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#dcb458]" />
                  {scope.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <MicroLabel>Next / project intake</MicroLabel>
              <h2
                className={`${displayFont} mt-5 max-w-[760px] text-[clamp(2.4rem,4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#14243f]`}
              >
                Pastikan kebutuhan proyek jelas sebelum pekerjaan dimulai.
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
            >
              Mulai diskusi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
