import { notFound } from "next/navigation";

import ProjectDetailPage from "@/components/site/project-detail-page";
import { getPublicProjectBySlug } from "@/modules/public-site/server";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPage project={project} />;
}
