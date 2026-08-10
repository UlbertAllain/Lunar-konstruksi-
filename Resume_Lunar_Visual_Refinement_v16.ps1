# Lunar Konstruksi - Resume Visual Refinement v16
# Dipakai setelah Apply_Lunar_Visual_Refinement_v15.ps1 berhenti di step [6/7]
# karena variable PowerShell $HOME bersifat read-only.
#
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Resume_Lunar_Visual_Refinement_v16.ps1

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
        throw "File tidak ditemukan: $Path"
    }

    $content = [System.IO.File]::ReadAllText($Path)

    if ($content.Contains($Old)) {
        $content = $content.Replace($Old, $New)
        Write-Utf8NoBom -Path $Path -Content $content
        Write-Host "  updated: $(Split-Path -Leaf $Path)" -ForegroundColor DarkGray
        return
    }

    if ($content.Contains($New)) {
        Write-Host "  already applied: $(Split-Path -Leaf $Path)" -ForegroundColor DarkGray
        return
    }

    Write-Warning "Pattern tidak ditemukan pada $Path. Dilewati agar script tetap aman."
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
Write-Host "=== Lunar Konstruksi / Resume Visual Refinement v16 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Step [1/5] s.d. [5/7] dari v15 sudah berhasil dan TIDAK akan disentuh ulang." -ForegroundColor Green
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\resume-visual-refinement-v16-$timestamp"

$filesToBackup = @(
    "components\site\formwork\home.tsx",
    "components\site\formwork\about.tsx",
    "components\site\formwork\projects.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\contact.tsx",
    "components\site\formwork\service-staggered-carousel.tsx"
)

foreach ($relativePath in $filesToBackup) {
    $source = Join-Path $repoRoot $relativePath

    if (Test-Path $source) {
        $destination = Join-Path $backupRoot $relativePath
        $destinationDir = Split-Path -Parent $destination
        New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
        Copy-Item -Force $source $destination
    }
}

Write-Host "[6/7] Menyeimbangkan typography seluruh halaman publik..." -ForegroundColor Yellow

# NOTE:
# Jangan gunakan variable $home.
# PowerShell bersifat case-insensitive, sehingga $home == built-in $HOME
# dan $HOME adalah read-only pada environment tertentu.

$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
Replace-LiteralSafe $homeFile 'text-[clamp(3.4rem,6vw,6.4rem)]' 'text-[clamp(3rem,5.2vw,5.35rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3rem,4.7vw,5.3rem)]' 'text-[clamp(2.5rem,3.9vw,4.15rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(2.9rem,4.5vw,4.7rem)]' 'text-[clamp(2.4rem,3.6vw,3.75rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3rem,5vw,5.8rem)]' 'text-[clamp(2.5rem,4vw,4.35rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(2.9rem,4.7vw,5.3rem)]' 'text-[clamp(2.45rem,3.9vw,4.15rem)]'
Replace-LiteralSafe $homeFile 'text-[clamp(3.2rem,5.2vw,5.6rem)]' 'text-[clamp(2.55rem,4.1vw,4.35rem)]'

$aboutFile = Join-Path $repoRoot "components\site\formwork\about.tsx"
Replace-LiteralSafe $aboutFile 'text-[clamp(3.8rem,7vw,7.8rem)]' 'text-[clamp(3rem,5.1vw,5.35rem)]'
Replace-LiteralSafe $aboutFile 'text-5xl font-black uppercase leading-[.9] tracking-[-.045em] sm:text-7xl' 'text-4xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-5xl lg:text-6xl'
Replace-LiteralSafe $aboutFile 'text-5xl font-black uppercase leading-[.9] tracking-[-.04em] sm:text-7xl' 'text-4xl font-black uppercase leading-[.92] tracking-[-.04em] sm:text-5xl lg:text-6xl'
Replace-LiteralSafe $aboutFile 'text-6xl font-black uppercase leading-[.86] tracking-[-.05em] sm:text-8xl' 'text-4xl font-black uppercase leading-[.91] tracking-[-.04em] sm:text-5xl lg:text-6xl'

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

Write-Host ""
Write-Host "[7/7] Menaikkan grid layanan homepage dan mengurangi ruang kosong..." -ForegroundColor Yellow

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

Write-Host ""
Write-Host "=== Resume selesai ===" -ForegroundColor Green
Write-Host "Backup step 6-7: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Sekarang validasi project:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Kalau semuanya lolos:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Lalu cek visual browser sebelum commit." -ForegroundColor Cyan
Write-Host ""
