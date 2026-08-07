import { PublicSeoTags } from "@/features/public-site";
import { getPublicHomeData, getPublicPageContext } from "@/features/public-site/server";

import { ReferenceHome } from "./redesign/reference-home";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export default async function HomePage() {
  const [context, data] = await Promise.all([
    getPublicPageContext("home"),
    getPublicHomeData(),
  ]);

  return (
    <>
      <PublicSeoTags metadata={context.metadata} />
      <SiteHeader />
      <main>
        <ReferenceHome context={context} data={data} />
      </main>
      <SiteFooter />
    </>
  );
}
