Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) { Write-Host "[LUNAR SERVICE] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[LUNAR SERVICE] GAGAL: $Message" -ForegroundColor Red; exit 1 }
function Read-Text([string]$Path) { return [System.IO.File]::ReadAllText($Path) }
function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8)
}
function Decode([string]$Value) { return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value)) }

function Replace-SectionByMarker([string]$Content, [string[]]$Markers, [string]$Replacement) {
  $markerIndex = -1
  foreach ($marker in $Markers) {
    $candidate = $Content.IndexOf($marker)
    if ($candidate -ge 0) { $markerIndex = $candidate; break }
  }
  if ($markerIndex -lt 0) { return $Content }
  $start = $Content.LastIndexOf("<section", $markerIndex)
  if ($start -lt 0) { return $Content }
  $end = $Content.IndexOf("</section>", $markerIndex)
  if ($end -lt 0) { return $Content }
  $end += "</section>".Length
  return $Content.Substring(0, $start) + $Replacement + $Content.Substring($end)
}

function Remove-EnclosingDivByMarker([string]$Content, [string]$Marker) {
  $markerIndex = $Content.IndexOf($Marker)
  if ($markerIndex -lt 0) { return $Content }
  $start = $Content.LastIndexOf("<div", $markerIndex)
  if ($start -lt 0) { return $Content }

  $tagRegex = New-Object System.Text.RegularExpressions.Regex('<div\b|</div>')
  $matches = $tagRegex.Matches($Content, $start)
  $depth = 0
  foreach ($match in $matches) {
    if ($match.Value -like '<div*') { $depth++ } else { $depth-- }
    if ($depth -eq 0) {
      $end = $match.Index + $match.Length
      return $Content.Remove($start, $end - $start)
    }
  }
  return $Content
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan dari repository Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
$contactPath = Join-Path $repoRoot "components/site/formwork/contact.tsx"
$packagePath = Join-Path $repoRoot "package.json"
if (-not (Test-Path -LiteralPath $homePath)) { Fail "home.tsx tidak ditemukan." }

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/service-carousel-lint-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
foreach ($relative in @("components/site/formwork/home.tsx", "components/site/formwork/about.tsx", "components/site/formwork/contact.tsx", "package.json")) {
  $source = Join-Path $repoRoot $relative
  if (Test-Path -LiteralPath $source) {
    $target = Join-Path $backupRoot $relative
    $targetParent = Split-Path -Parent $target
    if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) { New-Item -ItemType Directory -Force -Path $targetParent | Out-Null }
    Copy-Item -LiteralPath $source -Destination $target -Force
  }
}
Step "Backup: $backupRoot"

# 1. Client component service carousel.
$serviceComponentPath = Join-Path $repoRoot "components/site/formwork/service-showcase.tsx"
$servicePayload = "InVzZSBjbGllbnQiOwoKaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAicmVhY3QiOwppbXBvcnQgTGluayBmcm9tICJuZXh0L2xpbmsiOwppbXBvcnQgeyBBcnJvd0xlZnQsIEFycm93UmlnaHQgfSBmcm9tICJsdWNpZGUtcmVhY3QiOwoKZXhwb3J0IHR5cGUgU2VydmljZVNob3djYXNlSXRlbSA9IHsKICBpZDogc3RyaW5nOwogIHNsdWc6IHN0cmluZzsKICB0aXRsZTogc3RyaW5nOwogIGRlc2NyaXB0aW9uOiBzdHJpbmc7CiAgaW1hZ2U6IHN0cmluZzsKICBjYXRlZ29yeTogc3RyaW5nOwp9OwoKY29uc3Qgb2Zmc2V0cyA9IFsKICAibWQ6LXRyYW5zbGF0ZS15LTMiLAogICJtZDp0cmFuc2xhdGUteS04IiwKICAibWQ6LXRyYW5zbGF0ZS15LTUiLAogICJtZDp0cmFuc2xhdGUteS0xMCIsCiAgIm1kOi10cmFuc2xhdGUteS0yIiwKICAibWQ6dHJhbnNsYXRlLXktNyIsCl07Cgpjb25zdCByYWRpaSA9IFsKICAiNDJweCAxNHB4IDU0cHggMThweCIsCiAgIjE4cHggNDhweCAxNnB4IDU2cHgiLAogICI1NnB4IDE2cHggNDJweCAxMnB4IiwKICAiMTZweCA1NHB4IDIwcHggNDZweCIsCiAgIjQ4cHggMThweCA1OHB4IDIwcHgiLAogICIyMHB4IDQ2cHggMTRweCA1MnB4IiwKXTsKCmV4cG9ydCBmdW5jdGlvbiBTZXJ2aWNlU2hvd2Nhc2UoeyBpdGVtcyB9OiB7IGl0ZW1zOiBTZXJ2aWNlU2hvd2Nhc2VJdGVtW10gfSkgewogIGNvbnN0IHRyYWNrUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTsKCiAgZnVuY3Rpb24gbW92ZShkaXJlY3Rpb246IC0xIHwgMSkgewogICAgY29uc3QgdHJhY2sgPSB0cmFja1JlZi5jdXJyZW50OwogICAgaWYgKCF0cmFjaykgcmV0dXJuOwoKICAgIHRyYWNrLnNjcm9sbEJ5KHsKICAgICAgbGVmdDogZGlyZWN0aW9uICogTWF0aC5tYXgoMzIwLCB0cmFjay5jbGllbnRXaWR0aCAqIDAuNzIpLAogICAgICBiZWhhdmlvcjogInNtb290aCIsCiAgICB9KTsKICB9CgogIHJldHVybiAoCiAgICA8c2VjdGlvbgogICAgICBjbGFzc05hbWU9InJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBib3JkZXItdCBib3JkZXItWyNkZGQ2Y2FdIHB4LTUgcHktMjAgc206cHgtOCBsZzpweC0xMiBsZzpweS0yOCIKICAgICAgc3R5bGU9e3sKICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6CiAgICAgICAgICAibGluZWFyLWdyYWRpZW50KHJnYmEoMjQsNDUsNzcsLjAzNSkgMXB4LCB0cmFuc3BhcmVudCAxcHgpLCBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjQsNDUsNzcsLjAzNSkgMXB4LCB0cmFuc3BhcmVudCAxcHgpIiwKICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogIjc2cHggNzZweCIsCiAgICAgIH19CiAgICA+CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIC1sZWZ0LTI0IHRvcC0xNCBoLTY0IHctNjQgcm91bmRlZC1mdWxsIGJnLVsjZGNiNDU4XS9bMC4wN10gYmx1ci0zeGwiIC8+CiAgICAgIDxkaXYgY2xhc3NOYW1lPSJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIC1yaWdodC0yNCBib3R0b20tMTAgaC04MCB3LTgwIHJvdW5kZWQtZnVsbCBiZy1bIzE4MmQ0ZF0vWzAuMDVdIGJsdXItM3hsIiAvPgoKICAgICAgPGRpdiBjbGFzc05hbWU9InJlbGF0aXZlIG14LWF1dG8gbWF4LXctWzE0ODBweF0iPgogICAgICAgIDxkaXYgY2xhc3NOYW1lPSJteC1hdXRvIG1heC13LVs3OTBweF0gdGV4dC1jZW50ZXIiPgogICAgICAgICAgPHAgY2xhc3NOYW1lPSJmb250LW1vbm8gdGV4dC1bOXB4XSBmb250LXNlbWlib2xkIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LVsjNjU3MTg0XSI+CiAgICAgICAgICAgIDAyIC8gQ2FwYWJpbGl0aWVzIC8gc2VydmljZXMKICAgICAgICAgIDwvcD4KICAgICAgICAgIDxoMiBjbGFzc05hbWU9Im10LTUgdGV4dC1bY2xhbXAoMi44NXJlbSw1LjF2dyw1LjhyZW0pXSBmb250LXNlbWlib2xkIHVwcGVyY2FzZSBsZWFkaW5nLVswLjldIHRyYWNraW5nLVstMC4wNTVlbV0gdGV4dC1bIzE0MjQzZl0iPgogICAgICAgICAgICBMYXlhbmFuIGhhcnVzIGxhbmdzdW5nIHRlcmJhY2EuCiAgICAgICAgICA8L2gyPgogICAgICAgICAgPHAgY2xhc3NOYW1lPSJteC1hdXRvIG10LTYgbWF4LXctMnhsIHRleHQtWzE1cHhdIGxlYWRpbmctOCB0ZXh0LVsjNWY2OTc2XSI+CiAgICAgICAgICAgIFNldGlhcCBsYXlhbmFuIHRhbXBpbCBzZWJhZ2FpIHBla2VyamFhbiBueWF0YSwgbGVuZ2thcCBkZW5nYW4gdmlzdWFsIGRhcmkgZGF0YSBTZXJ2aWNlLiBHZXNlciB1bnR1ayBtZWxpaGF0IHNjb3BlIGxhaW4gdGFucGEgbWVtYnVhdCBoYWxhbWFuIHRlcmFzYSBwZW51aCBkYW4ga2FrdS4KICAgICAgICAgIDwvcD4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdiBjbGFzc05hbWU9Im10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtNSBib3JkZXItdCBib3JkZXItWyNkOGQxYzZdIHB0LTUiPgogICAgICAgICAgPGRpdiBjbGFzc05hbWU9ImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGZvbnQtbW9ubyB0ZXh0LVs5cHhdIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xNWVtXSB0ZXh0LVsjNzQ4MDkyXSI+CiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iaC0yIHctMiByb3VuZGVkLWZ1bGwgYmctWyNkY2I0NThdIiAvPgogICAgICAgICAgICA8c3Bhbj5GaWVsZCBwYWNrYWdlcyAvIHtTdHJpbmcoaXRlbXMubGVuZ3RoKS5wYWRTdGFydCgyLCAiMCIpfTwvc3Bhbj4KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiI+CiAgICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAgICB0eXBlPSJidXR0b24iCiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gbW92ZSgtMSl9CiAgICAgICAgICAgICAgYXJpYS1sYWJlbD0iTGF5YW5hbiBzZWJlbHVtbnlhIgogICAgICAgICAgICAgIGNsYXNzTmFtZT0iZ3JpZCBoLTEwIHctMTAgcGxhY2UtaXRlbXMtY2VudGVyIHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLVsjY2ZjN2JhXSBiZy1bI2Y4ZjRlY10gdGV4dC1bIzE0MjQzZl0gdHJhbnNpdGlvbiBob3ZlcjotdHJhbnNsYXRlLXgtMC41IGhvdmVyOmJvcmRlci1bI2RjYjQ1OF0iCiAgICAgICAgICAgID4KICAgICAgICAgICAgICA8QXJyb3dMZWZ0IGNsYXNzTmFtZT0iaC00IHctNCIgLz4KICAgICAgICAgICAgPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24KICAgICAgICAgICAgICB0eXBlPSJidXR0b24iCiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gbW92ZSgxKX0KICAgICAgICAgICAgICBhcmlhLWxhYmVsPSJMYXlhbmFuIGJlcmlrdXRueWEiCiAgICAgICAgICAgICAgY2xhc3NOYW1lPSJncmlkIGgtMTAgdy0xMCBwbGFjZS1pdGVtcy1jZW50ZXIgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNjZmM3YmFdIGJnLVsjMTQyNDNmXSB0ZXh0LVsjZjdmMmU5XSB0cmFuc2l0aW9uIGhvdmVyOnRyYW5zbGF0ZS14LTAuNSIKICAgICAgICAgICAgPgogICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IGNsYXNzTmFtZT0iaC00IHctNCIgLz4KICAgICAgICAgICAgPC9idXR0b24+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdgogICAgICAgICAgcmVmPXt0cmFja1JlZn0KICAgICAgICAgIGNsYXNzTmFtZT0ibXQtMyBmbGV4IHNuYXAteCBzbmFwLW1hbmRhdG9yeSBnYXAtNSBvdmVyZmxvdy14LWF1dG8gb3ZlcnNjcm9sbC14LWNvbnRhaW4gcHgtMSBwYi0xNiBwdC0xMCBbc2Nyb2xsYmFyLXdpZHRoOm5vbmVdIFsmOjotd2Via2l0LXNjcm9sbGJhcl06aGlkZGVuIHNtOmdhcC02IgogICAgICAgID4KICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7CiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBpdGVtLnNsdWcgPyBgL3NlcnZpY2VzLyR7aXRlbS5zbHVnfWAgOiAiL3NlcnZpY2VzIjsKICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gb2Zmc2V0c1tpbmRleCAlIG9mZnNldHMubGVuZ3RoXTsKICAgICAgICAgICAgY29uc3QgYm9yZGVyUmFkaXVzID0gcmFkaWlbaW5kZXggJSByYWRpaS5sZW5ndGhdOwoKICAgICAgICAgICAgcmV0dXJuICgKICAgICAgICAgICAgICA8YXJ0aWNsZQogICAgICAgICAgICAgICAga2V5PXtpdGVtLmlkfQogICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1bNzh2d10gc2hyaW5rLTAgc25hcC1zdGFydCBzbTp3LVszNjBweF0gbGc6dy1bMzkwcHhdICR7b2Zmc2V0fWB9CiAgICAgICAgICAgICAgPgogICAgICAgICAgICAgICAgPExpbmsKICAgICAgICAgICAgICAgICAgaHJlZj17aHJlZn0KICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSJncm91cCBibG9jayBvdmVyZmxvdy1oaWRkZW4gYm9yZGVyIGJvcmRlci1bI2Q4ZDBjM10gYmctWyNmOGY0ZWNdIHNoYWRvdy1bMF8xNnB4XzM2cHhfcmdiYSgyMCwzNiw2MywwLjA3KV0gdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTEgaG92ZXI6c2hhZG93LVswXzIycHhfNDhweF9yZ2JhKDIwLDM2LDYzLDAuMTIpXSIKICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzIH19CiAgICAgICAgICAgICAgICA+CiAgICAgICAgICAgICAgICAgIDxkaXYKICAgICAgICAgICAgICAgICAgICByb2xlPSJpbWciCiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YENvdmVyICR7aXRlbS50aXRsZX1gfQogICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0icmVsYXRpdmUgaC1bMjQ1cHhdIG92ZXJmbG93LWhpZGRlbiBiZy1bI2U5ZTNkOF0gYmctY292ZXIgYmctY2VudGVyIHNtOmgtWzI3MHB4XSIKICAgICAgICAgICAgICAgICAgICBzdHlsZT17CiAgICAgICAgICAgICAgICAgICAgICBpdGVtLmltYWdlCiAgICAgICAgICAgICAgICAgICAgICAgID8geyBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHtKU09OLnN0cmluZ2lmeShpdGVtLmltYWdlKX0pYCB9CiAgICAgICAgICAgICAgICAgICAgICAgIDogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAibGluZWFyLWdyYWRpZW50KDEzNWRlZywgcmdiYSgyNCw0NSw3NywuMDgpIDI1JSwgdHJhbnNwYXJlbnQgMjUlKSwgbGluZWFyLWdyYWRpZW50KDIyNWRlZywgcmdiYSgyNCw0NSw3NywuMDgpIDI1JSwgdHJhbnNwYXJlbnQgMjUlKSwgbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCByZ2JhKDIyMCwxODAsODgsLjEwKSAyNSUsIHRyYW5zcGFyZW50IDI1JSkiLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6ICI0MHB4IDQwcHgiLAogICAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgID4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iYWJzb2x1dGUgaW5zZXQtMCBiZy1ncmFkaWVudC10by10IGZyb20tWyMxNDI0M2ZdLzc1IHZpYS1bIzE0MjQzZl0vNSB0by10cmFuc3BhcmVudCIgLz4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iYWJzb2x1dGUgbGVmdC00IHRvcC00IHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLXdoaXRlLzM1IGJnLVsjMTQyNDNmXS81NSBweC0zIHB5LTEuNSBmb250LW1vbm8gdGV4dC1bOHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMTVlbV0gdGV4dC13aGl0ZSBiYWNrZHJvcC1ibHVyLXNtIj4KICAgICAgICAgICAgICAgICAgICAgIFNSVi17U3RyaW5nKGluZGV4ICsgMSkucGFkU3RhcnQoMiwgIjAiKX0KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICB7IWl0ZW0uaW1hZ2UgJiYgKAogICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9ImFic29sdXRlIGluc2V0LTAgZ3JpZCBwbGFjZS1pdGVtcy1jZW50ZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImZvbnQtbW9ubyB0ZXh0LVs5cHhdIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LVsjNjU3MTg0XSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWEgc2VydmljZSBiZWx1bSBkaWlzaQogICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICApfQogICAgICAgICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJncmlkIG1pbi1oLVsyMjBweF0gZ3JpZC1yb3dzLVthdXRvXzFmcl9hdXRvXSBnYXAtNSBwLTUgc206cC02Ij4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTUiPgogICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT0ibWF4LXctWzEyY2hdIHRleHQtWzEuN3JlbV0gZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgbGVhZGluZy1bMC45Ml0gdHJhY2tpbmctWy0wLjA0NWVtXSB0ZXh0LVsjMTQyNDNmXSI+CiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLnRpdGxlfQogICAgICAgICAgICAgICAgICAgICAgPC9oMz4KICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ibWF4LXctWzExNXB4XSB0ZXh0LXJpZ2h0IGZvbnQtbW9ubyB0ZXh0LVs4cHhdIHVwcGVyY2FzZSBsZWFkaW5nLTQgdHJhY2tpbmctWzAuMTRlbV0gdGV4dC1bIzhhN2I1YV0iPgogICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5jYXRlZ29yeX0KICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSJsaW5lLWNsYW1wLTMgdGV4dC1bMTNweF0gbGVhZGluZy03IHRleHQtWyM1ZjY5NzZdIj4KICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmRlc2NyaXB0aW9uIHx8CiAgICAgICAgICAgICAgICAgICAgICAgICJTY29wZSBrZXJqYSB5YW5nIGRpa2Vsb2xhIHNlY2FyYSB0ZXJ1a3VyIGRhcmkga29vcmRpbmFzaSBhd2FsIHNhbXBhaSBwZW55ZWxlc2FpYW4gbGFwYW5nYW4uIn0KICAgICAgICAgICAgICAgICAgICA8L3A+CgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYm9yZGVyLXQgYm9yZGVyLVsjZGVkNmNhXSBwdC00Ij4KICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0iZm9udC1tb25vIHRleHQtWzhweF0gdXBwZXJjYXNlIHRyYWNraW5nLVswLjE2ZW1dIHRleHQtWyM3NTgwOTRdIj4KICAgICAgICAgICAgICAgICAgICAgICAgU2NvcGUgLyBkZXRhaWwgLyBkZWxpdmVyeQogICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPgogICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bMTBweF0gZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMTJlbV0gdGV4dC1bIzE0MjQzZl0iPgogICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWwgPEFycm93UmlnaHQgY2xhc3NOYW1lPSJoLTMuNSB3LTMuNSB0cmFuc2l0aW9uIGdyb3VwLWhvdmVyOnRyYW5zbGF0ZS14LTEiIC8+CiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPC9MaW5rPgogICAgICAgICAgICAgIDwvYXJ0aWNsZT4KICAgICAgICAgICAgKTsKICAgICAgICAgIH0pfQogICAgICAgIDwvZGl2PgogICAgICA8L2Rpdj4KICAgIDwvc2VjdGlvbj4KICApOwp9Cg=="
Write-Utf8NoBom $serviceComponentPath (Decode $servicePayload)
Step "ServiceShowcase horizontal staggered dibuat."

# 2. Update Home imports + normalized service card data.
$homeSource = Read-Text $homePath
if ($homeSource -notmatch 'from "\./service-showcase"') {
  $homeSource = $homeSource.Replace('import { DatabaseImage } from "./media";', 'import { DatabaseImage } from "./media";' + [Environment]::NewLine + 'import { ServiceShowcase } from "./service-showcase";')
}

# Remove old now-unused capability media variables and project register leftovers.
$homeSource = [regex]::Replace($homeSource, '(?m)^\s*const serviceImages = distinctImages\(services\);\r?\n', '')
$homeSource = [regex]::Replace($homeSource, '(?m)^\s*const capabilityPrimary = .*?;\r?\n', '')
$homeSource = [regex]::Replace($homeSource, '(?m)^\s*const capabilitySecondary = .*?;\r?\n', '')
$homeSource = [regex]::Replace($homeSource, '(?m)^\s*const capabilityDetail = .*?;\r?\n', '')
$homeSource = [regex]::Replace($homeSource, '(?m)^\s*const registerProjects = .*?;\r?\n', '')

if ($homeSource -notmatch 'const serviceCards = services\.map') {
  $anchor = '  const services = data.services.map(serviceModel);'
  $serviceMap = @'

  const serviceCards = services.map((service, index) => {
    const record = service as unknown as Record<string, unknown>;
    const imageRecord =
      record.image && typeof record.image === "object"
        ? (record.image as Record<string, unknown>)
        : undefined;
    const coverRecord =
      record.coverImage && typeof record.coverImage === "object"
        ? (record.coverImage as Record<string, unknown>)
        : undefined;

    const image =
      (typeof record.image === "string" ? record.image : "") ||
      (typeof imageRecord?.url === "string" ? imageRecord.url : "") ||
      (typeof record.imageUrl === "string" ? record.imageUrl : "") ||
      (typeof record.coverImageUrl === "string" ? record.coverImageUrl : "") ||
      (typeof coverRecord?.url === "string" ? coverRecord.url : "");

    const description =
      (typeof record.shortDescription === "string" ? record.shortDescription : "") ||
      (typeof record.description === "string" ? record.description : "") ||
      (typeof record.summary === "string" ? record.summary : "") ||
      (typeof record.excerpt === "string" ? record.excerpt : "");

    return {
      id: String(record.id ?? `service-${index + 1}`),
      slug: typeof record.slug === "string" ? record.slug : "",
      title:
        (typeof record.name === "string" ? record.name : "") ||
        (typeof record.title === "string" ? record.title : "") ||
        `Layanan ${index + 1}`,
      description,
      image,
      category:
        (typeof record.category === "string" ? record.category : "") ||
        (typeof record.type === "string" ? record.type : "") ||
        "Field package",
    };
  });
'@
  if ($homeSource.Contains($anchor)) {
    $homeSource = $homeSource.Replace($anchor, $anchor + $serviceMap)
  } else {
    Fail "Anchor data services di home.tsx tidak ditemukan."
  }
}

$section2Replacement = '        <ServiceShowcase items={serviceCards} />'
$homeSource = Replace-SectionByMarker $homeSource @("02 / Capabilities / field package", "02 / Capabilities / services", "Capabilities / field package") $section2Replacement

# Remove duplicate Project Index box the user previously asked to remove.
$homeSource = Remove-EnclosingDivByMarker $homeSource "Project index"

Write-Utf8NoBom $homePath $homeSource
Step "Section 02 diubah jadi carousel service bergambar; Project Index duplikat dibuang."

# 3. Active lint warnings in Formwork.
if (Test-Path -LiteralPath $aboutPath) {
  $aboutSource = Read-Text $aboutPath
  $aboutSource = [regex]::Replace($aboutSource, '(?m)^\s*const hero = .*?;\r?\n', '')
  Write-Utf8NoBom $aboutPath $aboutSource
}

if (Test-Path -LiteralPath $contactPath) {
  $contactSource = Read-Text $contactPath
  if ($contactSource -match 'export function FormworkContact\(\{ data \}') {
    if ($contactSource -notmatch 'void data;') {
      $contactSource = [regex]::Replace(
        $contactSource,
        '(export function FormworkContact\(\{ data \}[^\{]*\{)',
        '$1' + [Environment]::NewLine + '  void data;',
        1
      )
    }
  }
  Write-Utf8NoBom $contactPath $contactSource
}
Step "Unused variable aktif di About/Contact dibersihkan."

# 4. Lint only scans active code; backups + abandoned redesign archive are excluded.
if (Test-Path -LiteralPath $packagePath) {
  $packageSource = Read-Text $packagePath
  $lintCommand = '"lint": "eslint . --ignore-pattern .lunar-backups/** --ignore-pattern components/site/redesign/**"'
  if ($packageSource -notmatch '\.lunar-backups/\*\*') {
    $packageSource = [regex]::Replace($packageSource, '"lint"\s*:\s*"[^"]*eslint[^"]*"', $lintCommand, 1)
    Write-Utf8NoBom $packagePath $packageSource
  }
}

$gitignorePath = Join-Path $repoRoot ".gitignore"
if (Test-Path -LiteralPath $gitignorePath) {
  $gitignore = Read-Text $gitignorePath
  if ($gitignore -notmatch '(?m)^\.lunar-backups/$') {
    $gitignore = $gitignore.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + "# Local patch backups" + [Environment]::NewLine + ".lunar-backups/" + [Environment]::NewLine
    Write-Utf8NoBom $gitignorePath $gitignore
  }
}
Step "Lint diarahkan ke source aktif; .lunar-backups dan redesign legacy tidak lagi ikut discan."

Write-Host ""
Write-Host "[LUNAR SERVICE] SELESAI." -ForegroundColor Green
Write-Host "  - judul Section 02 di tengah" -ForegroundColor Green
Write-Host "  - service cards pakai gambar database" -ForegroundColor Green
Write-Host "  - posisi card naik / turun bergantian" -ForegroundColor Green
Write-Host "  - horizontal scroll + arrow buttons" -ForegroundColor Green
Write-Host "  - Project Index duplikat di Section 03 dihapus" -ForegroundColor Green
Write-Host "  - lint backups/legacy diabaikan dan warning aktif dibersihkan" -ForegroundColor Green
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
