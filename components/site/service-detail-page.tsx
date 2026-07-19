"use client";

import Link from "next/link";
import { ArrowRight, Check, Layers3 } from "lucide-react";
import { useParams } from "next/navigation";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { usePublicOverview } from "./use-public-overview";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data } = usePublicOverview();
  const service = data.services.find((item) => item.slug === params.slug) ?? data.services[0];
  if (!service) return null;

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader />
      <main>
        <section className="site-section border-b border-slate-300">
          <div className="site-container grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div><span className="site-kicker text-orange-600">Service / {service.name}</span><h1 className="mt-6 text-5xl font-semibold leading-[0.93] tracking-[-0.055em] sm:text-7xl">{service.name}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">{service.shortDescription}</p><Link href="/contact" className="site-button-dark mt-8">Konsultasikan Kebutuhan <ArrowRight size={17} /></Link></div>
            <div className="overflow-hidden rounded-[28px] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.coverImage.url} alt={service.name} className="h-[560px] w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div><span className="site-kicker">Approach</span><h2 className="mt-5 text-3xl font-semibold tracking-tight">Bekerja dari kebutuhan menuju detail yang dapat dibangun.</h2></div>
            <div><p className="whitespace-pre-line text-xl leading-9 text-slate-700">{service.description}</p><div className="mt-10 grid gap-4 md:grid-cols-2">{service.features.map((feature, index) => <div key={`${feature.title}-${index}`} className="rounded-2xl border border-slate-300 p-5"><Layers3 className="text-orange-600" /><h3 className="mt-8 font-semibold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p></div>)}</div></div>
          </div>
        </section>

        <section className="bg-[#15181e] py-20 text-white sm:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[0.65fr_1.35fr]"><div><span className="site-kicker text-orange-400">Scope</span><h2 className="mt-5 text-3xl font-semibold tracking-tight">Lingkup yang dapat disesuaikan dengan project.</h2></div><div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">{service.scopes.map((scope, index) => <div key={`${scope.name}-${index}`} className="flex items-center gap-3 bg-[#15181e] p-5 text-sm text-slate-300"><Check size={17} className="text-orange-400" /> {scope.name}</div>)}</div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
