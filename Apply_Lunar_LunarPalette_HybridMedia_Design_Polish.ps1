Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) { Write-Host "[LUNAR POLISH] $Message" -ForegroundColor Cyan }
function Warn([string]$Message) { Write-Host "[LUNAR POLISH] $Message" -ForegroundColor Yellow }
function Fail([string]$Message) { Write-Host "[LUNAR POLISH] GAGAL: $Message" -ForegroundColor Red; exit 1 }
function Ensure-Parent([string]$Path) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
}
function Write-Utf8NoBom([string]$Path, [string]$Content) {
  Ensure-Parent $Path
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}
function Read-Text([string]$Path) {
  return [System.IO.File]::ReadAllText($Path)
}
function Replace-Literal([string]$Content, [string]$From, [string]$To) {
  return $Content.Replace($From, $To)
}
function Ensure-Import([string]$Content, [string]$ImportLine, [string]$Anchor) {
  if ($Content.Contains($ImportLine)) { return $Content }
  if ($Content.Contains($Anchor)) { return $Content.Replace($Anchor, "$Anchor`r`n$ImportLine") }
  return "$ImportLine`r`n$Content"
}
function Resolve-Asset([string[]]$Bases, [string]$Fallback) {
  $extensions = @(".png", ".jpg", ".jpeg", ".webp", ".avif")
  foreach ($base in $Bases) {
    foreach ($ext in $extensions) {
      $diskPath = Join-Path $repoRoot ("public/lunar-static/" + $base + $ext)
      if (Test-Path -LiteralPath $diskPath) {
        return "/lunar-static/$base$ext"
      }
    }
  }
  return $Fallback
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan script dari repository Git Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

Step "Repo: $repoRoot"

$required = @(
  "components/site/formwork/home.tsx",
  "components/site/formwork/decor.tsx",
  "components/site/formwork/header.tsx",
  "components/site/formwork/footer.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)
$missing = @($required | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Frontend Form / Work belum ada di working tree lokal. Repo GitHub main masih lebih lama daripada frontend pada screenshot-mu; jalankan patch ini pada folder lokal Lunar yang sudah memakai components/site/formwork."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/lunar-palette-hybrid-media-$stamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
$backupTargets = @("components/site/formwork", "components/site/site-header.tsx", "components/site/site-footer.tsx")
foreach ($target in $backupTargets) {
  if (Test-Path -LiteralPath $target) {
    $dest = Join-Path $backupRoot $target
    Ensure-Parent $dest
    Copy-Item -LiteralPath $target -Destination $dest -Recurse -Force
  }
}
Step "Backup: $backupRoot"

# -----------------------------------------------------------------------------
# 1. Resolve static art-direction assets.
#    Canonical names are preferred; known ChatGPT-generated aliases are accepted.
# -----------------------------------------------------------------------------
$hero = Resolve-Asset @("home-hero", "blueprints_beneath_the_rising_crane") "/lunar-static/formwork-hero-placeholder.svg"
$heroEngineer = Resolve-Asset @("home-hero-engineer", "architectural_blueprint_construction_collage") "/lunar-static/formwork-detail-01.svg"
$capStructure = Resolve-Asset @("home-capability-structure", "blueprints_of_a_concrete_construction_site") "/lunar-static/formwork-detail-02.svg"
$capBuilding = Resolve-Asset @("home-capability-building") "/lunar-static/formwork-detail-03.svg"
$capDetail = Resolve-Asset @("home-capability-detail") "/lunar-static/formwork-detail-04.svg"
$processPlan = Resolve-Asset @("home-process-plan", "architect_s_blueprint_collage_workspace") "/lunar-static/formwork-process-planning.svg"
$processSite = Resolve-Asset @("home-process-site", "architectural_blueprint_construction_scene") "/lunar-static/formwork-site-note.svg"
$aboutHero = Resolve-Asset @("about-hero", "architectural_collaboration_at_the_construction_si") "/lunar-static/formwork-about-placeholder.svg"
$servicesHero = Resolve-Asset @("services-hero", "blueprint_construction_montage") "/lunar-static/formwork-services-placeholder.svg"
$projectsHero = Resolve-Asset @("projects-hero") "/lunar-static/formwork-projects-placeholder.svg"
$contactHero = Resolve-Asset @("contact-hero") $processPlan

$resolved = [ordered]@{
  "Home hero" = $hero
  "Home hero engineer" = $heroEngineer
  "Capability structure" = $capStructure
  "Capability building" = $capBuilding
  "Capability detail" = $capDetail
  "Process planning" = $processPlan
  "Process site" = $processSite
  "About hero" = $aboutHero
  "Services hero" = $servicesHero
  "Projects hero" = $projectsHero
  "Contact hero" = $contactHero
}
Step "Static visual mapping:"
foreach ($item in $resolved.GetEnumerator()) {
  $isPlaceholder = $item.Value -like "*placeholder*" -or $item.Value -like "*formwork-detail*" -or $item.Value -like "*formwork-process*" -or $item.Value -like "*formwork-site-note*"
  if ($isPlaceholder) { Warn ("  {0,-24} -> {1}" -f $item.Key, $item.Value) }
  else { Write-Host ("  {0,-24} -> {1}" -f $item.Key, $item.Value) -ForegroundColor Green }
}

$localAssets = @"
export const LOCAL_MEDIA = {
  hero: "$hero",
  heroEngineer: "$heroEngineer",

  capabilityStructure: "$capStructure",
  capabilityBuilding: "$capBuilding",
  capabilityDetail: "$capDetail",

  processPlanning: "$processPlan",
  processNote: "$processSite",

  aboutHero: "$aboutHero",
  servicesHero: "$servicesHero",
  projectsHero: "$projectsHero",
  contactHero: "$contactHero",

  decorative: [
    "$capStructure",
    "$capBuilding",
    "$capDetail",
    "$processPlan",
    "$processSite",
  ] as string[],
};

export function localMediaAt(index: number) {
  if (!LOCAL_MEDIA.decorative.length) return "";
  return LOCAL_MEDIA.decorative[index % LOCAL_MEDIA.decorative.length] ?? "";
}
"@
Write-Utf8NoBom (Join-Path $repoRoot "components/site/formwork/local-assets.ts") $localAssets
Step "local-assets.ts dikunci sebagai art-direction lokal."

# -----------------------------------------------------------------------------
# 2. Home media contract: local visuals never borrow Project/Service/Team media.
# -----------------------------------------------------------------------------
$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$homeSource = Read-Text $homePath

$homeSource = [regex]::Replace($homeSource, 'const heroImage\s*=\s*[^;]+;', 'const heroImage = LOCAL_MEDIA.hero;', 1)
$homeSource = [regex]::Replace($homeSource, 'const heroInset\s*=\s*[^;]+;', 'const heroInset = LOCAL_MEDIA.heroEngineer;', 1)
$homeSource = [regex]::Replace($homeSource, 'const capabilityPrimary\s*=\s*[^;]+;', 'const capabilityPrimary = LOCAL_MEDIA.capabilityStructure;', 1)
$homeSource = [regex]::Replace($homeSource, 'const capabilitySecondary\s*=\s*[^;]+;', 'const capabilitySecondary = LOCAL_MEDIA.capabilityBuilding;', 1)
$homeSource = [regex]::Replace($homeSource, 'const capabilityDetail\s*=\s*[^;]+;', 'const capabilityDetail = LOCAL_MEDIA.capabilityDetail;', 1)
$homeSource = [regex]::Replace($homeSource, 'const processPrimary\s*=\s*[^;]+;', 'const processPrimary = LOCAL_MEDIA.processPlanning;', 1)
$homeSource = [regex]::Replace($homeSource, 'const processSecondary\s*=\s*[^;]+;', 'const processSecondary = LOCAL_MEDIA.processNote;', 1)

# Remove media pools that become unused after hard mapping.
$homeSource = $homeSource -replace '(?m)^\s*const projectImages = distinctImages\(projects\);\r?\n', ''
$homeSource = $homeSource -replace '(?m)^\s*const serviceImages = distinctImages\(services\);\r?\n', ''
$homeSource = $homeSource -replace '(?m)^\s*const teamImages = distinctImages\(team\);\r?\n', ''
$homeSource = $homeSource -replace '(?m)^\s*distinctImages,\r?\n', ''

# Let generated editorial art breathe; avoid over-cropping the main static cover.
$homeSource = $homeSource -replace 'src=\{heroImage\}([\s\S]{0,220}?)className="h-full w-full object-cover"', 'src={heroImage}$1className="h-full w-full object-contain"'

Write-Utf8NoBom $homePath $homeSource
Step "Home sekarang memakai hybrid media contract yang tegas."

# -----------------------------------------------------------------------------
# 3. Static page covers. Dynamic cards remain database-driven.
# -----------------------------------------------------------------------------
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
$about = Read-Text $aboutPath
$about = Ensure-Import $about 'import { LOCAL_MEDIA } from "./local-assets";' 'import { FormworkHeader } from "./header";'
$about = $about.Replace('src={project?.image ?? ""}', 'src={LOCAL_MEDIA.aboutHero}')
$about = $about -replace 'src=\{LOCAL_MEDIA\.aboutHero\}([^>]*?)className="h-\[500px\] w-full object-cover"', 'src={LOCAL_MEDIA.aboutHero}$1className="h-[500px] w-full object-contain"'
Write-Utf8NoBom $aboutPath $about

$servicesPath = Join-Path $repoRoot "components/site/formwork/services.tsx"
$services = Read-Text $servicesPath
$services = Ensure-Import $services 'import { LOCAL_MEDIA } from "./local-assets";' 'import { FormworkHeader } from "./header";'
$services = $services.Replace('src={services[0]?.image || projects[0]?.image || ""}', 'src={LOCAL_MEDIA.servicesHero}')
$services = $services -replace 'src=\{LOCAL_MEDIA\.servicesHero\}([^>]*?)className="h-\[460px\] w-full object-cover"', 'src={LOCAL_MEDIA.servicesHero}$1className="h-[460px] w-full object-contain"'
# projects collection was only a hero fallback in this component.
$services = $services -replace '(?m)^\s*const projects = data\.projects\.map\(projectModel\);\r?\n', ''
$services = $services.Replace('import { faqModel, projectModel, serviceModel, type SiteData } from "./data";', 'import { faqModel, serviceModel, type SiteData } from "./data";')
Write-Utf8NoBom $servicesPath $services

$projectsPath = Join-Path $repoRoot "components/site/formwork/projects.tsx"
$projectsSource = Read-Text $projectsPath
$projectsSource = Ensure-Import $projectsSource 'import { LOCAL_MEDIA } from "./local-assets";' 'import { FormworkHeader } from "./header";'
$projectsSource = $projectsSource.Replace('src={hero?.image ?? ""}', 'src={LOCAL_MEDIA.projectsHero}')
$projectsSource = $projectsSource -replace 'src=\{LOCAL_MEDIA\.projectsHero\}([^>]*?)className="h-\[470px\] w-full object-cover"', 'src={LOCAL_MEDIA.projectsHero}$1className="h-[470px] w-full object-contain"'
Write-Utf8NoBom $projectsPath $projectsSource

$contactPath = Join-Path $repoRoot "components/site/formwork/contact.tsx"
$contact = Read-Text $contactPath
$contact = Ensure-Import $contact 'import { LOCAL_MEDIA } from "./local-assets";' 'import { FormworkHeader } from "./header";'
$contact = $contact.Replace('src={project?.image ?? ""}', 'src={LOCAL_MEDIA.contactHero}')
$contact = $contact -replace 'src=\{LOCAL_MEDIA\.contactHero\}([^>]*?)className="h-\[450px\] w-full object-cover"', 'src={LOCAL_MEDIA.contactHero}$1className="h-[450px] w-full object-contain"'
$contact = $contact -replace '(?m)^\s*const project = data\.projects\.map\(projectModel\)\[0\];\r?\n', ''
$contact = $contact.Replace('import { projectModel, type SiteData } from "./data";', 'import { type SiteData } from "./data";')
Write-Utf8NoBom $contactPath $contact
Step "Page cover About / Services / Projects / Contact dikunci ke local art."

# -----------------------------------------------------------------------------
# 4. Lunar logo palette across the Form / Work public design.
#    Approx. sampled palette: Navy #182D4D, Slate #727D8E, Gold #DCB458.
# -----------------------------------------------------------------------------
$paletteMap = [ordered]@{
  '#e36c2f' = '#dcb458'
  '#e8915f' = '#e5c775'
  '#f2eee7' = '#f5f1e8'
  '#f4efe7' = '#f8f4ec'
  '#f3efe7' = '#f8f4ec'
  '#eee9e1' = '#efeae1'
  '#ebe5da' = '#ece7df'
  '#d9d3c9' = '#d9d4ca'
  '#d8d2c8' = '#ddd8cf'
  '#d8d1c6' = '#d9d4ca'
  '#cfc8bd' = '#cfcac1'
  '#bbb4aa' = '#c0bbb2'
  '#22292a' = '#182d4d'
  '#202829' = '#182d4d'
  '#1f282a' = '#182d4d'
  '#172124' = '#14243f'
  '#162023' = '#101f37'
  '#2a3031' = '#263b58'
  '#31393a' = '#354963'
  '#474c4b' = '#526174'
  '#4f514e' = '#566476'
  '#50514e' = '#566476'
  '#4c504e' = '#566476'
  '#5e5a54' = '#657184'
  '#5e5953' = '#657184'
  '#5f5b55' = '#657184'
  '#625e58' = '#657184'
  '#65605a' = '#657184'
  '#68645e' = '#707b8c'
  '#6c6760' = '#707b8c'
  '#77716a' = '#7c8592'
  '#817b72' = '#848d99'
}

$formworkFiles = Get-ChildItem -LiteralPath (Join-Path $repoRoot "components/site/formwork") -File -Recurse | Where-Object { $_.Extension -in @('.ts', '.tsx') }
foreach ($file in $formworkFiles) {
  $content = Read-Text $file.FullName
  foreach ($pair in $paletteMap.GetEnumerator()) {
    $content = Replace-Literal $content $pair.Key $pair.Value
  }
  Write-Utf8NoBom $file.FullName $content
}
Step "Palette Form / Work dipindah dari orange-charcoal ke Lunar navy-slate-gold."

# Decor is intentionally rewritten so blueprint and technical arcs use one consistent system.
$decor = @'
import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.09] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(24,45,77,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(24,45,77,.12) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}

export function TechnicalArc({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div className="h-full w-full rounded-full border border-[#dcb458]/75" />
      <span className="absolute left-[8%] top-[46%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dcb458]" />
      <span className="absolute bottom-[15%] right-[16%] h-2 w-2 rounded-full bg-[#dcb458]" />
    </div>
  );
}

export function MicroLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[8px] font-medium uppercase tracking-[0.16em] text-[#707b8c] ${className}`}>
      {children}
    </span>
  );
}

export const displayFont =
  "[font-family:'Bahnschrift_Condensed','Arial_Narrow','Roboto_Condensed','Helvetica_Neue_Condensed',Arial,sans-serif] [font-stretch:condensed]";
'@
Write-Utf8NoBom (Join-Path $repoRoot "components/site/formwork/decor.tsx") $decor

# -----------------------------------------------------------------------------
# 5. A small manifest so future asset replacement is obvious.
# -----------------------------------------------------------------------------
$manifest = @'
# Lunar local art-direction assets

Static images in this folder are DESIGN ASSETS, not database content.

Preferred filenames (PNG/JPG/JPEG/WEBP/AVIF are all accepted by the installer):

- home-hero
- home-hero-engineer
- home-capability-structure
- home-capability-building
- home-capability-detail
- home-process-plan
- home-process-site
- about-hero
- services-hero
- projects-hero
- contact-hero (optional; if absent the contact page uses home-process-plan)

Media contract:
- Local art: hero / page cover / capability storytelling / process storytelling
- Firestore + Cloudinary: Project cards / Service cards / Team / Testimonials
- Never borrow Team/Project/Service images for unrelated decorative slots.

Palette:
- Deep navy: #182D4D
- Dark navy: #14243F
- Slate: #727D8E
- Muted gold: #DCB458
- Warm paper: #F5F1E8
'@
Write-Utf8NoBom (Join-Path $repoRoot "public/lunar-static/README-LUNAR-ASSETS.md") $manifest

Write-Host ""
Write-Host "[LUNAR POLISH] SELESAI" -ForegroundColor Green
Write-Host "- Art-direction lokal dipisahkan tegas dari media database." -ForegroundColor Green
Write-Host "- Cover Home/About/Services/Projects/Contact memakai local assets." -ForegroundColor Green
Write-Host "- Project/Service/Team/Testimonial tetap memakai record database." -ForegroundColor Green
Write-Host "- Warna frontend diselaraskan ke palette logo Lunar." -ForegroundColor Green
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  git diff --check"
Write-Host "  npm run dev"
