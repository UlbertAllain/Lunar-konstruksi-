"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  BlueprintLayer,
  MicroLabel,
  TechnicalArc,
  displayFont,
} from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { projectModel, type SiteData } from "./data";

const expandedLayouts = [
  {
    wrapper: "md:col-span-7",
    media: "aspect-[16/10]",
    shape:
      "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
    label:
      "[clip-path:polygon(0%_0%,94%_0%,100%_25%,96%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-5 md:pt-12",
    media: "aspect-[16/10]",
    shape:
      "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
    label:
      "[clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%,0%_24%)]",
  },
  {
    wrapper: "md:col-span-5",
    media: "aspect-[5/4]",
    shape:
      "[clip-path:polygon(0%_0%,100%_0%,96%_88%,86%_100%,0%_100%,4%_14%)]",
    label:
      "[clip-path:polygon(0%_0%,100%_0%,96%_100%,7%_100%,0%_74%)]",
  },
  {
    wrapper: "md:col-span-7 md:pt-10",
    media: "aspect-[16/9]",
    shape:
      "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
    label:
      "[clip-path:polygon(0%_0%,96%_0%,100%_35%,100%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-8",
    media: "aspect-[16/9]",
    shape:
      "[clip-path:polygon(0%_0%,90%_0%,100%_18%,96%_100%,6%_100%,0%_86%)]",
    label:
      "[clip-path:polygon(0%_0%,95%_0%,100%_28%,97%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-4 md:pt-14",
    media: "aspect-[4/5]",
    shape:
      "[clip-path:polygon(12%_0%,100%_0%,100%_90%,88%_100%,0%_94%,0%_10%)]",
    label:
      "[clip-path:polygon(8%_0%,100%_0%,100%_100%,0%_100%,0%_20%)]",
  },
];

const horizontalShapes = [
  {
    media:
      "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
    label:
      "[clip-path:polygon(0%_0%,95%_0%,100%_28%,96%_100%,0%_100%)]",
  },
  {
    media:
      "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
    label:
      "[clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%,0%_24%)]",
  },
  {
    media:
      "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
    label:
      "[clip-path:polygon(0%_0%,96%_0%,100%_35%,100%_100%,0%_100%)]",
  },
];

export function FormworkProjects({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const hero = projects[0];
  const [expanded, setExpanded] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  function scrollRail(direction: "left" | "right") {
    const node = railRef.current;

    if (!node) {
      return;
    }

    const distance = Math.min(node.clientWidth * 0.82, 680);

    node.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  }

  return (
    <div className="lunar-public-page overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader services={data.services} projects={data.projects} />

      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20 lg:py-24">
          <BlueprintLayer />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
            <div>
              <MicroLabel>P-01 / Selected works</MicroLabel>

              <h1
                className={`${displayFont} mt-7 max-w-[680px] text-[clamp(2.7rem,4.35vw,4.55rem)] font-black uppercase leading-[.87] tracking-[-.05em]`}
              >
                Pekerjaan nyata membentuk arsip kami.
              </h1>

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#566476]">
                Dokumentasi proyek yang memperlihatkan konteks, proses, dan hasil
                pekerjaan dari berbagai kebutuhan konstruksi.
              </p>
            </div>

            <div className="relative min-h-[430px] sm:min-h-[480px] lg:min-h-[500px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,84%_0%,100%_10%,100%_74%,92%_100%,27%_100%,14%_93%,0%_79%,0%_17%)]">
                <DatabaseImage
                  src={data.siteContent.projectsHero?.url || LOCAL_MEDIA.projectsHero || hero?.image || ""}
                  alt={hero?.title ?? "Project"}
                  className="h-full min-h-[430px] w-full object-cover object-center sm:min-h-[460px] lg:min-h-[480px]"
                quality={95}
                  preload={true}
                  sizes="(max-width: 1023px) 94vw, 55vw"
                  hero
                  />
              </div>

              <div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
                <div className="px-4 py-3">
                  <MicroLabel>Portofolio proyek / P-02</MicroLabel>
                  <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
                    Setiap proyek menyimpan keputusan, progres, dan hasil yang
                    dapat dilihat secara nyata.
                  </p>
                </div>

                <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
                  WORK / RECORD
                </div>
              </div>

              <TechnicalArc
                label="WORK / ARCHIVE"
                className="bottom-[-10%] left-[12%] h-[360px] w-[500px] rotate-[17deg]"
              />
            </div>
          </div>
        </section>

        <section className="relative py-10 sm:py-16 lg:py-20">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="mb-8 flex flex-col gap-5 border-b border-[#d2cbc0] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <MicroLabel>P-02 / Project index</MicroLabel>

                <h2
                  className={`${displayFont} mt-3 text-[clamp(1.8rem,2.8vw,2.8rem)] font-black uppercase leading-[.92] tracking-[-.035em]`}
                >
                  Jelajahi portofolio.
                </h2>

                <p className="mt-2 max-w-lg text-[12px] leading-6 text-[#6c7787]">
                  Geser ke kanan untuk melihat proyek lain, atau buka tampilan
                  penuh bila ingin melihat seluruh arsip sekaligus.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!expanded ? (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollRail("left")}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] text-[#14243f] transition hover:border-[#b58c2f] hover:bg-[#eee7da]"
                      aria-label="Geser proyek ke kiri"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollRail("right")}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] text-[#14243f] transition hover:border-[#b58c2f] hover:bg-[#eee7da]"
                      aria-label="Geser proyek ke kanan"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#14243f] px-4 font-mono text-[8px] font-semibold uppercase tracking-[.12em] text-[#14243f] transition hover:bg-[#14243f] hover:text-[#f8f4ec]"
                  aria-pressed={expanded}
                >
                  {expanded ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" />
                      Tampilan horizontal
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" />
                      Lihat semua
                    </>
                  )}
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="grid gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-5 md:gap-y-14 lg:gap-x-6 lg:gap-y-16">
                {projects.map((project, index) => {
                  const layout =
                    expandedLayouts[index % expandedLayouts.length];

                  return (
                    <Link
                      key={project.id}
                      href={
                        project.slug
                          ? `/projects/${project.slug}`
                          : "/projects"
                      }
                      className={`group block min-w-0 ${layout.wrapper}`}
                    >
                      <article className="relative">
                        <div
                          className={`relative overflow-hidden bg-[#d8d1c6] ${layout.media} ${layout.shape}`}
                        >
                          <DatabaseImage
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#091b34]/38 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-45" />

                          <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-[#14243f]/55 text-white backdrop-blur-sm transition duration-300 group-hover:rotate-45 group-hover:bg-[#dcb458] group-hover:text-[#14243f]">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>

                        <div
                          className={`relative z-10 -mt-11 ml-[4%] w-[92%] bg-[#14243f]/96 px-4 py-4 text-white shadow-[0_16px_35px_rgba(20,36,63,0.13)] backdrop-blur-sm sm:px-5 ${layout.label}`}
                        >
                          <div className="flex items-end justify-between gap-5">
                            <div className="min-w-0">
                              <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e5c775]">
                                {project.location}
                                {project.year ? ` / ${project.year}` : ""}
                              </p>

                              <h3
                                className={`${displayFont} mt-1.5 text-[clamp(1.35rem,2.1vw,1.9rem)] font-black uppercase leading-[.95] tracking-[-.025em]`}
                              >
                                {project.title}
                              </h3>
                            </div>

                            <span className="shrink-0 pb-0.5 font-mono text-[8px] text-white/60">
                              P-{String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        <div className="ml-[8%] mt-3 flex items-center gap-3">
                          <span className="h-px w-8 bg-[#dcb458]" />
                          <span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#788394]">
                            {project.category || "Construction"}
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                ref={railRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 pr-[14vw] scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 sm:pr-[12vw] lg:gap-6 lg:pr-[18vw]"
              >
                {projects.map((project, index) => {
                  const shape =
                    horizontalShapes[index % horizontalShapes.length];

                  return (
                    <Link
                      key={project.id}
                      href={
                        project.slug
                          ? `/projects/${project.slug}`
                          : "/projects"
                      }
                      className="group block w-[88vw] max-w-[610px] shrink-0 snap-start sm:w-[520px] lg:w-[570px] xl:w-[610px]"
                    >
                      <article className="relative">
                        <div
                          className={`relative aspect-[16/10] overflow-hidden bg-[#d8d1c6] ${shape.media}`}
                        >
                          <DatabaseImage
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#091b34]/45 via-transparent to-transparent" />

                          <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-[#14243f]/55 text-white backdrop-blur-sm transition duration-300 group-hover:rotate-45 group-hover:bg-[#dcb458] group-hover:text-[#14243f]">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>

                        <div
                          className={`relative z-10 -mt-11 ml-[4%] w-[92%] bg-[#14243f]/96 px-4 py-4 text-white shadow-[0_16px_35px_rgba(20,36,63,0.13)] sm:px-5 ${shape.label}`}
                        >
                          <div className="flex items-end justify-between gap-5">
                            <div className="min-w-0">
                              <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e5c775]">
                                {project.location}
                                {project.year ? ` / ${project.year}` : ""}
                              </p>

                              <h3
                                className={`${displayFont} mt-1.5 text-[clamp(1.4rem,2vw,1.85rem)] font-black uppercase leading-[.95] tracking-[-.025em]`}
                              >
                                {project.title}
                              </h3>
                            </div>

                            <span className="shrink-0 font-mono text-[8px] text-white/60">
                              P-{String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        <div className="ml-[8%] mt-3 flex items-center gap-3">
                          <span className="h-px w-8 bg-[#dcb458]" />
                          <span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#788394]">
                            {project.category || "Construction"}
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#14243f] py-12 text-white sm:py-14 lg:py-16">
          <div className="mx-auto grid w-full max-w-[1480px] gap-7 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
            <div>
              <MicroLabel>Project record / archive</MicroLabel>

              <h2
                className={`${displayFont} mt-4 max-w-3xl text-[clamp(1.9rem,3vw,3.15rem)] font-black uppercase leading-[.94] tracking-[-.035em]`}
              >
                Setiap pekerjaan punya konteks, proses, dan hasil yang dapat
                dipertanggungjawabkan.
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] uppercase tracking-[.12em] text-[#e5c775] transition hover:gap-5"
            >
              Diskusikan proyek
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <FormworkFooter />
    </div>
  );
}
