import type { Metadata } from "next";

import ProjectsPage from "@/components/site/projects-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      "Portofolio Proyek Konstruksi",
    description:
      "Lihat portofolio Lunar Konstruksi: dokumentasi pekerjaan konstruksi, renovasi, interior, dan berbagai kebutuhan bangunan beserta lokasi serta lingkup proyek.",
    path: "/projects",
  });

export default function Page() {
  return <ProjectsPage />;
}
