import { notFound } from "next/navigation";

import ServiceDetailPage from "@/components/site/service-detail-page";
import {
  getPublicProjects,
  getPublicServiceBySlug,
} from "@/modules/public-site/server";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const projects = await getPublicProjects();

  const relatedProjects = service.id
    ? projects.filter(
        (project) =>
          project.serviceId === service.id,
      )
    : [];

  return (
    <ServiceDetailPage
      service={service}
      relatedProjects={relatedProjects}
    />
  );
}
