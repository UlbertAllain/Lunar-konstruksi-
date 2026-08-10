# Lunar Konstruksi - Technical SEO + Local SEO v33
#
# Adds:
# - MetadataBase + canonical
# - SEO titles/descriptions for public routes
# - dynamic generateMetadata for service/project detail
# - robots.txt via app/robots.ts
# - dynamic sitemap.xml via app/sitemap.ts
# - Google Search Console verification env support
# - Organization / LocalBusiness / Service / Breadcrumb JSON-LD
# - noindex for /admin
# - generated Open Graph image
# - natural Solo Raya wording in visible public copy
#
# IMPORTANT:
# Set NEXT_PUBLIC_SITE_URL to your FINAL production URL.
#
# Run:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_SEO_v33.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  $directoryPath =
    Split-Path -Parent $Path

  if (
    $directoryPath -and
    -not (
      Test-Path -LiteralPath $directoryPath
    )
  ) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $directoryPath |
    Out-Null
  }

  $utf8NoBom =
    New-Object `
      System.Text.UTF8Encoding($false)

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    $utf8NoBom
  )
}

function Backup-File {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$BackupRoot,

    [Parameter(Mandatory = $true)]
    [string]$RelativePath
  )

  if (
    -not (
      Test-Path -LiteralPath $Source
    )
  ) {
    return
  }

  $destination =
    Join-Path `
      $BackupRoot `
      $RelativePath

  $destinationDirectory =
    Split-Path -Parent $destination

  if ($destinationDirectory) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $destinationDirectory |
    Out-Null
  }

  Copy-Item `
    -LiteralPath $Source `
    -Destination $destination `
    -Force
}

function Replace-TextIfPresent {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$OldText,

    [Parameter(Mandatory = $true)]
    [string]$NewText,

    [Parameter(Mandatory = $true)]
    [string]$Label
  )

  if (
    -not (
      Test-Path -LiteralPath $Path
    )
  ) {
    Write-Host `
      "  skip: $Label (file missing)" `
      -ForegroundColor DarkYellow

    return
  }

  $content =
    [System.IO.File]::ReadAllText(
      $Path
    )

  if (
    -not $content.Contains(
      $OldText
    )
  ) {
    Write-Host `
      "  skip: $Label (text already changed/not found)" `
      -ForegroundColor DarkGray

    return
  }

  $content =
    $content.Replace(
      $OldText,
      $NewText
    )

  Write-Utf8NoBom `
    -Path $Path `
    -Content $content

  Write-Host `
    "  updated: $Label" `
    -ForegroundColor DarkGray
}

$repoRoot =
  $PSScriptRoot

if (
  -not (
    Test-Path -LiteralPath (
      Join-Path `
        $repoRoot `
        "package.json"
    )
  )
) {
  if (
    Test-Path -LiteralPath (
      Join-Path `
        (Get-Location) `
        "package.json"
    )
  ) {
    $repoRoot =
      (Get-Location).Path
  }
  else {
    throw `
      "Run this patch from the Lunar repository root."
  }
}

$requiredRelativeFiles =
  @(
    "app\layout.tsx",
    "app\page.tsx",
    "app\services\page.tsx",
    "app\projects\page.tsx",
    "app\contact\page.tsx",
    "app\services\[slug]\page.tsx",
    "app\projects\[slug]\page.tsx",
    "app\admin\layout.tsx",
    "components\site\home-page.tsx",
    "components\site\formwork\home.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\contact.tsx",
    "modules\site-content\site-content.types.ts",
    "modules\public-site\server.ts"
  )

foreach (
  $relativeFile in
    $requiredRelativeFiles
) {
  $requiredFile =
    Join-Path `
      $repoRoot `
      $relativeFile

  if (
    -not (
      Test-Path -LiteralPath $requiredFile
    )
  ) {
    throw `
      "Required file missing: $requiredFile"
  }
}

$siteContentTypes =
  [System.IO.File]::ReadAllText(
    (
      Join-Path `
        $repoRoot `
        "modules\site-content\site-content.types.ts"
    )
  )

if (
  -not $siteContentTypes.Contains(
    "companyProfile: CompanyProfile;"
  )
) {
  throw `
    "v33 expects the dynamic company profile revision (v32) to be applied first."
}

$timestamp =
  Get-Date `
    -Format "yyyyMMdd-HHmmss"

$backupRoot =
  Join-Path `
    $repoRoot `
    ".lunar-backups\seo-v33-$timestamp"

New-Item `
  -ItemType Directory `
  -Force `
  -Path $backupRoot |
Out-Null

$filesToBackup =
  @(
    "app\layout.tsx",
    "app\page.tsx",
    "app\services\page.tsx",
    "app\projects\page.tsx",
    "app\contact\page.tsx",
    "app\services\[slug]\page.tsx",
    "app\projects\[slug]\page.tsx",
    "app\admin\layout.tsx",
    "app\sitemap.ts",
    "app\robots.ts",
    "app\opengraph-image.tsx",
    "lib\seo.ts",
    "components\seo\json-ld.tsx",
    "components\site\home-page.tsx",
    "components\site\formwork\home.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\contact.tsx"
  )

foreach (
  $relativeFile in
    $filesToBackup
) {
  Backup-File `
    -Source (
      Join-Path `
        $repoRoot `
        $relativeFile
    ) `
    -BackupRoot $backupRoot `
    -RelativePath $relativeFile
}

Write-Host ""
Write-Host `
  "=== Lunar / Technical SEO + Local SEO v33 ===" `
  -ForegroundColor Cyan

# =========================================================
# 1. SEO CORE
# =========================================================

Write-Host `
  "[1/6] Creating SEO core..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "lib\seo.ts"
  ) `
  -Content @'
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

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "components\seo\json-ld.tsx"
  ) `
  -Content @'
type JsonLdProps = {
  data:
    | Record<string, unknown>
    | Array<
        Record<string, unknown>
      >;
};

export function JsonLd({
  data,
}: JsonLdProps) {
  const serialized =
    JSON.stringify(data).replace(
      /</g,
      "\\u003c",
    );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serialized,
      }}
    />
  );
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\layout.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const googleVerification =
  process.env
    .NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ?.trim();

export const metadata: Metadata = {
  metadataBase:
    new URL(SITE_URL),

  title: {
    default:
      DEFAULT_SEO_TITLE,
    template:
      `%s | ${SITE_NAME}`,
  },

  description:
    DEFAULT_SEO_DESCRIPTION,

  applicationName:
    SITE_NAME,

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  category:
    "Construction",

  icons: {
    icon:
      "/lunar-logo-mark.png",
    shortcut:
      "/lunar-logo-mark.png",
    apple:
      "/lunar-logo-mark.png",
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
  },

  verification:
    googleVerification
      ? {
          google:
            googleVerification,
        }
      : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\opengraph-image.tsx"
  ) `
  -Content @'
import {
  ImageResponse,
} from "next/og";

export const alt =
  "Lunar Konstruksi - Jasa Konstruksi dan Kontraktor Solo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "#f5f1e8",
          color: "#14243f",
          padding: "78px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "28px",
            height: "100%",
            background:
              "#dcb458",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            justifyContent:
              "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "18px",
              fontSize: "22px",
              letterSpacing:
                "0.16em",
              textTransform:
                "uppercase",
            }}
          >
            <span
              style={{
                display:
                  "block",
                width: "68px",
                height: "4px",
                background:
                  "#dcb458",
              }}
            />

            Lunar Konstruksi
          </div>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              maxWidth: "930px",
            }}
          >
            <div
              style={{
                fontSize:
                  "76px",
                lineHeight:
                  0.92,
                fontWeight:
                  900,
                letterSpacing:
                  "-0.045em",
                textTransform:
                  "uppercase",
              }}
            >
              Jasa Konstruksi
              & Kontraktor Solo
            </div>

            <div
              style={{
                marginTop:
                  "28px",
                fontSize:
                  "25px",
                lineHeight:
                  1.45,
                color:
                  "#657184",
              }}
            >
              Perencanaan,
              renovasi,
              interior, dan
              pekerjaan
              konstruksi di
              Solo Raya.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              fontSize: "18px",
              letterSpacing:
                "0.12em",
              textTransform:
                "uppercase",
            }}
          >
            <span>
              Planning /
              Coordination /
              Construction
            </span>

            <span
              style={{
                color:
                  "#b58c2f",
                fontWeight:
                  700,
              }}
            >
              Solo Raya
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

'@

Write-Host `
  "  canonical + metadataBase + OG + Google verification support ready." `
  -ForegroundColor DarkGray

# =========================================================
# 2. STATIC PUBLIC ROUTES
# =========================================================

Write-Host `
  "[2/6] Adding page-specific metadata..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\page.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";

import HomePage from "@/components/site/home-page";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      DEFAULT_SEO_TITLE,
    description:
      DEFAULT_SEO_DESCRIPTION,
    path: "/",
  });

export default function Home() {
  return <HomePage />;
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\services\page.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";

import ServicesPage from "@/components/site/services-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      "Jasa Konstruksi Solo & Solo Raya",
    description:
      "Layanan Lunar Konstruksi untuk konstruksi, renovasi, interior, atap, dan pekerjaan bangunan di Solo Raya dengan alur kerja yang jelas dan terkoordinasi.",
    path: "/services",
  });

export default function Page() {
  return <ServicesPage />;
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\projects\page.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";

import ProjectsPage from "@/components/site/projects-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      "Portofolio Proyek Konstruksi",
    description:
      "Lihat portofolio Lunar Konstruksi: dokumentasi pekerjaan konstruksi, renovasi, interior, dan berbagai kebutuhan bangunan beserta lokasi serta lingkup proyek.",
    path: "/projects",
  });

export default function Page() {
  return <ProjectsPage />;
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\contact\page.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";

import ContactPage from "@/components/site/contact-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata =
  buildPageMetadata({
    title:
      "Kontak Jasa Konstruksi Solo",
    description:
      "Hubungi Lunar Konstruksi untuk konsultasi kebutuhan konstruksi, renovasi, interior, dan pekerjaan bangunan di Solo Raya dan sekitarnya.",
    path: "/contact",
  });

export default function Page() {
  return <ContactPage />;
}

'@

# =========================================================
# 3. DYNAMIC DETAIL ROUTES
# =========================================================

Write-Host `
  "[3/6] Adding dynamic SEO for service/project details..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\services\[slug]\page.tsx"
  ) `
  -Content @'
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

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\projects\[slug]\page.tsx"
  ) `
  -Content @'
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

'@

Write-Host `
  "  service relatedProjects behavior preserved." `
  -ForegroundColor DarkGray

# =========================================================
# 4. SITEMAP + ROBOTS + ADMIN NOINDEX
# =========================================================

Write-Host `
  "[4/6] Creating sitemap.xml and robots.txt..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\sitemap.ts"
  ) `
  -Content @'
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

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\robots.ts"
  ) `
  -Content @'
import type { MetadataRoute } from "next";

import {
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap:
      absoluteUrl(
        "/sitemap.xml",
      ),
    host: SITE_URL,
  };
}

'@

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "app\admin\layout.tsx"
  ) `
  -Content @'
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

'@

Write-Host `
  "  /admin and /api excluded from crawler paths." `
  -ForegroundColor DarkGray

# =========================================================
# 5. STRUCTURED DATA
# =========================================================

Write-Host `
  "[5/6] Adding structured data..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path (
    Join-Path `
      $repoRoot `
      "components\site\home-page.tsx"
  ) `
  -Content @'
import { JsonLd } from "@/components/seo/json-ld";
import { buildBusinessJsonLd } from "@/lib/seo";
import { getPublicHomeData } from "@/modules/public-site/server";
import { FormworkHome } from "./formwork/home";

export default async function HomePage() {
  const data =
    await getPublicHomeData();

  return (
    <>
      <JsonLd
        data={buildBusinessJsonLd(
          data.siteContent,
        )}
      />

      <FormworkHome
        data={data}
      />
    </>
  );
}

'@

Write-Host `
  "  Organization / LocalBusiness added when office address exists." `
  -ForegroundColor DarkGray

Write-Host `
  "  Service + Breadcrumb structured data added to detail pages." `
  -ForegroundColor DarkGray

# =========================================================
# 6. VISIBLE LOCAL SEO COPY
# =========================================================

Write-Host `
  "[6/6] Adding natural Solo Raya context to public copy..." `
  -ForegroundColor Yellow

$homeVisualFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\home.tsx"

$servicesVisualFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\services.tsx"

$projectsVisualFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\projects.tsx"

$contactVisualFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\contact.tsx"

Replace-TextIfPresent `
  -Path $homeVisualFile `
  -OldText "01 / Perencanaan / konstruksi / koordinasi" `
  -NewText "01 / Jasa konstruksi / renovasi / Solo Raya" `
  -Label "Home hero micro label"

Replace-TextIfPresent `
  -Path $homeVisualFile `
  -OldText "Dari perencanaan sampai pekerjaan selesai, setiap tahap kami susun agar keputusan lebih jelas, koordinasi lebih rapi, dan pekerjaan di lapangan tetap terarah." `
  -NewText "Lunar Konstruksi menangani konstruksi, renovasi, interior, dan kebutuhan bangunan di Solo Raya. Dari perencanaan sampai pekerjaan selesai, setiap tahap kami susun agar keputusan lebih jelas dan pekerjaan tetap terarah." `
  -Label "Home hero local context"

Replace-TextIfPresent `
  -Path $homeVisualFile `
  -OldText 'alt="Lunar Konstruksi"' `
  -NewText 'alt="Jasa konstruksi Lunar Konstruksi di Solo Raya"' `
  -Label "Home hero alt text"

Replace-TextIfPresent `
  -Path $servicesVisualFile `
  -OldText "S-01 / Capabilities / scope of work" `
  -NewText "S-01 / Jasa konstruksi / Solo Raya" `
  -Label "Services hero micro label"

Replace-TextIfPresent `
  -Path $servicesVisualFile `
  -OldText "Ruang lingkup dapat disusun sesuai konteks proyek, dari satu`n                pekerjaan teknis sampai koordinasi design-build yang lebih`n                terintegrasi." `
  -NewText "Layanan konstruksi di Solo Raya disusun sesuai kebutuhan proyek, dari`n                pekerjaan teknis, renovasi, interior, sampai koordinasi pekerjaan yang`n                lebih terintegrasi." `
  -Label "Services hero local context"

Replace-TextIfPresent `
  -Path $servicesVisualFile `
  -OldText 'services[0]?.name || "Capabilities"' `
  -NewText 'services[0]?.name || "Jasa konstruksi Lunar Konstruksi di Solo Raya"' `
  -Label "Services hero alt fallback"

Replace-TextIfPresent `
  -Path $projectsVisualFile `
  -OldText "P-01 / Selected works" `
  -NewText "P-01 / Portofolio konstruksi / Solo Raya" `
  -Label "Projects hero micro label"

Replace-TextIfPresent `
  -Path $projectsVisualFile `
  -OldText "Dokumentasi proyek yang memperlihatkan konteks, proses, dan hasil`n                pekerjaan dari berbagai kebutuhan konstruksi." `
  -NewText "Dokumentasi proyek Lunar Konstruksi di Solo Raya dan area layanan lainnya,`n                memperlihatkan konteks, proses, serta hasil dari berbagai kebutuhan konstruksi." `
  -Label "Projects hero local context"

Replace-TextIfPresent `
  -Path $contactVisualFile `
  -OldText "C-01 / Konsultasi proyek" `
  -NewText "C-01 / Konsultasi proyek / Solo Raya" `
  -Label "Contact hero micro label"

Replace-TextIfPresent `
  -Path $contactVisualFile `
  -OldText "Sampaikan jenis pekerjaan,`n                lokasi, kebutuhan, dan`n                target Anda. Informasi`n                awal ini membantu kami`n                memahami proyek sebelum`n                masuk ke pembahasan yang`n                lebih rinci." `
  -NewText "Untuk kebutuhan proyek di Solo Raya dan sekitarnya, sampaikan jenis pekerjaan,`n                lokasi, kebutuhan, dan`n                target Anda. Informasi`n                awal ini membantu kami`n                memahami proyek sebelum`n                masuk ke pembahasan yang`n                lebih rinci." `
  -Label "Contact hero local context"

Write-Host ""
Write-Host `
  "=== v33 complete ===" `
  -ForegroundColor Green

Write-Host `
  "Backup: $backupRoot" `
  -ForegroundColor DarkGray

Write-Host ""
Write-Host `
  "IMPORTANT ENV:" `
  -ForegroundColor Cyan

Write-Host `
  "  NEXT_PUBLIC_SITE_URL=https://YOUR-FINAL-DOMAIN"

Write-Host `
  "  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=optional-until-search-console"

Write-Host ""
Write-Host `
  "Validate:" `
  -ForegroundColor Cyan

Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"

Write-Host ""
Write-Host `
  "Then restart:" `
  -ForegroundColor Cyan

Write-Host "  npm run dev"

Write-Host ""
Write-Host `
  "Check these URLs:" `
  -ForegroundColor Cyan

Write-Host "  http://localhost:3000/robots.txt"
Write-Host "  http://localhost:3000/sitemap.xml"
Write-Host "  http://localhost:3000/"
Write-Host "  http://localhost:3000/services"
Write-Host "  http://localhost:3000/projects"
Write-Host "  http://localhost:3000/contact"
Write-Host "  http://localhost:3000/services/[slug]"
Write-Host "  http://localhost:3000/projects/[slug]"

Write-Host ""
