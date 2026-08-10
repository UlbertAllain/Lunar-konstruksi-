# Lunar Konstruksi - Recovery Fix v30
#
# This patch is intentionally defensive:
# - LiteralPath is used for Next.js [slug] folders
# - no $home variable is used
# - old Partner block is removed with a targeted regex
# - ServiceDetailPage is patched minimally, not fully rewritten
#
# Run:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Recovery_v30.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  $directoryPath = Split-Path -Parent $Path

  if (
    $directoryPath -and
    -not (Test-Path -LiteralPath $directoryPath)
  ) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $directoryPath |
    Out-Null
  }

  $utf8NoBom =
    New-Object System.Text.UTF8Encoding($false)

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
    -not (Test-Path -LiteralPath $Source)
  ) {
    return
  }

  $destination =
    Join-Path $BackupRoot $RelativePath

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

$repoRoot = $PSScriptRoot

if (
  -not (
    Test-Path -LiteralPath (
      Join-Path $repoRoot "package.json"
    )
  )
) {
  if (
    Test-Path -LiteralPath (
      Join-Path (Get-Location) "package.json"
    )
  ) {
    $repoRoot = (Get-Location).Path
  }
  else {
    throw "Run this patch from the Lunar repository root."
  }
}

$homeFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\home.tsx"

$partnersFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\partners-marquee.tsx"

$serviceDetailFile =
  Join-Path `
    $repoRoot `
    "components\site\service-detail-page.tsx"

$serviceRouteFile =
  Join-Path `
    $repoRoot `
    "app\services\[slug]\page.tsx"

$globalsFile =
  Join-Path `
    $repoRoot `
    "app\globals.css"

foreach ($requiredFile in @(
  $homeFile,
  $serviceDetailFile,
  $serviceRouteFile,
  $globalsFile
)) {
  if (
    -not (
      Test-Path -LiteralPath $requiredFile
    )
  ) {
    throw "Required file missing: $requiredFile"
  }
}

$timestamp =
  Get-Date -Format "yyyyMMdd-HHmmss"

$backupRoot =
  Join-Path `
    $repoRoot `
    ".lunar-backups\recovery-v30-$timestamp"

New-Item `
  -ItemType Directory `
  -Force `
  -Path $backupRoot |
Out-Null

foreach ($relativePath in @(
  "components\site\formwork\home.tsx",
  "components\site\formwork\partners-marquee.tsx",
  "components\site\service-detail-page.tsx",
  "app\services\[slug]\page.tsx",
  "app\globals.css"
)) {
  Backup-File `
    -Source (
      Join-Path $repoRoot $relativePath
    ) `
    -BackupRoot $backupRoot `
    -RelativePath $relativePath
}

Write-Host ""
Write-Host "=== Lunar / Recovery Fix v30 ===" -ForegroundColor Cyan

# =========================================================
# 1. PARTNER COMPONENT
# =========================================================

Write-Host "[1/5] Writing clean Partner marquee component..." -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path $partnersFile `
  -Content @'
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
  if (!partners.length) {
    return null;
  }

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

      <div className="lunar-partner-marquee mt-4 overflow-hidden sm:mt-5">
        <div className="lunar-partner-track flex w-max items-center">
          {copies.map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex shrink-0 items-center"
              aria-hidden={copyIndex === 0 ? undefined : true}
            >
              {partners.map((partner) => {
                const visual = (
                  <PartnerVisual partner={partner} />
                );

                if (partner.website && copyIndex === 0) {
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
                  <div key={`${copyIndex}-${partner.id}`}>
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

# =========================================================
# 2. HOME PARTNER BLOCK
# =========================================================

Write-Host "[2/5] Replacing old Partner block safely..." -ForegroundColor Yellow

$homeContent =
  [System.IO.File]::ReadAllText(
    $homeFile
  )

$partnerImport =
  'import { PartnersMarquee } from "./partners-marquee";'

if (
  -not $homeContent.Contains($partnerImport)
) {
  $mediaImport =
    'import { DatabaseImage } from "./media";'

  if (
    -not $homeContent.Contains($mediaImport)
  ) {
    throw "Could not find DatabaseImage import in home.tsx."
  }

  $homeContent =
    $homeContent.Replace(
      $mediaImport,
      $mediaImport +
      [Environment]::NewLine +
      $partnerImport
    )
}

$partnerComponentCall =
  '<PartnersMarquee partners={partners} />'

$oldPartnerPattern =
  '(?s)\{partners\.length\s*\?\s*\(.*?\)\s*:\s*null\}'

$oldPartnerMatch =
  [System.Text.RegularExpressions.Regex]::Match(
    $homeContent,
    $oldPartnerPattern
  )

if ($oldPartnerMatch.Success) {
  $replacement =
    $partnerComponentCall

  $homeContent =
    $homeContent.Substring(
      0,
      $oldPartnerMatch.Index
    ) +
    $replacement +
    $homeContent.Substring(
      $oldPartnerMatch.Index +
      $oldPartnerMatch.Length
    )

  Write-Host "  old inline Partner block removed." -ForegroundColor DarkGray
}
elseif (
  $homeContent.Contains($partnerComponentCall)
) {
  Write-Host "  PartnersMarquee already present." -ForegroundColor DarkGray
}
else {
  $carouselMarker =
    '<ServiceStaggeredCarousel services={services} />'

  $carouselIndex =
    $homeContent.IndexOf(
      $carouselMarker
    )

  if ($carouselIndex -lt 0) {
    throw "ServiceStaggeredCarousel marker not found in home.tsx."
  }

  $insertIndex =
    $carouselIndex +
    $carouselMarker.Length

  $homeContent =
    $homeContent.Substring(
      0,
      $insertIndex
    ) +
    [Environment]::NewLine +
    [Environment]::NewLine +
    "        " +
    $partnerComponentCall +
    $homeContent.Substring(
      $insertIndex
    )

  Write-Host "  Partner marquee inserted after Services." -ForegroundColor DarkGray
}

Write-Utf8NoBom `
  -Path $homeFile `
  -Content $homeContent

# =========================================================
# 3. SERVICE DETAIL MINIMAL FIX
# =========================================================

Write-Host "[3/5] Fixing relatedProjects in ServiceDetailPage..." -ForegroundColor Yellow

$detailContent =
  [System.IO.File]::ReadAllText(
    $serviceDetailFile
  )

$projectImport =
  'import type { Project } from "@/modules/projects/project.types";'

if (
  -not $detailContent.Contains($projectImport)
) {
  $serviceTypeImport =
    'import type { ConstructionService } from "@/modules/services/service.types";'

  if (
    -not $detailContent.Contains($serviceTypeImport)
  ) {
    throw "ConstructionService import not found in service-detail-page.tsx."
  }

  $detailContent =
    $detailContent.Replace(
      $serviceTypeImport,
      $projectImport +
      [Environment]::NewLine +
      $serviceTypeImport
    )
}

$relatedImport =
  'import { RelatedProjectsSection } from "./related-projects-section";'

if (
  -not $detailContent.Contains($relatedImport)
) {
  $headerImport =
    'import { SiteHeader } from "./site-header";'

  if (
    -not $detailContent.Contains($headerImport)
  ) {
    throw "SiteHeader import not found in service-detail-page.tsx."
  }

  $detailContent =
    $detailContent.Replace(
      $headerImport,
      $relatedImport +
      [Environment]::NewLine +
      $headerImport
    )
}

if (
  -not $detailContent.Contains(
    "relatedProjects: Project[];"
  )
) {
  $interfacePattern =
    '(interface\s+ServiceDetailPageProps\s*\{\s*service:\s*ConstructionService\s*;)'

  $detailContent =
    [System.Text.RegularExpressions.Regex]::Replace(
      $detailContent,
      $interfacePattern,
      '$1' +
      [Environment]::NewLine +
      '  relatedProjects: Project[];',
      1
    )
}

$signaturePattern =
  '(?s)export default function ServiceDetailPage\(\{\s*service,\s*\}:\s*ServiceDetailPageProps\)'

if (
  [System.Text.RegularExpressions.Regex]::IsMatch(
    $detailContent,
    $signaturePattern
  )
) {
  $detailContent =
    [System.Text.RegularExpressions.Regex]::Replace(
      $detailContent,
      $signaturePattern,
      'export default function ServiceDetailPage({' +
      [Environment]::NewLine +
      '  service,' +
      [Environment]::NewLine +
      '  relatedProjects,' +
      [Environment]::NewLine +
      '}: ServiceDetailPageProps)',
      1
    )
}
elseif (
  -not $detailContent.Contains(
    "  relatedProjects,"
  )
) {
  throw "Could not patch ServiceDetailPage function signature."
}

Write-Utf8NoBom `
  -Path $serviceDetailFile `
  -Content $detailContent

Write-Host "  relatedProjects is now part of the component props." -ForegroundColor DarkGray

# =========================================================
# 4. SERVICE ROUTE
# =========================================================

Write-Host "[4/5] Rewriting service slug route..." -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path $serviceRouteFile `
  -Content @'
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

'@

Write-Host "  route now passes relatedProjects explicitly." -ForegroundColor DarkGray

# =========================================================
# 5. CSS
# =========================================================

Write-Host "[5/5] Applying Partner marquee CSS..." -ForegroundColor Yellow

$globalCssContent =
  [System.IO.File]::ReadAllText(
    $globalsFile
  )

$cssMarker =
  "/* =========================================================" +
  [Environment]::NewLine +
  "   LUNAR PARTNER MARQUEE V30"

$markerIndex =
  $globalCssContent.IndexOf(
    $cssMarker
  )

if ($markerIndex -ge 0) {
  $globalCssContent =
    $globalCssContent.Substring(
      0,
      $markerIndex
    ).TrimEnd()
}

$globalCssContent +=
  [Environment]::NewLine +
  [Environment]::NewLine +
  @'

/* =========================================================
   LUNAR PARTNER MARQUEE V30
   ========================================================= */

@keyframes lunarPartnerMarqueeV30 {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-10%);
  }
}

.lunar-partner-marquee {
  background: transparent !important;
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

.lunar-partner-marquee .lunar-partner-track {
  animation: lunarPartnerMarqueeV30 34s linear infinite !important;
  will-change: transform;
}

.lunar-partner-marquee:hover .lunar-partner-track {
  animation-play-state: paused !important;
}

@media (max-width: 640px) {
  .lunar-partner-marquee .lunar-partner-track {
    animation-duration: 27s !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lunar-partner-marquee .lunar-partner-track {
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
  -Path $globalsFile `
  -Content $globalCssContent

Write-Host ""
Write-Host "=== v30 complete ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray

Write-Host ""
Write-Host "Validate:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"

Write-Host ""
Write-Host "Restart dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev"

Write-Host ""
Write-Host "Check:" -ForegroundColor Cyan
Write-Host "  /"
Write-Host "  /services/[slug]"
Write-Host ""
