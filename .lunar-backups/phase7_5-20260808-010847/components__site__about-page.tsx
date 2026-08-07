import { getPublicPageContext } from "@/features/public-site/server";

import { PublicPageRenderer } from "./redesign/public-page-renderer";

export default async function AboutPage() {
  const context = await getPublicPageContext("about");
  return <PublicPageRenderer context={context} pageKey="about" />;
}
