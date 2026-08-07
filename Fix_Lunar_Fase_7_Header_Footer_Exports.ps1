# Lunar Konstruksi - Fase 7 Hotfix
# Restores named + default exports for SiteHeader and SiteFooter.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
  Write-Host "[HOTFIX FASE 7] GAGAL: jalankan dari root repository Lunar Konstruksi." -ForegroundColor Red
  exit 1
}

$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

$header = @'
import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";

import { PublicHeader } from "./redesign/public-header";

export async function SiteHeader() {
  const [navigation, settings] = await Promise.all([
    getNavigationSettingsWithDefaults(),
    getSiteSettingsWithDefaults(),
  ]);

  return <PublicHeader navigation={navigation} settings={settings} />;
}

export default SiteHeader;
'@

$footer = @'
import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";

import { PublicFooter } from "./redesign/public-footer";

export async function SiteFooter() {
  const [navigation, settings] = await Promise.all([
    getNavigationSettingsWithDefaults(),
    getSiteSettingsWithDefaults(),
  ]);

  return <PublicFooter navigation={navigation} settings={settings} />;
}

export default SiteFooter;
'@

Write-Utf8NoBom (Join-Path $repoRoot "components/site/site-header.tsx") $header
Write-Utf8NoBom (Join-Path $repoRoot "components/site/site-footer.tsx") $footer

Write-Host "[HOTFIX FASE 7] components/site/site-header.tsx fixed" -ForegroundColor Green
Write-Host "[HOTFIX FASE 7] components/site/site-footer.tsx fixed" -ForegroundColor Green
Write-Host "[HOTFIX FASE 7] Named + default exports are now compatible." -ForegroundColor Green
Write-Host ""
Write-Host "Run next:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host "or"
Write-Host "  npm run build"
