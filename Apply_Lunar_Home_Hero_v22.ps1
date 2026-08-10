# Lunar Konstruksi - Home Hero Proportion Fix v22
# Fokus: mengecilkan visual hero kanan tanpa mengubah aset/gaya desain.
#
# Jalankan dari root repo:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Home_Hero_v22.ps1

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

function Replace-Safe {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Old,
        [Parameter(Mandatory = $true)][string]$New,
        [string]$Label = "replacement"
    )

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

    Write-Warning "Pattern tidak ditemukan untuk: $Label"
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

if (-not (Test-Path $homeFile)) {
    throw "File tidak ditemukan: $homeFile"
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Home Hero Proportion v22 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\home-hero-v22-$timestamp"
$backupFile = Join-Path $backupRoot "components\site\formwork\home.tsx"
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupFile) | Out-Null
Copy-Item -Force $homeFile $backupFile

Write-Host "[1/1] Menyeimbangkan ukuran hero kanan..." -ForegroundColor Yellow

# Container hero:
# - desktop dibuat lebih pendek
# - kolom teks sedikit lebih luas supaya visual kanan tidak mendominasi
Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative mx-auto grid min-h-[760px] w-full max-w-[1480px] lg:grid-cols-[0.78fr_1.22fr] lg:min-h-[820px]"' `
    -New 'className="relative mx-auto grid min-h-[700px] w-full max-w-[1480px] lg:grid-cols-[0.9fr_1.1fr] lg:min-h-[740px]"' `
    -Label "hero overall proportion"

# Right visual container:
Replace-Safe `
    -Path $homeFile `
    -Old 'className="relative min-h-[530px] lg:min-h-full"' `
    -New 'className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-full"' `
    -Label "right visual container"

# Main abstract hero image:
# sebelumnya 108% width dan keluar ke kanan -7%, sekarang 90% dan center-right.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="absolute inset-y-[5%] right-[-7%] w-[108%] overflow-hidden"' `
    -New 'className="absolute inset-y-[10%] right-[1%] w-[90%] overflow-hidden lg:inset-y-[9%] lg:right-[2%] lg:w-[91%]"' `
    -Label "main hero image size"

# Remove extra scale that was enlarging the image.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="h-full w-full scale-[1.03] object-cover object-center mix-blend-multiply"' `
    -New 'className="h-full w-full object-cover object-center mix-blend-multiply"' `
    -Label "main image inner scale"

# Smaller engineer inset so it becomes detail, not second competing hero.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="absolute bottom-[8%] left-[1%] z-20 hidden h-[230px] w-[255px] overflow-hidden border-[7px] border-[#f5f1e8] bg-[#f8f4ec] shadow-[0_20px_50px_rgba(20,36,63,0.12)] sm:block lg:left-[3%] lg:h-[265px] lg:w-[292px]"' `
    -New 'className="absolute bottom-[10%] left-[5%] z-20 hidden h-[185px] w-[205px] overflow-hidden border-[6px] border-[#f5f1e8] bg-[#f8f4ec] shadow-[0_20px_50px_rgba(20,36,63,0.12)] sm:block lg:left-[7%] lg:h-[215px] lg:w-[238px]"' `
    -Label "engineer inset"

# Small technical note: reduce slightly and reposition.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="absolute right-[3%] top-[12%] z-20 hidden w-[205px] -rotate-[3deg] border border-[#ded5c7] bg-[#faf7f0]/95 px-4 py-4 shadow-[0_18px_44px_rgba(20,36,63,0.10)] lg:block"' `
    -New 'className="absolute right-[4%] top-[14%] z-20 hidden w-[188px] -rotate-[3deg] border border-[#ded5c7] bg-[#faf7f0]/95 px-4 py-3.5 shadow-[0_18px_44px_rgba(20,36,63,0.10)] lg:block"' `
    -Label "technical note"

# Decorative curve scales down with hero.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="pointer-events-none absolute bottom-[5%] right-[2%] hidden h-[250px] w-[78%] overflow-visible lg:block"' `
    -New 'className="pointer-events-none absolute bottom-[7%] right-[4%] hidden h-[205px] w-[68%] overflow-visible lg:block"' `
    -Label "decorative curve"

# Metrics are moved in a little so they do not feel detached.
Replace-Safe `
    -Path $homeFile `
    -Old 'className="absolute bottom-[5%] right-[4%] hidden grid-cols-3 gap-6 xl:grid"' `
    -New 'className="absolute bottom-[6%] right-[7%] hidden grid-cols-3 gap-5 xl:grid"' `
    -Label "hero metrics"

Write-Host ""
Write-Host "=== v22 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Perubahan:" -ForegroundColor Cyan
Write-Host "  - gambar hero kanan: 108% -> ~90%"
Write-Host "  - overflow kanan: -7% -> +2%"
Write-Host "  - tinggi hero desktop: 820px -> 740px"
Write-Host "  - split kolom: 0.78/1.22 -> 0.9/1.1"
Write-Host "  - engineer inset dan ornamen ikut diperkecil"
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
Write-Host ""
