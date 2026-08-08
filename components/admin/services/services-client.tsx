"use client";

import { ResourceList } from "@/components/admin/resource-list";
import type { ConstructionService } from "@/modules/services/service.types";

export default function ServicesClient() {
  return (
    <ResourceList<ConstructionService>
      title="Services"
      description="Kelola layanan utama, susunan penayangan, cover, dan konten yang tampil pada website."
      endpoint="/api/admin/services"
      createHref="/admin/services/create"
      editHref={(item) => `/admin/services/${item.id}/edit`}
      searchText={(item) => `${item.name} ${item.shortDescription}`}
      statusField="isPublished"
      emptyLabel="Belum ada layanan"
      columns={[
        {
          label: "Layanan",
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage.url} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-0.5 max-w-sm truncate text-xs text-slate-500">/{item.slug}</p>
              </div>
            </div>
          ),
        },
        {
          label: "Ringkasan",
          render: (item) => <p className="max-w-md line-clamp-2 text-slate-600">{item.shortDescription}</p>,
        },
        {
          label: "Urutan",
          render: (item) => <span className="font-semibold text-slate-700">{item.order}</span>,
        },
        {
          label: "Unggulan",
          render: (item) => <span className={item.isFeatured ? "admin-status-active" : "admin-status-inactive"}>{item.isFeatured ? "Ya" : "Tidak"}</span>,
        },
      ]}
    />
  );
}
