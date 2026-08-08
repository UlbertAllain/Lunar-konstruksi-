import { PublicSeoTags } from "@/modules/public-site";
import {
  getPublicHomeData,
  getPublicPageContext,
} from "@/modules/public-site/server";
import { ArchiveHome } from "./redesign/archive/archive-home";
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
        <ArchiveHome context={context} data={data} />
      </main>
      <SiteFooter />
    </>
  );
}
