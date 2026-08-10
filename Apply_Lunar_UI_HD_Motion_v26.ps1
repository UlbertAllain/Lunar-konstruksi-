# Lunar Konstruksi - UI Fix + HD Hero + Motion v26
# Jalankan dari root:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_UI_HD_Motion_v26.ps1
#
# Fokus:
# 1. hapus mojibake arrow seperti â†’
# 2. dropdown Proyek/Layanan tidak hilang saat kursor turun
# 3. hero Cloudinary -> high quality delivery (q_auto:best + max 2400px)
# 4. hindari double-compression Next pada hero Cloudinary
# 5. tambah animasi subtle, respects prefers-reduced-motion

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

function Backup-File {
  param([string]$Source, [string]$BackupRoot, [string]$RelativePath)
  if (-not (Test-Path $Source)) { return }
  $dest = Join-Path $BackupRoot $RelativePath
  $dir = Split-Path -Parent $dest
  if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Copy-Item -Force $Source $dest
}

function Add-HeroProp {
  param([string]$Path, [string]$SourceNeedle, [string]$Label)

  if (-not (Test-Path $Path)) {
    Write-Warning "Missing file: $Path"
    return
  }

  $text = [System.IO.File]::ReadAllText($Path)
  $sourceIndex = $text.IndexOf($SourceNeedle)

  if ($sourceIndex -lt 0) {
    Write-Warning "Hero source tidak ditemukan: $Label"
    return
  }

  $start = $text.LastIndexOf("<DatabaseImage", $sourceIndex)
  $end = $text.IndexOf("/>", $sourceIndex)

  if ($start -lt 0 -or $end -lt 0) {
    Write-Warning "DatabaseImage block tidak ditemukan: $Label"
    return
  }

  $block = $text.Substring($start, ($end + 2) - $start)

  if ($block -match '\shero(\s|=|/>)') {
    Write-Host "  already: $Label hero mode" -ForegroundColor DarkGray
    return
  }

  $block = $block.Replace(
    "/>",
    "hero" + [Environment]::NewLine +
    "                  />"
  )

  $text =
    $text.Substring(0, $start) +
    $block +
    $text.Substring($end + 2)

  Write-Utf8NoBom $Path $text
  Write-Host "  updated: $Label hero mode" -ForegroundColor DarkGray
}

$repoRoot = $PSScriptRoot

if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
  if (Test-Path (Join-Path (Get-Location) "package.json")) {
    $repoRoot = (Get-Location).Path
  } else {
    throw "Jalankan script dari root repository Lunar Konstruksi."
  }
}

$headerFile = Join-Path $repoRoot "components\site\formwork\header.tsx"
$mediaFile = Join-Path $repoRoot "components\site\formwork\media.tsx"
$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"
$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
$contactFile = Join-Path $repoRoot "components\site\formwork\contact.tsx"
$globalsFile = Join-Path $repoRoot "app\globals.css"
$nextConfigFile = Join-Path $repoRoot "next.config.ts"

foreach ($required in @(
  $headerFile,
  $mediaFile,
  $homeFile,
  $servicesFile,
  $projectsFile,
  $contactFile,
  $globalsFile
)) {
  if (-not (Test-Path $required)) {
    throw "File wajib tidak ditemukan: $required"
  }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\ui-hd-motion-v26-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupTargets = @(
  "components\site\formwork\header.tsx",
  "components\site\formwork\media.tsx",
  "components\site\formwork\home.tsx",
  "components\site\formwork\services.tsx",
  "components\site\formwork\projects.tsx",
  "components\site\formwork\contact.tsx",
  "app\globals.css",
  "next.config.ts"
)
foreach ($relative in $backupTargets) {
  Backup-File (Join-Path $repoRoot $relative) $backupRoot $relative
}

Write-Host ""
Write-Host "=== Lunar / UI + HD Hero + Motion v26 ===" -ForegroundColor Cyan

# STEP 1 - Repair mojibake
Write-Host "[1/5] Membersihkan karakter arrow rusak..." -ForegroundColor Yellow

$siteRoot = Join-Path $repoRoot "components\site"
Get-ChildItem -Path $siteRoot -Recurse -File -Include *.tsx,*.ts | ForEach-Object {
  $text = [System.IO.File]::ReadAllText($_.FullName)
  $fixed = $text `
    -replace 'â†’', '→' `
    -replace 'â†', '←' `
    -replace 'â†‘', '↑' `
    -replace 'â†“', '↓'

  if ($fixed -ne $text) {
    Write-Utf8NoBom $_.FullName $fixed
    Write-Host "  fixed: $($_.FullName.Replace($repoRoot + '\',''))" -ForegroundColor DarkGray
  }
}

# STEP 2 - Header
Write-Host "[2/5] Memperbaiki dropdown navbar..." -ForegroundColor Yellow

Write-Utf8NoBom $headerFile @'
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { displayFont } from "./decor";
import {
  projectModel,
  serviceModel,
} from "./data";

type Props = {
  services?: unknown[];
  projects?: unknown[];
};

function activePath(
  pathname: string,
  href: string,
) {
  if (href === "/") return pathname === "/";

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function FormworkHeader({
  services = [],
  projects = [],
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<
    "projects" | "services" | null
  >(null);

  const serviceItems = useMemo(
    () =>
      services
        .map(serviceModel)
        .filter((item) => item.slug),
    [services],
  );

  const projectItems = useMemo(
    () =>
      projects
        .map(projectModel)
        .filter((item) => item.slug),
    [projects],
  );

  const groups = [
    {
      key: "projects" as const,
      href: "/projects",
      label: "Proyek",
      items: projectItems.map((item) => ({
        href: `/projects/${item.slug}`,
        label: item.title,
        meta: item.location,
      })),
    },
    {
      key: "services" as const,
      href: "/services",
      label: "Layanan",
      items: serviceItems.map((item) => ({
        href: `/services/${item.slug}`,
        label: item.name,
        meta: "Layanan",
      })),
    },
  ];

  function closeMobile() {
    setOpen(false);
    setMobileGroup(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d1c6] bg-[#f5f1e8]/95 text-[#182d4d] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:h-[82px] sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeMobile}
          className="group flex min-w-0 items-center gap-3"
          aria-label="Lunar Konstruksi"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center sm:h-11 sm:w-11">
            <Image
              src="/lunar-logo-mark.png"
              alt=""
              width={750}
              height={770}
              priority
              className="h-10 w-10 object-contain transition duration-300 group-hover:scale-[1.04] sm:h-11 sm:w-11"
            />
          </span>

          <span className="hidden sm:block">
            <span
              className={`${displayFont} block text-[1.02rem] font-black uppercase leading-none tracking-[0.12em]`}
            >
              Lunar
            </span>
            <span className="mt-1 block font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-[#b58c2f]">
              Konstruksi
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#d8d1c6] bg-white/35 p-1 lg:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
              activePath(pathname, "/")
                ? "bg-[#14243f] text-[#f8f4ec]"
                : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
            }`}
          >
            Home
          </Link>

          {groups.map((group) => (
            <div
              key={group.key}
              className="group/nav relative"
            >
              <Link
                href={group.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
                  activePath(pathname, group.href)
                    ? "bg-[#14243f] text-[#f8f4ec]"
                    : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
                }`}
              >
                {group.label}
                <ChevronDown className="h-3 w-3 transition duration-200 group-hover/nav:rotate-180" />
              </Link>

              {group.items.length ? (
                <div className="invisible absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                  <div className="lunar-dropdown-panel overflow-hidden border border-[#d8d1c6] bg-[#f8f4ec] shadow-[0_24px_60px_rgba(20,36,63,0.16)]">
                    <div className="border-b border-[#ded7cb] px-4 py-3">
                      <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#b58c2f]">
                        Pilih {group.label}
                      </p>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex items-center justify-between gap-4 border-b border-[#e5ded3] px-3 py-3 last:border-b-0 hover:bg-[#eee8df]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[12px] font-semibold text-[#14243f]">
                              {item.label}
                            </span>
                            <span className="mt-1 block truncate font-mono text-[7px] uppercase tracking-[0.13em] text-[#89919c]">
                              {item.meta}
                            </span>
                          </span>

                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#b58c2f] transition duration-200 group-hover/item:translate-x-1" />
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={group.href}
                      className="group/all flex items-center justify-between bg-[#14243f] px-4 py-3 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#f8f4ec]"
                    >
                      Lihat semua {group.label}
                      <ArrowRight className="h-3.5 w-3.5 text-[#dcb458] transition group-hover/all:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          <Link
            href="/contact"
            className={`rounded-full px-4 py-2.5 text-[11px] font-semibold transition ${
              activePath(pathname, "/contact")
                ? "bg-[#14243f] text-[#f8f4ec]"
                : "text-[#526074] hover:bg-[#ebe5db] hover:text-[#14243f]"
            }`}
          >
            Kontak
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="h-px w-8 bg-[#dcb458]" />
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:bg-[#14243f] hover:text-[#f8f4ec]"
          >
            Konsultasikan proyek
          </Link>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen((value) => !value)
          }
          className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] sm:h-11 sm:w-11 lg:hidden"
          aria-label={
            open
              ? "Tutup navigasi"
              : "Buka navigasi"
          }
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {open ? (
        <div className="lunar-mobile-menu border-t border-[#d8d1c6] bg-[#f5f1e8] px-4 pb-6 pt-2 sm:px-8 lg:hidden">
          <nav className="mx-auto flex max-w-[1480px] flex-col">
            <Link
              href="/"
              onClick={closeMobile}
              className={`border-b border-[#ddd5c8] py-4 text-sm font-semibold ${
                pathname === "/"
                  ? "text-[#b58c2f]"
                  : "text-[#14243f]"
              }`}
            >
              Home
            </Link>

            {groups.map((group) => {
              const expanded =
                mobileGroup === group.key;

              return (
                <div
                  key={group.key}
                  className="border-b border-[#ddd5c8]"
                >
                  <div className="flex items-center">
                    <Link
                      href={group.href}
                      onClick={closeMobile}
                      className={`flex-1 py-4 text-sm font-semibold ${
                        activePath(
                          pathname,
                          group.href,
                        )
                          ? "text-[#b58c2f]"
                          : "text-[#14243f]"
                      }`}
                    >
                      {group.label}
                    </Link>

                    {group.items.length ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileGroup(
                            expanded
                              ? null
                              : group.key,
                          )
                        }
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d1c6]"
                        aria-label={`Buka daftar ${group.label}`}
                        aria-expanded={expanded}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition ${
                            expanded
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {expanded ? (
                    <div className="mb-3 border-l border-[#dcb458] pl-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="group/mobile flex items-center justify-between gap-3 py-3 text-[12px] text-[#526074]"
                        >
                          <span>{item.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#b58c2f] transition group-hover/mobile:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <Link
              href="/contact"
              onClick={closeMobile}
              className={`border-b border-[#ddd5c8] py-4 text-sm font-semibold ${
                activePath(pathname, "/contact")
                  ? "text-[#b58c2f]"
                  : "text-[#14243f]"
              }`}
            >
              Kontak
            </Link>

            <Link
              href="/contact"
              onClick={closeMobile}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#14243f] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#f8f4ec]"
            >
              Konsultasikan proyek
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

'@

Write-Host "  gap hover dropdown sudah menjadi bagian dari child hit-area." -ForegroundColor DarkGray
Write-Host "  arrow teks diganti icon Lucide." -ForegroundColor DarkGray

# STEP 3 - Media HD
Write-Host "[3/5] Mengubah hero Cloudinary ke high quality..." -ForegroundColor Yellow

Write-Utf8NoBom $mediaFile @'
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
  quality?: number;
  unoptimized?: boolean;
  hero?: boolean;
};

function cloudinaryHeroSource(src: string) {
  if (
    !src.includes("res.cloudinary.com") ||
    !src.includes("/image/upload/")
  ) {
    return src;
  }

  if (
    src.includes("/q_auto:best/") ||
    src.includes("/q_95/")
  ) {
    return src;
  }

  return src.replace(
    "/image/upload/",
    "/image/upload/c_limit,w_2400/q_auto:best/f_auto/",
  );
}

export function DatabaseImage({
  src,
  fallbackSrc = "",
  alt,
  className,
  placeholderLabel = "Media belum diisi",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
  preload = false,
  quality = 90,
  unoptimized = false,
  hero = false,
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

  const lower = resolved.toLowerCase();
  const isDataUrl = resolved.startsWith("data:");
  const isSvg =
    lower.endsWith(".svg") ||
    lower.includes(".svg?");
  const isCloudinaryHero =
    hero &&
    resolved.includes("res.cloudinary.com") &&
    resolved.includes("/image/upload/");

  const finalSrc = hero
    ? cloudinaryHeroSource(resolved)
    : resolved;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={hero ? 2400 : 1800}
      height={hero ? 1500 : 1200}
      sizes={sizes}
      preload={hero || preload}
      quality={quality}
      loading={hero || preload ? undefined : "lazy"}
      decoding="async"
      unoptimized={
        unoptimized ||
        isCloudinaryHero ||
        isDataUrl ||
        isSvg
      }
      className={`${className} ${
        hero ? "lunar-hero-image" : ""
      }`}
    />
  );
}

'@

# Ensure quality config remains valid if v24 wasn't fully applied.
if (Test-Path $nextConfigFile) {
  $config = [System.IO.File]::ReadAllText($nextConfigFile)

  if ($config.Contains("images: {") -and -not $config.Contains("qualities:")) {
    $config = $config.Replace(
      "images: {",
      "images: {" + [Environment]::NewLine +
      "    qualities: [75, 85, 90, 95],"
    )
    Write-Utf8NoBom $nextConfigFile $config
  }
}

Add-HeroProp $homeFile 'data.siteContent.homeHero?.url' "Home"
Add-HeroProp $servicesFile 'data.siteContent.servicesHero?.url' "Services"
Add-HeroProp $projectsFile 'data.siteContent.projectsHero?.url' "Projects"
Add-HeroProp $contactFile 'data.siteContent.contactHero?.url' "Contact"

Write-Host "  Cloudinary hero: c_limit,w_2400 + q_auto:best + f_auto." -ForegroundColor DarkGray
Write-Host "  Next tidak mengompres ulang hero Cloudinary." -ForegroundColor DarkGray

# STEP 4 - Public page scope class
Write-Host "[4/5] Menambahkan scope animasi public..." -ForegroundColor Yellow

foreach ($file in @(
  $homeFile,
  $servicesFile,
  $projectsFile,
  $contactFile
)) {
  $text = [System.IO.File]::ReadAllText($file)

  if (-not $text.Contains("lunar-public-page")) {
    $text = [System.Text.RegularExpressions.Regex]::Replace(
      $text,
      '<div className="overflow-hidden ',
      '<div className="lunar-public-page overflow-hidden ',
      1
    )
    Write-Utf8NoBom $file $text
  }
}

# Detail pages as well, if their root matches.
foreach ($relative in @(
  "components\site\project-detail-page.tsx",
  "components\site\service-detail-page.tsx"
)) {
  $file = Join-Path $repoRoot $relative

  if (Test-Path $file) {
    $text = [System.IO.File]::ReadAllText($file)

    if (-not $text.Contains("lunar-public-page")) {
      $updated = [System.Text.RegularExpressions.Regex]::Replace(
        $text,
        '<div className="([^"]*bg-\[#f5f1e8\][^"]*)"',
        '<div className="lunar-public-page $1"',
        1
      )

      if ($updated -ne $text) {
        Write-Utf8NoBom $file $updated
      }
    }
  }
}

# STEP 5 - CSS animations
Write-Host "[5/5] Menambahkan animasi subtle..." -ForegroundColor Yellow

$css = [System.IO.File]::ReadAllText($globalsFile)

if (-not $css.Contains("@keyframes lunarHeroImageIn")) {
  $css += @'


/* =========================================================
   LUNAR PUBLIC MOTION
   ========================================================= */

@keyframes lunarHeroImageIn {
  from {
    opacity: 0;
    transform: scale(0.975) translateY(14px);
    filter: saturate(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: saturate(1);
  }
}

@keyframes lunarDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-5px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes lunarMobileMenuIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lunarSectionIn {
  from {
    opacity: 0.001;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lunar-hero-image {
  animation: lunarHeroImageIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lunar-dropdown-panel {
  transform-origin: top center;
  animation: lunarDropdownIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lunar-mobile-menu {
  animation: lunarMobileMenuIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@supports (animation-timeline: view()) {
  .lunar-public-page main > section:not(:first-child) {
    animation: lunarSectionIn linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 26%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lunar-hero-image,
  .lunar-dropdown-panel,
  .lunar-mobile-menu,
  .lunar-public-page main > section {
    animation: none !important;
    transform: none !important;
  }
}

'@
  Write-Utf8NoBom $globalsFile $css
  Write-Host "  hero reveal + dropdown + mobile menu + section reveal aktif." -ForegroundColor DarkGray
} else {
  Write-Host "  motion CSS sudah tersedia." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== v26 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Hasil utama:" -ForegroundColor Cyan
Write-Host "  - karakter â†’ dibersihkan"
Write-Host "  - dropdown tidak hilang ketika pointer turun"
Write-Host "  - hero dinamis Cloudinary high quality"
Write-Host "  - Cloudinary memilih format browser lewat f_auto"
Write-Host "  - q_auto:best mempertahankan visual lebih tinggi"
Write-Host "  - hero max 2400px untuk mencegah source absurdly besar"
Write-Host "  - animasi subtle + reduced-motion support"
Write-Host ""
Write-Host "PENTING: restart dev server setelah patch." -ForegroundColor Yellow
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
