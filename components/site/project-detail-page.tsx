"use client";

import Link from "next/link";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import { useParams } from "next/navigation";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { usePublicOverview } from "./use-public-overview";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data } = usePublicOverview();
  const project = data.projects.find((item) => item.slug === params.slug) ?? data.projects[0];

  if (!project) return null;

  return (
    <div className="bg-[#f4f1ea] text-slate-950">
      <SiteHeader dark />
      <main>
        <section className="bg-[#12151b] pb-16 pt-12 text-white sm:pb-24 sm:pt-20">
          <div className="site-container">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Kembali ke portfolio</Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div><span className="site-kicker text-orange-400">Project / {project.year}</span><h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">{project.title}</h1></div>
              <p className="text-base leading-8 text-slate-400">{project.shortDescription}</p>
            </div>
          </div>
        </section>

        <section className="-mt-1 bg-[#12151b]">
          <div className="site-container">
            <div className="overflow-hidden rounded-t-[30px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.coverImage.url} alt={project.title} className="h-[70vh] min-h-[480px] w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="space-y-6">
              {[
                ["Lokasi", project.location],
                ["Tahun", String(project.year)],
                ["Durasi", project.duration],
                ["Status", project.status === "COMPLETED" ? "Selesai" : project.status === "PROCESS" ? "Dalam proses" : "Perencanaan"],
              ].map(([label, value]) => <div key={label} className="border-b border-slate-300 pb-4"><p className="site-kicker text-slate-400">{label}</p><p className="mt-2 font-semibold">{value}</p></div>)}
            </aside>
            <article>
              <span className="site-kicker text-orange-600">Project narrative</span>
              <p className="mt-6 whitespace-pre-line text-xl leading-9 text-slate-700 sm:text-2xl sm:leading-10">{project.description}</p>
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div><h2 className="text-lg font-semibold">Lingkup pekerjaan</h2><div className="mt-5 space-y-3">{project.scope.map((item) => <p key={item} className="flex items-center gap-3 text-sm text-slate-600"><Check size={16} className="text-orange-600" /> {item}</p>)}</div></div>
                <div><h2 className="text-lg font-semibold">Material utama</h2><div className="mt-5 space-y-3">{project.materials.map((item) => <p key={item} className="flex items-center gap-3 text-sm text-slate-600"><MapPin size={16} className="text-orange-600" /> {item}</p>)}</div></div>
              </div>
            </article>
          </div>
        </section>

        {project.gallery.length ? (
          <section className="pb-24">
            <div className="site-container grid gap-5 md:grid-cols-2">
              {project.gallery.map((image, index) => (
                <div key={image.publicId} className={index % 3 === 0 ? "md:col-span-2" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.alt || `${project.title} ${index + 1}`} className={`w-full rounded-[24px] object-cover ${index % 3 === 0 ? "h-[620px]" : "h-[420px]"}`} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
