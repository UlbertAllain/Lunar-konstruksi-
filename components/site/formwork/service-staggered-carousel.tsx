"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef } from "react";

import { DatabaseImage } from "./media";

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

  return firstString(
    record.url,
    record.secureUrl,
    record.secure_url,
    record.src,
  );
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
      ) ||
      "Solusi pekerjaan konstruksi yang disesuaikan dengan kebutuhan proyek Anda.",
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
  "30px 14px 42px 18px",
  "16px 40px 20px 38px",
  "40px 18px 30px 14px",
  "18px 36px 14px 42px",
  "36px 16px 44px 20px",
  "14px 42px 18px 34px",
];

export function ServiceStaggeredCarousel({
  services,
}: {
  services: unknown[];
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      services
        .map(normalizeService)
        .filter((service) => service.title),
    [services],
  );

  function move(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) return;

    const distance = Math.min(rail.clientWidth * 0.82, 820);

    rail.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative border-b border-[#d8d1c6] px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1480px]">
        <header className="mx-auto max-w-[820px] text-center">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.17em] text-[#657184] sm:text-[9px]">
            02 / Layanan
          </p>

          <h2 className="mt-5 text-[clamp(2.05rem,8.5vw,4.1rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#14243f] sm:mt-6">
            Layanan untuk setiap tahap pekerjaan.
          </h2>

          <p className="mx-auto mt-5 max-w-[660px] text-[14px] leading-7 text-[#5f6976] sm:mt-6 sm:text-[15px] sm:leading-8">
            Dari perencanaan sampai penyelesaian, pilih layanan yang sesuai
            dengan kebutuhan proyek Anda. Geser untuk melihat layanan lainnya.
          </p>
        </header>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#ddd5c8] pt-4 sm:mt-7 sm:gap-5 sm:pt-5">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#758094] sm:text-[9px]">
            Jelajahi layanan
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Geser layanan ke kiri"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#cfc6b8] bg-[#f8f4ec] text-[#14243f] transition hover:-translate-y-0.5 hover:border-[#dcb458] sm:h-11 sm:w-11"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Geser layanan ke kanan"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#14243f] bg-[#14243f] text-[#f8f4ec] transition hover:-translate-y-0.5 sm:h-11 sm:w-11"
            >
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          <div
            ref={railRef}
            className="mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-0.5 pb-7 pt-7 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 sm:pb-12 sm:pt-12 lg:gap-7"
          >
            {items.map((service, index) => {
              const isUpper = index % 2 === 0;

              return (
                <article
                  key={service.id}
                  className={`group relative min-h-[390px] w-[86vw] max-w-[360px] shrink-0 snap-start overflow-hidden border border-[#d7cfc2] bg-[#f8f4ec] shadow-[0_14px_30px_rgba(20,36,63,0.07)] transition duration-300 hover:shadow-[0_22px_46px_rgba(20,36,63,0.13)] sm:min-h-[430px] sm:w-[390px] sm:max-w-none sm:hover:-translate-y-2 lg:w-[405px] ${
                    isUpper ? "sm:-translate-y-4" : "sm:translate-y-4"
                  }`}
                  style={{
                    borderRadius:
                      cardShapes[index % cardShapes.length],
                  }}
                >
                  <Link
                    href={
                      service.slug
                        ? `/services/${service.slug}`
                        : "/services"
                    }
                    className="flex h-full min-h-[390px] flex-col sm:min-h-[430px]"
                  >
                    <div className="relative h-[205px] overflow-hidden bg-[#e8e2d8] sm:h-[225px]">
                      {service.image ? (
                        <>
                          <DatabaseImage
                            src={service.image}
                            alt={service.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                            sizes="(max-width: 639px) 86vw, 405px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#14243f]/55 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(225deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(45deg, rgba(220,180,88,.10) 25%, transparent 25%), linear-gradient(315deg, rgba(220,180,88,.10) 25%, #f1ece3 25%)",
                            backgroundSize: "42px 42px",
                          }}
                        />
                      )}

                      <div className="absolute left-4 top-4 rounded-full border border-white/45 bg-[#14243f]/55 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        SRV-{String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="absolute bottom-4 right-4 max-w-[170px] text-right font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-white/85">
                        {service.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:gap-6 sm:p-6">
                      <div>
                        <h3 className="max-w-[15ch] text-[1.5rem] font-bold uppercase leading-[0.96] tracking-[-0.035em] text-[#14243f] sm:text-[1.75rem]">
                          {service.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-[12px] leading-6 text-[#5f6976] sm:mt-4 sm:text-[13px] sm:leading-7">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between gap-4 border-t border-[#ded6ca] pt-4">
                        <span className="max-w-[120px] font-mono text-[7px] uppercase tracking-[0.14em] text-[#7b8491] sm:text-[8px]">
                          Sesuai kebutuhan proyek
                        </span>

                        <span className="inline-flex shrink-0 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#14243f] sm:text-[10px]">
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
          <div className="mt-10 border border-dashed border-[#cfc6b8] px-5 py-12 text-center sm:mt-12 sm:px-6 sm:py-16">
            <p className="text-sm text-[#5f6976]">
              Layanan belum tersedia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
