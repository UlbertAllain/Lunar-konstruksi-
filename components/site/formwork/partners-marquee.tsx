import type { SiteContentSettings } from "@/modules/site-content/site-content.types";

import { DatabaseImage } from "./media";

type Partner = SiteContentSettings["partners"][number];

const copies = Array.from({ length: 10 }, (_, index) => index);

function PartnerVisual({
  partner,
}: {
  partner: Partner;
}) {
  return (
    <div className="group flex h-[94px] w-[220px] shrink-0 items-center justify-center gap-7 px-5 sm:h-[104px] sm:w-[250px] sm:px-7">
      <span className="h-px w-7 shrink-0 bg-[#dcb458]/70 transition-all duration-300 group-hover:w-11" />

      {partner.logo?.url ? (
        <DatabaseImage
          src={partner.logo.url}
          alt={partner.logo.alt || partner.name}
          className="h-[42px] w-full max-w-[135px] object-contain opacity-60 grayscale transition duration-300 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:grayscale-0 sm:h-[48px] sm:max-w-[150px]"
          sizes="150px"
        />
      ) : (
        <span className="max-w-[155px] text-center text-[12px] font-black uppercase leading-5 tracking-[0.09em] text-[#14243f]/62 transition duration-300 group-hover:text-[#14243f] sm:text-[13px]">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export function PartnersMarquee({
  partners,
}: {
  partners: Partner[];
}) {
  if (!partners.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-[#d8d1c6] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-4 border-b border-[#d9d2c6] pb-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Our Partners
            </p>

            <h2 className="mt-3 max-w-[620px] text-[clamp(1.7rem,2.6vw,2.65rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]">
              Mitra yang ikut menjadi bagian dari perjalanan proyek.
            </h2>
          </div>

          <p className="max-w-md text-[12px] leading-6 text-[#6b7686] lg:justify-self-end">
            Kolaborasi dengan berbagai pihak membantu pekerjaan bergerak lebih
            terarah sesuai kebutuhan proyek.
          </p>
        </div>
      </div>

      <div className="lunar-partner-marquee mt-4 overflow-hidden sm:mt-5">
        <div className="lunar-partner-track flex w-max items-center">
          {copies.map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex shrink-0 items-center"
              aria-hidden={copyIndex === 0 ? undefined : true}
            >
              {partners.map((partner) => {
                const visual = (
                  <PartnerVisual partner={partner} />
                );

                if (partner.website && copyIndex === 0) {
                  return (
                    <a
                      key={`${copyIndex}-${partner.id}`}
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Kunjungi ${partner.name}`}
                    >
                      {visual}
                    </a>
                  );
                }

                return (
                  <div key={`${copyIndex}-${partner.id}`}>
                    {visual}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
