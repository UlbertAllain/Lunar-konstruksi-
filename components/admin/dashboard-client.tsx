"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CircleHelp,
  FolderKanban,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

type Summary = {
  services: ConstructionService[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};

const initialSummary: Summary = {
  services: [],
  projects: [],
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
      adminFetch<ApiEnvelope<Testimonial[]>>("/api/admin/testimonials"),
      adminFetch<ApiEnvelope<FAQ[]>>("/api/admin/faqs"),
    ])
      .then(([services, projects, testimonials, faqs]) => {
        if (!active) return;

        setSummary({
          services: services.data,
          projects: projects.data,
          testimonials: testimonials.data,
          faqs: faqs.data,
        });
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Dashboard gagal dimuat.",
        ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      label: "Layanan",
      count: summary.services.length,
      published: summary.services.filter((item) => item.isPublished).length,
      href: "/admin/services",
      icon: Wrench,
    },
    {
      label: "Proyek",
      count: summary.projects.length,
      published: summary.projects.filter((item) => item.isPublished).length,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Testimoni",
      count: summary.testimonials.length,
      published: summary.testimonials.filter((item) => item.isPublished).length,
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      label: "FAQ",
      count: summary.faqs.length,
      published: summary.faqs.filter((item) => item.isPublished).length,
      href: "/admin/faqs",
      icon: CircleHelp,
    },
  ];

  const recentProjects = summary.projects.slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="admin-panel overflow-hidden !border-[#263b59] !bg-[#14243f] !text-[#f8f4ec]">
        <div className="relative z-10 max-w-3xl py-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#dcb458]">
            Dashboard / overview
          </span>

          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,3vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.035em]">
            Kelola isi website dari satu tempat.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Perbarui layanan, proyek, testimoni, dan pertanyaan umum yang tampil
            di website Lunar Konstruksi.
          </p>
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-1/3 admin-dashboard-grid opacity-20 lg:block" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="admin-panel group overflow-hidden transition hover:-translate-y-0.5 hover:!border-[#b58c2f]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#8b8173]">
                  M-{String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-[#a59c90] transition group-hover:text-[#b58c2f]"
                />
              </div>

              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-black tracking-[-0.04em] text-[#14243f]">
                    {loading ? "â€”" : card.count}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#263b58]">
                    {card.label}
                  </p>
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d1c6] bg-[#eee8df] text-[#14243f] transition group-hover:border-[#dcb458] group-hover:bg-[#e9ddbf]">
                  <Icon size={17} />
                </span>
              </div>

              <p className="mt-4 text-xs text-[#7b8490]">
                {card.published} sudah dipublikasikan
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="admin-panel !p-0">
          <div className="flex items-center justify-between gap-4 border-b border-[#ded7cb] p-5">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b58c2f]">
                Project record
              </p>
              <h2 className="mt-2 font-bold text-[#14243f]">Proyek terbaru</h2>
              <p className="mt-1 text-xs text-[#737e8c]">
                Akses cepat ke proyek yang terakhir tersedia di CMS.
              </p>
            </div>

            <Link
              href="/admin/projects/create"
              className="admin-button-secondary"
            >
              Tambah proyek
            </Link>
          </div>

          {recentProjects.length ? (
            <div className="divide-y divide-[#e3ddd3]">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}/edit`}
                  className="flex items-center gap-4 p-4 transition hover:bg-[#f1ece3]"
                >
                  <div className="h-14 w-20 overflow-hidden bg-[#e4ddd2] [clip-path:polygon(0_0,90%_0,100%_18%,96%_100%,0_100%)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage.url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#14243f]">
                      {project.title}
                    </p>
                    <p className="mt-1 text-xs text-[#737e8c]">
                      {project.location} Â· {project.year}
                    </p>
                  </div>

                  <span
                    className={
                      project.isPublished
                        ? "admin-status-active"
                        : "admin-status-inactive"
                    }
                  >
                    {project.isPublished ? "Tayang" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-sm text-[#737e8c]">
              Belum ada proyek yang ditambahkan.
            </div>
          )}
        </div>

        <div className="admin-panel">
          <span className="admin-eyebrow">Status publikasi</span>
          <h2 className="mt-3 text-xl font-bold text-[#14243f]">
            Kesiapan konten
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#737e8c]">
            Persentase item yang sudah aktif atau dipublikasikan.
          </p>

          <div className="mt-6 space-y-5">
            {cards.map((card) => {
              const percentage = card.count
                ? Math.round((card.published / card.count) * 100)
                : 0;

              return (
                <div key={card.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#4f5d70]">
                      {card.label}
                    </span>
                    <span className="font-mono text-[9px] text-[#8a8175]">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden bg-[#e3ddd3]">
                    <div
                      className="h-full bg-[#dcb458] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
