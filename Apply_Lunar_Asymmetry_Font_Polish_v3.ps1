Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR POLISH] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR POLISH] GAGAL: $Message" -ForegroundColor Red
  exit 1
}

function Read-Text([string]$Path) {
  return [System.IO.File]::ReadAllText($Path)
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}

function Replace-Regex([string]$Content, [string]$Pattern, [string]$Replacement) {
  return [System.Text.RegularExpressions.Regex]::Replace(
    $Content,
    $Pattern,
    $Replacement,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )
}

function Replace-FirstRegex([string]$Content, [string]$Pattern, [string]$Replacement) {
  $regex = New-Object System.Text.RegularExpressions.Regex($Pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  return $regex.Replace($Content, $Replacement, 1)
}

function Backup-File([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath) {
  $source = Join-Path $RepoRoot $RelativePath
  if (-not (Test-Path -LiteralPath $source)) { return }
  $target = Join-Path $BackupRoot $RelativePath
  $targetParent = Split-Path -Parent $target
  if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) {
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
  }
  Copy-Item -LiteralPath $source -Destination $target -Force
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan script ini dari repository Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$targets = @(
  "components/site/formwork/decor.tsx",
  "components/site/formwork/home.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)

$missing = @($targets | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Beberapa file formwork tidak ditemukan."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/asymmetry-font-polish-v3-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
$targets | ForEach-Object { Backup-File $repoRoot $backupRoot $_ }
Step "Backup: $backupRoot"

# -----------------------------------------------------------------------------
# 1) Typography refresh
# -----------------------------------------------------------------------------
$decorPath = Join-Path $repoRoot "components/site/formwork/decor.tsx"
$decor = Read-Text $decorPath
$decor = Replace-Regex $decor "export const displayFont\s*=\s*[\s\S]*?;" "export const displayFont =`r`n  \"[font-family:'Oswald','Bebas_Neue','Haettenschweiler','Arial_Narrow',sans-serif] [font-variation-settings:'wght'_620]\";"
$decor = Replace-Regex $decor "export const bodyFont\s*=\s*[\s\S]*?;" "export const bodyFont =`r`n  \"[font-family:'Inter','Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]\";"
Write-Utf8NoBom $decorPath $decor
Step "Typography display/body diperbarui."

# -----------------------------------------------------------------------------
# 2) About hero: remove stray lower-left person image / circle block
# -----------------------------------------------------------------------------
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
$about = Read-Text $aboutPath
$aboutBefore = $about
$about = Replace-FirstRegex $about '<div className="absolute[^\"]*rounded-full[^\"]*">\s*<DatabaseImage[\s\S]*?<\/div>' ''
if ($about -ne $aboutBefore) {
  Step "Overlay foto orang di hero About dihapus."
}

# -----------------------------------------------------------------------------
# 3) Hero shells: make more asymmetric + less boxy
# -----------------------------------------------------------------------------
$pageConfigs = @(
  @{ Path = "components/site/formwork/home.tsx"; Marker = "CAPABILITY-AIRNOTE-01"; HeroShape = "[clip-path:polygon(10%_0%,85%_0%,100%_14%,100%_84%,88%_100%,16%_100%,0%_78%,0%_18%)]"; },
  @{ Path = "components/site/formwork/about.tsx"; Marker = "ABOUT-AIRNOTE-01"; HeroShape = "[clip-path:polygon(9%_0%,82%_0%,100%_10%,100%_78%,90%_96%,66%_100%,14%_94%,0%_74%,0%_18%)]"; },
  @{ Path = "components/site/formwork/services.tsx"; Marker = "SERVICES-AIRNOTE-01"; HeroShape = "[clip-path:polygon(14%_0%,80%_0%,100%_16%,96%_86%,82%_100%,12%_96%,0%_74%,2%_20%)]"; },
  @{ Path = "components/site/formwork/projects.tsx"; Marker = "PROJECTS-AIRNOTE-01"; HeroShape = "[clip-path:polygon(12%_0%,84%_0%,100%_12%,100%_72%,92%_100%,24%_100%,0%_82%,0%_16%)]"; },
  @{ Path = "components/site/formwork/contact.tsx"; Marker = "CONTACT-AIRNOTE-01"; HeroShape = "[clip-path:polygon(14%_0%,86%_0%,100%_18%,96%_86%,84%_100%,18%_96%,0%_76%,4%_18%)]"; }
)

foreach ($page in $pageConfigs) {
  $pagePath = Join-Path $repoRoot $page.Path
  $source = if ($page.Path -eq "components/site/formwork/about.tsx") { $about } else { Read-Text $pagePath }

  $source = Replace-FirstRegex $source 'className="absolute inset-y-\[[^\]]+\] right-\[[^\]]+\] w-\[[^\]]+\] overflow-hidden border border-\[\#d8d1c6\]\/70 bg-\[\#f5f1e8\] shadow-\[[^\]]+\] \[clip-path:polygon\([^\)]*\)\][^\"]*"' ('className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/70 bg-[#f5f1e8] shadow-[0_22px_56px_rgba(20,36,63,0.10)] ' + $page.HeroShape + '"')
  $source = Replace-FirstRegex $source 'className="absolute inset-y-\[[^\]]+\] right-\[[^\]]+\] w-\[[^\]]+\] overflow-visible[^\"]*"' ('className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/70 bg-[#f5f1e8] shadow-[0_22px_56px_rgba(20,36,63,0.10)] ' + $page.HeroShape + '"')
  $source = Replace-Regex $source 'className="h-full min-h-\[450px\] w-full object-cover object-center"' 'className="h-full min-h-[480px] w-full object-cover object-center"'
  $source = Replace-Regex $source 'className="h-\[[0-9]+px\] w-full object-cover object-center"' 'className="h-full min-h-[480px] w-full object-cover object-center"'

  Write-Utf8NoBom $pagePath $source
  if ($page.Path -eq "components/site/formwork/about.tsx") { $about = $source }
}
Step "Hero shell semua halaman dibuat lebih asimetris."

# -----------------------------------------------------------------------------
# 4) Add subtle filler note to reduce awkward empty space
# -----------------------------------------------------------------------------
$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$home = Read-Text $homePath

if ($home -notmatch 'CAPABILITY-AIRNOTE-01') {
  $home = Replace-FirstRegex $home '(<p className="mt-6 max-w-md text-sm leading-7 text-\[\#625e58\]">[\s\S]*?<\/p>)' '$1`r`n<div className="mt-6 hidden max-w-[260px] border border-[#ddd5c8] bg-[#f8f4ec] px-4 py-4 shadow-[0_10px_24px_rgba(20,36,63,0.05)] lg:block">{/* CAPABILITY-AIRNOTE-01 */}<MicroLabel>Field package / note</MicroLabel><p className="mt-3 text-[12px] leading-6 text-[#5f6976]">Scope tidak tampil sebagai daftar kosong. Ia dibaca sebagai paket kerja yang saling mengunci dari gambar kerja sampai eksekusi.</p></div>'
}

if ($home -notmatch 'PROJECT-INTRO-NOTE-01') {
  $home = Replace-FirstRegex $home '(<p className="max-w-xl text-sm leading-7 text-\[\#5f5b55\] lg:justify-self-end">[\s\S]*?<\/p>)' '$1`r`n<div className="hidden border border-[#ddd5c8] bg-[#f8f4ec] px-4 py-4 shadow-[0_10px_24px_rgba(20,36,63,0.05)] lg:block">{/* PROJECT-INTRO-NOTE-01 */}<MicroLabel>Register note</MicroLabel><p className="mt-3 max-w-[300px] text-[12px] leading-6 text-[#5f6976]">Setiap record diurutkan sebagai bukti keputusan, bukan sekadar galeri gambar. Karena itu blok register diberi konteks editorial yang lebih jelas.</p></div>'
}

Write-Utf8NoBom $homePath $home
Step "Area kosong Home diberi filler note yang ringan."

# -----------------------------------------------------------------------------
# 5) Improve section hero headings and body rhythm slightly
# -----------------------------------------------------------------------------
foreach ($relative in @(
  "components/site/formwork/home.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)) {
  $path = Join-Path $repoRoot $relative
  $content = Read-Text $path
  $content = Replace-Regex $content 'text-5xl font-black uppercase leading-\[\.92\] tracking-\[-\.04em\] sm:text-6xl(?: lg:text-7xl)?' 'text-[clamp(2.8rem,4.9vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]'
  $content = Replace-Regex $content 'text-sm leading-7 text-\[\#5f5b55\]' 'text-[15px] leading-8 text-[#5f6976]'
  Write-Utf8NoBom $path $content
}
Step "Heading dan body rhythm dipoles ulang."

# ensure about rewritten after section 5 changes from memory mismatch not needed.

Write-Host ""
Write-Host "[LUNAR POLISH] SELESAI." -ForegroundColor Green
Write-Host "  - foto orang bulat di hero About dihapus" -ForegroundColor Green
Write-Host "  - hero semua halaman dibuat lebih asimetris" -ForegroundColor Green
Write-Host "  - font display/body diganti" -ForegroundColor Green
Write-Host "  - ruang kosong Home dikasih note ringan" -ForegroundColor Green
Write-Host ""
Write-Host "Lanjutkan validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
