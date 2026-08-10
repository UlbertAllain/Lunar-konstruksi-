# Lunar Konstruksi - Mobile Responsive + Image Performance v23
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Mobile_Image_Perf_v23.ps1
#
# Tidak menambah dependency baru.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force -Path $directory | Out-Null
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Backup-File {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$BackupRoot,
        [Parameter(Mandatory = $true)][string]$RelativePath
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $destination = Join-Path $BackupRoot $RelativePath
    $destinationDirectory = Split-Path -Parent $destination

    if ($destinationDirectory) {
        New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
    }

    Copy-Item -Force $Source $destination
}

function Replace-Safe {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Old,
        [Parameter(Mandatory = $true)][string]$New,
        [string]$Label = "replacement"
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "File tidak ditemukan: $Path"
        return
    }

    $content = [System.IO.File]::ReadAllText($Path)

    if ($content.Contains($Old)) {
        $content = $content.Replace($Old, $New)
        Write-Utf8NoBom -Path $Path -Content $content
        Write-Host "  updated: $Label" -ForegroundColor DarkGray
        return
    }

    if ($content.Contains($New)) {
        Write-Host "  already applied: $Label" -ForegroundColor DarkGray
        return
    }

    Write-Warning "Pattern tidak ditemukan: $Label"
}

$repoRoot = $PSScriptRoot

if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
    if (Test-Path (Join-Path (Get-Location) "package.json")) {
        $repoRoot = (Get-Location).Path
    }
    else {
        throw "Jalankan script dari root repository Lunar Konstruksi."
    }
}

$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"
$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
$contactFile = Join-Path $repoRoot "components\site\formwork\contact.tsx"
$projectDetailFile = Join-Path $repoRoot "components\site\project-detail-page.tsx"
$serviceDetailFile = Join-Path $repoRoot "components\site\service-detail-page.tsx"
$mediaFile = Join-Path $repoRoot "components\site\formwork\media.tsx"
$carouselFile = Join-Path $repoRoot "components\site\formwork\service-staggered-carousel.tsx"

$requiredFiles = @(
    $homeFile,
    $servicesFile,
    $projectsFile,
    $contactFile,
    $mediaFile,
    $carouselFile
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "File wajib tidak ditemukan: $file"
    }
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Mobile + Image Performance v23 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\mobile-image-perf-v23-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupTargets = @(
    "components\site\formwork\home.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\contact.tsx",
    "components\site\project-detail-page.tsx",
    "components\site\service-detail-page.tsx",
    "components\site\formwork\media.tsx",
    "components\site\formwork\service-staggered-carousel.tsx"
)

foreach ($relativePath in $backupTargets) {
    Backup-File `
        -Source (Join-Path $repoRoot $relativePath) `
        -BackupRoot $backupRoot `
        -RelativePath $relativePath
}

Write-Host "[1/5] Mengaktifkan Next.js image optimization..." -ForegroundColor Yellow

$mediaCode = @'
import Image from "next/image";
import { ImageIcon } from "lucide-react";

type DatabaseImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className: string;
  placeholderLabel?: string;
  sizes?: string;
  preload?: boolean;
};

export function DatabaseImage({
  src,
  fallbackSrc = "",
  alt,
  className,
  placeholderLabel = "Media belum diisi",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
  preload = false,
}: DatabaseImageProps) {
  const resolved = src || fallbackSrc;

  if (!resolved) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#ded8ce] text-[#7f7a72]`}
      >
        <div className="flex max-w-[180px] flex-col items-center gap-2 px-4 text-center">
          <ImageIcon className="h-5 w-5" />
          <span className="font-mono text-[9px] uppercase leading-5 tracking-[0.18em]">
            {placeholderLabel}
          </span>
        </div>
      </div>
    );
  }

  const isDataUrl = resolved.startsWith("data:");
  const lower = resolved.toLowerCase();
  const isSvg = lower.endsWith(".svg") || lower.includes(".svg?");

  return (
    <Image
      src={resolved}
      alt={alt}
      width={1600}
      height={1000}
      sizes={sizes}
      preload={preload}
      loading={preload ? undefined : "lazy"}
      decoding="async"
      unoptimized={isDataUrl || isSvg}
      className={className}
    />
  );
}

'@

Write-Utf8NoBom -Path $mediaFile -Content $mediaCode

Write-Host "  DatabaseImage sekarang memakai next/image." -ForegroundColor DarkGray
Write-Host "  Image non-critical otomatis lazy-load." -ForegroundColor DarkGray
Write-Host "  Responsive srcset/sizes aktif." -ForegroundColor DarkGray

Write-Host "[2/5] Mengoptimalkan service carousel..." -ForegroundColor Yellow

$carouselCode = @'
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef } from "react";

import { DatabaseImage } from "./media";

type UnknownRecord = Record<string, unknown>;

type ServiceCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
};

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function imageFrom(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  return firstString(
    record.url,
    record.secureUrl,
    record.secure_url,
    record.src,
  );
}

function normalizeService(value: unknown, index: number): ServiceCard {
  const record = asRecord(value);

  return {
    id: firstString(record.id, record.slug) || `service-${index + 1}`,
    slug: firstString(record.slug),
    title: firstString(record.name, record.title) || `Layanan ${index + 1}`,
    description:
      firstString(
        record.shortDescription,
        record.description,
        record.summary,
        record.excerpt,
      ) ||
      "Solusi pekerjaan konstruksi yang disesuaikan dengan kebutuhan proyek Anda.",
    category:
      firstString(record.category, record.type, record.badge, record.group) ||
      "Layanan konstruksi",
    image: firstString(
      imageFrom(record.image),
      imageFrom(record.coverImage),
      record.imageUrl,
      record.coverImageUrl,
      record.thumbnailUrl,
      record.photoUrl,
    ),
  };
}

const cardShapes = [
  "30px 14px 42px 18px",
  "16px 40px 20px 38px",
  "40px 18px 30px 14px",
  "18px 36px 14px 42px",
  "36px 16px 44px 20px",
  "14px 42px 18px 34px",
];

export function ServiceStaggeredCarousel({
  services,
}: {
  services: unknown[];
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      services
        .map(normalizeService)
        .filter((service) => service.title),
    [services],
  );

  function move(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) return;

    const distance = Math.min(rail.clientWidth * 0.82, 820);

    rail.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative border-b border-[#d8d1c6] px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1480px]">
        <header className="mx-auto max-w-[820px] text-center">
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.17em] text-[#657184] sm:text-[9px]">
            02 / Layanan
          </p>

          <h2 className="mt-5 text-[clamp(2.05rem,8.5vw,4.1rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#14243f] sm:mt-6">
            Layanan untuk setiap tahap pekerjaan.
          </h2>

          <p className="mx-auto mt-5 max-w-[660px] text-[14px] leading-7 text-[#5f6976] sm:mt-6 sm:text-[15px] sm:leading-8">
            Dari perencanaan sampai penyelesaian, pilih layanan yang sesuai
            dengan kebutuhan proyek Anda. Geser untuk melihat layanan lainnya.
          </p>
        </header>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#ddd5c8] pt-4 sm:mt-7 sm:gap-5 sm:pt-5">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#758094] sm:text-[9px]">
            Jelajahi layanan
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Geser layanan ke kiri"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#cfc6b8] bg-[#f8f4ec] text-[#14243f] transition hover:-translate-y-0.5 hover:border-[#dcb458] sm:h-11 sm:w-11"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Geser layanan ke kanan"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#14243f] bg-[#14243f] text-[#f8f4ec] transition hover:-translate-y-0.5 sm:h-11 sm:w-11"
            >
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          <div
            ref={railRef}
            className="mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-0.5 pb-7 pt-7 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 sm:pb-12 sm:pt-12 lg:gap-7"
          >
            {items.map((service, index) => {
              const isUpper = index % 2 === 0;

              return (
                <article
                  key={service.id}
                  className={`group relative min-h-[390px] w-[86vw] max-w-[360px] shrink-0 snap-start overflow-hidden border border-[#d7cfc2] bg-[#f8f4ec] shadow-[0_14px_30px_rgba(20,36,63,0.07)] transition duration-300 hover:shadow-[0_22px_46px_rgba(20,36,63,0.13)] sm:min-h-[430px] sm:w-[390px] sm:max-w-none sm:hover:-translate-y-2 lg:w-[405px] ${
                    isUpper ? "sm:-translate-y-4" : "sm:translate-y-4"
                  }`}
                  style={{
                    borderRadius:
                      cardShapes[index % cardShapes.length],
                  }}
                >
                  <Link
                    href={
                      service.slug
                        ? `/services/${service.slug}`
                        : "/services"
                    }
                    className="flex h-full min-h-[390px] flex-col sm:min-h-[430px]"
                  >
                    <div className="relative h-[205px] overflow-hidden bg-[#e8e2d8] sm:h-[225px]">
                      {service.image ? (
                        <>
                          <DatabaseImage
                            src={service.image}
                            alt={service.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                            sizes="(max-width: 639px) 86vw, 405px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#14243f]/55 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(225deg, rgba(24,45,77,.08) 25%, transparent 25%), linear-gradient(45deg, rgba(220,180,88,.10) 25%, transparent 25%), linear-gradient(315deg, rgba(220,180,88,.10) 25%, #f1ece3 25%)",
                            backgroundSize: "42px 42px",
                          }}
                        />
                      )}

                      <div className="absolute left-4 top-4 rounded-full border border-white/45 bg-[#14243f]/55 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        SRV-{String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="absolute bottom-4 right-4 max-w-[170px] text-right font-mono text-[8px] uppercase leading-4 tracking-[0.14em] text-white/85">
                        {service.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:gap-6 sm:p-6">
                      <div>
                        <h3 className="max-w-[15ch] text-[1.5rem] font-bold uppercase leading-[0.96] tracking-[-0.035em] text-[#14243f] sm:text-[1.75rem]">
                          {service.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-[12px] leading-6 text-[#5f6976] sm:mt-4 sm:text-[13px] sm:leading-7">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between gap-4 border-t border-[#ded6ca] pt-4">
                        <span className="max-w-[120px] font-mono text-[7px] uppercase tracking-[0.14em] text-[#7b8491] sm:text-[8px]">
                          Sesuai kebutuhan proyek
                        </span>

                        <span className="inline-flex shrink-0 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#14243f] sm:text-[10px]">
                          Lihat layanan
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-[#cfc6b8] px-5 py-12 text-center sm:mt-12 sm:px-6 sm:py-16">
            <p className="text-sm text-[#5f6976]">
              Layanan belum tersedia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

'@

Write-Utf8NoBom -Path $carouselFile -Content $carouselCode

Write-Host "  Foto service bukan CSS background lagi." -ForegroundColor DarkGray
Write-Host "  Offscreen image bisa lazy-load." -ForegroundColor DarkGray
Write-Host "  Stagger dimatikan pada mobile." -ForegroundColor DarkGray

Write-Host "[3/5] Responsive pass homepage + preload hero..." -ForegroundColor Yellow

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative mx-auto grid min-h-[700px] w-full max-w-[1480px] lg:grid-cols-[0.9fr_1.1fr] lg:min-h-[740px]"' `
    -New 'className="relative mx-auto grid w-full max-w-[1480px] lg:min-h-[740px] lg:grid-cols-[0.9fr_1.1fr]"' `
    -Label "home hero mobile min-height"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[0.78fr_1.22fr] lg:min-h-[820px]"' `
    -New 'className="relative mx-auto grid w-full max-w-[1480px] lg:min-h-[740px] lg:grid-cols-[0.9fr_1.1fr]"' `
    -Label "home hero legacy proportion"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative z-20 flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-10 lg:py-20"' `
    -New 'className="relative z-20 flex flex-col justify-between px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:px-10 lg:py-20"' `
    -Label "home hero mobile spacing"

Replace-Safe `
    -Path $homeFile `
    -Old 'text-[clamp(2.8rem,4.7vw,4.8rem)]' `
    -New 'text-[clamp(2.35rem,10.5vw,4.8rem)]' `
    -Label "home hero responsive title"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-full"' `
    -New 'className="relative min-h-[330px] sm:min-h-[470px] lg:min-h-full"' `
    -Label "home hero mobile visual height"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative min-h-[530px] lg:min-h-full"' `
    -New 'className="relative min-h-[330px] sm:min-h-[470px] lg:min-h-full"' `
    -Label "home hero legacy visual height"

$homeContent = [System.IO.File]::ReadAllText($homeFile)

if (-not $homeContent.Contains('preload={true}')) {
    $heroPattern = '(?s)(<DatabaseImage\s+src=\{LOCAL_MEDIA\.hero\}\s+alt="Lunar Konstruksi"\s+className="[^"]+"\s+)(placeholderLabel="Tambahkan home-hero\.png")'

    $homeUpdated = [System.Text.RegularExpressions.Regex]::Replace(
        $homeContent,
        $heroPattern,
        '$1preload={true}' + [Environment]::NewLine +
        '          sizes="(max-width: 1023px) 94vw, 50vw"' + [Environment]::NewLine +
        '          $2',
        1
    )

    if ($homeUpdated -ne $homeContent) {
        Write-Utf8NoBom -Path $homeFile -Content $homeUpdated
        Write-Host "  main hero image dipreload." -ForegroundColor DarkGray
    }
    else {
        Write-Warning "Hero DatabaseImage tidak cocok untuk preload otomatis."
    }
}
else {
    Write-Host "  hero preload sudah aktif." -ForegroundColor DarkGray
}

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative mt-7 min-h-[520px] sm:min-h-[570px]"' `
    -New 'className="relative mt-7 sm:min-h-[570px]"' `
    -Label "featured project mobile wrapper"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="group absolute inset-x-0 top-0 overflow-hidden border border-[#d8d1c6] bg-[#e7e0d5] shadow-[0_16px_34px_rgba(20,36,63,.07)] sm:right-[16%]"' `
    -New 'className="group relative block overflow-hidden border border-[#d8d1c6] bg-[#e7e0d5] shadow-[0_16px_34px_rgba(20,36,63,.07)] sm:absolute sm:inset-x-0 sm:top-0 sm:right-[16%]"' `
    -Label "featured project mobile position"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-[1.015] sm:h-[420px]"' `
    -New 'className="h-[250px] w-full object-cover transition duration-700 group-hover:scale-[1.015] sm:h-[420px]"' `
    -Label "featured project mobile image height"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative border-l border-[#b8b1a7] pl-7"' `
    -New 'className="relative sm:border-l sm:border-[#b8b1a7] sm:pl-7"' `
    -Label "process mobile rail"

Replace-Safe `
    -Path $homeFile `
    -Old 'className="absolute -left-[32px] top-2 h-2.5 w-2.5 rounded-full bg-[#dcb458]"' `
    -New 'className="absolute -left-[32px] top-2 hidden h-2.5 w-2.5 rounded-full bg-[#dcb458] sm:block"' `
    -Label "process mobile dots"

Write-Host "[4/5] Responsive pass Services, Contact, Projects..." -ForegroundColor Yellow

Replace-Safe `
    -Path $servicesFile `
    -Old 'className="relative min-h-[520px]"' `
    -New 'className="relative min-h-[330px] sm:min-h-[430px] lg:min-h-[520px]"' `
    -Label "services hero mobile height"

Replace-Safe `
    -Path $servicesFile `
    -Old 'className="h-full min-h-[500px] w-full object-cover object-center"' `
    -New 'className="h-full min-h-[310px] w-full object-cover object-center sm:min-h-[410px] lg:min-h-[500px]"' `
    -Label "services hero image mobile height"

Replace-Safe `
    -Path $servicesFile `
    -Old 'text-[clamp(2.8rem,4.7vw,4.7rem)]' `
    -New 'text-[clamp(2.3rem,10vw,4.7rem)]' `
    -Label "services mobile title"

Replace-Safe `
    -Path $contactFile `
    -Old 'className="relative min-h-[460px]"' `
    -New 'className="relative min-h-[310px] sm:min-h-[410px] lg:min-h-[460px]"' `
    -Label "contact hero mobile height"

Replace-Safe `
    -Path $contactFile `
    -Old 'className="h-[430px] w-full object-contain mix-blend-multiply"' `
    -New 'className="h-[290px] w-full object-contain mix-blend-multiply sm:h-[390px] lg:h-[430px]"' `
    -Label "contact hero image mobile height"

Replace-Safe `
    -Path $contactFile `
    -Old 'className="relative min-h-[500px]"' `
    -New 'className="relative min-h-[310px] sm:min-h-[410px] lg:min-h-[500px]"' `
    -Label "contact legacy hero mobile height"

Replace-Safe `
    -Path $contactFile `
    -Old 'className="h-[450px] w-full object-contain mix-blend-multiply mix-blend-multiply"' `
    -New 'className="h-[290px] w-full object-contain mix-blend-multiply sm:h-[390px] lg:h-[450px]"' `
    -Label "contact legacy image mobile height"

Replace-Safe `
    -Path $projectsFile `
    -Old 'className="relative py-14 sm:py-16 lg:py-20"' `
    -New 'className="relative py-10 sm:py-16 lg:py-20"' `
    -Label "projects mobile section spacing"

Replace-Safe `
    -Path $projectsFile `
    -Old 'className="group block w-[82vw] max-w-[610px] shrink-0 snap-start sm:w-[520px] lg:w-[570px] xl:w-[610px]"' `
    -New 'className="group block w-[88vw] max-w-[610px] shrink-0 snap-start sm:w-[520px] lg:w-[570px] xl:w-[610px]"' `
    -Label "projects mobile rail width"

Write-Host "[5/5] Responsive pass detail pages..." -ForegroundColor Yellow

if (Test-Path $projectDetailFile) {
    Replace-Safe `
        -Path $projectDetailFile `
        -Old 'text-[clamp(2.65rem,4.5vw,4.65rem)]' `
        -New 'text-[clamp(2.2rem,9.5vw,4.65rem)]' `
        -Label "project detail mobile title"

    Replace-Safe `
        -Path $projectDetailFile `
        -Old 'className="h-[360px] w-full object-cover sm:h-[430px] lg:h-[500px]"' `
        -New 'className="h-[260px] w-full object-cover sm:h-[400px] lg:h-[500px]"' `
        -Label "project detail cover mobile height"
}

if (Test-Path $serviceDetailFile) {
    Replace-Safe `
        -Path $serviceDetailFile `
        -Old 'text-[clamp(2.65rem,4.5vw,4.6rem)]' `
        -New 'text-[clamp(2.2rem,9.5vw,4.6rem)]' `
        -Label "service detail mobile title"

    Replace-Safe `
        -Path $serviceDetailFile `
        -Old 'className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[480px]"' `
        -New 'className="h-[250px] w-full object-cover sm:h-[390px] lg:h-[480px]"' `
        -Label "service detail cover mobile height"
}

Write-Host ""
Write-Host "=== v23 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Validasi wajib:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Setelah aman:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Test responsive minimal:" -ForegroundColor Cyan
Write-Host "  360 x 800"
Write-Host "  390 x 844"
Write-Host "  430 x 932"
Write-Host "  768 x 1024"
Write-Host ""
