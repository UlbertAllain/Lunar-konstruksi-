import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers3,
  MapPin,
} from "lucide-react";
import type { Project } from "@/modules/projects/project.types";

import {
  BlueprintLayer,
  MicroLabel,
  displayFont,
} from "./formwork/decor";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const galleryLayouts = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5 md:row-span-2",
  "md:col-span-5 md:row-span-2",
  "md:col-span-7 md:row-span-2",
  "md:col-span-4 md:row-span-2",
  "md:col-span-4 md:row-span-2",
  "md:col-span-4 md:row-span-2",
];

function projectStatusLabel(status: string) {
  if (status === "COMPLETED") return "Selesai";
  if (status === "PROCESS") return "Dalam proses";
  return "Perencanaan";
}

interface ProjectDetailPageProps {
  project: Project;
}

export default function ProjectDetailPage({
  project,
}: ProjectDetailPageProps) {
  const meta = [
    ["Lokasi", project.location],
    ["Tahun", String(project.year)],
    ["Durasi", project.duration],
    ["Status", projectStatusLabel(project.status)],
  ];

  return (
    <div className="lunar-public-page overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-[#d8d1c6] py-12 sm:py-16 lg:py-20">
          <BlueprintLayer className="opacity-[0.05]" />

          <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#697482] transition hover:text-[#14243f]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke proyek
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end xl:gap-14">
              <div className="pb-1">
                <MicroLabel>
                  P-{String(project.year).slice(-2)} / Project record
                </MicroLabel>

                <h1
                  className={`${displayFont} mt-6 max-w-[720px] text-[clamp(2.2rem,9.5vw,4.65rem)] font-black uppercase leading-[0.88] tracking-[-0.048em] text-[#14243f]`}
                >
                  {project.title}
                </h1>

                <p className="mt-6 max-w-[610px] text-[15px] leading-8 text-[#5f6976]">
                  {project.shortDescription}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-[#d8d1c6] py-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {meta.map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#8a93a0]">
                        {label}
                      </p>
                      <p className="mt-2 truncate text-[13px] font-semibold text-[#14243f]">
                        {value || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden border border-[#d5cdc0] bg-[#e8e1d6] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(8%_0%,92%_0%,100%_10%,100%_90%,92%_100%,8%_100%,0%_90%,0%_10%)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage.url}
                    alt={project.title}
                    className="h-[260px] w-full object-cover sm:h-[400px] lg:h-[500px]"
                  />
                </div>

                <div className="absolute bottom-4 left-4 hidden border border-white/30 bg-[#14243f]/88 px-4 py-3 text-white backdrop-blur sm:block">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#e5c775]">
                    Site record
                  </p>
                  <p className="mt-1 max-w-[230px] text-[11px] leading-5 text-white/72">
                    Dokumentasi visual dan lingkup pekerjaan disusun sebagai satu
                    catatan proyek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 xl:gap-16">
            <aside>
              <MicroLabel>Informasi proyek</MicroLabel>

              <div className="mt-6 border-t border-[#c9c2b7]">
                <div className="border-b border-[#d8d1c6] py-5">
                  <div className="flex items-center gap-2 text-[#b58c2f]">
                    <MapPin className="h-4 w-4" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em]">
                      Lokasi pekerjaan
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#14243f]">
                    {project.location || "-"}
                  </p>
                </div>

                <div className="border-b border-[#d8d1c6] py-5">
                  <div className="flex items-center gap-2 text-[#b58c2f]">
                    <Layers3 className="h-4 w-4" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em]">
                      Material utama
                    </span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {project.materials.length ? (
                      project.materials.map((item) => (
                        <p
                          key={item}
                          className="flex items-start gap-3 text-[13px] leading-6 text-[#5f6976]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcb458]" />
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="text-[13px] text-[#7c8795]">
                        Data material belum ditambahkan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <article>
              <MicroLabel>Pelaksanaan pekerjaan</MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[760px] text-[clamp(2rem,3vw,3.15rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#14243f]`}
              >
                Lingkup pekerjaan dan pelaksanaannya kami jelaskan secara ringkas.
              </h2>

              <p className="mt-7 max-w-[850px] whitespace-pre-line text-[16px] leading-8 text-[#5b6776] sm:text-[17px]">
                {project.description}
              </p>

              <div className="mt-10 border-t border-[#c9c2b7]">
                <div className="grid gap-5 py-6 sm:grid-cols-[150px_1fr]">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#8a93a0]">
                      Lingkup pekerjaan
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.scope.length ? (
                      project.scope.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 border border-[#d8d1c6] bg-[#faf7f0] px-4 py-3"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#b58c2f]" />
                          <span className="text-[13px] leading-6 text-[#566476]">
                            {item}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7c8795]">
                        Lingkup pekerjaan belum ditambahkan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {project.gallery.length ? (
          <section className="border-y border-[#d8d1c6] bg-[#f5f1e8] py-16 sm:py-20">
            <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <MicroLabel>Gallery / site documentation</MicroLabel>
                  <h2
                    className={`${displayFont} mt-5 max-w-[680px] text-[clamp(2.3rem,3.7vw,4rem)] font-black uppercase leading-[0.91] tracking-[-0.04em] text-[#14243f]`}
                  >
                    Dokumentasi pekerjaan dalam grid yang lebih terukur.
                  </h2>
                </div>
                <p className="max-w-md text-[13px] leading-6 text-[#657184]">
                  Proporsi foto dibuat lebih terkendali supaya setiap dokumentasi
                  tetap terbaca tanpa mengambil satu layar penuh.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12 md:auto-rows-[150px] lg:auto-rows-[180px] xl:auto-rows-[205px]">
                {project.gallery.map((image, index) => (
                  <figure
                    key={image.publicId}
                    className={`group relative aspect-[4/3] overflow-hidden border border-[#d2cabc] bg-transparent md:aspect-auto ${
                      galleryLayouts[index % galleryLayouts.length]
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt || `${project.title} ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.018]"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <MicroLabel>Next / project discussion</MicroLabel>
              <h2
                className={`${displayFont} mt-5 max-w-[760px] text-[clamp(2.4rem,4vw,4.25rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#14243f]`}
              >
                Punya kebutuhan serupa? Bicarakan konteksnya sejak awal.
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
            >
              Konsultasikan proyek
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
