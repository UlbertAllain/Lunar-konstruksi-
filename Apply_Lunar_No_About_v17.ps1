# Lunar Konstruksi - Remove Public About + Team v17
# Script lanjutan yang AMAN setelah v15, dan juga bisa dipakai
# walaupun Resume v16 belum sempat dijalankan.
#
# Efek:
# - Hapus menu Tentang/About dari navbar publik
# - Hapus halaman /about
# - Hapus komponen About publik lama
# - Hapus section Tim/anggota dari landing page
# - Hapus dependency teamModel dari landing page
# - Rapikan nomor section setelah Team dihapus
# - Tetap menyelesaikan typography + service carousel dari resume v16
#
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_No_About_v17.ps1

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

function Replace-LiteralSafe {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Old,
        [Parameter(Mandatory = $true)][string]$New
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "File tidak ditemukan, dilewati: $Path"
        return
    }

    $content = [System.IO.File]::ReadAllText($Path)

    if ($content.Contains($Old)) {
        $content = $content.Replace($Old, $New)
        Write-Utf8NoBom -Path $Path -Content $content
        Write-Host "  updated: $Path" -ForegroundColor DarkGray
        return
    }

    if ($content.Contains($New)) {
        Write-Host "  already applied: $Path" -ForegroundColor DarkGray
        return
    }

    Write-Warning "Pattern tidak ditemukan pada $Path. Dilewati."
}

function Backup-Path {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$DestinationRoot,
        [Parameter(Mandatory = $true)][string]$RelativePath
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $destination = Join-Path $DestinationRoot $RelativePath
    $destinationDirectory = Split-Path -Parent $destination

    if ($destinationDirectory) {
        New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
    }

    if ((Get-Item $Source).PSIsContainer) {
        Copy-Item -Recurse -Force $Source $destination
    }
    else {
        Copy-Item -Force $Source $destination
    }
}

$repoRoot = $PSScriptRoot

if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
    if (Test-Path (Join-Path (Get-Location) "package.json")) {
        $repoRoot = (Get-Location).Path
    }
    else {
        throw "Jalankan script dari root repository Lunar Konstruksi (folder yang berisi package.json)."
    }
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Remove Public About + Team v17 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\remove-about-team-v17-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupTargets = @(
    "components\site\formwork\header.tsx",
    "components\site\formwork\home.tsx",
    "components\site\formwork\about.tsx",
    "components\site\about-page.tsx",
    "app\about",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\contact.tsx",
    "components\site\formwork\service-staggered-carousel.tsx"
)

foreach ($relativePath in $backupTargets) {
    $source = Join-Path $repoRoot $relativePath
    Backup-Path -Source $source -DestinationRoot $backupRoot -RelativePath $relativePath
}

Write-Host "[1/6] Menghapus menu Tentang/About dari navbar..." -ForegroundColor Yellow

$headerFile = Join-Path $repoRoot "components\site\formwork\header.tsx"

if (-not (Test-Path $headerFile)) {
    throw "Navbar Formwork tidak ditemukan: $headerFile"
}

$headerContent = [System.IO.File]::ReadAllText($headerFile)

# Kompatibel dengan navbar lama maupun navbar hasil v15.
$headerUpdated = [System.Text.RegularExpressions.Regex]::Replace(
    $headerContent,
    '(?m)^[ \t]*\{[ \t]*href:[ \t]*"/about",[ \t]*label:[ \t]*"[^"]+"[ \t]*\},[ \t]*\r?\n',
    ''
)

if ($headerUpdated -ne $headerContent) {
    Write-Utf8NoBom -Path $headerFile -Content $headerUpdated
    Write-Host "  menu /about dihapus dari navbar." -ForegroundColor DarkGray
}
elseif ($headerContent.Contains('href="/about"') -or $headerContent.Contains('href: "/about"')) {
    Write-Warning "Referensi /about masih ditemukan di header, tetapi formatnya berbeda dari yang diperkirakan."
}
else {
    Write-Host "  menu /about sudah tidak ada." -ForegroundColor DarkGray
}

Write-Host "[2/6] Menghapus section Tim/anggota dari landing page..." -ForegroundColor Yellow

$landingFile = Join-Path $repoRoot "components\site\formwork\home.tsx"

if (-not (Test-Path $landingFile)) {
    throw "Landing page Formwork tidak ditemukan: $landingFile"
}

$landingContent = [System.IO.File]::ReadAllText($landingFile)

# Hapus teamModel dari import data.
$landingContent = [System.Text.RegularExpressions.Regex]::Replace(
    $landingContent,
    '(?m)^[ \t]*teamModel,[ \t]*\r?\n',
    ''
)

# Hapus variable data team dari FormworkHome.
$landingContent = [System.Text.RegularExpressions.Regex]::Replace(
    $landingContent,
    '(?m)^[ \t]*const[ \t]+team[ \t]*=[ \t]*data\.team\.map\(teamModel\);[ \t]*\r?\n',
    ''
)

# Hapus seluruh block TEAM dengan memakai marker section,
# sehingga tidak bergantung pada jumlah anggota atau struktur grid di dalamnya.
$teamStart = $landingContent.IndexOf("{/* TEAM")
$testimonialStart = $landingContent.IndexOf("{/* TESTIMONIAL")

if ($teamStart -ge 0 -and $testimonialStart -gt $teamStart) {
    $beforeTeam = $landingContent.Substring(0, $teamStart)
    $afterTeam = $landingContent.Substring($testimonialStart)
    $landingContent = $beforeTeam + $afterTeam

    Write-Host "  seluruh section Team di landing page dihapus." -ForegroundColor DarkGray
}
elseif ($teamStart -lt 0) {
    Write-Host "  section Team sudah tidak ditemukan; kemungkinan sudah terhapus." -ForegroundColor DarkGray
}
else {
    throw "Marker TEAM ditemukan tetapi marker TESTIMONIAL tidak ditemukan. Script dihentikan untuk mencegah penghapusan berlebihan."
}

# Rapikan numbering section setelah Team dihapus.
$landingContent = $landingContent.Replace(
    "<MicroLabel>07 / Cerita klien</MicroLabel>",
    "<MicroLabel>06 / Cerita klien</MicroLabel>"
)
$landingContent = $landingContent.Replace(
    "<MicroLabel>08 / Mulai proyek Anda</MicroLabel>",
    "<MicroLabel>07 / Mulai proyek Anda</MicroLabel>"
)

Write-Utf8NoBom -Path $landingFile -Content $landingContent

Write-Host "[3/6] Menghapus halaman /about dan komponen public About..." -ForegroundColor Yellow

$aboutRoute = Join-Path $repoRoot "app\about"
$aboutPageComponent = Join-Path $repoRoot "components\site\about-page.tsx"
$formworkAboutComponent = Join-Path $repoRoot "components\site\formwork\about.tsx"

if (Test-Path $aboutRoute) {
    Remove-Item -Recurse -Force $aboutRoute
    Write-Host "  removed: app\about" -ForegroundColor DarkGray
}
else {
    Write-Host "  app\about sudah tidak ada." -ForegroundColor DarkGray
}

if (Test-Path $aboutPageComponent) {
    Remove-Item -Force $aboutPageComponent
    Write-Host "  removed: components\site\about-page.tsx" -ForegroundColor DarkGray
}
else {
    Write-Host "  components\site\about-page.tsx sudah tidak ada." -ForegroundColor DarkGray
}

if (Test-Path $formworkAboutComponent) {
    Remove-Item -Force $formworkAboutComponent
    Write-Host "  removed: components\site\formwork\about.tsx" -ForegroundColor DarkGray
}
else {
    Write-Host "  components\site\formwork\about.tsx sudah tidak ada." -ForegroundColor DarkGray
}

Write-Host "[4/6] Menyelesaikan typography public dari revisi sebelumnya..." -ForegroundColor Yellow

# Script ini sengaja idempotent agar aman baik v16 sudah maupun belum dijalankan.

$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
Replace-LiteralSafe $homeFile 'text-[clamp(3.4rem,6vw,6.4rem)]' 'text-[clamp(3rem,5.2vw,5.35rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3rem,4.7vw,5.3rem)]' 'text-[clamp(2.5rem,3.9vw,4.15rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(2.9rem,4.5vw,4.7rem)]' 'text-[clamp(2.4rem,3.6vw,3.75rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3rem,5vw,5.8rem)]' 'text-[clamp(2.5rem,4vw,4.35rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(2.9rem,4.7vw,5.3rem)]' 'text-[clamp(2.45rem,3.9vw,4.15rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3.2rem,5.2vw,5.6rem)]' 'text-[clamp(2.55rem,4.1vw,4.35rem)]'

$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
Replace-LiteralSafe $projectsFile 'text-[clamp(3.8rem,7vw,7.8rem)]' 'text-[clamp(3rem,5.1vw,5.35rem)]'
Replace-LiteralSafe $projectsFile 'text-5xl font-black uppercase leading-[.88] sm:text-7xl' 'text-4xl font-black uppercase leading-[.92] sm:text-5xl lg:text-6xl'

$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"
Replace-LiteralSafe $servicesFile 'text-[clamp(3.7rem,7vw,7.6rem)]' 'text-[clamp(3rem,5.1vw,5.25rem)]'
Replace-LiteralSafe $servicesFile 'text-5xl font-black uppercase leading-[.9] sm:text-7xl' 'text-4xl font-black uppercase leading-[.92] sm:text-5xl lg:text-6xl'
Replace-LiteralSafe $servicesFile 'text-5xl font-black uppercase leading-[.9]' 'text-4xl font-black uppercase leading-[.92] sm:text-5xl'
Replace-LiteralSafe $servicesFile 'text-6xl font-black uppercase leading-[.86] sm:text-8xl' 'text-4xl font-black uppercase leading-[.91] sm:text-5xl lg:text-6xl'

$contactFile = Join-Path $repoRoot "components\site\formwork\contact.tsx"
Replace-LiteralSafe $contactFile 'text-[clamp(3.8rem,7vw,7.7rem)]' 'text-[clamp(3rem,5.1vw,5.25rem)]'
Replace-LiteralSafe $contactFile 'text-5xl font-black uppercase leading-[.9] sm:text-7xl' 'text-4xl font-black uppercase leading-[.92] sm:text-5xl lg:text-6xl'

Write-Host "[5/6] Menaikkan grid layanan homepage..." -ForegroundColor Yellow

$carouselFile = Join-Path $repoRoot "components\site\formwork\service-staggered-carousel.tsx"
Replace-LiteralSafe $carouselFile 'px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28' 'px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-20'
Replace-LiteralSafe $carouselFile 'text-[clamp(3.2rem,5.8vw,6.3rem)]' 'text-[clamp(2.55rem,4.5vw,4.65rem)]'
Replace-LiteralSafe $carouselFile 'mt-10 flex items-center justify-between gap-5 border-t' 'mt-7 flex items-center justify-between gap-5 border-t'
Replace-LiteralSafe $carouselFile 'mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-20 pt-20' 'mt-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-12 pt-12'
Replace-LiteralSafe $carouselFile 'min-h-[465px] w-[80vw]' 'min-h-[440px] w-[80vw]'
Replace-LiteralSafe $carouselFile 'min-h-[465px] flex-col' 'min-h-[440px] flex-col'
Replace-LiteralSafe $carouselFile 'h-[255px] overflow-hidden' 'h-[235px] overflow-hidden'
Replace-LiteralSafe $carouselFile 'isUpper ? "-translate-y-8" : "translate-y-8"' 'isUpper ? "-translate-y-4" : "translate-y-4"'
Replace-LiteralSafe $carouselFile 'text-[2rem] font-bold uppercase' 'text-[1.75rem] font-bold uppercase'

Write-Host "[6/6] Audit referensi public About/Team..." -ForegroundColor Yellow

$publicFiles = @(
    (Join-Path $repoRoot "components\site\formwork\header.tsx"),
    (Join-Path $repoRoot "components\site\formwork\home.tsx")
)

$foundIssue = $false

foreach ($file in $publicFiles) {
    if (-not (Test-Path $file)) {
        continue
    }

    $content = [System.IO.File]::ReadAllText($file)

    if ($content.Contains('href: "/about"') -or $content.Contains('href="/about"')) {
        Write-Warning "Masih ada link /about di: $file"
        $foundIssue = $true
    }

    if ((Split-Path -Leaf $file) -eq "home.tsx") {
        if ($content.Contains("data.team.map(teamModel)") -or $content.Contains("{/* TEAM")) {
            Write-Warning "Masih ada render Team di landing page: $file"
            $foundIssue = $true
        }
    }
}

if (-not $foundIssue) {
    Write-Host "  public About/Team sudah bersih." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Revisi v17 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "PENTING:" -ForegroundColor Cyan
Write-Host "  - About tidak lagi muncul di navbar."
Write-Host "  - Route /about dihapus."
Write-Host "  - Section anggota/tim di landing page dihapus."
Write-Host "  - Data Team di CMS/admin TIDAK dihapus, hanya tidak diekspos di public."
Write-Host ""
Write-Host "Sekarang jalankan:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Kalau semua lolos:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
