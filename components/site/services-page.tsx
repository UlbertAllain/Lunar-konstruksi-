import { getPublicPageContext } from "@/features/public-site/server";

import { PublicPageRenderer } from "./redesign/public-page-renderer";

export default async function ServicesPage() {
  const context = await getPublicPageContext("services");
  return <PublicPageRenderer context={context} pageKey="services" />;
}
