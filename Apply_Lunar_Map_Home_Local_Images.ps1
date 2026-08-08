Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) { Write-Host "[LOCAL MEDIA] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[LOCAL MEDIA] GAGAL: $Message" -ForegroundColor Red; exit 1 }
function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan script dari repository Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

$requiredSource = @(
  "components/site/formwork/home.tsx",
  "components/site/formwork/local-assets.ts"
)
$missingSource = @($requiredSource | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missingSource.Count -gt 0) {
  $missingSource | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Source formwork belum lengkap."
}

$requiredImages = @(
  "public/lunar-static/home-hero.jpg",
  "public/lunar-static/home-hero-engineer.jpg",
  "public/lunar-static/home-capability-structure.jpg",
  "public/lunar-static/home-capability-building.jpg",
  "public/lunar-static/home-capability-detail.jpg",
  "public/lunar-static/home-process-plan.jpg",
  "public/lunar-static/home-process-site.jpg"
)
$missingImages = @($requiredImages | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missingImages.Count -gt 0) {
  Write-Host "[LOCAL MEDIA] File berikut belum ditemukan:" -ForegroundColor Yellow
  $missingImages | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Pastikan nama file persis seperti daftar di atas."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/local-home-media-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
foreach ($item in $requiredSource) {
  $dest = Join-Path $backupRoot $item
  $parent = Split-Path -Parent $dest
  if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  Copy-Item -LiteralPath $item -Destination $dest -Force
}
Step "Backup dibuat di $backupRoot"

$localAssets = @'
export const LOCAL_MEDIA = {
  hero: "/lunar-static/home-hero.jpg",
  heroEngineer: "/lunar-static/home-hero-engineer.jpg",

  capabilityStructure: "/lunar-static/home-capability-structure.jpg",
  capabilityBuilding: "/lunar-static/home-capability-building.jpg",
  capabilityDetail: "/lunar-static/home-capability-detail.jpg",

  processPlanning: "/lunar-static/home-process-plan.jpg",
  processNote: "/lunar-static/home-process-site.jpg",

  aboutHero: "/lunar-static/formwork-about-placeholder.svg",
  servicesHero: "/lunar-static/formwork-services-placeholder.svg",
  projectsHero: "/lunar-static/formwork-projects-placeholder.svg",

  decorative: [
    "/lunar-static/home-capability-structure.jpg",
    "/lunar-static/home-capability-building.jpg",
    "/lunar-static/home-capability-detail.jpg",
    "/lunar-static/home-process-plan.jpg",
    "/lunar-static/home-process-site.jpg",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}
'@
Write-Utf8NoBom (Join-Path $repoRoot "components/site/formwork/local-assets.ts") $localAssets
Step "local-assets.ts dimapping ke 7 gambar Home."

$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$homeSource = [System.IO.File]::ReadAllText($homePath)

$replacements = @(
  @(
    'const heroImage = LOCAL_MEDIA\.hero \|\| projectImages\[0\] \|\| "";',
    'const heroImage = LOCAL_MEDIA.hero;'
  ),
  @(
    'const heroInset = projectImages\.find\(\(image\) => image && image !== heroImage\) \|\| teamImages\[0\] \|\| localMediaAt\(1\);',
    'const heroInset = LOCAL_MEDIA.heroEngineer;'
  ),
  @(
    'const capabilityPrimary = serviceImages\[0\] \|\| projectImages\[1\] \|\| localMediaAt\(2\);',
    'const capabilityPrimary = LOCAL_MEDIA.capabilityStructure;'
  ),
  @(
    'const capabilitySecondary = projectImages\.find\(\(image\) => image && image !== heroImage && image !== capabilityPrimary\) \|\| teamImages\[1\] \|\| localMediaAt\(3\);',
    'const capabilitySecondary = LOCAL_MEDIA.capabilityBuilding;'
  ),
  @(
    'const capabilityDetail = teamImages\.find\(\(image\) => image && image !== heroInset && image !== capabilitySecondary\) \|\| serviceImages\[1\] \|\| localMediaAt\(4\);',
    'const capabilityDetail = LOCAL_MEDIA.capabilityDetail;'
  )
)

foreach ($pair in $replacements) {
  $pattern = $pair[0]
  $replacement = $pair[1]
  if ([regex]::IsMatch($homeSource, $pattern)) {
    $homeSource = [regex]::Replace($homeSource, $pattern, $replacement, 1)
  }
}

# Remove now-unused image collections if those variables are no longer referenced.
$homeSource = $homeSource -replace '  const projectImages = distinctImages\(projects\);\r?\n', ''
$homeSource = $homeSource -replace '  const serviceImages = distinctImages\(services\);\r?\n', ''
$homeSource = $homeSource -replace '  const teamImages = distinctImages\(team\);\r?\n', ''
$homeSource = $homeSource -replace '  const hero = projects\[0\];\r?\n', ''
$homeSource = $homeSource -replace '  distinctImages,\r?\n', ''

Write-Utf8NoBom $homePath $homeSource
Step "Home sekarang memakai local storytelling images secara eksplisit."

Write-Host ""
Write-Host "[LOCAL MEDIA] SELESAI" -ForegroundColor Green
Write-Host "Hero                -> home-hero.jpg" -ForegroundColor Green
Write-Host "Hero inset           -> home-hero-engineer.jpg" -ForegroundColor Green
Write-Host "Capability structure -> home-capability-structure.jpg" -ForegroundColor Green
Write-Host "Capability building  -> home-capability-building.jpg" -ForegroundColor Green
Write-Host "Capability detail    -> home-capability-detail.jpg" -ForegroundColor Green
Write-Host "Process planning     -> home-process-plan.jpg" -ForegroundColor Green
Write-Host "Process site         -> home-process-site.jpg" -ForegroundColor Green
Write-Host ""
Write-Host "Project cards / Team / Services records tetap membaca media database masing-masing." -ForegroundColor Yellow
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
