import type { Metadata } from "next";

import ContactPage from "@/components/site/contact-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      "Kontak Jasa Konstruksi Solo",
    description:
      "Hubungi Lunar Konstruksi untuk konsultasi kebutuhan konstruksi, renovasi, interior, dan pekerjaan bangunan di Solo Raya dan sekitarnya.",
    path: "/contact",
  });

export default function Page() {
  return <ContactPage />;
}
