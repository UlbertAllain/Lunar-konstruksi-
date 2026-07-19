"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { usePublicOverview } from "./use-public-overview";

export default function ServicesPage() {
  const { data } = usePublicOverview();

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader />
      <main>
        <section className="border-b border-slate-300 py-16 sm:py-24">
          <div className="site-container">
            <span className="site-kicker text-orange-600">Services / Capabilities</span>
            <div className="mt-7 grid gap-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">Layanan yang terhubung dari perencanaan sampai serah terima.</h1>
              <p className="site-lead">Ruang lingkup dapat disusun sesuai konteks project, mulai dari satu pekerjaan spesifik hingga pengelolaan terintegrasi.</p>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container space-y-8">
            {data.services.map((service, index) => (
              <article key={service.id ?? service.slug} className="grid overflow-hidden rounded-[28px] border border-slate-300 bg-white/40 lg:grid-cols-[0.9fr_1.1fr]">
                <div className={index % 2 ? "lg:order-2" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.coverImage.url} alt={service.name} className="h-full min-h-[380px] w-full object-cover" />
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-10">
                  <div>
                    <span className="font-mono text-xs text-orange-600">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{service.name}</h2>
                    <p className="mt-5 text-base leading-8 text-slate-600">{service.shortDescription}</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {service.scopes.slice(0, 6).map((scope) => (
                        <p key={scope.name} className="flex items-center gap-2 text-sm text-slate-600"><Check size={15} className="text-orange-600" /> {scope.name}</p>
                      ))}
                    </div>
                  </div>
                  <Link href={`/services/${service.slug}`} className="site-button-dark mt-10 self-start">Lihat Detail <ArrowUpRight size={17} /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
