import { PublicSeoTags } from "@/modules/public-site";
import { getPublicPageContext } from "@/modules/public-site/server";
import { ArchivePageRenderer } from "./redesign/archive/archive-page-renderer";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export default async function ServicesPage(){const context=await getPublicPageContext("services");return <><PublicSeoTags metadata={context.metadata}/><SiteHeader/><main><ArchivePageRenderer context={context} pageKey="services"/></main><SiteFooter/></>}
