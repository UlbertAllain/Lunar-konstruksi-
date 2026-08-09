Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) { Write-Host "[LUNAR FLOW] $Message" -ForegroundColor Cyan }
function Warn([string]$Message) { Write-Host "[LUNAR FLOW] $Message" -ForegroundColor Yellow }
function Fail([string]$Message) { Write-Host "[LUNAR FLOW] GAGAL: $Message" -ForegroundColor Red; exit 1 }
function Ensure-Parent([string]$Path) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
}
function Read-Text([string]$Path) { [System.IO.File]::ReadAllText($Path) }
function Write-Utf8NoBom([string]$Path, [string]$Content) {
  Ensure-Parent $Path
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}
function Replace-Literal([string]$Content, [string]$From, [string]$To) {
  return $Content.Replace($From, $To)
}
function Replace-Regex([string]$Content, [string]$Pattern, [string]$Replacement) {
  return [regex]::Replace($Content, $Pattern, $Replacement)
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan dari repository Git Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$required = @(
  "components/site/formwork/decor.tsx",
  "components/site/formwork/home.tsx",
  "components/site/formwork/about.tsx",
  "components/site/formwork/services.tsx",
  "components/site/formwork/projects.tsx",
  "components/site/formwork/contact.tsx"
)
$missing = @($required | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Frontend Formwork yang aktif tidak lengkap."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/typography-technical-flow-$stamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
Copy-Item -LiteralPath "components/site/formwork" -Destination (Join-Path $backupRoot "formwork") -Recurse -Force
Step "Backup: $backupRoot"

# -----------------------------------------------------------------------------
# 1. Fix runtime error + stale Contact references.
# -----------------------------------------------------------------------------
$contactPath = Join-Path $repoRoot "components/site/formwork/contact.tsx"
$contact = Read-Text $contactPath
$contact = Replace-Regex $contact 'alt=\{project\?\.title\s*\?\?\s*"Lunar Konstruksi"\}' 'alt="Lunar Konstruksi — konsultasi proyek"'
$contact = Replace-Regex $contact 'alt=\{project\?\.title\s*\|\|\s*"Lunar Konstruksi"\}' 'alt="Lunar Konstruksi — konsultasi proyek"'
$contact = Replace-Regex $contact '(?m)^\s*const project\s*=.*?;\r?\n' ''
$contact = Replace-Regex $contact 'projectModel,\s*' ''
$contact = Replace-Regex $contact ',\s*projectModel' ''
Write-Utf8NoBom $contactPath $contact
Step "Runtime Contact diperbaiki: tidak ada referensi project yang sudah dihapus."

# -----------------------------------------------------------------------------
# 2. Rewrite technical decoration system.
#    TechnicalArc stays as compatibility name, but is no longer a circle.
# -----------------------------------------------------------------------------
$decor = @'
import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(24,45,77,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(24,45,77,.10) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "linear-gradient(to bottom, black, rgba(0,0,0,.72) 58%, transparent 100%)",
      }}
    />
  );
}

type TechnicalArcProps = {
  className?: string;
  label?: string;
};

/**
 * Compatibility name retained because the existing pages import TechnicalArc.
 * Visually this is now a free-form construction route / alignment spline,
 * not a decorative circle.
 */
export function TechnicalArc({ className = "", label = "GRID / ALIGN" }: TechnicalArcProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg
        viewBox="0 0 620 420"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <path
          d="M18 332 C96 188 168 344 258 232 C344 124 410 76 476 128 C525 166 553 143 604 74"
          stroke="#dcb458"
          strokeWidth="1.35"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M28 348 C104 214 177 365 271 250 C359 142 421 96 486 145 C529 177 560 157 610 96"
          stroke="#182d4d"
          strokeOpacity="0.22"
          strokeWidth="0.75"
          strokeDasharray="5 11"
          vectorEffect="non-scaling-stroke"
        />

        <g stroke="#dcb458" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M93 226 l-8 -7 M93 226 l-3 10" />
          <path d="M258 232 l-8 -8 M258 232 l-1 11" />
          <path d="M477 128 l-8 -8 M477 128 l1 11" />
        </g>

        <circle cx="93" cy="226" r="4.5" fill="#dcb458" />
        <circle cx="258" cy="232" r="3.5" fill="#f5f1e8" stroke="#dcb458" strokeWidth="1.4" />
        <circle cx="477" cy="128" r="4" fill="#dcb458" />
        <circle cx="604" cy="74" r="2.8" fill="#182d4d" />

        <g fill="#657184" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" letterSpacing="1.5">
          <text x="104" y="216">01</text>
          <text x="270" y="252">REF</text>
          <text x="488" y="118">+00</text>
          <text x="336" y="206">{label}</text>
        </g>
      </svg>
    </div>
  );
}

export function MicroLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-[#657184] ${className}`}
    >
      {children}
    </span>
  );
}

export const displayFont =
  "[font-family:'Bahnschrift','Arial_Narrow','Roboto_Condensed','Helvetica_Neue_Condensed',Arial,sans-serif] [font-stretch:75%] [font-variation-settings:'wdth'_72,'wght'_720]";

export const bodyFont =
  "[font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]";
'@
Write-Utf8NoBom (Join-Path $repoRoot "components/site/formwork/decor.tsx") $decor
Step "Lingkaran technical diganti menjadi spline/route yang terstruktur."

# -----------------------------------------------------------------------------
# 3. Typography + page rhythm + art breathing.
# -----------------------------------------------------------------------------
$formworkFiles = Get-ChildItem -LiteralPath (Join-Path $repoRoot "components/site/formwork") -Filter "*.tsx" -File
foreach ($file in $formworkFiles) {
  $content = Read-Text $file.FullName

  # Public page body typography.
  $content = Replace-Regex $content 'className="overflow-hidden bg-\[\#f5f1e8\] text-\[\#182d4d\]"' 'className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:''Aptos'',''Segoe_UI_Variable_Text'',''Segoe_UI'',Arial,sans-serif]"'
  $content = Replace-Regex $content 'className="overflow-hidden bg-\[\#f2eee7\] text-\[\#22292a\]"' 'className="overflow-hidden bg-[#f2eee7] text-[#22292a] [font-family:''Aptos'',''Segoe_UI_Variable_Text'',''Segoe_UI'',Arial,sans-serif]"'

  # Static editorial artwork already contains its own composition. Let it breathe.
  $content = Replace-Regex $content '(src=\{LOCAL_MEDIA\.(?:hero|aboutHero|servicesHero|projectsHero|contactHero)\}[^>]*?className=")([^"]*?)object-contain([^"]*")' '$1$2object-contain mix-blend-multiply$3'

  Write-Utf8NoBom $file.FullName $content
}

# Hero masks: generated local artwork is already a complete editorial composition.
# Remove the second decorative blob layer around it.
$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$home = Read-Text $homePath
$home = Replace-Regex $home 'className="absolute inset-y-\[4%\] right-0 w-\[92%\] overflow-hidden \[border-bottom-left-radius:[^"]+"' 'className="absolute inset-y-[3%] right-[-4%] w-[104%] overflow-visible lg:w-[106%]"'
$home = Replace-Regex $home 'className="absolute inset-y-\[3%\] right-\[-4%\] w-\[104%\] overflow-hidden [^"]+"' 'className="absolute inset-y-[3%] right-[-4%] w-[104%] overflow-visible lg:w-[106%]"'
$home = Replace-Literal $home '<TechnicalArc className="bottom-[-5%] left-[20%] hidden h-[360px] w-[520px] rotate-[11deg] lg:block" />' '<TechnicalArc label="FIELD / STRUCTURE" className="bottom-[-2%] left-[17%] hidden h-[340px] w-[560px] rotate-[5deg] lg:block" />'
$home = Replace-Literal $home '<TechnicalArc className="left-[25%] top-[14%] h-[500px] w-[520px] rotate-[30deg] opacity-65" />' '<TechnicalArc label="SHOP / DETAIL" className="left-[23%] top-[17%] h-[420px] w-[560px] rotate-[18deg] opacity-70" />'

# Section numbering creates an actual editorial information system instead of loose labels.
$home = Replace-Literal $home 'General contracting / field coordination' '01 / General contracting / field coordination'
$home = Replace-Literal $home 'Capabilities / field package' '02 / Capabilities / field package'
$home = Replace-Literal $home 'Selected work / project register' '03 / Selected work / project register'
$home = Replace-Literal $home 'Site sequence / work logic' '04 / Site sequence / work logic'
$home = Replace-Literal $home 'Control / tolerance / handover' '05 / Control / tolerance / handover'
$home = Replace-Literal $home 'Field crew / personnel' '06 / Field crew / personnel'
$home = Replace-Literal $home 'Field memo / client record' '07 / Field memo / client record'
$home = Replace-Literal $home 'Closing note / next project' '08 / Closing note / next project'
Write-Utf8NoBom $homePath $home

$pageSpecs = @(
  @{ Path = "components/site/formwork/about.tsx"; HeroWidth = "78"; Label = "TEAM / FIELD"; Prefix = "A-01 / " },
  @{ Path = "components/site/formwork/services.tsx"; HeroWidth = "82"; Label = "SCOPE / FLOW"; Prefix = "S-01 / " },
  @{ Path = "components/site/formwork/projects.tsx"; HeroWidth = "86"; Label = "WORK / ARCHIVE"; Prefix = "P-01 / " },
  @{ Path = "components/site/formwork/contact.tsx"; HeroWidth = "84"; Label = "BRIEF / INTAKE"; Prefix = "C-01 / " }
)

foreach ($spec in $pageSpecs) {
  $path = Join-Path $repoRoot $spec.Path
  $content = Read-Text $path

  # Remove redundant organic clipping around already-composed local artwork.
  $content = Replace-Regex $content ('className="absolute right-0 top-0 w-\[' + $spec.HeroWidth + '%\] overflow-hidden \[border-radius:[^"]+"') 'className="absolute inset-y-0 right-[-3%] w-[94%] overflow-visible"'
  $content = Replace-Regex $content 'className="absolute right-0 top-0 w-\[(?:78|82|84|86)%\] overflow-hidden \[border-radius:[^"]+"' 'className="absolute inset-y-0 right-[-3%] w-[94%] overflow-visible"'

  # First hero spline gets a context-aware label.
  $heroArcRegex = New-Object System.Text.RegularExpressions.Regex('<TechnicalArc\s+className="([^"]+)"\s*/>')
  $content = $heroArcRegex.Replace(
    $content,
    ('<TechnicalArc label="' + $spec.Label + '" className="$1" />'),
    1
  )

  # Prefix the first micro-label, making each page feel like a dossier rather than a loose landing page.
  $microLabelRegex = New-Object System.Text.RegularExpressions.Regex('<MicroLabel>([^<]+)</MicroLabel>')
  $content = $microLabelRegex.Replace(
    $content,
    ('<MicroLabel>' + $spec.Prefix + '$1</MicroLabel>'),
    1
  )

  Write-Utf8NoBom $path $content
}

# About has a second large decorative line in its CTA; label that separately.
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
$about = Read-Text $aboutPath
$about = Replace-Literal $about '<TechnicalArc className="-bottom-[310px] left-[-12%] h-[540px] w-[120%]" />' '<TechnicalArc label="NEXT / PROJECT" className="-bottom-[250px] left-[-7%] h-[470px] w-[112%]" />'
Write-Utf8NoBom $aboutPath $about

# -----------------------------------------------------------------------------
# 4. Header typography: stronger brand voice without adding another visual gimmick.
# -----------------------------------------------------------------------------
$headerPath = Join-Path $repoRoot "components/site/formwork/header.tsx"
if (Test-Path -LiteralPath $headerPath) {
  $header = Read-Text $headerPath
  if ($header -notmatch 'from "\./decor"') {
    $header = $header.Replace('import { Menu, X } from "lucide-react";', "import { Menu, X } from `"lucide-react`";`r`nimport { displayFont } from `"./decor`";")
  }
  $header = Replace-Literal $header 'className="flex items-center gap-2 text-lg font-black tracking-[0.08em]"' 'className={`${displayFont} flex items-center gap-2 text-[1.28rem] font-bold tracking-[0.075em]`}'
  Write-Utf8NoBom $headerPath $header
}

# -----------------------------------------------------------------------------
# 5. Sanity checks.
# -----------------------------------------------------------------------------
$contactCheck = Read-Text $contactPath
if ($contactCheck -match 'project\?\.') {
  Fail "Masih ada referensi project?. di contact.tsx. Script dihentikan agar bug tidak lolos."
}

$decorCheck = Read-Text (Join-Path $repoRoot "components/site/formwork/decor.tsx")
if ($decorCheck -notmatch 'FIELD|GRID / ALIGN') {
  Fail "decor.tsx tidak berhasil ditulis."
}

Write-Host ""
Write-Host "[LUNAR FLOW] SELESAI" -ForegroundColor Green
Write-Host "- Contact runtime error diperbaiki." -ForegroundColor Green
Write-Host "- Technical circle diganti free-form spline + marker + label." -ForegroundColor Green
Write-Host "- Hero local artwork tidak lagi dipaksa di dalam blob mask berlapis." -ForegroundColor Green
Write-Host "- Typography display dibuat lebih condensed dan body lebih bersih." -ForegroundColor Green
Write-Host "- Home/page labels sekarang punya numbering/dossier system." -ForegroundColor Green
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  git diff --check"
Write-Host "  npm run dev"
