import {
  ArrowUpRight,
  MapPinned,
  Navigation,
} from "lucide-react";

import type { OfficeLocation } from "@/modules/site-content/site-content.types";
import {
  BlueprintLayer,
  MicroLabel,
  displayFont,
} from "./decor";

function safeMapEmbedUrl(
  value: string,
) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return "";
    }

    if (
      (url.hostname ===
        "www.google.com" ||
        url.hostname ===
          "google.com") &&
      url.pathname.startsWith(
        "/maps/embed",
      )
    ) {
      return url.toString();
    }

    if (
      url.hostname ===
        "maps.google.com" &&
      url.searchParams.get(
        "output",
      ) === "embed"
    ) {
      return url.toString();
    }

    return "";
  } catch {
    return "";
  }
}

function safeExternalUrl(
  value: string,
) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export function OfficeLocationSection({
  location,
}: {
  location: OfficeLocation;
}) {
  const embedUrl =
    safeMapEmbedUrl(
      location.googleMapsEmbedUrl,
    );

  const mapsUrl =
    safeExternalUrl(
      location.googleMapsUrl,
    );

  if (
    !location.isVisible ||
    !embedUrl
  ) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-y border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
      <BlueprintLayer className="opacity-[0.035]" />

      <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-[#d5cec2] pb-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <MicroLabel>
              Lokasi kantor
            </MicroLabel>

            <h2
              className={`${displayFont} mt-5 max-w-[620px] text-[clamp(2.05rem,3.5vw,3.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#14243f]`}
            >
              Temui Lunar Konstruksi.
            </h2>
          </div>

          <p className="max-w-xl text-[13px] leading-7 text-[#657184] lg:justify-self-end">
            Lihat lokasi kantor kami
            melalui peta di bawah, atau
            buka Google Maps untuk
            mendapatkan petunjuk arah.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
          <div className="relative min-h-[360px] overflow-hidden bg-[#ded8ce] shadow-[0_20px_52px_rgba(20,36,63,0.10)] [clip-path:polygon(0%_0%,94%_0%,100%_10%,97%_100%,7%_100%,0%_90%)] sm:min-h-[460px]">
            <iframe
              src={embedUrl}
              title={
                location.name ||
                "Lokasi kantor Lunar Konstruksi"
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.12] contrast-[1.02]"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#14243f]/35 to-transparent" />

            <div className="pointer-events-none absolute left-4 top-4 border border-white/40 bg-[#14243f]/82 px-3 py-2 text-white backdrop-blur-sm sm:left-5 sm:top-5">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#e5c775]">
                Office / Maps
              </span>
            </div>
          </div>

          <article className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#14243f] p-6 text-[#f8f4ec] [clip-path:polygon(0%_7%,9%_0%,100%_0%,100%_90%,91%_100%,0%_100%)] sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <MapPinned className="h-5 w-5 text-[#dcb458]" />

                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/38">
                  Location
                </span>
              </div>

              <h3
                className={`${displayFont} mt-10 text-[clamp(1.75rem,2.7vw,2.55rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]`}
              >
                {location.name ||
                  "Kantor Lunar Konstruksi"}
              </h3>

              {location.address ? (
                <p className="mt-5 max-w-[420px] whitespace-pre-line text-[13px] leading-7 text-white/60">
                  {location.address}
                </p>
              ) : null}
            </div>

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-white"
              >
                <Navigation className="h-3.5 w-3.5 text-[#dcb458]" />

                Buka di Google Maps

                <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
