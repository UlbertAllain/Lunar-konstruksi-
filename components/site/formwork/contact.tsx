import {
  BlueprintLayer,
  MicroLabel,
  TechnicalArc,
  displayFont,
} from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { TechnicalContactForm } from "./contact-form";
import { DatabaseImage } from "./media";
import { OfficeLocationSection } from "./office-location-section";
import { type SiteData } from "./data";

export function FormworkContact({
  data,
}: {
  data: SiteData;
}) {
  const profile =
    data.siteContent.companyProfile;

  const email =
    profile.email ||
    process.env
      .NEXT_PUBLIC_COMPANY_EMAIL ||
    "hello@lunarkonstruksi.id";

  const phone =
    profile.phone ||
    process.env
      .NEXT_PUBLIC_COMPANY_PHONE ||
    "+62 812 0000 0000";

  return (
    <div className="lunar-public-page overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader
        services={data.services}
        projects={data.projects}
      />

      <main>
        <section className="relative border-b border-[#d9d4ca] py-14 sm:py-18 lg:py-20">
          <BlueprintLayer />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
            <div>
              <MicroLabel>
                C-01 / Konsultasi proyek / Solo Raya
              </MicroLabel>

              <h1
                className={`${displayFont} mt-7 max-w-[650px] text-[clamp(2.3rem,10vw,4.7rem)] font-black uppercase leading-[.88] tracking-[-.048em]`}
              >
                Ceritakan proyek yang
                ingin Anda kerjakan.
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#5f6976]">
                Untuk kebutuhan proyek di Solo Raya dan sekitarnya, sampaikan jenis pekerjaan,
                lokasi, kebutuhan, dan
                target Anda. Informasi
                awal ini membantu kami
                memahami proyek sebelum
                masuk ke pembahasan yang
                lebih rinci.
              </p>
            </div>

            <div className="relative min-h-[310px] sm:min-h-[410px] lg:min-h-[460px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(14%_0%,84%_0%,100%_18%,95%_70%,100%_86%,83%_100%,17%_94%,0%_76%,4%_19%)]">
                <DatabaseImage
                  src={
                    data.siteContent
                      .contactHero?.url ||
                    LOCAL_MEDIA.contactHero
                  }
                  alt="Konsultasi proyek Lunar Konstruksi"
                  className="h-[290px] w-full object-contain mix-blend-multiply sm:h-[390px] lg:h-[430px]"
                  quality={95}
                  preload={true}
                  sizes="(max-width: 1023px) 94vw, 55vw"
                  hero
                />
              </div>

              <div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
                <div className="px-4 py-3">
                  <MicroLabel>
                    Informasi awal / C-02
                  </MicroLabel>

                  <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
                    Semakin jelas kebutuhan
                    awalnya, semakin mudah
                    menentukan langkah
                    berikutnya.
                  </p>
                </div>

                <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
                  PROJECT / INPUT
                </div>
              </div>

              <TechnicalArc
                label="PROJECT / INPUT"
                className="bottom-[-9%] left-[10%] h-[360px] w-[500px] rotate-[17deg]"
              />
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10">
            <div>
              <MicroLabel>
                Hubungi Lunar Konstruksi
              </MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[520px] text-[clamp(2.05rem,3.4vw,3.45rem)] font-black uppercase leading-[.92] tracking-[-.035em]`}
              >
                Mulai dengan kebutuhan
                Anda. Kami bantu susun
                langkahnya.
              </h2>

              <div className="mt-9 border-t border-[#c0bbb2] pt-5 text-sm leading-7 text-[#5f6976]">
                <p>{email}</p>
                <p>{phone}</p>

                <p className="mt-2 text-xs text-[#87909b]">
                  Jadwal pertemuan dapat
                  disesuaikan melalui
                  konfirmasi terlebih
                  dahulu.
                </p>
              </div>
            </div>

            <div>
              <MicroLabel>
                Informasi proyek
              </MicroLabel>

              <div className="mt-7">
                <TechnicalContactForm />
              </div>
            </div>
          </div>
        </section>

        <OfficeLocationSection
          location={
            data.siteContent
              .officeLocation
          }
        />

        <section className="bg-[#14243f] py-14 text-white sm:py-16">
          <div className="mx-auto grid w-full max-w-[1480px] gap-3 px-5 sm:px-8 md:grid-cols-3 lg:px-10">
            {[
              [
                "01",
                "Kebutuhan",
                "Ceritakan jenis pekerjaan dan hasil yang ingin dicapai.",
              ],
              [
                "02",
                "Kondisi",
                "Informasikan lokasi, waktu, anggaran, akses, atau batasan yang sudah diketahui.",
              ],
              [
                "03",
                "Langkah berikutnya",
                "Kami pelajari kebutuhan awal lalu menentukan pembahasan yang paling relevan.",
              ],
            ].map(
              ([
                number,
                title,
                text,
              ]) => (
                <article
                  key={number}
                  className="border border-white/12 bg-white/[0.035] p-5"
                >
                  <p className="font-mono text-[9px] text-[#dcb458]">
                    {number}
                  </p>

                  <h3
                    className={`${displayFont} mt-8 text-[1.45rem] font-black uppercase leading-[.94]`}
                  >
                    {title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-white/55">
                    {text}
                  </p>
                </article>
              ),
            )}
          </div>
        </section>
      </main>

      <FormworkFooter content={data.siteContent} />
    </div>
  );
}
