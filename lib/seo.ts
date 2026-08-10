import type { Metadata } from "next";

import type { ConstructionService } from "@/modules/services/service.types";
import type { Project } from "@/modules/projects/project.types";
import type { SiteContentSettings } from "@/modules/site-content/site-content.types";

const FALLBACK_SITE_URL =
  "https://lunar-konstruksi.vercel.app";

function normalizeSiteUrl(
  value: string | undefined,
) {
  const raw =
    value?.trim() ||
    FALLBACK_SITE_URL;

  const withProtocol =
    /^https?:\/\//i.test(raw)
      ? raw
      : `https://${raw}`;

  try {
    return new URL(
      withProtocol,
    ).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL =
  normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL,
  );

export const SITE_NAME =
  "Lunar Konstruksi";

export const DEFAULT_SEO_TITLE =
  "Lunar Konstruksi | Jasa Konstruksi & Kontraktor Solo";

export const DEFAULT_SEO_DESCRIPTION =
  "Lunar Konstruksi melayani jasa konstruksi, renovasi, interior, atap, dan pekerjaan bangunan di Solo Raya dengan perencanaan serta koordinasi yang jelas.";

export const SOLO_AREA_SERVED = [
  "Surakarta",
  "Solo Raya",
  "Sukoharjo",
  "Karanganyar",
  "Boyolali",
  "Klaten",
  "Wonogiri",
];

export function absoluteUrl(
  path = "/",
) {
  if (
    /^https?:\/\//i.test(path)
  ) {
    return path;
  }

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${SITE_URL}${normalizedPath}`;
}

function cleanText(
  value: string,
) {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

export function seoDescription(
  value: string,
  fallback =
    DEFAULT_SEO_DESCRIPTION,
) {
  const clean =
    cleanText(value || fallback);

  if (clean.length <= 158) {
    return clean;
  }

  return `${clean
    .slice(0, 155)
    .trimEnd()}...`;
}

function imageList(
  image?: string,
) {
  if (!image) {
    return undefined;
  }

  return [
    {
      url: absoluteUrl(image),
    },
  ];
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical =
    absoluteUrl(path);

  const cleanDescription =
    seoDescription(description);

  return {
    title,
    description:
      cleanDescription,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview":
          "large",
        "max-snippet": -1,
        "max-video-preview":
          -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description:
        cleanDescription,
      images: imageList(image),
    },
    twitter: {
      card:
        "summary_large_image",
      title,
      description:
        cleanDescription,
      images: image
        ? [absoluteUrl(image)]
        : undefined,
    },
  };
}

export function buildServiceMetadata(
  service: ConstructionService,
): Metadata {
  const path =
    `/services/${service.slug}`;

  const title =
    `${service.name} di Solo Raya`;

  const description =
    seoDescription(
      `${service.shortDescription} Layanan ${service.name.toLowerCase()} dari Lunar Konstruksi untuk kebutuhan proyek di Solo Raya dan sekitarnya.`,
    );

  return buildPageMetadata({
    title,
    description,
    path,
    image:
      service.coverImage?.url,
  });
}

export function buildProjectMetadata(
  project: Project,
): Metadata {
  const path =
    `/projects/${project.slug}`;

  const location =
    project.location?.trim();

  const title = location
    ? `${project.title} | Proyek ${location}`
    : `${project.title} | Portofolio Proyek`;

  const description =
    seoDescription(
      project.shortDescription ||
        `Dokumentasi proyek ${project.title} oleh Lunar Konstruksi.`,
    );

  return buildPageMetadata({
    title,
    description,
    path,
    image:
      project.coverImage?.url,
  });
}

function compactObject(
  value: Record<
    string,
    unknown
  >,
) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) =>
        entry !== undefined &&
        entry !== null &&
        entry !== "",
    ),
  );
}

export function buildBusinessJsonLd(
  content: SiteContentSettings,
) {
  const profile =
    content.companyProfile;

  const office =
    content.officeLocation;

  const name =
    profile.companyName?.trim() ||
    SITE_NAME;

  const description =
    profile.shortDescription?.trim() ||
    DEFAULT_SEO_DESCRIPTION;

  const sameAs = [
    profile.instagramUrl,
    profile.linkedinUrl,
  ].filter(Boolean);

  const organization =
    compactObject({
      "@type": "Organization",
      "@id":
        `${SITE_URL}/#organization`,
      name,
      url: SITE_URL,
      logo:
        absoluteUrl(
          "/lunar-logo-mark.png",
        ),
      description,
      email: profile.email,
      telephone:
        profile.phone,
      sameAs:
        sameAs.length
          ? sameAs
          : undefined,
    });

  const webSite =
    compactObject({
      "@type": "WebSite",
      "@id":
        `${SITE_URL}/#website`,
      url: SITE_URL,
      name,
      inLanguage: "id-ID",
      publisher: {
        "@id":
          `${SITE_URL}/#organization`,
      },
    });

  const graph: Record<
    string,
    unknown
  >[] = [
    organization,
    webSite,
  ];

  if (
    office.address?.trim()
  ) {
    graph.push(
      compactObject({
        "@type":
          "HomeAndConstructionBusiness",
        "@id":
          `${SITE_URL}/#localbusiness`,
        name,
        url: SITE_URL,
        image:
          content.homeHero?.url ||
          absoluteUrl(
            "/lunar-logo-mark.png",
          ),
        description,
        email: profile.email,
        telephone:
          profile.phone,
        address: {
          "@type":
            "PostalAddress",
          streetAddress:
            office.address,
          addressCountry:
            "ID",
        },
        areaServed:
          SOLO_AREA_SERVED.map(
            (area) => ({
              "@type":
                "AdministrativeArea",
              name: area,
            }),
          ),
        hasMap:
          office.googleMapsUrl ||
          undefined,
        sameAs:
          sameAs.length
            ? sameAs
            : undefined,
        parentOrganization: {
          "@id":
            `${SITE_URL}/#organization`,
        },
      }),
    );
  }

  return {
    "@context":
      "https://schema.org",
    "@graph": graph,
  };
}

export function buildServiceJsonLd(
  service: ConstructionService,
) {
  const pageUrl =
    absoluteUrl(
      `/services/${service.slug}`,
    );

  return {
    "@context":
      "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id":
          `${pageUrl}#service`,
        name: service.name,
        serviceType:
          service.name,
        description:
          service.shortDescription,
        url: pageUrl,
        image:
          service.coverImage?.url ||
          undefined,
        areaServed:
          SOLO_AREA_SERVED.map(
            (area) => ({
              "@type":
                "AdministrativeArea",
              name: area,
            }),
          ),
        provider: {
          "@id":
            `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      buildBreadcrumbJsonLd(
        [
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Layanan",
            path: "/services",
          },
          {
            name: service.name,
            path:
              `/services/${service.slug}`,
          },
        ],
        false,
      ),
    ],
  };
}

export function buildProjectJsonLd(
  project: Project,
) {
  return buildBreadcrumbJsonLd(
    [
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Proyek",
        path: "/projects",
      },
      {
        name: project.title,
        path:
          `/projects/${project.slug}`,
      },
    ],
  );
}

export function buildBreadcrumbJsonLd(
  items: Array<{
    name: string;
    path: string;
  }>,
  includeContext = true,
) {
  const data = {
    "@type":
      "BreadcrumbList",
    itemListElement:
      items.map(
        (item, index) => ({
          "@type":
            "ListItem",
          position:
            index + 1,
          name: item.name,
          item:
            absoluteUrl(
              item.path,
            ),
        }),
      ),
  };

  if (!includeContext) {
    return data;
  }

  return {
    "@context":
      "https://schema.org",
    ...data,
  };
}
