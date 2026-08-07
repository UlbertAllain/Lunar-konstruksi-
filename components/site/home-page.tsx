import { getPublicPageContext } from "@/features/public-site/server";

import { PublicPageRenderer } from "./redesign/public-page-renderer";

export default async function HomePage() {
  const context = await getPublicPageContext("home");
  return <PublicPageRenderer context={context} pageKey="home" />;
}
