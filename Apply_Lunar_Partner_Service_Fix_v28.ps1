# Lunar Konstruksi - Partner + Service Detail Fix v28
#
# Fix:
# 1. Our Partners no grey empty block
# 2. Partner visual is no longer boxed
# 3. Continuous marquee stays full even with only one partner
# 4. Fix relatedProjects runtime ReferenceError
# 5. Route guarantees relatedProjects is passed into ServiceDetailPage
#
# Run:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Partner_Service_Fix_v28.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [string]$Path,
    [string]$Content
  )

  $dir = Split-Path -Parent $Path

  if (
    $dir -and
    -not (Test-Path $dir)
  ) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $dir |
    Out-Null
  }

  $utf8 = New-Object `
    System.Text.UTF8Encoding($false)

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    $utf8
  )
}

function Backup-File {
  param(
    [string]$Source,
    [string]$BackupRoot,
    [string]$RelativePath
  )

  if (-not (Test-Path -LiteralPath $Source)) {
    return
  }

  $dest = Join-Path $BackupRoot $RelativePath
  $dir = Split-Path -Parent $dest

  if ($dir) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $dir |
    Out-Null
  }

  Copy-Item `
    -LiteralPath $Source `
    -Destination $dest `
    -Force
}

$repoRoot = $PSScriptRoot

if (
  -not (
    Test-Path (
      Join-Path $repoRoot "package.json"
    )
  )
) {
  if (
    Test-Path (
      Join-Path (Get-Location) "package.json"
    )
  ) {
    $repoRoot = (Get-Location).Path
  }
  else {
    throw "Run this patch from the Lunar repository root."
  }
}

$homeFile = Join-Path `
  $repoRoot `
  "components\site\formwork\home.tsx"

$partnersFile = Join-Path `
  $repoRoot `
  "components\site\formwork\partners-marquee.tsx"

$detailFile = Join-Path `
  $repoRoot `
  "components\site\service-detail-page.tsx"

$routeFile = Join-Path `
  $repoRoot `
  "app\services\[slug]\page.tsx"

$globalsFile = Join-Path `
  $repoRoot `
  "app\globals.css"

foreach ($required in @(
  $homeFile,
  $detailFile,
  $routeFile,
  $globalsFile
)) {
  if (-not (Test-Path -LiteralPath $required)) {
    throw "Required file missing: $required"
  }
}

$timestamp = Get-Date `
  -Format "yyyyMMdd-HHmmss"

$backupRoot = Join-Path `
  $repoRoot `
  ".lunar-backups\partner-service-v28-$timestamp"

New-Item `
  -ItemType Directory `
  -Force `
  -Path $backupRoot |
Out-Null

foreach ($relative in @(
  "components\site\formwork\home.tsx",
  "components\site\formwork\partners-marquee.tsx",
  "components\site\service-detail-page.tsx",
  "app\services\[slug]\page.tsx",
  "app\globals.css"
)) {
  Backup-File `
    (Join-Path $repoRoot $relative) `
    $backupRoot `
    $relative
}

Write-Host ""
Write-Host `
  "=== Lunar / Partner + Service v28 ===" `
  -ForegroundColor Cyan

# =========================================================
# 1. NEW PARTNER MARQUEE COMPONENT
# =========================================================

Write-Host `
  "[1/4] Rebuilding partner marquee..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  $partnersFile `
@'
import type { SiteContentSettings } from "@/modules/site-content/site-content.types";

import { DatabaseImage } from "./media";

type Partner = SiteContentSettings["partners"][number];

const copies = Array.from({ length: 10 }, (_, index) => index);

function PartnerVisual({
  partner,
}: {
  partner: Partner;
}) {
  return (
    <div className="group flex h-[94px] w-[220px] shrink-0 items-center justify-center gap-7 px-5 sm:h-[104px] sm:w-[250px] sm:px-7">
      <span className="h-px w-7 shrink-0 bg-[#dcb458]/70 transition-all duration-300 group-hover:w-11" />

      {partner.logo?.url ? (
        <DatabaseImage
          src={partner.logo.url}
          alt={partner.logo.alt || partner.name}
          className="h-[42px] w-full max-w-[135px] object-contain opacity-60 grayscale transition duration-300 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:grayscale-0 sm:h-[48px] sm:max-w-[150px]"
          sizes="150px"
        />
      ) : (
        <span className="max-w-[155px] text-center text-[12px] font-black uppercase leading-5 tracking-[0.09em] text-[#14243f]/62 transition duration-300 group-hover:text-[#14243f] sm:text-[13px]">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export function PartnersMarquee({
  partners,
}: {
  partners: Partner[];
}) {
  if (!partners.length) return null;

  return (
    <section className="relative overflow-hidden border-b border-[#d8d1c6] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-4 border-b border-[#d9d2c6] pb-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Our Partners
            </p>

            <h2 className="mt-3 max-w-[620px] text-[clamp(1.7rem,2.6vw,2.65rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]">
              Mitra yang ikut menjadi bagian dari perjalanan proyek.
            </h2>
          </div>

          <p className="max-w-md text-[12px] leading-6 text-[#6b7686] lg:justify-self-end">
            Kolaborasi dengan berbagai pihak membantu pekerjaan bergerak lebih
            terarah sesuai kebutuhan proyek.
          </p>
        </div>
      </div>

      <div className="lunar-partner-marquee mt-4 overflow-hidden bg-[#f5f1e8] sm:mt-5">
        <div className="lunar-partner-track flex w-max items-center">
          {copies.map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex shrink-0 items-center"
              aria-hidden={copyIndex === 0 ? undefined : true}
            >
              {partners.map((partner) => {
                const visual = (
                  <PartnerVisual
                    partner={partner}
                  />
                );

                if (
                  partner.website &&
                  copyIndex === 0
                ) {
                  return (
                    <a
                      key={`${copyIndex}-${partner.id}`}
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Kunjungi ${partner.name}`}
                    >
                      {visual}
                    </a>
                  );
                }

                return (
                  <div
                    key={`${copyIndex}-${partner.id}`}
                  >
                    {visual}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'@

$home = [System.IO.File]::ReadAllText(
  $homeFile
)

if (
  -not $home.Contains(
    'import { PartnersMarquee } from "./partners-marquee";'
  )
) {
  $needle =
    'import { DatabaseImage } from "./media";'

  if (-not $home.Contains($needle)) {
    throw "Home media import marker not found."
  }

  $home = $home.Replace(
    $needle,
    $needle +
    [Environment]::NewLine +
    'import { PartnersMarquee } from "./partners-marquee";'
  )
}

$partnerStart =
  $home.IndexOf(
    "        {partners.length ? ("
  )

if ($partnerStart -ge 0) {
  $nextProjectSection =
    $home.IndexOf(
      '<section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">',
      $partnerStart
    )

  if ($nextProjectSection -lt 0) {
    throw "Could not find section after old Partners block."
  }

  $replacement =
    "        <PartnersMarquee partners={partners} />" +
    [Environment]::NewLine +
    [Environment]::NewLine +
    "        "

  $home =
    $home.Substring(
      0,
      $partnerStart
    ) +
    $replacement +
    $home.Substring(
      $nextProjectSection
    )
}
elseif (
  -not $home.Contains(
    "<PartnersMarquee partners={partners} />"
  )
) {
  $carousel =
    '<ServiceStaggeredCarousel services={services} />'

  $carouselIndex =
    $home.IndexOf($carousel)

  if ($carouselIndex -lt 0) {
    throw "Service carousel marker not found."
  }

  $insertIndex =
    $carouselIndex +
    $carousel.Length

  $home =
    $home.Substring(
      0,
      $insertIndex
    ) +
    [Environment]::NewLine +
    [Environment]::NewLine +
    "        <PartnersMarquee partners={partners} />" +
    $home.Substring(
      $insertIndex
    )
}

Write-Utf8NoBom `
  $homeFile `
  $home

Write-Host `
  "  no grey rail background" `
  -ForegroundColor DarkGray

Write-Host `
  "  no card boxes around each partner" `
  -ForegroundColor DarkGray

Write-Host `
  "  ten repeated cycles keep marquee full" `
  -ForegroundColor DarkGray

# =========================================================
# 2. FIX SERVICE DETAIL
# =========================================================

Write-Host `
  "[2/4] Fixing ServiceDetailPage props..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  $detailFile `
@'
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Layers3,
} from "lucide-react";

import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import {
  BlueprintLayer,
  MicroLabel,
  displayFont,
} from "./formwork/decor";
import { DatabaseImage } from "./formwork/media";
import { RelatedProjectsSection } from "./related-projects-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface ServiceDetailPageProps {
  service: ConstructionService;
  relatedProjects: Project[];
}

export default function ServiceDetailPage({
  service,
  relatedProjects,
}: ServiceDetailPageProps) {
  return (
    <div className="lunar-public-page overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-[#d8d1c6] py-12 sm:py-16 lg:py-20">
          <BlueprintLayer className="opacity-[0.05]" />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-10 xl:gap-14">
            <div>
              <MicroLabel>
                S-01 / Detail layanan
              </MicroLabel>

              <h1
                className={`${displayFont} mt-6 max-w-[720px] text-[clamp(2.2rem,9.5vw,4.6rem)] font-black uppercase leading-[0.88] tracking-[-0.048em] text-[#14243f]`}
              >
                {service.name}
              </h1>

              <p className="mt-6 max-w-[620px] text-[15px] leading-8 text-[#5f6976]">
                {service.shortDescription}
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
              >
                Konsultasikan kebutuhan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden border border-[#d5cdc0] bg-[#e8e1d6] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,92%_0%,100%_12%,96%_90%,88%_100%,8%_96%,0%_84%,3%_14%)]">
                <DatabaseImage
                  src={service.coverImage.url}
                  alt={
                    service.coverImage.alt ||
                    service.name
                  }
                  className="h-[250px] w-full object-cover sm:h-[390px] lg:h-[480px]"
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  quality={95}
                />
              </div>

              <div className="absolute bottom-4 left-4 hidden border border-white/30 bg-[#14243f]/88 px-4 py-3 text-white backdrop-blur sm:block">
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#e5c775]">
                  Lingkup layanan
                </p>
                <p className="mt-1 max-w-[230px] text-[11px] leading-5 text-white/72">
                  Ruang lingkup disusun sesuai
                  kebutuhan, kondisi, dan target
                  pekerjaan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.68fr_1.32fr] lg:px-10 xl:gap-16">
            <div>
              <MicroLabel>
                Cara kerja
              </MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[460px] text-[clamp(2rem,3vw,3.1rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#14243f]`}
              >
                Kebutuhan proyek diterjemahkan
                menjadi langkah kerja yang jelas.
              </h2>
            </div>

            <div>
              <p className="max-w-[850px] whitespace-pre-line text-[16px] leading-8 text-[#5b6776] sm:text-[17px]">
                {service.description}
              </p>

              {service.features.length ? (
                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {service.features.map(
                    (feature, index) => (
                      <article
                        key={`${feature.title}-${index}`}
                        className="border border-[#d8d1c6] bg-[#faf7f0] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c7ad6e] sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <Layers3 className="h-5 w-5 text-[#b58c2f]" />
                          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#8a93a0]">
                            F-
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </div>

                        <h3
                          className={`${displayFont} mt-7 text-[1.45rem] font-black uppercase leading-[0.95] text-[#14243f]`}
                        >
                          {feature.title}
                        </h3>

                        <p className="mt-3 text-[13px] leading-6 text-[#657184]">
                          {feature.description}
                        </p>
                      </article>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative bg-[#14243f] py-16 text-[#f8f4ec] sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:px-10">
            <div>
              <MicroLabel className="!text-[#dcb458]">
                Lingkup pekerjaan
              </MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[480px] text-[clamp(2.1rem,3.3vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]`}
              >
                Lingkup pekerjaan dapat disesuaikan
                dengan kebutuhan proyek.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
              {service.scopes.map(
                (scope, index) => (
                  <div
                    key={`${scope.name}-${index}`}
                    className="flex min-h-[76px] items-center gap-3 bg-[#14243f] px-5 py-4 text-[13px] leading-6 text-white/70 transition hover:bg-white/[0.045]"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#dcb458]" />
                    {scope.name}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <RelatedProjectsSection
          projects={relatedProjects}
          serviceName={service.name}
        />

        <section className="py-14 sm:py-16">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <MicroLabel>
                Mulai proyek
              </MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[720px] text-[clamp(2rem,3.2vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#14243f]`}
              >
                Pastikan kebutuhan proyek jelas
                sebelum pekerjaan dimulai.
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#14243f]"
            >
              Mulai diskusi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

'@

Write-Host `
  "  relatedProjects is now declared and destructured" `
  -ForegroundColor DarkGray

# =========================================================
# 3. FIX SERVICE ROUTE
# =========================================================

Write-Host `
  "[3/4] Fixing service route data flow..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  $routeFile `
@'
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
  const service = await getPublicServiceBySlug(
    slug,
  );

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

'@

Write-Host `
  "  projects are filtered by project.serviceId === service.id" `
  -ForegroundColor DarkGray

# =========================================================
# 4. PARTNER CSS
# =========================================================

Write-Host `
  "[4/4] Updating marquee animation..." `
  -ForegroundColor Yellow

$css = [System.IO.File]::ReadAllText(
  $globalsFile
)

# Disable previous partner keyframe/track rules without
# trying to parse their whole CSS blocks.
$css = $css.Replace(
  ".lunar-partner-track {",
  ".lunar-partner-track-v27-disabled {"
)

$css = $css.Replace(
  ".lunar-partner-marquee:hover .lunar-partner-track {",
  ".lunar-partner-marquee-v27-disabled:hover .lunar-partner-track-v27-disabled {"
)

$css +=
  [Environment]::NewLine +
  [Environment]::NewLine +
@'

/* =========================================================
   LUNAR PARTNER MARQUEE V28
   ========================================================= */

@keyframes lunarPartnerMarqueeV28 {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-10%);
  }
}

.lunar-partner-track {
  animation: lunarPartnerMarqueeV28 34s linear infinite;
  will-change: transform;
}

.lunar-partner-marquee {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.lunar-partner-marquee:hover
  .lunar-partner-track {
  animation-play-state: paused;
}

@media (max-width: 640px) {
  .lunar-partner-track {
    animation-duration: 27s;
  }

  .lunar-partner-marquee {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 3%,
      black 97%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 3%,
      black 97%,
      transparent 100%
    );
  }
}

@media (prefers-reduced-motion: reduce) {
  .lunar-partner-track {
    animation: none !important;
  }

  .lunar-partner-marquee {
    overflow-x: auto;
    mask-image: none;
    -webkit-mask-image: none;
  }
}

'@

Write-Utf8NoBom `
  $globalsFile `
  $css

Write-Host ""
Write-Host `
  "=== v28 complete ===" `
  -ForegroundColor Green

Write-Host `
  "Backup: $backupRoot" `
  -ForegroundColor DarkGray

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
  "Check:" `
  -ForegroundColor Cyan

Write-Host "  /"
Write-Host "  /services/[slug]"
Write-Host ""
