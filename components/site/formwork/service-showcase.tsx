"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type ServiceShowcaseItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
};

const offsets = [
  "md:-translate-y-3",
  "md:translate-y-8",
  "md:-translate-y-5",
  "md:translate-y-10",
  "md:-translate-y-2",
  "md:translate-y-7",
];

const radii = [
  "42px 14px 54px 18px",
  "18px 48px 16px 56px",
  "56px 16px 42px 12px",
  "16px 54px 20px 46px",
  "48px 18px 58px 20px",
  "20px 46px 14px 52px",
];

export function ServiceShowcase({ items }: { items: ServiceShowcaseItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * Math.max(320, track.clientWidth * 0.72),
      behavior: "smooth",
    });
  }

  return (
    <section
      className="relative overflow-hidden border-t border-[#ddd6ca] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      style={{
        backgroundImage:
          "linear-gradient(rgba(24,45,77,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(24,45,77,.035) 1px, transparent 1px)",
        backgroundSize: "76px 76px",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-14 h-64 w-64 rounded-full bg-[#dcb458]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#182d4d]/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="mx-auto max-w-[790px] text-center">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#657184]">
            02 / Capabilities / services
          </p>
          <h2 className="mt-5 text-[clamp(2.85rem,5.1vw,5.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em] text-[#14243f]">
            Layanan harus langsung terbaca.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-[#5f6976]">
            Setiap layanan tampil sebagai pekerjaan nyata, lengkap dengan visual dari data Service. Geser untuk melihat scope lain tanpa membuat halaman terasa penuh dan kaku.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-5 border-t border-[#d8d1c6] pt-5">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#748092]">
            <span className="h-2 w-2 rounded-full bg-[#dcb458]" />
            <span>Field packages / {String(items.length).padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Layanan sebelumnya"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc7ba] bg-[#f8f4ec] text-[#14243f] transition hover:-translate-x-0.5 hover:border-[#dcb458]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Layanan berikutnya"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc7ba] bg-[#14243f] text-[#f7f2e9] transition hover:translate-x-0.5"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-3 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-1 pb-16 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
        >
          {items.map((item, index) => {
            const href = item.slug ? `/services/${item.slug}` : "/services";
            const offset = offsets[index % offsets.length];
            const borderRadius = radii[index % radii.length];

            return (
              <article
                key={item.id}
                className={`w-[78vw] shrink-0 snap-start sm:w-[360px] lg:w-[390px] ${offset}`}
              >
                <Link
                  href={href}
                  className="group block overflow-hidden border border-[#d8d0c3] bg-[#f8f4ec] shadow-[0_16px_36px_rgba(20,36,63,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(20,36,63,0.12)]"
                  style={{ borderRadius }}
                >
                  <div
                    role="img"
                    aria-label={`Cover ${item.title}`}
                    className="relative h-[245px] overflow-hidden bg-[#e9e3d8] bg-cover bg-center sm:h-[270px]"
                    style={
                      item.image
                        ? { backgroundImage: `url(${JSON.stringify(item.image)})` }
                        : {
                            backgroundImage:
                              "linear-gradient(135deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(225deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(45deg, rgba(220,180,88,.10) 25%, transparent 25%)",
                            backgroundSize: "40px 40px",
                          }
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14243f]/75 via-[#14243f]/5 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/35 bg-[#14243f]/55 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                      SRV-{String(index + 1).padStart(2, "0")}
                    </div>
                    {!item.image && (
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#657184]">
                          Media service belum diisi
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid min-h-[220px] grid-rows-[auto_1fr_auto] gap-5 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-5">
                      <h3 className="max-w-[12ch] text-[1.7rem] font-semibold uppercase leading-[0.92] tracking-[-0.045em] text-[#14243f]">
                        {item.title}
                      </h3>
                      <span className="max-w-[115px] text-right font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-[#8a7b5a]">
                        {item.category}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-[13px] leading-7 text-[#5f6976]">
                      {item.description ||
                        "Scope kerja yang dikelola secara terukur dari koordinasi awal sampai penyelesaian lapangan."}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#ded6ca] pt-4">
                      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#758094]">
                        Scope / detail / delivery
                      </span>
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#14243f]">
                        Detail <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
