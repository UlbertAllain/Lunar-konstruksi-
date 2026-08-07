import { getPublicPageContext } from "@/features/public-site/server";

import { PublicPageRenderer } from "./redesign/public-page-renderer";

export default async function ProjectsPage() {
  const context = await getPublicPageContext("projects");
  return <PublicPageRenderer context={context} pageKey="projects" />;
}
