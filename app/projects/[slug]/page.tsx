import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import ProjectDetailPage from "@/components/site/project-detail-page";
import {
  buildProjectJsonLd,
  buildProjectMetadata,
} from "@/lib/seo";
import { getPublicProjectBySlug } from "@/modules/public-site/server";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project =
    await getPublicProjectBySlug(
      slug,
    );

  if (!project) {
    return {
      title:
        "Proyek tidak ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildProjectMetadata(
    project,
  );
}

export default async function Page({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project =
    await getPublicProjectBySlug(
      slug,
    );

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildProjectJsonLd(
          project,
        )}
      />

      <ProjectDetailPage
        project={project}
      />
    </>
  );
}
