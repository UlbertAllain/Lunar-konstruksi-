"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef } from "react";

type UnknownRecord = Record<string, unknown>;

type ServiceCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
};

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function imageFrom(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);
  return firstString(record.url, record.secureUrl, record.secure_url, record.src);
}

function normalizeService(value: unknown, index: number): ServiceCard {
  const record = asRecord(value);

  return {
    id: firstString(record.id, record.slug) || `service-${index + 1}`,
    slug: firstString(record.slug),
    title: firstString(record.name, record.title) || `Layanan ${index + 1}`,
    description:
      firstString(
        record.shortDescription,
        record.description,
        record.summary,
        record.excerpt,
      ) || "Solusi pekerjaan konstruksi yang disesuaikan dengan kebutuhan proyek Anda.",
    category:
      firstString(record.category, record.type, record.badge, record.group) ||
      "Layanan konstruksi",
    image: firstString(
      imageFrom(record.image),
      imageFrom(record.coverImage),
      record.imageUrl,
      record.coverImageUrl,
      record.thumbnailUrl,
      record.photoUrl,
    ),
  };
}

const cardShapes = [
  "34px 14px 46px 20px",
  "16px 44px 22px 42px",
  "44px 18px 32px 14px",
  "18px 38px 14px 46px",
  "40px 16px 48px 22px",
  "14px 46px 20px 36px",
];

export function ServiceStaggeredCarousel({ services }: { services: unknown[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const items = useMemo(
    () => services.map(normalizeService).filter((service) => service.title),
    [services],
  );

  function move(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;

    const distance = Math.min(rail.clientWidth * 0.82, 820);
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <section className="relative border-b border-[#d8d1c6] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto w-full max-w-[1480px]">
        <header className="mx-auto max-w-[820px] text-center">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#657184]">
            02 / Layanan
          </p>
          <h2 className="mt-6 text-[clamp(3.2rem,5.8vw,6.3rem)] font-black uppercase leading-[0.88] tracking-[-0.055em] text-[#14243f]">
            Layanan untuk setiap tahap pekerjaan.
          </h2>
          <p className="mx-auto mt-6 max-w-[660px] text-[15px] leading-8 text-[#5f6976]">
            Dari perencanaan sampai penyelesaian, pilih layanan yang sesuai dengan
            kebutuhan proyek Anda. Geser untuk melihat layanan lainnya.
          </p>
        </header>

        <div className="mt-10 flex items-center justify-between gap-5 border-t border-[#ddd5c8] pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#758094]">
            Jelajahi layanan
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Geser layanan ke kiri"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#cfc6b8] bg-[#f8f4ec] text-[#14243f] transition hover:-translate-y-0.5 hover:border-[#dcb458]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Geser layanan ke kanan"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#14243f] bg-[#14243f] text-[#f8f4ec] transition hover:-translate-y-0.5"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          <div
            ref={railRef}
            className="mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-20 pt-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 lg:gap-7"
          >
            {items.map((service, index) => {
              const isUpper = index % 2 === 0;
              const safeImage = service.image.replace(/"/g, "%22");

              return (
                <article
                  key={service.id}
                  className={`group relative min-h-[465px] w-[80vw] shrink-0 snap-start overflow-hidden border border-[#d7cfc2] bg-[#f8f4ec] shadow-[0_16px_34px_rgba(20,36,63,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_46px_rgba(20,36,63,0.13)] sm:w-[390px] lg:w-[405px] ${
                    isUpper ? "-translate-y-8" : "translate-y-8"
                  }`}
                  style={{ borderRadius: cardShapes[index % cardShapes.length] }}
                >
                  <Link
                    href={service.slug ? `/services/${service.slug}` : "/services"}
                    className="flex h-full min-h-[465px] flex-col"
                  >
                    <div
                      className="relative h-[255px] overflow-hidden bg-[#e8e2d8] bg-cover bg-center transition duration-700 group-hover:scale-[1.025]"
                      style={
                        service.image
                          ? {
                              backgroundImage: `linear-gradient(to top, rgba(20,36,63,.55), rgba(20,36,63,.03) 58%), url("${safeImage}")`,
                            }
                          : {
                              backgroundImage:
                                "linear-gradient(135deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(225deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(45deg, rgba(220,180,88,.10) 25%, transparent 25%), linear-gradient(315deg, rgba(220,180,88,.10) 25%, #f1ece3 25%)",
                              backgroundSize: "42px 42px",
                            }
                      }
                    >
                      <div className="absolute left-4 top-4 rounded-full border border-white/45 bg-[#14243f]/55 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        SRV-{String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute bottom-4 right-4 max-w-[170px] text-right font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-white/85">
                        {service.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
                      <div>
                        <h3 className="max-w-[15ch] text-[2rem] font-bold uppercase leading-[0.94] tracking-[-0.045em] text-[#14243f]">
                          {service.title}
                        </h3>
                        <p className="mt-4 line-clamp-3 text-[13px] leading-7 text-[#5f6976]">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between gap-5 border-t border-[#ded6ca] pt-4">
                        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#7b8491]">
                          Sesuai kebutuhan proyek
                        </span>
                        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#14243f]">
                          Lihat layanan
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-[#cfc6b8] px-6 py-16 text-center">
            <p className="text-sm text-[#5f6976]">Layanan belum tersedia.</p>
          </div>
        )}
      </div>
    </section>
  );
}