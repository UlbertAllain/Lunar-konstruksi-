"use client";

import { ResourceList } from "@/components/admin/resource-list";
import type { TeamMember } from "@/modules/team/team.types";

export default function TeamClient() {
  return (
    <ResourceList<TeamMember>
      title="Team"
      description="Kelola profil tenaga ahli dan personel yang menjadi representasi perusahaan."
      endpoint="/api/admin/team"
      createHref="/admin/team/create"
      editHref={(item) => `/admin/team/${item.id}/edit`}
      searchText={(item) => `${item.name} ${item.position} ${item.skills.join(" ")}`}
      statusField="isActive"
      statusLabels={["Nonaktif", "Aktif"]}
      emptyLabel="Belum ada anggota tim"
      columns={[
        {
          label: "Anggota",
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.photo.url} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.position}</p>
              </div>
            </div>
          ),
        },
        {
          label: "Keahlian",
          render: (item) => <p className="max-w-md text-slate-600">{item.skills.slice(0, 3).join(" · ")}</p>,
        },
        { label: "Urutan", render: (item) => item.order },
      ]}
    />
  );
}
