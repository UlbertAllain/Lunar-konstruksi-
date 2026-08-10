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

import type { Project } from "@/modules/projects/project.types";
import { MicroLabel, displayFont } from "./formwork/decor";
import { DatabaseImage } from "./formwork/media";

const expandedLayouts = [
  {
    wrapper: "md:col-span-7",
    media: "aspect-[16/10]",
    shape: "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
    label: "[clip-path:polygon(0%_0%,94%_0%,100%_25%,96%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-5 md:pt-12",
    media: "aspect-[16/10]",
    shape:
      "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
    label: "[clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%,0%_24%)]",
  },
  {
    wrapper: "md:col-span-5",
    media: "aspect-[5/4]",
    shape: "[clip-path:polygon(0%_0%,100%_0%,96%_88%,86%_100%,0%_100%,4%_14%)]",
    label: "[clip-path:polygon(0%_0%,100%_0%,96%_100%,7%_100%,0%_74%)]",
  },
  {
    wrapper: "md:col-span-7 md:pt-10",
    media: "aspect-[16/9]",
    shape: "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
    label: "[clip-path:polygon(0%_0%,96%_0%,100%_35%,100%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-8",
    media: "aspect-[16/9]",
    shape: "[clip-path:polygon(0%_0%,90%_0%,100%_18%,96%_100%,6%_100%,0%_86%)]",
    label: "[clip-path:polygon(0%_0%,95%_0%,100%_28%,97%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-4 md:pt-14",
    media: "aspect-[4/5]",
    shape:
      "[clip-path:polygon(12%_0%,100%_0%,100%_90%,88%_100%,0%_94%,0%_10%)]",
    label: "[clip-path:polygon(8%_0%,100%_0%,100%_100%,0%_100%,0%_20%)]",
  },
];

const horizontalShapes = [
  {
    media: "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
    label: "[clip-path:polygon(0%_0%,95%_0%,100%_28%,96%_100%,0%_100%)]",
  },
  {
    media:
      "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
    label: "[clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%,0%_24%)]",
  },
  {
    media: "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
    label: "[clip-path:polygon(0%_0%,96%_0%,100%_35%,100%_100%,0%_100%)]",
  },
];

function projectStatus(status: Project["status"]) {
  switch (status) {
    case "COMPLETED":
      return "Selesai";
    case "PROCESS":
      return "Dalam pengerjaan";
    case "PLANNING":
      return "Perencanaan";
    default:
      return "Proyek";
  }
}

export function RelatedProjectsSection({
  projects,
  serviceName,
}: {
  projects: Project[];
  serviceName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  if (!projects.length) {
    return null;
  }

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const distance = Math.min(rail.clientWidth * 0.82, 680);

    rail.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative overflow-hidden border-t border-[#d8d1c6] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#d2cbc0] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <MicroLabel>Proyek terkait</MicroLabel>

            <h2
              className={`${displayFont} mt-3 max-w-[680px] text-[clamp(1.85rem,2.8vw,2.9rem)] font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#14243f]`}
            >
              Contoh pekerjaan untuk {serviceName}.
            </h2>

            <p className="mt-3 max-w-[610px] text-[12px] leading-6 text-[#6c7787]">
              Geser untuk melihat proyek lain, atau buka tampilan penuh untuk
              melihat seluruh proyek terkait sekaligus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!expanded && projects.length > 1 ? (
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

            {projects.length > 1 ? (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-pressed={expanded}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#14243f] px-4 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-[#14243f] transition hover:bg-[#14243f] hover:text-[#f8f4ec]"
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
            ) : null}
          </div>
        </div>

        {/* EXPANDED MODE */}
        {expanded ? (
          <div className="grid gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-5 md:gap-y-14 lg:gap-x-6 lg:gap-y-16">
            {projects.map((project, index) => {
              const layout = expandedLayouts[index % expandedLayouts.length];

              return (
                <Link
                  key={project.id ?? project.slug}
                  href={`/projects/${project.slug}`}
                  className={`group block min-w-0 ${layout.wrapper}`}
                >
                  <article className="relative">
                    <div
                      className={`relative overflow-hidden bg-[#ded7cd] ${layout.media} ${layout.shape}`}
                    >
                      <DatabaseImage
                        src={project.coverImage.url}
                        alt={project.coverImage.alt || project.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                        sizes="(max-width: 767px) 100vw, 58vw"
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
                          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#e5c775]">
                            {project.location}
                            {project.year ? ` / ${project.year}` : ""}
                          </p>

                          <h3
                            className={`${displayFont} mt-1.5 text-[clamp(1.35rem,2.1vw,1.9rem)] font-black uppercase leading-[0.95] tracking-[-0.025em]`}
                          >
                            {project.title}
                          </h3>
                        </div>

                        <span className="shrink-0 pb-0.5 font-mono text-[8px] text-white/60">
                          P-
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="ml-[8%] mt-3 flex items-center gap-3">
                      <span className="h-px w-8 bg-[#dcb458]" />

                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#788394]">
                        {projectStatus(project.status)}
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          /* DEFAULT HORIZONTAL MODE */
          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 pr-[14vw] scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 sm:pr-[12vw] lg:gap-6 lg:pr-[18vw]"
          >
            {projects.map((project, index) => {
              const shape = horizontalShapes[index % horizontalShapes.length];

              return (
                <Link
                  key={project.id ?? project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block w-[88vw] max-w-[610px] shrink-0 snap-start sm:w-[520px] lg:w-[570px] xl:w-[610px]"
                >
                  <article className="relative">
                    <div
                      className={`relative aspect-[16/10] overflow-hidden bg-[#ded7cd] ${shape.media}`}
                    >
                      <DatabaseImage
                        src={project.coverImage.url}
                        alt={project.coverImage.alt || project.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                        sizes="(max-width: 639px) 88vw, 610px"
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
                          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#e5c775]">
                            {project.location}
                            {project.year ? ` / ${project.year}` : ""}
                          </p>

                          <h3
                            className={`${displayFont} mt-1.5 text-[clamp(1.4rem,2vw,1.85rem)] font-black uppercase leading-[0.95] tracking-[-0.025em]`}
                          >
                            {project.title}
                          </h3>
                        </div>

                        <span className="shrink-0 font-mono text-[8px] text-white/60">
                          P-
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="ml-[8%] mt-3 flex items-center gap-3">
                      <span className="h-px w-8 bg-[#dcb458]" />

                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#788394]">
                        {projectStatus(project.status)}
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-9">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f] transition hover:gap-5"
          >
            Lihat semua proyek
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
