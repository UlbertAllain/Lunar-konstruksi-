import type { MetadataRoute } from "next";

import {
  absoluteUrl,
} from "@/lib/seo";
import {
  getPublicProjects,
  getPublicServices,
} from "@/modules/public-site/server";

export const revalidate = 300;

function validDate(
  value:
    | string
    | Date
    | undefined,
) {
  if (!value) {
    return undefined;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(
    date.getTime(),
  )
    ? undefined
    : date;
}

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const [
    services,
    projects,
  ] = await Promise.all([
    getPublicServices(),
    getPublicProjects(),
  ]);

  const staticPages:
    MetadataRoute.Sitemap = [
      {
        url: absoluteUrl("/"),
        changeFrequency:
          "weekly",
        priority: 1,
      },
      {
        url:
          absoluteUrl(
            "/services",
          ),
        changeFrequency:
          "weekly",
        priority: 0.9,
      },
      {
        url:
          absoluteUrl(
            "/projects",
          ),
        changeFrequency:
          "weekly",
        priority: 0.9,
      },
      {
        url:
          absoluteUrl(
            "/contact",
          ),
        changeFrequency:
          "monthly",
        priority: 0.7,
      },
    ];

  const servicePages:
    MetadataRoute.Sitemap =
      services.map(
        (service) => ({
          url: absoluteUrl(
            `/services/${service.slug}`,
          ),
          lastModified:
            validDate(
              service.updatedAt ??
                service.createdAt,
            ),
          changeFrequency:
            "monthly",
          priority: 0.8,
        }),
      );

  const projectPages:
    MetadataRoute.Sitemap =
      projects.map(
        (project) => ({
          url: absoluteUrl(
            `/projects/${project.slug}`,
          ),
          lastModified:
            validDate(
              project.updatedAt ??
                project.createdAt,
            ),
          changeFrequency:
            "monthly",
          priority: 0.8,
        }),
      );

  return [
    ...staticPages,
    ...servicePages,
    ...projectPages,
  ];
}
