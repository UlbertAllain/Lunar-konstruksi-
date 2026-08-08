"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CircleHelp,
  FolderKanban,
  MessageSquareQuote,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { TeamMember } from "@/modules/team/team.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

type Summary = {
  services: ConstructionService[];
  projects: Project[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};

const initialSummary: Summary = {
  services: [],
  projects: [],
  team: [],
  testimonials: [],
  faqs: [],
};

export default function DashboardClient() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      adminFetch<ApiEnvelope<ConstructionService[]>>("/api/admin/services"),
      adminFetch<ApiEnvelope<Project[]>>("/api/admin/projects"),
      adminFetch<ApiEnvelope<TeamMember[]>>("/api/admin/team"),
      adminFetch<ApiEnvelope<Testimonial[]>>("/api/admin/testimonials"),
      adminFetch<ApiEnvelope<FAQ[]>>("/api/admin/faqs"),
    ])
      .then(([services, projects, team, testimonials, faqs]) => {
        if (!active) return;
        setSummary({
          services: services.data,
          projects: projects.data,
          team: team.data,
          testimonials: testimonials.data,
          faqs: faqs.data,
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Dashboard gagal dimuat."))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Services", count: summary.services.length, published: summary.services.filter((item) => item.isPublished).length, href: "/admin/services", icon: Wrench },
    { label: "Projects", count: summary.projects.length, published: summary.projects.filter((item) => item.isPublished).length, href: "/admin/projects", icon: FolderKanban },
    { label: "Team", count: summary.team.length, published: summary.team.filter((item) => item.isActive).length, href: "/admin/team", icon: Users },
    { label: "Testimonials", count: summary.testimonials.length, published: summary.testimonials.filter((item) => item.isPublished).length, href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "FAQ", count: summary.faqs.length, published: summary.faqs.filter((item) => item.isPublished).length, href: "/admin/faqs", icon: CircleHelp },
  ];

  const recentProjects = summary.projects.slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="admin-panel overflow-hidden bg-[#171a20] text-white">
        <div className="relative z-10 max-w-3xl py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">CMS overview</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Kontrol konten perusahaan, tanpa friksi.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Pantau kesiapan data publik, perbarui portfolio, dan pastikan setiap bagian company profile tetap konsisten.</p>
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-1/3 admin-dashboard-grid opacity-20 lg:block" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="admin-panel group p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-orange-100 group-hover:text-orange-700"><Icon size={19} /></span>
                <ArrowUpRight size={17} className="text-slate-300 group-hover:text-orange-600" />
              </div>
              <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">{loading ? "—" : card.count}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{card.label}</p>
              <p className="mt-2 text-xs text-slate-400">{card.published} aktif / published</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="admin-panel p-0">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">Project terbaru</h2>
              <p className="mt-1 text-xs text-slate-500">Ringkasan portfolio yang dikelola dari CMS.</p>
            </div>
            <Link href="/admin/projects/create" className="admin-button-secondary">Tambah Project</Link>
          </div>
          {recentProjects.length ? (
            <div className="divide-y divide-slate-100">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/admin/projects/${project.id}/edit`} className="flex items-center gap-4 p-4 transition hover:bg-slate-50">
                  <div className="h-14 w-20 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.coverImage.url} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{project.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{project.location} · {project.year}</p>
                  </div>
                  <span className={project.isPublished ? "admin-status-active" : "admin-status-inactive"}>{project.isPublished ? "Published" : "Draft"}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-sm text-slate-500">Belum ada project.</div>
          )}
        </div>

        <div className="admin-panel">
          <span className="admin-eyebrow">Publishing health</span>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">Kesiapan website</h2>
          <div className="mt-6 space-y-4">
            {cards.map((card) => {
              const percentage = card.count ? Math.round((card.published / card.count) * 100) : 0;
              return (
                <div key={card.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">{card.label}</span>
                    <span className="text-slate-400">{percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${percentage}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
