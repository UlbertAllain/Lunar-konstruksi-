# Lunar Konstruksi - Server Client Boundary Fix v34
#
# Fixes the Firebase Admin / child_process / fs / net / tls build error.
#
# Root cause:
# FormworkProjects is a Client Component and imported FormworkFooter.
# FormworkFooter imported the Firebase Admin repository.
# That pulled firebase-admin into the browser bundle.
#
# This patch:
# - makes FormworkFooter a pure presentational component
# - passes siteContent from existing page data
# - keeps SiteFooter as a server-side wrapper for detail pages
# - removes the unused FAQ index lint warning
#
# Run:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Server_Boundary_Fix_v34.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  $directoryPath =
    Split-Path -Parent $Path

  if (
    $directoryPath -and
    -not (
      Test-Path -LiteralPath $directoryPath
    )
  ) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $directoryPath |
    Out-Null
  }

  $utf8NoBom =
    New-Object `
      System.Text.UTF8Encoding($false)

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    $utf8NoBom
  )
}

function Backup-File {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$BackupRoot,

    [Parameter(Mandatory = $true)]
    [string]$RelativePath
  )

  if (
    -not (
      Test-Path -LiteralPath $Source
    )
  ) {
    return
  }

  $destination =
    Join-Path `
      $BackupRoot `
      $RelativePath

  $destinationDirectory =
    Split-Path -Parent $destination

  if ($destinationDirectory) {
    New-Item `
      -ItemType Directory `
      -Force `
      -Path $destinationDirectory |
    Out-Null
  }

  Copy-Item `
    -LiteralPath $Source `
    -Destination $destination `
    -Force
}

function Replace-AllLiteral {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$OldText,

    [Parameter(Mandatory = $true)]
    [string]$NewText,

    [Parameter(Mandatory = $true)]
    [string]$Label
  )

  $content =
    [System.IO.File]::ReadAllText(
      $Path
    )

  if (
    -not $content.Contains(
      $OldText
    )
  ) {
    Write-Host `
      "  skip: $Label (already fixed or marker not found)" `
      -ForegroundColor DarkGray

    return
  }

  $content =
    $content.Replace(
      $OldText,
      $NewText
    )

  Write-Utf8NoBom `
    -Path $Path `
    -Content $content

  Write-Host `
    "  updated: $Label" `
    -ForegroundColor DarkGray
}

$repoRoot =
  $PSScriptRoot

if (
  -not (
    Test-Path -LiteralPath (
      Join-Path `
        $repoRoot `
        "package.json"
    )
  )
) {
  if (
    Test-Path -LiteralPath (
      Join-Path `
        (Get-Location) `
        "package.json"
    )
  ) {
    $repoRoot =
      (Get-Location).Path
  }
  else {
    throw `
      "Run this patch from the Lunar repository root."
  }
}

$footerFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\footer.tsx"

$siteFooterFile =
  Join-Path `
    $repoRoot `
    "components\site\site-footer.tsx"

$homeFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\home.tsx"

$servicesFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\services.tsx"

$projectsFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\projects.tsx"

$contactFile =
  Join-Path `
    $repoRoot `
    "components\site\formwork\contact.tsx"

foreach ($requiredFile in @(
  $footerFile,
  $siteFooterFile,
  $homeFile,
  $servicesFile,
  $projectsFile,
  $contactFile
)) {
  if (
    -not (
      Test-Path -LiteralPath $requiredFile
    )
  ) {
    throw `
      "Required file missing: $requiredFile"
  }
}

$timestamp =
  Get-Date `
    -Format "yyyyMMdd-HHmmss"

$backupRoot =
  Join-Path `
    $repoRoot `
    ".lunar-backups\server-boundary-v34-$timestamp"

New-Item `
  -ItemType Directory `
  -Force `
  -Path $backupRoot |
Out-Null

foreach ($relativeFile in @(
  "components\site\formwork\footer.tsx",
  "components\site\site-footer.tsx",
  "components\site\formwork\home.tsx",
  "components\site\formwork\services.tsx",
  "components\site\formwork\projects.tsx",
  "components\site\formwork\contact.tsx"
)) {
  Backup-File `
    -Source (
      Join-Path `
        $repoRoot `
        $relativeFile
    ) `
    -BackupRoot $backupRoot `
    -RelativePath $relativeFile
}

Write-Host ""
Write-Host `
  "=== Lunar / Server-Client Boundary Fix v34 ===" `
  -ForegroundColor Cyan

# =========================================================
# 1. PURE FOOTER
# =========================================================

Write-Host `
  "[1/4] Removing Firebase Admin from FormworkFooter..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path $footerFile `
  -Content @'
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import type { SiteContentSettings } from "@/modules/site-content/site-content.types";
import { displayFont } from "./decor";

function whatsappHref(
  value: string,
) {
  const digits =
    value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let normalized = digits;

  if (normalized.startsWith("0")) {
    normalized =
      `62${normalized.slice(1)}`;
  }

  return `https://wa.me/${normalized}`;
}

export function FormworkFooter({
  content,
}: {
  content: SiteContentSettings;
}) {
  const profile =
    content.companyProfile;

  const office =
    content.officeLocation;

  const companyName =
    profile.companyName ||
    "Lunar Konstruksi";

  const shortDescription =
    profile.shortDescription ||
    "Perencanaan, koordinasi, dan pekerjaan konstruksi dengan proses yang jelas dari awal sampai serah terima.";

  const email =
    profile.email ||
    process.env
      .NEXT_PUBLIC_COMPANY_EMAIL ||
    "";

  const phone =
    profile.phone ||
    process.env
      .NEXT_PUBLIC_COMPANY_PHONE ||
    "";

  const whatsapp =
    whatsappHref(
      profile.whatsapp,
    );

  const socials = [
    {
      label: "Instagram",
      shortLabel: "IG",
      href: profile.instagramUrl,
    },
    {
      label: "LinkedIn",
      shortLabel: "IN",
      href: profile.linkedinUrl,
    },
  ].filter(
    (item) =>
      Boolean(item.href),
  );

  return (
    <footer className="bg-[#101f37] text-[#f8f4ec]">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid gap-10 border-b border-white/15 pb-10 xl:grid-cols-[1.08fr_.92fr] xl:gap-16">
          <div>
            <p
              className={`${displayFont} text-[clamp(2rem,3.1vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]`}
            >
              {companyName}
            </p>

            <p className="mt-4 max-w-xl text-[13px] leading-7 text-white/55">
              {shortDescription}
            </p>

            {socials.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {socials.map(
                  (social) => (
                    <a
                      key={
                        social.label
                      }
                      href={
                        social.href
                      }
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        social.label
                      }
                      title={
                        social.label
                      }
                      className="group grid h-10 w-10 place-items-center rounded-full border border-white/15 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white/55 transition duration-300 hover:-translate-y-0.5 hover:border-[#dcb458]/70 hover:bg-[#dcb458] hover:text-[#14243f]"
                    >
                      {
                        social.shortLabel
                      }
                    </a>
                  ),
                )}
              </div>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#dcb458]">
                Contact
              </p>

              <div className="mt-4 space-y-3 text-[13px] leading-6 text-white/70">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <Mail className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span className="break-all">
                      {email}
                    </span>
                  </a>
                ) : null}

                {phone ? (
                  <a
                    href={`tel:${phone.replace(
                      /\s/g,
                      "",
                    )}`}
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <Phone className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span>
                      {phone}
                    </span>
                  </a>
                ) : null}

                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 transition hover:text-white"
                  >
                    <MessageCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span>
                      WhatsApp
                    </span>

                    <ArrowUpRight className="mt-1 h-3 w-3 text-white/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dcb458]" />
                  </a>
                ) : null}

                {office.address ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-[#dcb458]" />

                    <span className="max-w-[280px] whitespace-pre-line">
                      {
                        office.address
                      }
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#dcb458]">
                Navigate
              </p>

              <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-white/70">
                {[
                  ["/", "Home"],
                  [
                    "/projects",
                    "Proyek",
                  ],
                  [
                    "/services",
                    "Layanan",
                  ],
                  [
                    "/contact",
                    "Kontak",
                  ],
                ].map(
                  ([
                    href,
                    label,
                  ]) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex w-fit items-center gap-2 transition hover:text-white"
                    >
                      {label}

                      <span className="h-px w-0 bg-[#dcb458] transition-all duration-300 group-hover:w-5" />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy;{" "}
            {new Date().getFullYear()}{" "}
            {profile.copyrightText ||
              companyName}
          </span>

          <span>
            Planning / Coordination /
            Construction
          </span>
        </div>
      </div>
    </footer>
  );
}

'@

Write-Host `
  "  FormworkFooter now receives SiteContentSettings as props." `
  -ForegroundColor DarkGray

Write-Host `
  "  No repository or firebase-admin import remains in this component." `
  -ForegroundColor DarkGray

# =========================================================
# 2. PAGE DATA -> FOOTER
# =========================================================

Write-Host `
  "[2/4] Passing existing siteContent into public footers..." `
  -ForegroundColor Yellow

foreach ($pageFile in @(
  $homeFile,
  $servicesFile,
  $projectsFile,
  $contactFile
)) {
  Replace-AllLiteral `
    -Path $pageFile `
    -OldText "<FormworkFooter />" `
    -NewText "<FormworkFooter content={data.siteContent} />" `
    -Label (
      Split-Path `
        -Leaf `
        $pageFile
    )
}

# =========================================================
# 3. DETAIL PAGE SERVER WRAPPER
# =========================================================

Write-Host `
  "[3/4] Keeping detail-page footer server-side..." `
  -ForegroundColor Yellow

Write-Utf8NoBom `
  -Path $siteFooterFile `
  -Content @'
import { getSiteContentSettings } from "@/modules/site-content/site-content.repository";
import { FormworkFooter } from "./formwork/footer";

export async function SiteFooter() {
  const content =
    await getSiteContentSettings();

  return (
    <FormworkFooter
      content={content}
    />
  );
}

export default SiteFooter;

'@

Write-Host `
  "  SiteFooter fetches settings only on the server." `
  -ForegroundColor DarkGray

# =========================================================
# 4. LINT WARNING
# =========================================================

Write-Host `
  "[4/4] Cleaning lint warning..." `
  -ForegroundColor Yellow

Replace-AllLiteral `
  -Path $homeFile `
  -OldText "faqs.slice(0, 6).map((faq, index) => (" `
  -NewText "faqs.slice(0, 6).map((faq) => (" `
  -Label "unused FAQ index"

Write-Host ""
Write-Host `
  "=== v34 complete ===" `
  -ForegroundColor Green

Write-Host `
  "Backup: $backupRoot" `
  -ForegroundColor DarkGray

Write-Host ""
Write-Host `
  "Run in this exact order:" `
  -ForegroundColor Cyan

Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"

Write-Host ""
Write-Host `
  "Do NOT push yet if build still reports an error." `
  -ForegroundColor Yellow

Write-Host ""
