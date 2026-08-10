# Lunar Konstruksi - Image Quality Balance v24
# Fokus:
# - pertahankan optimasi next/image
# - naikkan kualitas default dari 75 -> 90
# - hero utama -> quality 95 + preload
# - responsive sizes tetap aktif
# - tidak mengubah layout/responsive v23
#
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Image_Quality_v24.ps1

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

function Add-PropToDatabaseImage {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$SourceToken,
        [Parameter(Mandatory = $true)][string]$PropLine,
        [Parameter(Mandatory = $true)][string]$Label
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "File tidak ditemukan: $Path"
        return
    }

    $content = [System.IO.File]::ReadAllText($Path)

    $tokenIndex = $content.IndexOf($SourceToken)

    if ($tokenIndex -lt 0) {
        Write-Warning "Source token tidak ditemukan untuk $Label"
        return
    }

    $imageStart = $content.LastIndexOf("<DatabaseImage", $tokenIndex)

    if ($imageStart -lt 0) {
        Write-Warning "DatabaseImage tidak ditemukan untuk $Label"
        return
    }

    $imageEnd = $content.IndexOf("/>", $tokenIndex)

    if ($imageEnd -lt 0) {
        Write-Warning "Penutup DatabaseImage tidak ditemukan untuk $Label"
        return
    }

    $blockLength = ($imageEnd + 2) - $imageStart
    $block = $content.Substring($imageStart, $blockLength)

    $propName = ($PropLine.Trim() -split "=")[0]

    if ($block.Contains($propName + "=")) {
        Write-Host "  already applied: $Label / $propName" -ForegroundColor DarkGray
        return
    }

    $lineStart = $content.LastIndexOf([Environment]::NewLine, $imageEnd)

    if ($lineStart -lt 0) {
        Write-Warning "Tidak bisa menentukan indent untuk $Label"
        return
    }

    $closingLine = $content.Substring($lineStart + [Environment]::NewLine.Length, $imageEnd - ($lineStart + [Environment]::NewLine.Length))
    $indent = ($closingLine -replace '/>.*$', '')

    $insert = $PropLine

    if (-not $insert.StartsWith(" ")) {
        $insert = $indent + $insert.Trim()
    }

    $content =
        $content.Substring(0, $imageEnd) +
        $insert +
        [Environment]::NewLine +
        $indent +
        $content.Substring($imageEnd)

    Write-Utf8NoBom -Path $Path -Content $content
    Write-Host "  updated: $Label / $propName" -ForegroundColor DarkGray
}

function Add-HeroQualityByRegex {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Label
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "File tidak ditemukan: $Path"
        return
    }

    $content = [System.IO.File]::ReadAllText($Path)

    if (-not [System.Text.RegularExpressions.Regex]::IsMatch(
        $content,
        $Pattern,
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )) {
        Write-Warning "Hero pattern tidak ditemukan: $Label"
        return
    }

    $match = [System.Text.RegularExpressions.Regex]::Match(
        $content,
        $Pattern,
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    $block = $match.Value

    if (-not $block.Contains("quality={95}")) {
        $block = $block.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains("preload={true}")) {
        $block = $block.Replace(
            "/>",
            "preload={true}" + [Environment]::NewLine +
            "                  />"
        )
    }

    $content =
        $content.Substring(0, $match.Index) +
        $block +
        $content.Substring($match.Index + $match.Length)

    Write-Utf8NoBom -Path $Path -Content $content
    Write-Host "  hero quality applied: $Label" -ForegroundColor DarkGray
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

$nextConfigFile = Join-Path $repoRoot "next.config.ts"
$mediaFile = Join-Path $repoRoot "components\site\formwork\media.tsx"
$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"
$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
$contactFile = Join-Path $repoRoot "components\site\formwork\contact.tsx"

$requiredFiles = @(
    $nextConfigFile,
    $mediaFile,
    $homeFile,
    $servicesFile,
    $projectsFile,
    $contactFile
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "File wajib tidak ditemukan: $file"
    }
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Image Quality Balance v24 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\image-quality-v24-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupTargets = @(
    "next.config.ts",
    "components\site\formwork\media.tsx",
    "components\site\formwork\home.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\contact.tsx"
)

foreach ($relativePath in $backupTargets) {
    Backup-File `
        -Source (Join-Path $repoRoot $relativePath) `
        -BackupRoot $backupRoot `
        -RelativePath $relativePath
}

# =========================================================
# 1. NEXT CONFIG QUALITY WHITELIST
# =========================================================

Write-Host "[1/4] Mengatur quality whitelist Next.js..." -ForegroundColor Yellow

$nextConfig = [System.IO.File]::ReadAllText($nextConfigFile)

if ($nextConfig.Contains("qualities:")) {
    $nextConfig = [System.Text.RegularExpressions.Regex]::Replace(
        $nextConfig,
        'qualities:\s*\[[^\]]*\]',
        'qualities: [75, 85, 90, 95]'
    )

    Write-Host "  qualities diperbarui -> 75 / 85 / 90 / 95" -ForegroundColor DarkGray
}
elseif ($nextConfig.Contains("images: {")) {
    $nextConfig = $nextConfig.Replace(
        "images: {",
        "images: {" + [Environment]::NewLine +
        "    qualities: [75, 85, 90, 95],"
    )

    Write-Host "  qualities ditambahkan -> 75 / 85 / 90 / 95" -ForegroundColor DarkGray
}
else {
    throw "Blok images pada next.config.ts tidak ditemukan."
}

Write-Utf8NoBom -Path $nextConfigFile -Content $nextConfig

# =========================================================
# 2. DATABASE IMAGE QUALITY DEFAULT
# =========================================================

Write-Host "[2/4] Menaikkan kualitas default DatabaseImage..." -ForegroundColor Yellow

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
  quality?: number;
  unoptimized?: boolean;
};

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
  const isSvg = lower.endsWith(".svg") || lower.includes(".svg?");

  return (
    <Image
      src={resolved}
      alt={alt}
      width={1800}
      height={1200}
      sizes={sizes}
      preload={preload}
      quality={quality}
      loading={preload ? undefined : "lazy"}
      decoding="async"
      unoptimized={unoptimized || isDataUrl || isSvg}
      className={className}
    />
  );
}

'@

Write-Utf8NoBom -Path $mediaFile -Content $mediaCode

Write-Host "  default image quality: 90" -ForegroundColor DarkGray
Write-Host "  responsive sizes + lazy loading tetap dipertahankan" -ForegroundColor DarkGray
Write-Host "  prop unoptimized tersedia sebagai fallback bila diperlukan" -ForegroundColor DarkGray

# =========================================================
# 3. MAIN HERO QUALITY 95
# =========================================================

Write-Host "[3/4] Mengatur hero utama ke quality 95..." -ForegroundColor Yellow

# HOME HERO
$homeContent = [System.IO.File]::ReadAllText($homeFile)

$homeHeroPattern = '(?s)<DatabaseImage\s+src=\{LOCAL_MEDIA\.hero\}.*?/>'

if ([System.Text.RegularExpressions.Regex]::IsMatch($homeContent, $homeHeroPattern)) {
    $homeMatch = [System.Text.RegularExpressions.Regex]::Match($homeContent, $homeHeroPattern)
    $homeBlock = $homeMatch.Value

    if (-not $homeBlock.Contains("quality={95}")) {
        $homeBlock = $homeBlock.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "          />"
        )
    }

    if (-not $homeBlock.Contains("preload={true}")) {
        $homeBlock = $homeBlock.Replace(
            "/>",
            "preload={true}" + [Environment]::NewLine +
            "          />"
        )
    }

    if (-not $homeBlock.Contains('sizes="(max-width: 1023px) 94vw, 50vw"')) {
        $homeBlock = $homeBlock.Replace(
            "/>",
            'sizes="(max-width: 1023px) 94vw, 50vw"' + [Environment]::NewLine +
            "          />"
        )
    }

    $homeContent =
        $homeContent.Substring(0, $homeMatch.Index) +
        $homeBlock +
        $homeContent.Substring($homeMatch.Index + $homeMatch.Length)

    Write-Utf8NoBom -Path $homeFile -Content $homeContent
    Write-Host "  Home hero -> q95 + preload" -ForegroundColor DarkGray
}
else {
    Write-Warning "Home hero tidak ditemukan."
}

# SERVICES HERO - unique by fallback expression and min-height class.
$servicesContent = [System.IO.File]::ReadAllText($servicesFile)
$servicesHeroPattern = '(?s)<DatabaseImage\s+src=\{\s*LOCAL_MEDIA\.servicesHero.*?/>'

if ([System.Text.RegularExpressions.Regex]::IsMatch($servicesContent, $servicesHeroPattern)) {
    $match = [System.Text.RegularExpressions.Regex]::Match($servicesContent, $servicesHeroPattern)
    $block = $match.Value

    if (-not $block.Contains("quality={95}")) {
        $block = $block.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains("preload={true}")) {
        $block = $block.Replace(
            "/>",
            "preload={true}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains('sizes="(max-width: 1023px) 94vw, 55vw"')) {
        $block = $block.Replace(
            "/>",
            'sizes="(max-width: 1023px) 94vw, 55vw"' + [Environment]::NewLine +
            "                  />"
        )
    }

    $servicesContent =
        $servicesContent.Substring(0, $match.Index) +
        $block +
        $servicesContent.Substring($match.Index + $match.Length)

    Write-Utf8NoBom -Path $servicesFile -Content $servicesContent
    Write-Host "  Services hero -> q95 + preload" -ForegroundColor DarkGray
}
else {
    Write-Warning "Services hero tidak ditemukan."
}

# PROJECTS HERO
$projectsContent = [System.IO.File]::ReadAllText($projectsFile)
$projectsHeroPattern = '(?s)<DatabaseImage\s+src=\{LOCAL_MEDIA\.projectsHero.*?/>'

if ([System.Text.RegularExpressions.Regex]::IsMatch($projectsContent, $projectsHeroPattern)) {
    $match = [System.Text.RegularExpressions.Regex]::Match($projectsContent, $projectsHeroPattern)
    $block = $match.Value

    if (-not $block.Contains("quality={95}")) {
        $block = $block.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains("preload={true}")) {
        $block = $block.Replace(
            "/>",
            "preload={true}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains('sizes="(max-width: 1023px) 94vw, 55vw"')) {
        $block = $block.Replace(
            "/>",
            'sizes="(max-width: 1023px) 94vw, 55vw"' + [Environment]::NewLine +
            "                  />"
        )
    }

    $projectsContent =
        $projectsContent.Substring(0, $match.Index) +
        $block +
        $projectsContent.Substring($match.Index + $match.Length)

    Write-Utf8NoBom -Path $projectsFile -Content $projectsContent
    Write-Host "  Projects hero -> q95 + preload" -ForegroundColor DarkGray
}
else {
    Write-Warning "Projects hero tidak ditemukan."
}

# CONTACT HERO
$contactContent = [System.IO.File]::ReadAllText($contactFile)
$contactHeroPattern = '(?s)<DatabaseImage\s+src=\{LOCAL_MEDIA\.contactHero\}.*?/>'

if ([System.Text.RegularExpressions.Regex]::IsMatch($contactContent, $contactHeroPattern)) {
    $match = [System.Text.RegularExpressions.Regex]::Match($contactContent, $contactHeroPattern)
    $block = $match.Value

    if (-not $block.Contains("quality={95}")) {
        $block = $block.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains("preload={true}")) {
        $block = $block.Replace(
            "/>",
            "preload={true}" + [Environment]::NewLine +
            "                  />"
        )
    }

    if (-not $block.Contains('sizes="(max-width: 1023px) 94vw, 55vw"')) {
        $block = $block.Replace(
            "/>",
            'sizes="(max-width: 1023px) 94vw, 55vw"' + [Environment]::NewLine +
            "                  />"
        )
    }

    $contactContent =
        $contactContent.Substring(0, $match.Index) +
        $block +
        $contactContent.Substring($match.Index + $match.Length)

    Write-Utf8NoBom -Path $contactFile -Content $contactContent
    Write-Host "  Contact hero -> q95 + preload" -ForegroundColor DarkGray
}
else {
    Write-Warning "Contact hero tidak ditemukan."
}

# =========================================================
# 4. FEATURED VISUALS QUALITY 90/95
# =========================================================

Write-Host "[4/4] Menyetel visual penting lainnya..." -ForegroundColor Yellow

# Home engineer inset -> 95 (small visual, sharp edges/details)
$homeContent = [System.IO.File]::ReadAllText($homeFile)
$engineerPattern = '(?s)<DatabaseImage\s+src=\{LOCAL_MEDIA\.heroEngineer\}.*?/>'

if ([System.Text.RegularExpressions.Regex]::IsMatch($homeContent, $engineerPattern)) {
    $match = [System.Text.RegularExpressions.Regex]::Match($homeContent, $engineerPattern)
    $block = $match.Value

    if (-not $block.Contains("quality={95}")) {
        $block = $block.Replace(
            "/>",
            "quality={95}" + [Environment]::NewLine +
            "          />"
        )

        $homeContent =
            $homeContent.Substring(0, $match.Index) +
            $block +
            $homeContent.Substring($match.Index + $match.Length)

        Write-Utf8NoBom -Path $homeFile -Content $homeContent
    }

    Write-Host "  Home engineer inset -> q95" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== v24 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Strategi kualitas:" -ForegroundColor Cyan
Write-Host "  Hero Home      : quality 95 + preload"
Write-Host "  Hero Services  : quality 95 + preload"
Write-Host "  Hero Projects  : quality 95 + preload"
Write-Host "  Hero Contact   : quality 95 + preload"
Write-Host "  Image lainnya  : quality 90 + lazy-load"
Write-Host "  SVG/data URL   : tidak dioptimasi ulang"
Write-Host ""
Write-Host "Tidak dilakukan:" -ForegroundColor Cyan
Write-Host "  - tidak convert foto ke SVG"
Write-Host "  - tidak mematikan responsive image"
Write-Host "  - tidak mengubah layout v23"
Write-Host ""
Write-Host "PENTING: restart dev server karena next.config.ts berubah." -ForegroundColor Yellow
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Kalau masih terlihat burik setelah q95:" -ForegroundColor Cyan
Write-Host "  jangan convert ke SVG; cek resolusi file sumber hero."
Write-Host "  DatabaseImage sekarang punya prop unoptimized={true} sebagai opsi terakhir"
Write-Host "  untuk hero tertentu bila source aslinya memang sudah tajam."
Write-Host ""
