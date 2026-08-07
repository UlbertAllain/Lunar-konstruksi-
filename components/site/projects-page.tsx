import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { PublicSeoTags } from "@/features/public-site";
import {
  getPublicProjectsData,
  getPublicPageContext,
} from "@/features/public-site/server";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
export default async function ProjectsPage() {
  const [data, pageContext] = await Promise.all([
    getPublicProjectsData(),
    getPublicPageContext("projects"),
  ]);

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <PublicSeoTags metadata={pageContext.metadata} />
      <SiteHeader />
      <main>
        <section className="border-b border-slate-300 py-16 sm:py-24">
          <div className="site-container">
            <span className="site-kicker">Portfolio / Built work</span>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">Pekerjaan nyata, konteks nyata, keputusan nyata.</h1>
              <p className="site-lead">Setiap project menunjukkan bagaimana kebutuhan, kondisi lokasi, material, waktu, dan biaya diterjemahkan menjadi hasil yang dapat digunakan.</p>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container grid gap-x-5 gap-y-12 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Link key={project.id ?? project.slug} href={`/projects/${project.slug}`} className={`group ${index % 3 === 0 ? "md:col-span-2" : ""}`}>
                <div className="relative overflow-hidden rounded-[28px] bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage.url} alt={project.title} className={`w-full object-cover transition duration-700 group-hover:scale-[1.025] ${index % 3 === 0 ? "h-[560px]" : "h-[420px]"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-950 backdrop-blur"><MapPin size={13} /> {project.location}</div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-5 border-b border-slate-300 pb-5">
                  <div><p className="site-kicker text-orange-600">{project.year} / {project.duration}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{project.shortDescription}</p></div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-300 transition group-hover:rotate-45 group-hover:bg-orange-500"><ArrowUpRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
