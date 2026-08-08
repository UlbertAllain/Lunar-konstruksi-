# Lunar Konstruksi - Total Codebase Cleanup v2
# Purpose: remove obsolete Full CMS architecture and consolidate backend by domain.
# Supports both the original GitHub-main layout and the later Phase-1 features/* layout.
# Run from repository root.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
  Write-Host "[CLEANUP] $Message" -ForegroundColor Cyan
}

function Fail-Cleanup([string]$Message) {
  Write-Host ""
  Write-Host "[CLEANUP] GAGAL: $Message" -ForegroundColor Red
  exit 1
}

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

function Decode([string]$Value) {
  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value))
}

function Remove-PathSafe([string]$Path) {
  if (Test-Path -LiteralPath $Path) {
    Remove-Item -LiteralPath $Path -Recurse -Force
    Write-Host "[CLEANUP] remove $Path" -ForegroundColor DarkGray
  }
}

function Get-SourceFiles {
  $roots = @("app", "components", "lib", "modules", "shared", "features", "cms", "scripts")
  $extensions = @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
  $result = @()

  foreach ($root in $roots) {
    if (-not (Test-Path -LiteralPath $root)) { continue }
    $result += Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object { $extensions -contains $_.Extension }
  }

  return $result
}

function Replace-CodeText([string]$OldText, [string]$NewText) {
  foreach ($file in Get-SourceFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if (-not $content.Contains($OldText)) { continue }
    Write-Utf8NoBom $file.FullName ($content.Replace($OldText, $NewText))
  }
}

function Select-PreferredSource([string[]]$Candidates) {
  foreach ($candidate in $Candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }
  return $null
}

function Copy-Implementation([string]$Target, [string[]]$Candidates) {
  $source = Select-PreferredSource $Candidates
  if (-not $source) {
    Fail-Cleanup "Tidak menemukan implementation source untuk $Target. Kandidat: $($Candidates -join ', ')"
  }

  Ensure-Parent $Target
  Copy-Item -LiteralPath $source -Destination $Target -Force
  Write-Host "[CLEANUP] source $source -> $Target" -ForegroundColor DarkGray
}

function Copy-DirectoryIfExists([string]$From, [string]$To) {
  if (-not (Test-Path -LiteralPath $From)) { return $false }
  if (Test-Path -LiteralPath $To) { Remove-Item -LiteralPath $To -Recurse -Force }
  Ensure-Parent $To
  Copy-Item -LiteralPath $From -Destination $To -Recurse -Force
  Write-Host "[CLEANUP] source $From -> $To" -ForegroundColor DarkGray
  return $true
}

function Remove-EmptyDirectory([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  $children = @(Get-ChildItem -LiteralPath $Path -Force)
  if ($children.Count -eq 0) {
    Remove-Item -LiteralPath $Path -Force
    Write-Host "[CLEANUP] remove empty $Path" -ForegroundColor DarkGray
  }
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail-Cleanup "Jalankan script ini dari repository Git Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot

$branch = (& git branch --show-current).Trim()
$head = (& git rev-parse --short HEAD).Trim()
Write-Step "Repo   : $repoRoot"
Write-Step "Branch : $branch"
Write-Step "HEAD   : $head"

$trackedStatus = & git status --porcelain --untracked-files=no
if ($LASTEXITCODE -ne 0) { Fail-Cleanup "Tidak bisa membaca git status." }
if ($trackedStatus) {
  Write-Host $trackedStatus
  Fail-Cleanup "Ada perubahan TRACKED yang belum disimpan. Commit/stash dulu. Commit Git terakhir menjadi rollback point cleanup ini."
}

foreach ($required in @("package.json", "app", "components", "lib")) {
  if (-not (Test-Path -LiteralPath $required)) { Fail-Cleanup "Prasyarat tidak ditemukan: $required" }
}

if (Test-Path -LiteralPath "modules/projects/project.repository.ts") {
  Fail-Cleanup "modules/ hasil cleanup sudah terdeteksi. Jangan jalankan cleanup dua kali pada kondisi yang sama."
}

Write-Step "Memilih implementation source aktif (features/* bila ada, classic root bila tidak)..."

# Backend domain files. Phase-1 features/* implementation is preferred when present because
# root repositories/services/types/validators may only be compatibility wrappers.
Copy-Implementation "modules/_shared/base.repository.ts" @(
  "features/shared/data/base.repository.ts",
  "repositories/base.repository.ts"
)
Copy-Implementation "modules/_shared/common.schema.ts" @(
  "features/shared/validation/common.ts",
  "validators/common.ts"
)

Copy-Implementation "modules/admin/admin.repository.ts" @(
  "features/admin/admin.repository.ts",
  "repositories/admin.repository.ts"
)
Copy-Implementation "modules/admin/admin.types.ts" @(
  "features/admin/admin.types.ts",
  "types/admin.ts"
)
Copy-Implementation "modules/admin/admin-auth.service.ts" @(
  "lib/auth.ts"
)

Copy-Implementation "modules/faqs/faq.repository.ts" @(
  "features/faqs/faq.repository.ts",
  "repositories/faq.repository.ts"
)
Copy-Implementation "modules/faqs/faq.service.ts" @(
  "features/faqs/faq.service.ts",
  "services/faq.service.ts"
)
Copy-Implementation "modules/faqs/faq.types.ts" @(
  "features/faqs/faq.types.ts",
  "types/faq.ts"
)
Copy-Implementation "modules/faqs/faq.schema.ts" @(
  "features/faqs/faq.validator.ts",
  "validators/faq.validator.ts"
)

Copy-Implementation "modules/projects/project.repository.ts" @(
  "features/projects/project.repository.ts",
  "repositories/project.repository.ts"
)
Copy-Implementation "modules/projects/project.service.ts" @(
  "features/projects/project.service.ts",
  "services/project.service.ts"
)
Copy-Implementation "modules/projects/project.types.ts" @(
  "features/projects/project.types.ts",
  "types/project.ts"
)
Copy-Implementation "modules/projects/project.schema.ts" @(
  "features/projects/project.validator.ts",
  "validators/project.validator.ts"
)

Copy-Implementation "modules/services/service.repository.ts" @(
  "features/services/service.repository.ts",
  "repositories/service.repository.ts"
)
Copy-Implementation "modules/services/service.service.ts" @(
  "features/services/service.service.ts",
  "services/service.service.ts"
)
Copy-Implementation "modules/services/service.types.ts" @(
  "features/services/service.types.ts",
  "types/service.ts"
)
Copy-Implementation "modules/services/service.schema.ts" @(
  "features/services/service.validator.ts",
  "validators/service.validator.ts"
)

Copy-Implementation "modules/team/team.repository.ts" @(
  "features/team/team.repository.ts",
  "repositories/team.repository.ts"
)
Copy-Implementation "modules/team/team.service.ts" @(
  "features/team/team.service.ts",
  "services/team.service.ts"
)
Copy-Implementation "modules/team/team.types.ts" @(
  "features/team/team.types.ts",
  "types/team.ts"
)
Copy-Implementation "modules/team/team.schema.ts" @(
  "features/team/team.validator.ts",
  "validators/team.validator.ts"
)

Copy-Implementation "modules/testimonials/testimonial.repository.ts" @(
  "features/testimonials/testimonial.repository.ts",
  "repositories/testimonial.repository.ts"
)
Copy-Implementation "modules/testimonials/testimonial.service.ts" @(
  "features/testimonials/testimonial.service.ts",
  "services/testimonial.service.ts"
)
Copy-Implementation "modules/testimonials/testimonial.types.ts" @(
  "features/testimonials/testimonial.types.ts",
  "types/testimonial.ts"
)
Copy-Implementation "modules/testimonials/testimonial.schema.ts" @(
  "features/testimonials/testimonial.validator.ts",
  "validators/testimonial.validator.ts"
)

Copy-Implementation "modules/media/media.types.ts" @(
  "features/media/media.types.ts",
  "types/media.ts"
)
Copy-Implementation "modules/media/upload.service.ts" @(
  "features/media/upload.service.ts",
  "services/upload.service.ts"
)

Copy-Implementation "shared/api-auth.ts" @(
  "features/admin/api-auth.ts",
  "utils/api-auth.ts"
)
Copy-Implementation "shared/slug.ts" @(
  "features/shared/slug/slug.ts",
  "utils/slug.ts"
)
Copy-Implementation "shared/unique-slug.ts" @(
  "features/shared/slug/unique-slug.ts",
  "utils/unique-slug.ts"
)
Copy-Implementation "shared/upload-client.ts" @(
  "features/media/upload-client.ts",
  "utils/upload-client.ts"
)

# Keep the Leads feature, but make it a normal domain module instead of leaving a second architecture style.
$hadLeads = Copy-DirectoryIfExists "features/leads" "modules/leads"

# Shared helpers introduced by Leads/CMS phases are kept only when they are useful outside Full CMS.
if (Test-Path -LiteralPath "features/shared/errors/domain-error.ts") {
  Copy-Item -LiteralPath "features/shared/errors/domain-error.ts" -Destination "modules/_shared/domain-error.ts" -Force
}
if (Test-Path -LiteralPath "features/shared/http/route-handler.ts") {
  Copy-Item -LiteralPath "features/shared/http/route-handler.ts" -Destination "modules/_shared/route-handler.ts" -Force
}

Write-Step "Menulis read-model website publik yang tidak bergantung pada Full CMS..."
$payload = @{}
$payload["README.md"] = "IyBMdW5hciBLb25zdHJ1a3NpCgpDb21wYW55IHByb2ZpbGUga29uc3RydWtzaSBiZXJiYXNpcyBOZXh0LmpzIGRlbmdhbiBhZG1pbiBDUlVEIGtsYXNpayB1bnR1ayBtZW5nZWxvbGEga29udGVuIGJpc25pcy4gRnVsbCBDTVMvcGFnZSBidWlsZGVyIHN1ZGFoIGRpcGVuc2l1bmthbiBhZ2FyIHN0cnVrdHVyIGFwbGlrYXNpIGxlYmloIHNlZGVyaGFuYSBkYW4gbXVkYWggZGlyYXdhdC4KCiMjIFN0YWNrCgotIE5leHQuanMgMTYgKyBSZWFjdCAxOSArIFR5cGVTY3JpcHQKLSBUYWlsd2luZCBDU1MgNAotIEZpcmViYXNlIEF1dGhlbnRpY2F0aW9uCi0gQ2xvdWQgRmlyZXN0b3JlIG1lbGFsdWkgRmlyZWJhc2UgQWRtaW4gU0RLIGRpIHNlcnZlcgotIENsb3VkaW5hcnkgdW50dWsgbWVkaWEKLSBab2QgdW50dWsgdmFsaWRhc2kgcGF5bG9hZAoKIyMgQWRtaW4KCkFkbWluIG1lbmdndW5ha2FuIHBvbGEgQ1JVRCB5YW5nIGplbGFzOgoKLSBEYXNoYm9hcmQKLSBTZXJ2aWNlcwotIFByb2plY3RzCi0gVGVhbQotIFRlc3RpbW9uaWFscwotIEZBUQoKVGlkYWsgYWRhIFBhZ2VzL1NlY3Rpb25zIGJ1aWxkZXIsIENNUyBXb3Jrc3BhY2UsIGF0YXUgZWRpdG9yIGxheW91dCBkaW5hbWlzLgoKIyMgU3RydWt0dXIKCmBgYHRleHQKYXBwLyAgICAgICAgICAgICAgICAgICAgIyByb3V0aW5nLCBwYWdlcywgQVBJIHJvdXRlcwpjb21wb25lbnRzLyAgICAgICAgICAgICAjIFVJIGFkbWluIGRhbiB3ZWJzaXRlIHB1YmxpawpsaWIvICAgICAgICAgICAgICAgICAgICAjIGluZnJhc3RydWN0dXJlOiBGaXJlYmFzZSwgQ2xvdWRpbmFyeSwgSFRUUCBoZWxwZXJzCm1vZHVsZXMvICAgICAgICAgICAgICAgICMgYnVzaW5lc3MvZG9tYWluIGJhY2tlbmQKICBfc2hhcmVkLyAgICAgICAgICAgICAgIyBwcmltaXRpdmVzIGxpbnRhcyBkb21haW4KICBhZG1pbi8KICBmYXFzLwogIGxlYWRzLwogIG1lZGlhLwogIHByb2plY3RzLwogIHB1YmxpYy1zaXRlLyAgICAgICAgICAjIHJlYWQtbW9kZWwgd2Vic2l0ZSBwdWJsaWs7IGJ1a2FuIENNUwogIHNlcnZpY2VzLwogIHRlYW0vCiAgdGVzdGltb25pYWxzLwpzaGFyZWQvICAgICAgICAgICAgICAgICAjIGhlbHBlciBhcGxpa2FzaSBsaW50YXMgZG9tYWluCnNjcmlwdHMvICAgICAgICAgICAgICAgICMgbWFpbnRlbmFuY2UvYm9vdHN0cmFwIHNjcmlwdHMKcHVibGljLyAgICAgICAgICAgICAgICAgIyBzdGF0aWMgYXNzZXRzCmBgYAoKU2V0aWFwIGRvbWFpbiBtZW55aW1wYW4gdHlwZSwgc2NoZW1hLCByZXBvc2l0b3J5LCBkYW4gc2VydmljZSBkaSBmb2xkZXIgeWFuZyBzYW1hLiBDb250b2g6CgpgYGB0ZXh0Cm1vZHVsZXMvcHJvamVjdHMvCiAgcHJvamVjdC50eXBlcy50cwogIHByb2plY3Quc2NoZW1hLnRzCiAgcHJvamVjdC5yZXBvc2l0b3J5LnRzCiAgcHJvamVjdC5zZXJ2aWNlLnRzCiAgaW5kZXgudHMKICBzZXJ2ZXIudHMKYGBgCgojIyBEYXRhIHB1YmxpawoKV2Vic2l0ZSBwdWJsaWsgbWVtYmFjYSBrb2xla3NpIFNlcnZpY2VzLCBQcm9qZWN0cywgVGVhbSwgVGVzdGltb25pYWxzLCBkYW4gRkFRIGxhbmdzdW5nIG1lbGFsdWkgcmVhZC1tb2RlbCBzZXJ2ZXIgYG1vZHVsZXMvcHVibGljLXNpdGVgLgoKRGF0YSBgc2l0ZVNldHRpbmdzL2dlbmVyYWxgIGRhbiBgbmF2aWdhdGlvbi9tYWluYCB5YW5nIHN1ZGFoIHBlcm5haCB0ZXJzaW1wYW4gdGV0YXAgZGliYWNhIHNlYmFnYWkga29uZmlndXJhc2kgdGFtcGlsYW4gZ2xvYmFsLCB0ZXRhcGkgdGlkYWsgYWRhIGxhZ2kgVUkgRnVsbCBDTVMgdW50dWsgbWVuZ3ViYWggbGF5b3V0L3NlY3Rpb24gaGFsYW1hbi4KCiMjIEFsdXIgYmFja2VuZAoKYGBgdGV4dApBZG1pbiBBUEkgUm91dGUKICAtPiByZXF1aXJlQWRtaW4KICAtPiBkb21haW4gc2VydmljZQogIC0+IFpvZCBzY2hlbWEKICAtPiBkb21haW4gcmVwb3NpdG9yeQogIC0+IEZpcmVzdG9yZSAvIENsb3VkaW5hcnkKYGBgCgojIyBWYWxpZGFzaQoKYGBgYmFzaApucG0gcnVuIGxpbnQKbnBtIHJ1biB0eXBlY2hlY2sKbnBtIHJ1biBidWlsZApgYGAK"
$payload["modules/admin/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9hZG1pbi50eXBlcyI7Cg=="
$payload["modules/admin/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9hZG1pbi5yZXBvc2l0b3J5IjsKZXhwb3J0ICogZnJvbSAiLi9hZG1pbi1hdXRoLnNlcnZpY2UiOwpleHBvcnQgKiBmcm9tICJAL3NoYXJlZC9hcGktYXV0aCI7Cg=="
$payload["modules/faqs/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9mYXEudHlwZXMiOwpleHBvcnQgKiBmcm9tICIuL2ZhcS5zY2hlbWEiOwo="
$payload["modules/faqs/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9mYXEucmVwb3NpdG9yeSI7CmV4cG9ydCAqIGZyb20gIi4vZmFxLnNlcnZpY2UiOwo="
$payload["modules/media/client.ts"] = "ZXhwb3J0ICogZnJvbSAiQC9zaGFyZWQvdXBsb2FkLWNsaWVudCI7Cg=="
$payload["modules/media/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9tZWRpYS50eXBlcyI7Cg=="
$payload["modules/media/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi91cGxvYWQuc2VydmljZSI7Cg=="
$payload["modules/projects/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9wcm9qZWN0LnR5cGVzIjsKZXhwb3J0ICogZnJvbSAiLi9wcm9qZWN0LnNjaGVtYSI7Cg=="
$payload["modules/projects/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9wcm9qZWN0LnJlcG9zaXRvcnkiOwpleHBvcnQgKiBmcm9tICIuL3Byb2plY3Quc2VydmljZSI7Cg=="
$payload["modules/public-site/components/public-seo-tags.tsx"] = "aW1wb3J0IHR5cGUgeyBTZW9NZXRhZGF0YSB9IGZyb20gIi4uL3B1YmxpYy1zaXRlLnR5cGVzIjsKCmV4cG9ydCBmdW5jdGlvbiBQdWJsaWNTZW9UYWdzKHsgbWV0YWRhdGEgfTogeyBtZXRhZGF0YTogU2VvTWV0YWRhdGEgfSkgewogIGNvbnN0IHJvYm90cyA9IFttZXRhZGF0YS5ub0luZGV4ID8gIm5vaW5kZXgiIDogImluZGV4IiwgbWV0YWRhdGEubm9Gb2xsb3cgPyAibm9mb2xsb3ciIDogImZvbGxvdyJdLmpvaW4oIiwgIik7CgogIHJldHVybiAoCiAgICA8PgogICAgICB7bWV0YWRhdGEudGl0bGUgPyA8dGl0bGU+e21ldGFkYXRhLnRpdGxlfTwvdGl0bGU+IDogbnVsbH0KICAgICAge21ldGFkYXRhLmRlc2NyaXB0aW9uID8gPG1ldGEgbmFtZT0iZGVzY3JpcHRpb24iIGNvbnRlbnQ9e21ldGFkYXRhLmRlc2NyaXB0aW9ufSAvPiA6IG51bGx9CiAgICAgIDxtZXRhIG5hbWU9InJvYm90cyIgY29udGVudD17cm9ib3RzfSAvPgogICAgICB7bWV0YWRhdGEudGl0bGUgPyA8bWV0YSBwcm9wZXJ0eT0ib2c6dGl0bGUiIGNvbnRlbnQ9e21ldGFkYXRhLnRpdGxlfSAvPiA6IG51bGx9CiAgICAgIHttZXRhZGF0YS5kZXNjcmlwdGlvbiA/IDxtZXRhIHByb3BlcnR5PSJvZzpkZXNjcmlwdGlvbiIgY29udGVudD17bWV0YWRhdGEuZGVzY3JpcHRpb259IC8+IDogbnVsbH0KICAgICAge21ldGFkYXRhLm9nSW1hZ2VVcmwgPyA8bWV0YSBwcm9wZXJ0eT0ib2c6aW1hZ2UiIGNvbnRlbnQ9e21ldGFkYXRhLm9nSW1hZ2VVcmx9IC8+IDogbnVsbH0KICAgICAge21ldGFkYXRhLmNhbm9uaWNhbFVybCA/IDxsaW5rIHJlbD0iY2Fub25pY2FsIiBocmVmPXttZXRhZGF0YS5jYW5vbmljYWxVcmx9IC8+IDogbnVsbH0KICAgIDwvPgogICk7Cn0K"
$payload["modules/public-site/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9jb21wb25lbnRzL3B1YmxpYy1zZW8tdGFncyI7CmV4cG9ydCAqIGZyb20gIi4vcHVibGljLXNpdGUudHlwZXMiOwo="
$payload["modules/public-site/public-content.repository.ts"] = "aW1wb3J0IHR5cGUgeyBRdWVyeURvY3VtZW50U25hcHNob3QgfSBmcm9tICJmaXJlYmFzZS1hZG1pbi9maXJlc3RvcmUiOwoKaW1wb3J0IHsgZ2V0QWRtaW5EYiB9IGZyb20gIkAvbGliL2ZpcmViYXNlL2FkbWluIjsKaW1wb3J0IHsgc2VyaWFsaXplRG9jdW1lbnQgfSBmcm9tICJAL2xpYi9maXJlc3RvcmUiOwppbXBvcnQgdHlwZSB7IEZBUSB9IGZyb20gIkAvbW9kdWxlcy9mYXFzL2ZhcS50eXBlcyI7CmltcG9ydCB0eXBlIHsgUHJvamVjdCB9IGZyb20gIkAvbW9kdWxlcy9wcm9qZWN0cy9wcm9qZWN0LnR5cGVzIjsKaW1wb3J0IHR5cGUgeyBDb25zdHJ1Y3Rpb25TZXJ2aWNlIH0gZnJvbSAiQC9tb2R1bGVzL3NlcnZpY2VzL3NlcnZpY2UudHlwZXMiOwppbXBvcnQgdHlwZSB7IFRlYW1NZW1iZXIgfSBmcm9tICJAL21vZHVsZXMvdGVhbS90ZWFtLnR5cGVzIjsKaW1wb3J0IHR5cGUgeyBUZXN0aW1vbmlhbCB9IGZyb20gIkAvbW9kdWxlcy90ZXN0aW1vbmlhbHMvdGVzdGltb25pYWwudHlwZXMiOwoKZnVuY3Rpb24gc2VyaWFsaXplTWFueTxUPihkb2N1bWVudHM6IFF1ZXJ5RG9jdW1lbnRTbmFwc2hvdFtdKSB7CiAgcmV0dXJuIGRvY3VtZW50cy5tYXAoKGRvY3VtZW50KSA9PiBzZXJpYWxpemVEb2N1bWVudDxUPihkb2N1bWVudC5pZCwgZG9jdW1lbnQuZGF0YSgpKSk7Cn0KCmZ1bmN0aW9uIHNvcnRCeU9yZGVyPFQgZXh0ZW5kcyB7IG9yZGVyOiBudW1iZXIgfT4oaXRlbXM6IFRbXSkgewogIHJldHVybiBbLi4uaXRlbXNdLnNvcnQoKGEsIGIpID0+IGEub3JkZXIgLSBiLm9yZGVyKTsKfQoKYXN5bmMgZnVuY3Rpb24gbGlzdFB1Ymxpc2hlZDxUIGV4dGVuZHMgeyBvcmRlcjogbnVtYmVyIH0+KGNvbGxlY3Rpb246IHN0cmluZywgZmllbGQ6ICJpc1B1Ymxpc2hlZCIgfCAiaXNBY3RpdmUiKSB7CiAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRBZG1pbkRiKCkuY29sbGVjdGlvbihjb2xsZWN0aW9uKS53aGVyZShmaWVsZCwgIj09IiwgdHJ1ZSkuZ2V0KCk7CiAgcmV0dXJuIHNvcnRCeU9yZGVyKHNlcmlhbGl6ZU1hbnk8VD4oc25hcHNob3QuZG9jcykpOwp9Cgphc3luYyBmdW5jdGlvbiBmaW5kUHVibGlzaGVkQnlTbHVnPFQgZXh0ZW5kcyB7IGlzUHVibGlzaGVkOiBib29sZWFuIH0+KGNvbGxlY3Rpb246IHN0cmluZywgc2x1Zzogc3RyaW5nKSB7CiAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRBZG1pbkRiKCkuY29sbGVjdGlvbihjb2xsZWN0aW9uKS53aGVyZSgic2x1ZyIsICI9PSIsIHNsdWcpLmxpbWl0KDEpLmdldCgpOwogIGNvbnN0IGRvY3VtZW50ID0gc25hcHNob3QuZG9jc1swXTsKICBpZiAoIWRvY3VtZW50KSByZXR1cm4gbnVsbDsKICBjb25zdCBpdGVtID0gc2VyaWFsaXplRG9jdW1lbnQ8VD4oZG9jdW1lbnQuaWQsIGRvY3VtZW50LmRhdGEoKSk7CiAgcmV0dXJuIGl0ZW0uaXNQdWJsaXNoZWQgPyBpdGVtIDogbnVsbDsKfQoKZXhwb3J0IGZ1bmN0aW9uIGxpc3RQdWJsaWNTZXJ2aWNlcygpIHsKICByZXR1cm4gbGlzdFB1Ymxpc2hlZDxDb25zdHJ1Y3Rpb25TZXJ2aWNlPigic2VydmljZXMiLCAiaXNQdWJsaXNoZWQiKTsKfQoKZXhwb3J0IGZ1bmN0aW9uIGdldFB1YmxpY1NlcnZpY2VCeVNsdWcoc2x1Zzogc3RyaW5nKSB7CiAgcmV0dXJuIGZpbmRQdWJsaXNoZWRCeVNsdWc8Q29uc3RydWN0aW9uU2VydmljZT4oInNlcnZpY2VzIiwgc2x1Zyk7Cn0KCmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0UHVibGljUHJvamVjdHMoKSB7CiAgY29uc3QgcHJvamVjdHMgPSBhd2FpdCBsaXN0UHVibGlzaGVkPFByb2plY3Q+KCJwcm9qZWN0cyIsICJpc1B1Ymxpc2hlZCIpOwogIHJldHVybiBwcm9qZWN0cy5zb3J0KChhLCBiKSA9PiBhLm9yZGVyIC0gYi5vcmRlciB8fCBiLnllYXIgLSBhLnllYXIgfHwgYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpKTsKfQoKZXhwb3J0IGZ1bmN0aW9uIGdldFB1YmxpY1Byb2plY3RCeVNsdWcoc2x1Zzogc3RyaW5nKSB7CiAgcmV0dXJuIGZpbmRQdWJsaXNoZWRCeVNsdWc8UHJvamVjdD4oInByb2plY3RzIiwgc2x1Zyk7Cn0KCmV4cG9ydCBmdW5jdGlvbiBsaXN0UHVibGljVGVhbSgpIHsKICByZXR1cm4gbGlzdFB1Ymxpc2hlZDxUZWFtTWVtYmVyPigidGVhbSIsICJpc0FjdGl2ZSIpOwp9CgpleHBvcnQgZnVuY3Rpb24gbGlzdFB1YmxpY1Rlc3RpbW9uaWFscygpIHsKICByZXR1cm4gbGlzdFB1Ymxpc2hlZDxUZXN0aW1vbmlhbD4oInRlc3RpbW9uaWFscyIsICJpc1B1Ymxpc2hlZCIpOwp9CgpleHBvcnQgZnVuY3Rpb24gbGlzdFB1YmxpY0ZhcXMoKSB7CiAgcmV0dXJuIGxpc3RQdWJsaXNoZWQ8RkFRPigiZmFxcyIsICJpc1B1Ymxpc2hlZCIpOwp9Cg=="
$payload["modules/public-site/public-site.service.ts"] = "aW1wb3J0IHsgdW5zdGFibGVfY2FjaGUgfSBmcm9tICJuZXh0L2NhY2hlIjsKCmltcG9ydCB7CiAgZ2V0UHVibGljUHJvamVjdEJ5U2x1ZyBhcyByZWFkUHVibGljUHJvamVjdEJ5U2x1ZywKICBnZXRQdWJsaWNTZXJ2aWNlQnlTbHVnIGFzIHJlYWRQdWJsaWNTZXJ2aWNlQnlTbHVnLAogIGxpc3RQdWJsaWNGYXFzIGFzIHJlYWRQdWJsaWNGYXFzLAogIGxpc3RQdWJsaWNQcm9qZWN0cyBhcyByZWFkUHVibGljUHJvamVjdHMsCiAgbGlzdFB1YmxpY1NlcnZpY2VzIGFzIHJlYWRQdWJsaWNTZXJ2aWNlcywKICBsaXN0UHVibGljVGVhbSBhcyByZWFkUHVibGljVGVhbSwKICBsaXN0UHVibGljVGVzdGltb25pYWxzIGFzIHJlYWRQdWJsaWNUZXN0aW1vbmlhbHMsCn0gZnJvbSAiLi9wdWJsaWMtY29udGVudC5yZXBvc2l0b3J5IjsKaW1wb3J0IHsgZ2V0TmF2aWdhdGlvblNldHRpbmdzV2l0aERlZmF1bHRzLCBnZXRTaXRlU2V0dGluZ3NXaXRoRGVmYXVsdHMgfSBmcm9tICIuL3NpdGUtY29uZmlnIjsKaW1wb3J0IHR5cGUgewogIENtc0Jsb2NrVHlwZSwKICBDbXNDb250ZW50U291cmNlLAogIEh5ZHJhdGVkQ21zU2VjdGlvbiwKICBQdWJsaWNPdmVydmlld0RhdGEsCiAgUHVibGljUGFnZUNvbnRleHQsCiAgUHVibGljUGFnZUtleSwKICBTZW9NZXRhZGF0YSwKfSBmcm9tICIuL3B1YmxpYy1zaXRlLnR5cGVzIjsKCmNvbnN0IENBQ0hFX1NFQ09ORFMgPSAzMDA7CgpleHBvcnQgY29uc3QgZ2V0UHVibGljU2VydmljZXMgPSB1bnN0YWJsZV9jYWNoZShyZWFkUHVibGljU2VydmljZXMsIFsicHVibGljLXNlcnZpY2VzIl0sIHsKICByZXZhbGlkYXRlOiBDQUNIRV9TRUNPTkRTLAogIHRhZ3M6IFsicHVibGljLXNlcnZpY2VzIl0sCn0pOwoKZXhwb3J0IGNvbnN0IGdldFB1YmxpY1Byb2plY3RzID0gdW5zdGFibGVfY2FjaGUocmVhZFB1YmxpY1Byb2plY3RzLCBbInB1YmxpYy1wcm9qZWN0cyJdLCB7CiAgcmV2YWxpZGF0ZTogQ0FDSEVfU0VDT05EUywKICB0YWdzOiBbInB1YmxpYy1wcm9qZWN0cyJdLAp9KTsKCmV4cG9ydCBjb25zdCBnZXRQdWJsaWNUZWFtID0gdW5zdGFibGVfY2FjaGUocmVhZFB1YmxpY1RlYW0sIFsicHVibGljLXRlYW0iXSwgewogIHJldmFsaWRhdGU6IENBQ0hFX1NFQ09ORFMsCiAgdGFnczogWyJwdWJsaWMtdGVhbSJdLAp9KTsKCmV4cG9ydCBjb25zdCBnZXRQdWJsaWNUZXN0aW1vbmlhbHMgPSB1bnN0YWJsZV9jYWNoZShyZWFkUHVibGljVGVzdGltb25pYWxzLCBbInB1YmxpYy10ZXN0aW1vbmlhbHMiXSwgewogIHJldmFsaWRhdGU6IENBQ0hFX1NFQ09ORFMsCiAgdGFnczogWyJwdWJsaWMtdGVzdGltb25pYWxzIl0sCn0pOwoKZXhwb3J0IGNvbnN0IGdldFB1YmxpY0ZhcXMgPSB1bnN0YWJsZV9jYWNoZShyZWFkUHVibGljRmFxcywgWyJwdWJsaWMtZmFxcyJdLCB7CiAgcmV2YWxpZGF0ZTogQ0FDSEVfU0VDT05EUywKICB0YWdzOiBbInB1YmxpYy1mYXFzIl0sCn0pOwoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1YmxpY1Byb2plY3RCeVNsdWcoc2x1Zzogc3RyaW5nKSB7CiAgcmV0dXJuIHVuc3RhYmxlX2NhY2hlKCgpID0+IHJlYWRQdWJsaWNQcm9qZWN0QnlTbHVnKHNsdWcpLCBbInB1YmxpYy1wcm9qZWN0Iiwgc2x1Z10sIHsKICAgIHJldmFsaWRhdGU6IENBQ0hFX1NFQ09ORFMsCiAgICB0YWdzOiBbInB1YmxpYy1wcm9qZWN0cyIsIGBwcm9qZWN0OiR7c2x1Z31gXSwKICB9KSgpOwp9CgpleHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHVibGljU2VydmljZUJ5U2x1ZyhzbHVnOiBzdHJpbmcpIHsKICByZXR1cm4gdW5zdGFibGVfY2FjaGUoKCkgPT4gcmVhZFB1YmxpY1NlcnZpY2VCeVNsdWcoc2x1ZyksIFsicHVibGljLXNlcnZpY2UiLCBzbHVnXSwgewogICAgcmV2YWxpZGF0ZTogQ0FDSEVfU0VDT05EUywKICAgIHRhZ3M6IFsicHVibGljLXNlcnZpY2VzIiwgYHNlcnZpY2U6JHtzbHVnfWBdLAogIH0pKCk7Cn0KCmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQdWJsaWNPdmVydmlld0RhdGEoKTogUHJvbWlzZTxQdWJsaWNPdmVydmlld0RhdGE+IHsKICBjb25zdCBbc2VydmljZXMsIHByb2plY3RzLCB0ZWFtLCB0ZXN0aW1vbmlhbHMsIGZhcXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoWwogICAgZ2V0UHVibGljU2VydmljZXMoKSwKICAgIGdldFB1YmxpY1Byb2plY3RzKCksCiAgICBnZXRQdWJsaWNUZWFtKCksCiAgICBnZXRQdWJsaWNUZXN0aW1vbmlhbHMoKSwKICAgIGdldFB1YmxpY0ZhcXMoKSwKICBdKTsKCiAgcmV0dXJuIHsgc2VydmljZXMsIHByb2plY3RzLCB0ZWFtLCB0ZXN0aW1vbmlhbHMsIGZhcXMgfTsKfQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1YmxpY0hvbWVEYXRhKCkgewogIHJldHVybiBnZXRQdWJsaWNPdmVydmlld0RhdGEoKTsKfQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1YmxpY0Fib3V0RGF0YSgpIHsKICByZXR1cm4geyB0ZWFtOiBhd2FpdCBnZXRQdWJsaWNUZWFtKCkgfTsKfQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFB1YmxpY1Byb2plY3RzRGF0YSgpIHsKICByZXR1cm4geyBwcm9qZWN0czogYXdhaXQgZ2V0UHVibGljUHJvamVjdHMoKSB9Owp9CgpleHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHVibGljU2VydmljZXNEYXRhKCkgewogIHJldHVybiB7IHNlcnZpY2VzOiBhd2FpdCBnZXRQdWJsaWNTZXJ2aWNlcygpIH07Cn0KCnR5cGUgU2VjdGlvblNlZWQgPSB7CiAgaWQ6IHN0cmluZzsKICB0eXBlOiBDbXNCbG9ja1R5cGU7CiAgdmFyaWFudDogc3RyaW5nOwogIG9yZGVyOiBudW1iZXI7CiAgc291cmNlPzogQ21zQ29udGVudFNvdXJjZTsKICBjb250ZW50PzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47Cn07Cgpjb25zdCBQQUdFX1RJVExFUzogUmVjb3JkPFB1YmxpY1BhZ2VLZXksIHN0cmluZz4gPSB7CiAgaG9tZTogIkhvbWUiLAogIGFib3V0OiAiVGVudGFuZyIsCiAgc2VydmljZXM6ICJMYXlhbmFuIiwKICBwcm9qZWN0czogIlByb2plY3RzIiwKICBjb250YWN0OiAiS29udGFrIiwKfTsKCmNvbnN0IFBBR0VfU0VDVElPTlM6IFJlY29yZDxQdWJsaWNQYWdlS2V5LCBTZWN0aW9uU2VlZFtdPiA9IHsKICBob21lOiBbCiAgICB7IGlkOiAiaG9tZS1oZXJvIiwgdHlwZTogImhlcm8iLCB2YXJpYW50OiAic3RydWN0dXJhIiwgb3JkZXI6IDAgfSwKICAgIHsgaWQ6ICJob21lLWludHJvIiwgdHlwZTogImludHJvIiwgdmFyaWFudDogImVkaXRvcmlhbCIsIG9yZGVyOiAxMCB9LAogICAgeyBpZDogImhvbWUtc2VydmljZXMiLCB0eXBlOiAic2VydmljZXMiLCB2YXJpYW50OiAicG9saWZvcm0iLCBvcmRlcjogMjAsIHNvdXJjZTogInNlcnZpY2VzIiwgY29udGVudDogeyBsaW1pdDogNiB9IH0sCiAgICB7IGlkOiAiaG9tZS1wcm9jZXNzIiwgdHlwZTogInByb2Nlc3MiLCB2YXJpYW50OiAidGltZWxpbmUiLCBvcmRlcjogMzAgfSwKICAgIHsgaWQ6ICJob21lLXByb2plY3RzIiwgdHlwZTogInByb2plY3RzIiwgdmFyaWFudDogImxhcy1ncmlkIiwgb3JkZXI6IDQwLCBzb3VyY2U6ICJwcm9qZWN0cyIsIGNvbnRlbnQ6IHsgZmVhdHVyZWRPbmx5OiB0cnVlLCBsaW1pdDogNiB9IH0sCiAgICB7IGlkOiAiaG9tZS10ZXN0aW1vbmlhbHMiLCB0eXBlOiAidGVzdGltb25pYWxzIiwgdmFyaWFudDogIm1pbmltYWwiLCBvcmRlcjogNTAsIHNvdXJjZTogInRlc3RpbW9uaWFscyIgfSwKICAgIHsgaWQ6ICJob21lLWN0YSIsIHR5cGU6ICJjdGEiLCB2YXJpYW50OiAibWluaW1hbCIsIG9yZGVyOiA2MCB9LAogIF0sCiAgYWJvdXQ6IFsKICAgIHsgaWQ6ICJhYm91dC1oZXJvIiwgdHlwZTogImhlcm8iLCB2YXJpYW50OiAiZWRpdG9yaWFsIiwgb3JkZXI6IDAgfSwKICAgIHsgaWQ6ICJhYm91dC1pbnRybyIsIHR5cGU6ICJpbnRybyIsIHZhcmlhbnQ6ICJlZGl0b3JpYWwiLCBvcmRlcjogMTAgfSwKICAgIHsgaWQ6ICJhYm91dC1zdGF0cyIsIHR5cGU6ICJzdGF0cyIsIHZhcmlhbnQ6ICJpbmxpbmUiLCBvcmRlcjogMjAgfSwKICAgIHsgaWQ6ICJhYm91dC10ZWFtIiwgdHlwZTogInRlYW0iLCB2YXJpYW50OiAiZWRpdG9yaWFsLWdyaWQiLCBvcmRlcjogMzAsIHNvdXJjZTogInRlYW0iIH0sCiAgICB7IGlkOiAiYWJvdXQtY3RhIiwgdHlwZTogImN0YSIsIHZhcmlhbnQ6ICJtaW5pbWFsIiwgb3JkZXI6IDQwIH0sCiAgXSwKICBzZXJ2aWNlczogWwogICAgeyBpZDogInNlcnZpY2VzLWhlcm8iLCB0eXBlOiAiaGVybyIsIHZhcmlhbnQ6ICJlZGl0b3JpYWwiLCBvcmRlcjogMCB9LAogICAgeyBpZDogInNlcnZpY2VzLWxpc3QiLCB0eXBlOiAic2VydmljZXMiLCB2YXJpYW50OiAicG9saWZvcm0iLCBvcmRlcjogMTAsIHNvdXJjZTogInNlcnZpY2VzIiB9LAogICAgeyBpZDogInNlcnZpY2VzLXByb2Nlc3MiLCB0eXBlOiAicHJvY2VzcyIsIHZhcmlhbnQ6ICJ0aW1lbGluZSIsIG9yZGVyOiAyMCB9LAogICAgeyBpZDogInNlcnZpY2VzLWZhcSIsIHR5cGU6ICJmYXEiLCB2YXJpYW50OiAic3BsaXQiLCBvcmRlcjogMzAsIHNvdXJjZTogImZhcXMiIH0sCiAgICB7IGlkOiAic2VydmljZXMtY3RhIiwgdHlwZTogImN0YSIsIHZhcmlhbnQ6ICJtaW5pbWFsIiwgb3JkZXI6IDQwIH0sCiAgXSwKICBwcm9qZWN0czogWwogICAgeyBpZDogInByb2plY3RzLWhlcm8iLCB0eXBlOiAiaGVybyIsIHZhcmlhbnQ6ICJlZGl0b3JpYWwiLCBvcmRlcjogMCB9LAogICAgeyBpZDogInByb2plY3RzLWxpc3QiLCB0eXBlOiAicHJvamVjdHMiLCB2YXJpYW50OiAibGFzLWdyaWQiLCBvcmRlcjogMTAsIHNvdXJjZTogInByb2plY3RzIiB9LAogICAgeyBpZDogInByb2plY3RzLWN0YSIsIHR5cGU6ICJjdGEiLCB2YXJpYW50OiAibWluaW1hbCIsIG9yZGVyOiAyMCB9LAogIF0sCiAgY29udGFjdDogWwogICAgeyBpZDogImNvbnRhY3QtaGVybyIsIHR5cGU6ICJoZXJvIiwgdmFyaWFudDogIm1pbmltYWwiLCBvcmRlcjogMCB9LAogICAgeyBpZDogImNvbnRhY3QtY3RhIiwgdHlwZTogImN0YSIsIHZhcmlhbnQ6ICJtaW5pbWFsIiwgb3JkZXI6IDEwIH0sCiAgXSwKfTsKCmZ1bmN0aW9uIGdldFNvdXJjZURhdGEoc291cmNlOiBDbXNDb250ZW50U291cmNlLCBjb250ZW50OiBQdWJsaWNPdmVydmlld0RhdGEpOiB1bmtub3duW10gewogIHN3aXRjaCAoc291cmNlKSB7CiAgICBjYXNlICJzZXJ2aWNlcyI6CiAgICAgIHJldHVybiBjb250ZW50LnNlcnZpY2VzOwogICAgY2FzZSAicHJvamVjdHMiOgogICAgICByZXR1cm4gY29udGVudC5wcm9qZWN0czsKICAgIGNhc2UgInRlYW0iOgogICAgICByZXR1cm4gY29udGVudC50ZWFtOwogICAgY2FzZSAidGVzdGltb25pYWxzIjoKICAgICAgcmV0dXJuIGNvbnRlbnQudGVzdGltb25pYWxzOwogICAgY2FzZSAiZmFxcyI6CiAgICAgIHJldHVybiBjb250ZW50LmZhcXM7CiAgfQp9CgpmdW5jdGlvbiBoeWRyYXRlU2VjdGlvbnMocGFnZUtleTogUHVibGljUGFnZUtleSwgY29udGVudDogUHVibGljT3ZlcnZpZXdEYXRhKTogSHlkcmF0ZWRDbXNTZWN0aW9uW10gewogIHJldHVybiBQQUdFX1NFQ1RJT05TW3BhZ2VLZXldLm1hcCgoc2VlZCkgPT4gewogICAgbGV0IGRhdGEgPSBzZWVkLnNvdXJjZSA/IFsuLi5nZXRTb3VyY2VEYXRhKHNlZWQuc291cmNlLCBjb250ZW50KV0gOiBbXTsKICAgIGNvbnN0IHNlY3Rpb25Db250ZW50ID0gc2VlZC5jb250ZW50ID8/IHt9OwoKICAgIGlmIChzZWN0aW9uQ29udGVudC5mZWF0dXJlZE9ubHkgPT09IHRydWUpIHsKICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKAogICAgICAgIChpdGVtKSA9PiB0eXBlb2YgaXRlbSA9PT0gIm9iamVjdCIgJiYgaXRlbSAhPT0gbnVsbCAmJiAiaXNGZWF0dXJlZCIgaW4gaXRlbSAmJiBpdGVtLmlzRmVhdHVyZWQgPT09IHRydWUsCiAgICAgICk7CiAgICB9CgogICAgaWYgKHR5cGVvZiBzZWN0aW9uQ29udGVudC5saW1pdCA9PT0gIm51bWJlciIgJiYgc2VjdGlvbkNvbnRlbnQubGltaXQgPiAwKSB7CiAgICAgIGRhdGEgPSBkYXRhLnNsaWNlKDAsIHNlY3Rpb25Db250ZW50LmxpbWl0KTsKICAgIH0KCiAgICByZXR1cm4gewogICAgICBpZDogc2VlZC5pZCwKICAgICAgdHlwZTogc2VlZC50eXBlLAogICAgICB2YXJpYW50OiBzZWVkLnZhcmlhbnQsCiAgICAgIGlzVmlzaWJsZTogdHJ1ZSwKICAgICAgb3JkZXI6IHNlZWQub3JkZXIsCiAgICAgIGNvbnRlbnQ6IHNlY3Rpb25Db250ZW50LAogICAgICBzb3VyY2U6IHNlZWQuc291cmNlID8/IG51bGwsCiAgICAgIGRhdGEsCiAgICB9OwogIH0pOwp9CgpmdW5jdGlvbiByZXNvbHZlTWV0YWRhdGEocGFnZUtleTogUHVibGljUGFnZUtleSwgc2l0ZU5hbWU6IHN0cmluZywgZGVmYXVsdHM6IFNlb01ldGFkYXRhKTogU2VvTWV0YWRhdGEgewogIGNvbnN0IHRpdGxlID0gcGFnZUtleSA9PT0gImhvbWUiID8gZGVmYXVsdHMudGl0bGUgfHwgc2l0ZU5hbWUgOiBgJHtQQUdFX1RJVExFU1twYWdlS2V5XX0gfCAke3NpdGVOYW1lfWA7CiAgcmV0dXJuIHsKICAgIC4uLmRlZmF1bHRzLAogICAgdGl0bGUsCiAgICBub0luZGV4OiBkZWZhdWx0cy5ub0luZGV4ID8/IGZhbHNlLAogICAgbm9Gb2xsb3c6IGRlZmF1bHRzLm5vRm9sbG93ID8/IGZhbHNlLAogIH07Cn0KCmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQdWJsaWNQYWdlQ29udGV4dChwYWdlS2V5OiBQdWJsaWNQYWdlS2V5KTogUHJvbWlzZTxQdWJsaWNQYWdlQ29udGV4dD4gewogIGNvbnN0IFtjb250ZW50LCBzZXR0aW5ncywgbmF2aWdhdGlvbl0gPSBhd2FpdCBQcm9taXNlLmFsbChbCiAgICBnZXRQdWJsaWNPdmVydmlld0RhdGEoKSwKICAgIGdldFNpdGVTZXR0aW5nc1dpdGhEZWZhdWx0cygpLAogICAgZ2V0TmF2aWdhdGlvblNldHRpbmdzV2l0aERlZmF1bHRzKCksCiAgXSk7CgogIGNvbnN0IHNlY3Rpb25zID0gaHlkcmF0ZVNlY3Rpb25zKHBhZ2VLZXksIGNvbnRlbnQpOwogIGNvbnN0IHNpdGVOYW1lID0gc2V0dGluZ3MuaWRlbnRpdHkuY29tcGFueU5hbWUgfHwgc2V0dGluZ3MuaWRlbnRpdHkuc2l0ZU5hbWUgfHwgIkx1bmFyIEtvbnN0cnVrc2kiOwogIGNvbnN0IG1ldGFkYXRhID0gcmVzb2x2ZU1ldGFkYXRhKHBhZ2VLZXksIHNpdGVOYW1lLCBzZXR0aW5ncy5kZWZhdWx0U2VvKTsKCiAgcmV0dXJuIHsKICAgIHBhZ2U6IHsKICAgICAgaWQ6IHBhZ2VLZXksCiAgICAgIHRpdGxlOiBQQUdFX1RJVExFU1twYWdlS2V5XSwKICAgICAgc2x1ZzogcGFnZUtleSA9PT0gImhvbWUiID8gIiIgOiBwYWdlS2V5LAogICAgICBwYWdlVHlwZTogInN5c3RlbSIsCiAgICAgIHN5c3RlbUtleTogcGFnZUtleSwKICAgICAgc3RhdHVzOiAicHVibGlzaGVkIiwKICAgICAgc2VjdGlvbnMsCiAgICAgIHNlbzogbWV0YWRhdGEsCiAgICB9LAogICAgc2V0dGluZ3MsCiAgICBuYXZpZ2F0aW9uLAogICAgc2VjdGlvbnMsCiAgICBtZXRhZGF0YSwKICB9Owp9Cg=="
$payload["modules/public-site/public-site.types.ts"] = "aW1wb3J0IHR5cGUgeyBGQVEgfSBmcm9tICJAL21vZHVsZXMvZmFxcy9mYXEudHlwZXMiOwppbXBvcnQgdHlwZSB7IFByb2plY3QgfSBmcm9tICJAL21vZHVsZXMvcHJvamVjdHMvcHJvamVjdC50eXBlcyI7CmltcG9ydCB0eXBlIHsgQ29uc3RydWN0aW9uU2VydmljZSB9IGZyb20gIkAvbW9kdWxlcy9zZXJ2aWNlcy9zZXJ2aWNlLnR5cGVzIjsKaW1wb3J0IHR5cGUgeyBUZWFtTWVtYmVyIH0gZnJvbSAiQC9tb2R1bGVzL3RlYW0vdGVhbS50eXBlcyI7CmltcG9ydCB0eXBlIHsgVGVzdGltb25pYWwgfSBmcm9tICJAL21vZHVsZXMvdGVzdGltb25pYWxzL3Rlc3RpbW9uaWFsLnR5cGVzIjsKCmV4cG9ydCB0eXBlIFB1YmxpY1BhZ2VLZXkgPSAiaG9tZSIgfCAiYWJvdXQiIHwgInNlcnZpY2VzIiB8ICJwcm9qZWN0cyIgfCAiY29udGFjdCI7CmV4cG9ydCB0eXBlIENtc1N5c3RlbVBhZ2VLZXkgPSBQdWJsaWNQYWdlS2V5OwoKZXhwb3J0IGludGVyZmFjZSBTZW9NZXRhZGF0YSB7CiAgdGl0bGU/OiBzdHJpbmc7CiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7CiAgb2dJbWFnZVVybD86IHN0cmluZzsKICBjYW5vbmljYWxVcmw/OiBzdHJpbmc7CiAgbm9JbmRleD86IGJvb2xlYW47CiAgbm9Gb2xsb3c/OiBib29sZWFuOwp9CgpleHBvcnQgdHlwZSBOYXZpZ2F0aW9uVGFyZ2V0ID0gImludGVybmFsIiB8ICJleHRlcm5hbCI7CgpleHBvcnQgaW50ZXJmYWNlIE5hdmlnYXRpb25DaGlsZEl0ZW0gewogIGlkOiBzdHJpbmc7CiAgbGFiZWw6IHN0cmluZzsKICBocmVmOiBzdHJpbmc7CiAgdGFyZ2V0OiBOYXZpZ2F0aW9uVGFyZ2V0OwogIG9wZW5Jbk5ld1RhYjogYm9vbGVhbjsKICBpc1Zpc2libGU6IGJvb2xlYW47CiAgb3JkZXI6IG51bWJlcjsKfQoKZXhwb3J0IGludGVyZmFjZSBOYXZpZ2F0aW9uSXRlbSBleHRlbmRzIE5hdmlnYXRpb25DaGlsZEl0ZW0gewogIGNoaWxkcmVuOiBOYXZpZ2F0aW9uQ2hpbGRJdGVtW107Cn0KCmV4cG9ydCBpbnRlcmZhY2UgTmF2aWdhdGlvblNldHRpbmdzIHsKICBpZDogc3RyaW5nOwogIGhlYWRlcjogTmF2aWdhdGlvbkl0ZW1bXTsKICBmb290ZXJQcmltYXJ5OiBOYXZpZ2F0aW9uSXRlbVtdOwogIGZvb3RlclNlY29uZGFyeTogTmF2aWdhdGlvbkl0ZW1bXTsKICBjcmVhdGVkQXQ/OiBzdHJpbmc7CiAgdXBkYXRlZEF0Pzogc3RyaW5nOwp9CgpleHBvcnQgaW50ZXJmYWNlIFNvY2lhbExpbmsgewogIGlkOiBzdHJpbmc7CiAgbGFiZWw6IHN0cmluZzsKICB1cmw6IHN0cmluZzsKICBpc1Zpc2libGU6IGJvb2xlYW47CiAgb3JkZXI6IG51bWJlcjsKfQoKZXhwb3J0IGludGVyZmFjZSBTaXRlSWRlbnRpdHkgewogIHNpdGVOYW1lOiBzdHJpbmc7CiAgY29tcGFueU5hbWU6IHN0cmluZzsKICB0YWdsaW5lOiBzdHJpbmc7CiAgZGVzY3JpcHRpb246IHN0cmluZzsKICBsb2dvVXJsOiBzdHJpbmc7CiAgbG9nb0RhcmtVcmw6IHN0cmluZzsKICBmYXZpY29uVXJsOiBzdHJpbmc7Cn0KCmV4cG9ydCBpbnRlcmZhY2UgU2l0ZUNvbnRhY3QgewogIGVtYWlsOiBzdHJpbmc7CiAgcGhvbmU6IHN0cmluZzsKICB3aGF0c2FwcDogc3RyaW5nOwogIGFkZHJlc3M6IHN0cmluZzsKICBjaXR5OiBzdHJpbmc7CiAgcHJvdmluY2U6IHN0cmluZzsKICBwb3N0YWxDb2RlOiBzdHJpbmc7CiAgbWFwc1VybDogc3RyaW5nOwp9CgpleHBvcnQgaW50ZXJmYWNlIEZvb3RlclNldHRpbmdzIHsKICBzaG9ydERlc2NyaXB0aW9uOiBzdHJpbmc7CiAgY29weXJpZ2h0VGV4dDogc3RyaW5nOwp9CgpleHBvcnQgaW50ZXJmYWNlIFNpdGVTZXR0aW5ncyB7CiAgaWQ6IHN0cmluZzsKICBpZGVudGl0eTogU2l0ZUlkZW50aXR5OwogIGNvbnRhY3Q6IFNpdGVDb250YWN0OwogIHNvY2lhbExpbmtzOiBTb2NpYWxMaW5rW107CiAgZm9vdGVyOiBGb290ZXJTZXR0aW5nczsKICBkZWZhdWx0U2VvOiBTZW9NZXRhZGF0YTsKICBjcmVhdGVkQXQ/OiBzdHJpbmc7CiAgdXBkYXRlZEF0Pzogc3RyaW5nOwp9CgpleHBvcnQgdHlwZSBDbXNDb250ZW50U291cmNlID0gInNlcnZpY2VzIiB8ICJwcm9qZWN0cyIgfCAidGVhbSIgfCAidGVzdGltb25pYWxzIiB8ICJmYXFzIjsKZXhwb3J0IHR5cGUgQ21zQmxvY2tUeXBlID0gImhlcm8iIHwgImludHJvIiB8ICJzdGF0cyIgfCAic2VydmljZXMiIHwgInByb2Nlc3MiIHwgInByb2plY3RzIiB8ICJnYWxsZXJ5IiB8ICJ0ZWFtIiB8ICJ0ZXN0aW1vbmlhbHMiIHwgImZhcSIgfCAiY3RhIjsKCmV4cG9ydCBpbnRlcmZhY2UgSHlkcmF0ZWRDbXNTZWN0aW9uIHsKICBpZDogc3RyaW5nOwogIHR5cGU6IENtc0Jsb2NrVHlwZTsKICB2YXJpYW50OiBzdHJpbmc7CiAgaXNWaXNpYmxlOiBib29sZWFuOwogIG9yZGVyOiBudW1iZXI7CiAgY29udGVudDogUmVjb3JkPHN0cmluZywgdW5rbm93bj47CiAgc291cmNlOiBDbXNDb250ZW50U291cmNlIHwgbnVsbDsKICBkYXRhOiB1bmtub3duW107Cn0KCmV4cG9ydCBpbnRlcmZhY2UgUHVibGljUGFnZVJlY29yZCB7CiAgaWQ6IHN0cmluZzsKICB0aXRsZTogc3RyaW5nOwogIHNsdWc6IHN0cmluZzsKICBwYWdlVHlwZTogInN5c3RlbSI7CiAgc3lzdGVtS2V5OiBQdWJsaWNQYWdlS2V5OwogIHN0YXR1czogInB1Ymxpc2hlZCI7CiAgc2VjdGlvbnM6IEh5ZHJhdGVkQ21zU2VjdGlvbltdOwogIHNlbzogU2VvTWV0YWRhdGE7Cn0KCmV4cG9ydCBpbnRlcmZhY2UgUHVibGljT3ZlcnZpZXdEYXRhIHsKICBzZXJ2aWNlczogQ29uc3RydWN0aW9uU2VydmljZVtdOwogIHByb2plY3RzOiBQcm9qZWN0W107CiAgdGVhbTogVGVhbU1lbWJlcltdOwogIHRlc3RpbW9uaWFsczogVGVzdGltb25pYWxbXTsKICBmYXFzOiBGQVFbXTsKfQoKZXhwb3J0IGludGVyZmFjZSBQdWJsaWNQYWdlQ29udGV4dCB7CiAgcGFnZTogUHVibGljUGFnZVJlY29yZDsKICBzZXR0aW5nczogU2l0ZVNldHRpbmdzOwogIG5hdmlnYXRpb246IE5hdmlnYXRpb25TZXR0aW5nczsKICBzZWN0aW9uczogSHlkcmF0ZWRDbXNTZWN0aW9uW107CiAgbWV0YWRhdGE6IFNlb01ldGFkYXRhOwp9Cg=="
$payload["modules/public-site/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9wdWJsaWMtc2l0ZS5zZXJ2aWNlIjsKZXhwb3J0ICogZnJvbSAiLi9zaXRlLWNvbmZpZyI7Cg=="
$payload["modules/public-site/site-config.ts"] = "aW1wb3J0IHsgZ2V0QWRtaW5EYiB9IGZyb20gIkAvbGliL2ZpcmViYXNlL2FkbWluIjsKaW1wb3J0IHsgc2VyaWFsaXplRG9jdW1lbnQgfSBmcm9tICJAL2xpYi9maXJlc3RvcmUiOwoKaW1wb3J0IHR5cGUgeyBOYXZpZ2F0aW9uSXRlbSwgTmF2aWdhdGlvblNldHRpbmdzLCBTaXRlU2V0dGluZ3MgfSBmcm9tICIuL3B1YmxpYy1zaXRlLnR5cGVzIjsKCmZ1bmN0aW9uIG5hdmlnYXRpb25JdGVtKGlkOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcsIGhyZWY6IHN0cmluZywgb3JkZXI6IG51bWJlcik6IE5hdmlnYXRpb25JdGVtIHsKICByZXR1cm4gewogICAgaWQsCiAgICBsYWJlbCwKICAgIGhyZWYsCiAgICB0YXJnZXQ6ICJpbnRlcm5hbCIsCiAgICBvcGVuSW5OZXdUYWI6IGZhbHNlLAogICAgaXNWaXNpYmxlOiB0cnVlLAogICAgb3JkZXIsCiAgICBjaGlsZHJlbjogW10sCiAgfTsKfQoKY29uc3QgREVGQVVMVF9OQVZJR0FUSU9OOiBOYXZpZ2F0aW9uU2V0dGluZ3MgPSB7CiAgaWQ6ICJtYWluIiwKICBoZWFkZXI6IFsKICAgIG5hdmlnYXRpb25JdGVtKCJuYXYtc2VydmljZXMiLCAiTGF5YW5hbiIsICIvc2VydmljZXMiLCAxMCksCiAgICBuYXZpZ2F0aW9uSXRlbSgibmF2LXByb2plY3RzIiwgIlBvcnRmb2xpbyIsICIvcHJvamVjdHMiLCAyMCksCiAgICBuYXZpZ2F0aW9uSXRlbSgibmF2LWFib3V0IiwgIlRlbnRhbmciLCAiL2Fib3V0IiwgMzApLAogICAgbmF2aWdhdGlvbkl0ZW0oIm5hdi1jb250YWN0IiwgIktvbnRhayIsICIvY29udGFjdCIsIDQwKSwKICBdLAogIGZvb3RlclByaW1hcnk6IFsKICAgIG5hdmlnYXRpb25JdGVtKCJmb290ZXItaG9tZSIsICJCZXJhbmRhIiwgIi8iLCAxMCksCiAgICBuYXZpZ2F0aW9uSXRlbSgiZm9vdGVyLXNlcnZpY2VzIiwgIkxheWFuYW4iLCAiL3NlcnZpY2VzIiwgMjApLAogICAgbmF2aWdhdGlvbkl0ZW0oImZvb3Rlci1wcm9qZWN0cyIsICJQb3J0Zm9saW8iLCAiL3Byb2plY3RzIiwgMzApLAogICAgbmF2aWdhdGlvbkl0ZW0oImZvb3Rlci1hYm91dCIsICJUZW50YW5nIiwgIi9hYm91dCIsIDQwKSwKICAgIG5hdmlnYXRpb25JdGVtKCJmb290ZXItY29udGFjdCIsICJLb250YWsiLCAiL2NvbnRhY3QiLCA1MCksCiAgXSwKICBmb290ZXJTZWNvbmRhcnk6IFtdLAp9OwoKY29uc3QgREVGQVVMVF9TRVRUSU5HUzogU2l0ZVNldHRpbmdzID0gewogIGlkOiAiZ2VuZXJhbCIsCiAgaWRlbnRpdHk6IHsKICAgIHNpdGVOYW1lOiAiTHVuYXIgS29uc3RydWtzaSIsCiAgICBjb21wYW55TmFtZTogIkx1bmFyIEtvbnN0cnVrc2kiLAogICAgdGFnbGluZTogIiIsCiAgICBkZXNjcmlwdGlvbjogIiIsCiAgICBsb2dvVXJsOiAiIiwKICAgIGxvZ29EYXJrVXJsOiAiIiwKICAgIGZhdmljb25Vcmw6ICIiLAogIH0sCiAgY29udGFjdDogewogICAgZW1haWw6ICIiLAogICAgcGhvbmU6ICIiLAogICAgd2hhdHNhcHA6ICIiLAogICAgYWRkcmVzczogIiIsCiAgICBjaXR5OiAiIiwKICAgIHByb3ZpbmNlOiAiIiwKICAgIHBvc3RhbENvZGU6ICIiLAogICAgbWFwc1VybDogIiIsCiAgfSwKICBzb2NpYWxMaW5rczogW10sCiAgZm9vdGVyOiB7CiAgICBzaG9ydERlc2NyaXB0aW9uOiAiIiwKICAgIGNvcHlyaWdodFRleHQ6ICJMdW5hciBLb25zdHJ1a3NpLiBBbGwgcmlnaHRzIHJlc2VydmVkLiIsCiAgfSwKICBkZWZhdWx0U2VvOiB7CiAgICB0aXRsZTogIkx1bmFyIEtvbnN0cnVrc2kiLAogICAgZGVzY3JpcHRpb246ICIiLAogICAgb2dJbWFnZVVybDogIiIsCiAgICBjYW5vbmljYWxVcmw6ICIiLAogICAgbm9JbmRleDogZmFsc2UsCiAgICBub0ZvbGxvdzogZmFsc2UsCiAgfSwKfTsKCmFzeW5jIGZ1bmN0aW9uIHJlYWRTaW5nbGV0b248VD4oY29sbGVjdGlvbjogc3RyaW5nLCBkb2N1bWVudElkOiBzdHJpbmcpIHsKICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGdldEFkbWluRGIoKS5jb2xsZWN0aW9uKGNvbGxlY3Rpb24pLmRvYyhkb2N1bWVudElkKS5nZXQoKTsKICBpZiAoIXNuYXBzaG90LmV4aXN0cykgcmV0dXJuIG51bGw7CiAgcmV0dXJuIHNlcmlhbGl6ZURvY3VtZW50PFQ+KHNuYXBzaG90LmlkLCBzbmFwc2hvdC5kYXRhKCkpOwp9CgpleHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmF2aWdhdGlvblNldHRpbmdzV2l0aERlZmF1bHRzKCk6IFByb21pc2U8TmF2aWdhdGlvblNldHRpbmdzPiB7CiAgcmV0dXJuIChhd2FpdCByZWFkU2luZ2xldG9uPE5hdmlnYXRpb25TZXR0aW5ncz4oIm5hdmlnYXRpb24iLCAibWFpbiIpKSA/PyBERUZBVUxUX05BVklHQVRJT047Cn0KCmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTaXRlU2V0dGluZ3NXaXRoRGVmYXVsdHMoKTogUHJvbWlzZTxTaXRlU2V0dGluZ3M+IHsKICBjb25zdCBzYXZlZCA9IGF3YWl0IHJlYWRTaW5nbGV0b248U2l0ZVNldHRpbmdzPigic2l0ZVNldHRpbmdzIiwgImdlbmVyYWwiKTsKICBpZiAoIXNhdmVkKSByZXR1cm4gREVGQVVMVF9TRVRUSU5HUzsKCiAgcmV0dXJuIHsKICAgIC4uLkRFRkFVTFRfU0VUVElOR1MsCiAgICAuLi5zYXZlZCwKICAgIGlkZW50aXR5OiB7IC4uLkRFRkFVTFRfU0VUVElOR1MuaWRlbnRpdHksIC4uLnNhdmVkLmlkZW50aXR5IH0sCiAgICBjb250YWN0OiB7IC4uLkRFRkFVTFRfU0VUVElOR1MuY29udGFjdCwgLi4uc2F2ZWQuY29udGFjdCB9LAogICAgZm9vdGVyOiB7IC4uLkRFRkFVTFRfU0VUVElOR1MuZm9vdGVyLCAuLi5zYXZlZC5mb290ZXIgfSwKICAgIGRlZmF1bHRTZW86IHsgLi4uREVGQVVMVF9TRVRUSU5HUy5kZWZhdWx0U2VvLCAuLi5zYXZlZC5kZWZhdWx0U2VvIH0sCiAgICBzb2NpYWxMaW5rczogQXJyYXkuaXNBcnJheShzYXZlZC5zb2NpYWxMaW5rcykgPyBzYXZlZC5zb2NpYWxMaW5rcyA6IFtdLAogIH07Cn0K"
$payload["modules/services/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9zZXJ2aWNlLnR5cGVzIjsKZXhwb3J0ICogZnJvbSAiLi9zZXJ2aWNlLnNjaGVtYSI7Cg=="
$payload["modules/services/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi9zZXJ2aWNlLnJlcG9zaXRvcnkiOwpleHBvcnQgKiBmcm9tICIuL3NlcnZpY2Uuc2VydmljZSI7Cg=="
$payload["modules/team/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi90ZWFtLnR5cGVzIjsKZXhwb3J0ICogZnJvbSAiLi90ZWFtLnNjaGVtYSI7Cg=="
$payload["modules/team/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi90ZWFtLnJlcG9zaXRvcnkiOwpleHBvcnQgKiBmcm9tICIuL3RlYW0uc2VydmljZSI7Cg=="
$payload["modules/testimonials/index.ts"] = "ZXhwb3J0ICogZnJvbSAiLi90ZXN0aW1vbmlhbC50eXBlcyI7CmV4cG9ydCAqIGZyb20gIi4vdGVzdGltb25pYWwuc2NoZW1hIjsK"
$payload["modules/testimonials/server.ts"] = "ZXhwb3J0ICogZnJvbSAiLi90ZXN0aW1vbmlhbC5yZXBvc2l0b3J5IjsKZXhwb3J0ICogZnJvbSAiLi90ZXN0aW1vbmlhbC5zZXJ2aWNlIjsK"

foreach ($entry in $payload.GetEnumerator()) {
  $target = Join-Path $repoRoot $entry.Key
  Write-Utf8NoBom $target (Decode $entry.Value)
}

Write-Step "Memigrasikan import path ke arsitektur modules/..."

$replacements = @(
  @("@/repositories/base.repository", "@/modules/_shared/base.repository"),
  @("@/validators/common", "@/modules/_shared/common.schema"),
  @("@/repositories/admin.repository", "@/modules/admin/admin.repository"),
  @("@/types/admin", "@/modules/admin/admin.types"),
  @("@/lib/auth", "@/modules/admin/admin-auth.service"),
  @("@/repositories/faq.repository", "@/modules/faqs/faq.repository"),
  @("@/services/faq.service", "@/modules/faqs/faq.service"),
  @("@/types/faq", "@/modules/faqs/faq.types"),
  @("@/validators/faq.validator", "@/modules/faqs/faq.schema"),
  @("@/repositories/project.repository", "@/modules/projects/project.repository"),
  @("@/services/project.service", "@/modules/projects/project.service"),
  @("@/types/project", "@/modules/projects/project.types"),
  @("@/validators/project.validator", "@/modules/projects/project.schema"),
  @("@/repositories/service.repository", "@/modules/services/service.repository"),
  @("@/services/service.service", "@/modules/services/service.service"),
  @("@/types/service", "@/modules/services/service.types"),
  @("@/validators/service.validator", "@/modules/services/service.schema"),
  @("@/repositories/team.repository", "@/modules/team/team.repository"),
  @("@/services/team.service", "@/modules/team/team.service"),
  @("@/types/team", "@/modules/team/team.types"),
  @("@/validators/team.validator", "@/modules/team/team.schema"),
  @("@/repositories/testimonial.repository", "@/modules/testimonials/testimonial.repository"),
  @("@/services/testimonial.service", "@/modules/testimonials/testimonial.service"),
  @("@/types/testimonial", "@/modules/testimonials/testimonial.types"),
  @("@/validators/testimonial.validator", "@/modules/testimonials/testimonial.schema"),
  @("@/types/media", "@/modules/media/media.types"),
  @("@/services/upload.service", "@/modules/media/upload.service"),
  @("@/utils/api-auth", "@/shared/api-auth"),
  @("@/utils/slug", "@/shared/slug"),
  @("@/utils/unique-slug", "@/shared/unique-slug"),
  @("@/utils/upload-client", "@/shared/upload-client"),
  @("@/features/admin/server", "@/modules/admin/server"),
  @("@/features/admin", "@/modules/admin"),
  @("@/features/faqs/server", "@/modules/faqs/server"),
  @("@/features/faqs", "@/modules/faqs"),
  @("@/features/projects/server", "@/modules/projects/server"),
  @("@/features/projects", "@/modules/projects"),
  @("@/features/services/server", "@/modules/services/server"),
  @("@/features/services", "@/modules/services"),
  @("@/features/team/server", "@/modules/team/server"),
  @("@/features/team", "@/modules/team"),
  @("@/features/testimonials/server", "@/modules/testimonials/server"),
  @("@/features/testimonials", "@/modules/testimonials"),
  @("@/features/media/server", "@/modules/media/server"),
  @("@/features/media/client", "@/modules/media/client"),
  @("@/features/media", "@/modules/media"),
  @("@/features/leads", "@/modules/leads"),
  @("@/features/shared/data/base.repository", "@/modules/_shared/base.repository"),
  @("@/features/shared/validation/common", "@/modules/_shared/common.schema"),
  @("@/features/shared/errors/domain-error", "@/modules/_shared/domain-error"),
  @("@/features/shared/http/route-handler", "@/modules/_shared/route-handler"),
  @("@/features/shared/slug/slug", "@/shared/slug"),
  @("@/features/shared/slug/unique-slug", "@/shared/unique-slug"),
  @("@/features/public-site/server", "@/modules/public-site/server"),
  @("@/features/public-site", "@/modules/public-site"),
  @("@/features/navigation/navigation.types", "@/modules/public-site"),
  @("@/features/site-settings/site-settings.types", "@/modules/public-site"),
  @("@/features/navigation/server", "@/modules/public-site/server"),
  @("@/features/site-settings/server", "@/modules/public-site/server"),
  @("@/features/seo/seo.types", "@/modules/public-site"),
  @("@/features/seo", "@/modules/public-site"),
  @("@/features/pages/page.types", "@/modules/public-site"),
  @("@/cms/blocks/block.types", "@/modules/public-site"),
  @("@/cms", "@/modules/public-site")
)

foreach ($pair in $replacements) {
  Replace-CodeText $pair[0] $pair[1]
}

# Relative bridge imports inside implementations copied from Phase 1.
Replace-CodeText 'from "./base.repository"' 'from "@/modules/_shared/base.repository"'
Replace-CodeText "from './base.repository'" "from '@/modules/_shared/base.repository'"
Replace-CodeText 'from "./common"' 'from "@/modules/_shared/common.schema"'
Replace-CodeText "from './common'" "from '@/modules/_shared/common.schema'"
Replace-CodeText 'from "./media"' 'from "@/modules/media/media.types"'
Replace-CodeText "from './media'" "from '@/modules/media/media.types'"
Replace-CodeText 'from "./project.validator"' 'from "./project.schema"'
Replace-CodeText 'from "./service.validator"' 'from "./service.schema"'
Replace-CodeText 'from "./team.validator"' 'from "./team.schema"'
Replace-CodeText 'from "./testimonial.validator"' 'from "./testimonial.schema"'
Replace-CodeText 'from "./faq.validator"' 'from "./faq.schema"'
Replace-CodeText "from './project.validator'" "from './project.schema'"
Replace-CodeText "from './service.validator'" "from './service.schema'"
Replace-CodeText "from './team.validator'" "from './team.schema'"
Replace-CodeText "from './testimonial.validator'" "from './testimonial.schema'"
Replace-CodeText "from './faq.validator'" "from './faq.schema'"

Write-Step "Menghapus Full CMS, compatibility wrappers, dan artefak fase lama..."

$obsoleteDirectories = @(
  "cms",
  "app/admin/(dashboard)/cms",
  "app/api/admin/cms",
  "components/admin/cms",
  "features/pages",
  "features/navigation",
  "features/site-settings",
  "features/seo",
  "features/content",
  "features/public-site",
  "features/admin",
  "features/faqs",
  "features/media",
  "features/projects",
  "features/services",
  "features/team",
  "features/testimonials",
  "features/leads",
  "features/shared"
)
foreach ($path in $obsoleteDirectories) { Remove-PathSafe $path }

# Seed endpoints/UI from the retired Full CMS.
foreach ($path in @(
  "components/admin/cms-seed-manager.tsx",
  "components/admin/seed/cms-seed-manager.tsx",
  "app/api/admin/seed/cms",
  "app/admin/(dashboard)/seed/cms"
)) { Remove-PathSafe $path }

# Old horizontal architecture is now duplicated by modules/.
foreach ($path in @("repositories", "services", "types", "validators", "utils")) { Remove-PathSafe $path }
Remove-PathSafe "lib/auth.ts"

# Files that are repository/build artifacts rather than runtime source.
foreach ($path in @(
  "lunar-construction-complete.zip",
  "AGENTS.md",
  "CLAUDE.md",
  "AUDIT_REPORT.md",
  "ARCHITECTURE.md",
  "CMS_FOUNDATION.md",
  "CMS_MODULES.md",
  "PUBLIC_DATA_ARCHITECTURE.md",
  "LEADS_CONTACT_FLOW.md",
  "ADMIN_CMS_UI.md",
  "CMS_SEED_GUIDE.md",
  "PHASE7_PUBLIC_REDESIGN.md",
  "PHASE7_1_DESIGN_RESET.md",
  "PHASE7_2_CONSTRUCTION_DIRECTION.md",
  "PHASE7_3_REFERENCE_MATCH.md",
  "PHASE7_4_DATABASE_REFERENCE_SYNC.md",
  "PHASE7_5_FIELD_ARCHIVE.md",
  "PHASE7_6_GRID_MEDIA_POLISH.md"
)) { Remove-PathSafe $path }

# Local throw-away installers/backups from the migration history.
$oldScripts = Get-ChildItem -LiteralPath $repoRoot -File -ErrorAction SilentlyContinue | Where-Object {
  $_.Name -like "Apply_Lunar_*.ps1" -or
  $_.Name -like "Fix_Lunar_*.ps1" -or
  $_.Name -like "Reset_Lunar_*.ps1" -or
  $_.Name -like "Lunar_Konstruksi_Fase_*.patch"
}
foreach ($artifact in $oldScripts) {
  Remove-Item -LiteralPath $artifact.FullName -Force
  Write-Host "[CLEANUP] remove $($artifact.Name)" -ForegroundColor DarkGray
}
Remove-PathSafe ".lunar-backups"

# Remove empty features root if nothing unknown remains.
Remove-EmptyDirectory "features"

Write-Step "Memeriksa import legacy dan folder yang seharusnya sudah hilang..."
$legacyTokens = @(
  "@/repositories/",
  "@/services/",
  "@/types/",
  "@/validators/",
  "@/utils/",
  "@/features/",
  "@/cms"
)
$legacyHits = @()
foreach ($file in Get-SourceFiles) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  foreach ($token in $legacyTokens) {
    if ($content.Contains($token)) { $legacyHits += "$($file.FullName) -> $token" }
  }
}

$leftoverFeatureFiles = @()
if (Test-Path -LiteralPath "features") {
  $leftoverFeatureFiles = @(Get-ChildItem -LiteralPath "features" -Recurse -File)
}

Write-Host ""
if ($legacyHits.Count -gt 0 -or $leftoverFeatureFiles.Count -gt 0) {
  Write-Host "[CLEANUP] SELESAI DENGAN CATATAN." -ForegroundColor Yellow
  if ($legacyHits.Count -gt 0) {
    Write-Host "Masih ada import legacy yang tidak dikenali otomatis:" -ForegroundColor Yellow
    $legacyHits | Sort-Object -Unique | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  }
  if ($leftoverFeatureFiles.Count -gt 0) {
    Write-Host "Masih ada file features/ yang tidak dikenal dan sengaja tidak ditebak:" -ForegroundColor Yellow
    $leftoverFeatureFiles | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Yellow }
  }
} else {
  Write-Host "[CLEANUP] Import legacy dan folder Full CMS: bersih." -ForegroundColor Green
}

Write-Host ""
Write-Host "[CLEANUP] Struktur backend utama:" -ForegroundColor Green
Write-Host "  modules/_shared"
Write-Host "  modules/admin"
Write-Host "  modules/faqs"
if ($hadLeads) { Write-Host "  modules/leads" }
Write-Host "  modules/media"
Write-Host "  modules/projects"
Write-Host "  modules/public-site"
Write-Host "  modules/services"
Write-Host "  modules/team"
Write-Host "  modules/testimonials"
Write-Host "  shared"
Write-Host ""
Write-Host "Tidak ada dependency baru. npm install tidak diperlukan." -ForegroundColor Green
Write-Host ""
Write-Host "VALIDASI WAJIB sebelum commit:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  git diff --check"
Write-Host "  git status --short"
Write-Host ""
Write-Host "Rollback jika diperlukan:" -ForegroundColor Cyan
Write-Host "  git reset --hard $head"
