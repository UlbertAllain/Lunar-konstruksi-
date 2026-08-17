import type { Metadata } from "next";

import ServicesPage from "@/components/site/services-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Jasa Konstruksi Solo & Solo Raya",
  description:
    "Layanan Lunar Konstruksi untuk konstruksi, renovasi, interior, atap, dan pekerjaan bangunan di Solo Raya dengan alur kerja yang jelas dan terkoordinasi.",
  path: "/services",
});

export default function Page() {
  return <ServicesPage />;
}
