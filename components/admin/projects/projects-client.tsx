"use client";

import { ResourceList } from "@/components/admin/resource-list";
import type { Project } from "@/modules/projects/project.types";

const statusLabel = {
  PLANNING: "Perencanaan",
  PROCESS: "Proses",
  COMPLETED: "Selesai",
};

export default function ProjectsClient() {
  return (
    <ResourceList<Project>
      title="Projects"
      description="Kelola portfolio, dokumentasi visual, detail teknis, dan status pengerjaan project."
      endpoint="/api/admin/projects"
      createHref="/admin/projects/create"
      editHref={(item) => `/admin/projects/${item.id}/edit`}
      searchText={(item) => `${item.title} ${item.location} ${item.clientName ?? ""}`}
      statusField="isPublished"
      emptyLabel="Belum ada project"
      columns={[
        {
          label: "Project",
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage.url} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.location}</p>
              </div>
            </div>
          ),
        },
        { label: "Tahun", render: (item) => item.year },
        { label: "Durasi", render: (item) => item.duration },
        {
          label: "Pengerjaan",
          render: (item) => <span className="admin-status-inactive">{statusLabel[item.status]}</span>,
        },
        {
          label: "Unggulan",
          render: (item) => <span className={item.isFeatured ? "admin-status-active" : "admin-status-inactive"}>{item.isFeatured ? "Ya" : "Tidak"}</span>,
        },
      ]}
    />
  );
}
