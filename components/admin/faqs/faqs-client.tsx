"use client";

import { ResourceList } from "@/components/admin/resource-list";
import type { FAQ } from "@/modules/faqs/faq.types";

export default function FAQsClient() {
  return (
    <ResourceList<FAQ>
      title="FAQ"
      description="Kelola pertanyaan umum yang membantu calon klien memahami proses kerja perusahaan."
      endpoint="/api/admin/faqs"
      createHref="/admin/faqs/create"
      editHref={(item) => `/admin/faqs/${item.id}/edit`}
      searchText={(item) => `${item.question} ${item.answer}`}
      statusField="isPublished"
      emptyLabel="Belum ada FAQ"
      columns={[
        {
          label: "Pertanyaan",
          render: (item) => <p className="max-w-md font-semibold text-slate-900">{item.question}</p>,
        },
        {
          label: "Jawaban",
          render: (item) => <p className="max-w-lg line-clamp-2 text-slate-600">{item.answer}</p>,
        },
        { label: "Urutan", render: (item) => item.order },
      ]}
    />
  );
}
