import { PublicSeoTags } from "@/features/public-site";
import { getPublicPageContext } from "@/features/public-site/server";
import { ArchivePageRenderer } from "./redesign/archive/archive-page-renderer";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export default async function ContactPage() {
  const context = await getPublicPageContext("contact");
  return (
    <>
      <PublicSeoTags metadata={context.metadata} />
      <SiteHeader />
      <main>
        <ArchivePageRenderer context={context} pageKey="contact" />
      </main>
      <SiteFooter />
    </>
  );
}
