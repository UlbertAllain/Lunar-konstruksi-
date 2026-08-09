Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR POLISH V4] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR POLISH V4] GAGAL: $Message" -ForegroundColor Red
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

function Replace-FirstRegex([string]$Content, [string]$Pattern, [string]$Replacement) {
  $regex = [System.Text.RegularExpressions.Regex]::new(
    $Pattern,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )

  return $regex.Replace($Content, $Replacement, 1)
}

function Replace-AllRegex([string]$Content, [string]$Pattern, [string]$Replacement) {
  return [System.Text.RegularExpressions.Regex]::Replace(
    $Content,
    $Pattern,
    $Replacement,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )
}

function Insert-AfterFirstRegex([string]$Content, [string]$Pattern, [string]$Markup) {
  $regex = [System.Text.RegularExpressions.Regex]::new(
    $Pattern,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )

  $match = $regex.Match($Content)
  if (-not $match.Success) {
    return $Content
  }

  $insertAt = $match.Index + $match.Length
  return $Content.Substring(0, $insertAt) + "`r`n" + $Markup + $Content.Substring($insertAt)
}

function Backup-File([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath) {
  $sourcePath = Join-Path $RepoRoot $RelativePath
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    return
  }

  $targetPath = Join-Path $BackupRoot $RelativePath
  $targetParent = Split-Path -Parent $targetPath

  if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) {
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
  }

  Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
  Fail "Jalankan script ini dari repository Lunar Konstruksi."
}

$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$targetFiles = @(
  "components/site/formwork/decor.tsx",
  "components/site/formwork/home.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)

$missingFiles = @($targetFiles | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missingFiles.Count -gt 0) {
  $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Beberapa file Formwork tidak ditemukan."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/asymmetry-font-polish-v4-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
$targetFiles | ForEach-Object { Backup-File $repoRoot $backupRoot $_ }
Step "Backup: $backupRoot"

# =============================================================================
# 1. TYPOGRAPHY
# =============================================================================
$decorPath = Join-Path $repoRoot "components/site/formwork/decor.tsx"
$decorSource = Read-Text $decorPath

$displayFontReplacement = @'
export const displayFont =
  "[font-family:'Aptos_Display','Segoe_UI_Variable_Display','Helvetica_Neue',Arial,sans-serif] [font-stretch:92%]";
'@

$bodyFontReplacement = @'
export const bodyFont =
  "[font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]";
'@

$decorSource = Replace-FirstRegex $decorSource 'export const displayFont\s*=\s*[\s\S]*?;' $displayFontReplacement
$decorSource = Replace-FirstRegex $decorSource 'export const bodyFont\s*=\s*[\s\S]*?;' $bodyFontReplacement
Write-Utf8NoBom $decorPath $decorSource
Step "Font display diganti ke arah geometric/editorial yang lebih lega."

# =============================================================================
# 2. ABOUT HERO: REMOVE THE STRAY ROUND PEOPLE PHOTO
# =============================================================================
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
$aboutSource = Read-Text $aboutPath
$aboutOriginal = $aboutSource

$aboutSource = Replace-FirstRegex $aboutSource '<div className="absolute[^\"]*rounded-full[^\"]*">\s*<DatabaseImage[\s\S]*?<\/div>' ''

if ($aboutSource -ne $aboutOriginal) {
  Step "Foto orang bulat di kiri-bawah hero About dihapus."
}

Write-Utf8NoBom $aboutPath $aboutSource

# =============================================================================
# 3. STRONGER ASYMMETRIC HERO SHELLS
# =============================================================================
$pageConfigs = @(
  @{
    Path = "components/site/formwork/home.tsx"
    Shape = "[clip-path:polygon(9%_0%,81%_0%,100%_13%,100%_72%,92%_72%,84%_100%,19%_100%,0%_80%,0%_20%)]"
  },
  @{
    Path = "components/site/formwork/about.tsx"
    Shape = "[clip-path:polygon(10%_0%,78%_0%,100%_12%,100%_69%,91%_72%,82%_100%,17%_94%,0%_76%,0%_18%)]"
  },
  @{
    Path = "components/site/formwork/services.tsx"
    Shape = "[clip-path:polygon(15%_0%,76%_0%,100%_17%,95%_74%,100%_86%,82%_100%,18%_95%,0%_78%,3%_18%)]"
  },
  @{
    Path = "components/site/formwork/projects.tsx"
    Shape = "[clip-path:polygon(9%_0%,84%_0%,100%_10%,100%_74%,92%_100%,27%_100%,14%_93%,0%_79%,0%_17%)]"
  },
  @{
    Path = "components/site/formwork/contact.tsx"
    Shape = "[clip-path:polygon(14%_0%,84%_0%,100%_18%,95%_70%,100%_86%,83%_100%,17%_94%,0%_76%,4%_19%)]"
  }
)

foreach ($pageConfig in $pageConfigs) {
  $pagePath = Join-Path $repoRoot $pageConfig.Path
  $pageSource = Read-Text $pagePath

  $heroShellReplacement = 'className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] ' + $pageConfig.Shape + '"'

  $pageSource = Replace-FirstRegex $pageSource 'className="absolute inset-y-\[[^\]]+\] right-\[[^\]]+\] w-\[[^\]]+\] overflow-hidden[^\"]*\[clip-path:polygon\([^\)]*\)\][^\"]*"' $heroShellReplacement
  $pageSource = Replace-FirstRegex $pageSource 'className="absolute inset-y-\[[^\]]+\] right-\[[^\]]+\] w-\[[^\]]+\] overflow-visible[^\"]*"' $heroShellReplacement

  $pageSource = Replace-AllRegex $pageSource 'className="h-full min-h-\[450px\] w-full object-cover object-center"' 'className="h-full min-h-[500px] w-full object-cover object-center"'

  Write-Utf8NoBom $pagePath $pageSource
}
Step "Hero Home/About/Services/Projects/Contact dibuat lebih asimetris."

# =============================================================================
# 4. FILL AWKWARD EMPTY SPACE, BUT KEEP BREATHING ROOM
# =============================================================================
$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$homeSource = Read-Text $homePath

if ($homeSource -notmatch 'CAPABILITY-AIRNOTE-02') {
  $capabilityNote = @'
<div className="mt-7 hidden max-w-[290px] border-l border-[#dcb458] pl-4 lg:block">
  {/* CAPABILITY-AIRNOTE-02 */}
  <MicroLabel>Package logic / 02</MicroLabel>
  <p className="mt-3 text-[12px] leading-6 text-[#66717f]">
    Scope, gambar kerja, material, dan eksekusi dibaca sebagai satu jalur keputusan—bukan daftar layanan yang berdiri sendiri.
  </p>
</div>
'@

  $homeSource = Insert-AfterFirstRegex $homeSource '<p className="mt-6 max-w-md text-sm leading-7 text-\[\#625e58\]">[\s\S]*?<\/p>' $capabilityNote
}

if ($homeSource -notmatch 'PROJECT-INTRO-NOTE-02') {
  $projectNote = @'
<div className="hidden max-w-[310px] border-l border-[#dcb458] pl-4 lg:block">
  {/* PROJECT-INTRO-NOTE-02 */}
  <MicroLabel>Register logic / 03</MicroLabel>
  <p className="mt-3 text-[12px] leading-6 text-[#66717f]">
    Ruang kosong dipakai sebagai jeda, sementara metadata dan indeks menjaga section tetap terasa aktif tanpa menjadi penuh sesak.
  </p>
</div>
'@

  $homeSource = Insert-AfterFirstRegex $homeSource '<p className="max-w-xl text-sm leading-7 text-\[\#5f5b55\] lg:justify-self-end">[\s\S]*?<\/p>' $projectNote
}

Write-Utf8NoBom $homePath $homeSource
Step "Area kosong Home diberi technical note ringan, bukan card besar."

# =============================================================================
# 5. TYPOGRAPHIC RHYTHM
# =============================================================================
foreach ($relativePath in @(
  "components/site/formwork/home.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)) {
  $pagePath = Join-Path $repoRoot $relativePath
  $pageSource = Read-Text $pagePath

  $pageSource = Replace-AllRegex $pageSource 'text-5xl font-black uppercase leading-\[\.92\] tracking-\[-\.04em\] sm:text-6xl(?: lg:text-7xl)?' 'text-[clamp(2.7rem,4.7vw,5.35rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]'
  $pageSource = Replace-AllRegex $pageSource 'text-\[clamp\(2\.8rem,4\.9vw,5\.6rem\)\] font-black uppercase leading-\[0\.9\] tracking-\[-0\.045em\]' 'text-[clamp(2.7rem,4.7vw,5.35rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]'
  $pageSource = Replace-AllRegex $pageSource 'text-sm leading-7 text-\[\#5f5b55\]' 'text-[15px] leading-8 text-[#626d7a]'

  Write-Utf8NoBom $pagePath $pageSource
}
Step "Hierarchy heading/body dibuat sedikit lebih lega dan tidak terlalu berteriak."

Write-Host ""
Write-Host "[LUNAR POLISH V4] SELESAI." -ForegroundColor Green
Write-Host "  - v3 ParserError tidak memengaruhi source karena script lama gagal sebelum eksekusi" -ForegroundColor Green
Write-Host "  - foto orang bulat About dihapus" -ForegroundColor Green
Write-Host "  - hero dibuat lebih asimetris" -ForegroundColor Green
Write-Host "  - typography diganti" -ForegroundColor Green
Write-Host "  - empty space diberi note ringan" -ForegroundColor Green
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
