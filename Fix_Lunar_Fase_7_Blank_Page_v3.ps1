# Lunar Konstruksi - Fase 7 Blank Page Hotfix v3
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Fail([string]$Message) { Write-Host "[FASE 7 HOTFIX] GAGAL: $Message" -ForegroundColor Red; exit 1 }
function Write-Utf8NoBom([string]$Path, [string]$Content) { $encoding = New-Object System.Text.UTF8Encoding($false); [System.IO.File]::WriteAllText($Path, $Content, $encoding) }
function Decode([string]$Value) { [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Value)) }

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan dari root repository Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

$required = @(
  "features/public-site/public-site.service.ts",
  "features/pages/page.defaults.ts",
  "components/site/redesign/public-page-renderer.tsx",
  "components/site/site-header.tsx",
  "components/site/site-footer.tsx"
)
$missing = @($required | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) { $missing | ForEach-Object { Write-Host "  - $_" }; Fail "Fondasi Fase 7 tidak lengkap." }

$servicePath = Join-Path $repoRoot "features/public-site/public-site.service.ts"
$service = [System.IO.File]::ReadAllText($servicePath)
if ($service -notmatch "DEFAULT_SYSTEM_PAGES") {
  $importAnchor = import type { CmsSystemPageKey } from "@/features/pages/page.types";
  if (-not $service.Contains($importAnchor)) { Fail "Import anchor CmsSystemPageKey tidak ditemukan pada public-site.service.ts." }
  $service = $service.Replace($importAnchor, import { DEFAULT_SYSTEM_PAGES } from "@/features/pages/page.defaults"; + [Environment]::NewLine + $importAnchor)
}

$old =   const page = pageRecord?.status === "published" ? pageRecord : null; + [Environment]::NewLine +   const sections = page ? await hydrateSections(page.sections) : [];
$new =   const page = pageRecord?.status === "published" ? pageRecord : null; + [Environment]::NewLine +   const fallbackPage = DEFAULT_SYSTEM_PAGES.find((item) => item.systemKey === systemKey); + [Environment]::NewLine +   const sectionSource = page?.sections ?? fallbackPage?.sections ?? []; + [Environment]::NewLine +   const sections = await hydrateSections(sectionSource);
if ($service.Contains($old)) { $service = $service.Replace($old, $new) } elseif ($service -notmatch "fallbackPage = DEFAULT_SYSTEM_PAGES") { Fail "Blok page/sections pada public-site.service.ts tidak dikenali." }
Write-Utf8NoBom $servicePath $service
Write-Host "[FASE 7 HOTFIX] patch features/public-site/public-site.service.ts" -ForegroundColor Green

$payload = @{}
$payload["components/site/home-page.tsx"] = "aW1wb3J0IHsgUHVibGljU2VvVGFncyB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUiOwppbXBvcnQgeyBnZXRQdWJsaWNQYWdlQ29udGV4dCB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUvc2VydmVyIjsKCmltcG9ydCB7IFB1YmxpY1BhZ2VSZW5kZXJlciB9IGZyb20gIi4vcmVkZXNpZ24vcHVibGljLXBhZ2UtcmVuZGVyZXIiOwppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiLi9zaXRlLWZvb3RlciI7CmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9tICIuL3NpdGUtaGVhZGVyIjsKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEhvbWVQYWdlKCkgewogIGNvbnN0IGNvbnRleHQgPSBhd2FpdCBnZXRQdWJsaWNQYWdlQ29udGV4dCgiaG9tZSIpOwoKICByZXR1cm4gKAogICAgPD4KICAgICAgPFB1YmxpY1Nlb1RhZ3MgbWV0YWRhdGE9e2NvbnRleHQubWV0YWRhdGF9IC8+CiAgICAgIDxTaXRlSGVhZGVyIC8+CiAgICAgIDxtYWluPgogICAgICAgIDxQdWJsaWNQYWdlUmVuZGVyZXIgY29udGV4dD17Y29udGV4dH0gcGFnZUtleT0iaG9tZSIgLz4KICAgICAgPC9tYWluPgogICAgICA8U2l0ZUZvb3RlciAvPgogICAgPC8+CiAgKTsKfQo="
$payload["components/site/about-page.tsx"] = "aW1wb3J0IHsgUHVibGljU2VvVGFncyB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUiOwppbXBvcnQgeyBnZXRQdWJsaWNQYWdlQ29udGV4dCB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUvc2VydmVyIjsKCmltcG9ydCB7IFB1YmxpY1BhZ2VSZW5kZXJlciB9IGZyb20gIi4vcmVkZXNpZ24vcHVibGljLXBhZ2UtcmVuZGVyZXIiOwppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiLi9zaXRlLWZvb3RlciI7CmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9tICIuL3NpdGUtaGVhZGVyIjsKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIEFib3V0UGFnZSgpIHsKICBjb25zdCBjb250ZXh0ID0gYXdhaXQgZ2V0UHVibGljUGFnZUNvbnRleHQoImFib3V0Iik7CgogIHJldHVybiAoCiAgICA8PgogICAgICA8UHVibGljU2VvVGFncyBtZXRhZGF0YT17Y29udGV4dC5tZXRhZGF0YX0gLz4KICAgICAgPFNpdGVIZWFkZXIgLz4KICAgICAgPG1haW4+CiAgICAgICAgPFB1YmxpY1BhZ2VSZW5kZXJlciBjb250ZXh0PXtjb250ZXh0fSBwYWdlS2V5PSJhYm91dCIgLz4KICAgICAgPC9tYWluPgogICAgICA8U2l0ZUZvb3RlciAvPgogICAgPC8+CiAgKTsKfQo="
$payload["components/site/services-page.tsx"] = "aW1wb3J0IHsgUHVibGljU2VvVGFncyB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUiOwppbXBvcnQgeyBnZXRQdWJsaWNQYWdlQ29udGV4dCB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUvc2VydmVyIjsKCmltcG9ydCB7IFB1YmxpY1BhZ2VSZW5kZXJlciB9IGZyb20gIi4vcmVkZXNpZ24vcHVibGljLXBhZ2UtcmVuZGVyZXIiOwppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiLi9zaXRlLWZvb3RlciI7CmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9tICIuL3NpdGUtaGVhZGVyIjsKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFNlcnZpY2VzUGFnZSgpIHsKICBjb25zdCBjb250ZXh0ID0gYXdhaXQgZ2V0UHVibGljUGFnZUNvbnRleHQoInNlcnZpY2VzIik7CgogIHJldHVybiAoCiAgICA8PgogICAgICA8UHVibGljU2VvVGFncyBtZXRhZGF0YT17Y29udGV4dC5tZXRhZGF0YX0gLz4KICAgICAgPFNpdGVIZWFkZXIgLz4KICAgICAgPG1haW4+CiAgICAgICAgPFB1YmxpY1BhZ2VSZW5kZXJlciBjb250ZXh0PXtjb250ZXh0fSBwYWdlS2V5PSJzZXJ2aWNlcyIgLz4KICAgICAgPC9tYWluPgogICAgICA8U2l0ZUZvb3RlciAvPgogICAgPC8+CiAgKTsKfQo="
$payload["components/site/projects-page.tsx"] = "aW1wb3J0IHsgUHVibGljU2VvVGFncyB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUiOwppbXBvcnQgeyBnZXRQdWJsaWNQYWdlQ29udGV4dCB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUvc2VydmVyIjsKCmltcG9ydCB7IFB1YmxpY1BhZ2VSZW5kZXJlciB9IGZyb20gIi4vcmVkZXNpZ24vcHVibGljLXBhZ2UtcmVuZGVyZXIiOwppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiLi9zaXRlLWZvb3RlciI7CmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9tICIuL3NpdGUtaGVhZGVyIjsKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIFByb2plY3RzUGFnZSgpIHsKICBjb25zdCBjb250ZXh0ID0gYXdhaXQgZ2V0UHVibGljUGFnZUNvbnRleHQoInByb2plY3RzIik7CgogIHJldHVybiAoCiAgICA8PgogICAgICA8UHVibGljU2VvVGFncyBtZXRhZGF0YT17Y29udGV4dC5tZXRhZGF0YX0gLz4KICAgICAgPFNpdGVIZWFkZXIgLz4KICAgICAgPG1haW4+CiAgICAgICAgPFB1YmxpY1BhZ2VSZW5kZXJlciBjb250ZXh0PXtjb250ZXh0fSBwYWdlS2V5PSJwcm9qZWN0cyIgLz4KICAgICAgPC9tYWluPgogICAgICA8U2l0ZUZvb3RlciAvPgogICAgPC8+CiAgKTsKfQo="
$payload["components/site/contact-page.tsx"] = "aW1wb3J0IHsgUHVibGljU2VvVGFncyB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUiOwppbXBvcnQgeyBnZXRQdWJsaWNQYWdlQ29udGV4dCB9IGZyb20gIkAvZmVhdHVyZXMvcHVibGljLXNpdGUvc2VydmVyIjsKCmltcG9ydCB7IFB1YmxpY1BhZ2VSZW5kZXJlciB9IGZyb20gIi4vcmVkZXNpZ24vcHVibGljLXBhZ2UtcmVuZGVyZXIiOwppbXBvcnQgeyBTaXRlRm9vdGVyIH0gZnJvbSAiLi9zaXRlLWZvb3RlciI7CmltcG9ydCB7IFNpdGVIZWFkZXIgfSBmcm9tICIuL3NpdGUtaGVhZGVyIjsKCmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIENvbnRhY3RQYWdlKCkgewogIGNvbnN0IGNvbnRleHQgPSBhd2FpdCBnZXRQdWJsaWNQYWdlQ29udGV4dCgiY29udGFjdCIpOwoKICByZXR1cm4gKAogICAgPD4KICAgICAgPFB1YmxpY1Nlb1RhZ3MgbWV0YWRhdGE9e2NvbnRleHQubWV0YWRhdGF9IC8+CiAgICAgIDxTaXRlSGVhZGVyIC8+CiAgICAgIDxtYWluPgogICAgICAgIDxQdWJsaWNQYWdlUmVuZGVyZXIgY29udGV4dD17Y29udGV4dH0gcGFnZUtleT0iY29udGFjdCIgLz4KICAgICAgPC9tYWluPgogICAgICA8U2l0ZUZvb3RlciAvPgogICAgPC8+CiAgKTsKfQo="

foreach ($entry in $payload.GetEnumerator()) { $target = Join-Path $repoRoot $entry.Key; Write-Utf8NoBom $target (Decode $entry.Value); Write-Host "[FASE 7 HOTFIX] write $($entry.Key)" -ForegroundColor Green }

Write-Host ""
Write-Host "[FASE 7 HOTFIX] Blank-page fix selesai." -ForegroundColor Cyan
Write-Host "[FASE 7 HOTFIX] Public pages kembali memiliki Header/Footer/SEO dan memakai default CMS sections saat page belum published." -ForegroundColor Cyan
Write-Host "Jalankan: npm run dev"
