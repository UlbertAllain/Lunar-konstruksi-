import type { Metadata } from "next";

import HomePage from "@/components/site/home-page";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
    path: "/",
  });

export default function Home() {
  return <HomePage />;
}
