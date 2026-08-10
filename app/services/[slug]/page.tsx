import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import ServiceDetailPage from "@/components/site/service-detail-page";
import {
  buildServiceJsonLd,
  buildServiceMetadata,
} from "@/lib/seo";
import {
  getPublicProjects,
  getPublicServiceBySlug,
} from "@/modules/public-site/server";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  const service =
    await getPublicServiceBySlug(
      slug,
    );

  if (!service) {
    return {
      title:
        "Layanan tidak ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildServiceMetadata(
    service,
  );
}

export default async function Page({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service =
    await getPublicServiceBySlug(
      slug,
    );

  if (!service) {
    notFound();
  }

  const projects =
    await getPublicProjects();

  const relatedProjects =
    service.id
      ? projects.filter(
          (project) =>
            project.serviceId ===
            service.id,
        )
      : [];

  return (
    <>
      <JsonLd
        data={buildServiceJsonLd(
          service,
        )}
      />

      <ServiceDetailPage
        service={service}
        relatedProjects={
          relatedProjects
        }
      />
    </>
  );
}
