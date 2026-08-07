import { getPublicPageContext } from "@/features/public-site/server";

import { PublicPageRenderer } from "./redesign/public-page-renderer";

export default async function ContactPage() {
  const context = await getPublicPageContext("contact");
  return <PublicPageRenderer context={context} pageKey="contact" />;
}
