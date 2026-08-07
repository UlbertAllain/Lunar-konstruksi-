import { Check, Compass, Eye, Layers3 } from "lucide-react";

import { PublicSeoTags } from "@/features/public-site";
import {
  getPublicAboutData,
  getPublicPageContext,
} from "@/features/public-site/server";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
export default async function AboutPage() {
  const [data, pageContext] = await Promise.all([
    getPublicAboutData(),
    getPublicPageContext("about"),
  ]);

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <PublicSeoTags metadata={pageContext.metadata} />
      <SiteHeader />
      <main>
        <section className="site-section border-b border-slate-300">
          <div className="site-container">
            <span className="site-kicker text-orange-600">
              About / Lunar Konstruksi
            </span>
            <div className="mt-7 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">
                Kami membangun dengan struktur berpikir yang jelas.
              </h1>
              <p className="site-lead">
                Lunar Konstruksi berangkat dari keyakinan bahwa hasil bangunan
                yang baik ditentukan oleh kualitas keputusan sejak awal, bukan
                hanya oleh aktivitas di lapangan.
              </p>
            </div>
          </div>
        </section>
        {/* test */}
        <section className="site-section">
          <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <span className="site-kicker">Our position</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                Partner teknis, bukan sekadar pelaksana.
              </h2>
            </div>
            <div className="space-y-7 text-xl leading-9 text-slate-700">
              <p>
                Kami menghubungkan perencanaan, estimasi, desain, koordinasi,
                dan pelaksanaan agar keputusan di satu tahap tidak menciptakan
                masalah pada tahap berikutnya.
              </p>
              <p>
                Setiap project memiliki konteks berbeda. Karena itu, kami tidak
                memaksakan satu formula, tetapi membangun kerangka kerja yang
                tetap disiplin dan dapat dipertanggungjawabkan.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#15181e] py-20 text-white sm:py-24">
          <div className="site-container grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              [
                Compass,
                "Clarity",
                "Lingkup, prioritas, keputusan, dan risiko dijelaskan sejak awal.",
              ],
              [
                Layers3,
                "Integration",
                "Desain dan konstruksi dipandang sebagai satu sistem kerja.",
              ],
              [
                Eye,
                "Accountability",
                "Progres dan perubahan didokumentasikan secara transparan.",
              ],
            ].map(([Icon, title, text]) => {
              const C = Icon as typeof Compass;
              return (
                <article key={title as string} className="bg-[#15181e] p-8">
                  <C className="text-orange-400" />
                  <h3 className="mt-16 text-2xl font-semibold">
                    {title as string}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {text as string}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <div className="site-heading-grid">
              <div>
                <span className="site-kicker">Team</span>
                <h2 className="site-title mt-5">
                  Keahlian lintas fungsi, satu standar kerja.
                </h2>
              </div>
              <p className="site-lead">
                Tim kami menggabungkan pemikiran desain, pengendalian project,
                dan pengalaman lapangan.
              </p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.team.map((member) => (
                <article
                  key={member.id ?? member.name}
                  className="rounded-[26px] border border-slate-300 p-4"
                >
                  <div className="overflow-hidden rounded-[20px] bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo.url}
                      alt={member.name}
                      className="h-[360px] w-full object-cover grayscale"
                    />
                  </div>
                  <div className="p-3 pb-1">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm text-orange-600">
                      {member.position}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {member.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600"
                        >
                          <Check size={12} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
