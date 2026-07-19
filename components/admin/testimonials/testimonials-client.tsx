"use client";

import { ResourceList } from "@/components/admin/resource-list";
import type { Testimonial } from "@/types/testimonial";

export default function TestimonialsClient() {
  return (
    <ResourceList<Testimonial>
      title="Testimonials"
      description="Kelola ulasan klien, rating, dan keterkaitannya dengan layanan atau project."
      endpoint="/api/admin/testimonials"
      createHref="/admin/testimonials/create"
      editHref={(item) => `/admin/testimonials/${item.id}/edit`}
      searchText={(item) => `${item.clientName} ${item.clientPosition ?? ""} ${item.projectName ?? ""}`}
      statusField="isPublished"
      emptyLabel="Belum ada testimoni"
      columns={[
        {
          label: "Klien",
          render: (item) => (
            <div>
              <p className="font-semibold text-slate-900">{item.clientName}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.clientPosition || item.projectName || "Klien"}</p>
            </div>
          ),
        },
        {
          label: "Testimoni",
          render: (item) => <p className="max-w-lg line-clamp-2 text-slate-600">{item.message}</p>,
        },
        { label: "Rating", render: (item) => <span className="font-semibold text-amber-600">{item.rating}/5</span> },
        { label: "Urutan", render: (item) => item.order },
      ]}
    />
  );
}
