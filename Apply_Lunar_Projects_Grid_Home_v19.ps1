# Lunar Konstruksi - Projects Grid + Home Navbar v19
# Jalankan dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Projects_Grid_Home_v19.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force -Path $directory | Out-Null
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Backup-File {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$BackupRoot,
        [Parameter(Mandatory = $true)][string]$RelativePath
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $destination = Join-Path $BackupRoot $RelativePath
    $destinationDir = Split-Path -Parent $destination

    if ($destinationDir) {
        New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
    }

    Copy-Item -Force $Source $destination
}

$repoRoot = $PSScriptRoot

if (-not (Test-Path (Join-Path $repoRoot "package.json"))) {
    if (Test-Path (Join-Path (Get-Location) "package.json")) {
        $repoRoot = (Get-Location).Path
    }
    else {
        throw "Jalankan script dari root repository Lunar Konstruksi."
    }
}

$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
$headerFile = Join-Path $repoRoot "components\site\formwork\header.tsx"

if (-not (Test-Path $projectsFile)) {
    throw "File projects tidak ditemukan: $projectsFile"
}

if (-not (Test-Path $headerFile)) {
    throw "File navbar tidak ditemukan: $headerFile"
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Projects Grid + Home Navbar v19 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\projects-grid-home-v19-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

Backup-File -Source $projectsFile -BackupRoot $backupRoot -RelativePath "components\site\formwork\projects.tsx"
Backup-File -Source $headerFile -BackupRoot $backupRoot -RelativePath "components\site\formwork\header.tsx"

Write-Host "[1/2] Menambahkan Home ke navbar..." -ForegroundColor Yellow

$headerContent = [System.IO.File]::ReadAllText($headerFile)

if ($headerContent.Contains('{ href: "/", label: "Home" }')) {
    Write-Host "  Home sudah ada di navbar." -ForegroundColor DarkGray
}
else {
    $pattern = 'const links = \['
    $replacement = 'const links = [' + [Environment]::NewLine + '  { href: "/", label: "Home" },'
    $updated = [System.Text.RegularExpressions.Regex]::Replace(
        $headerContent,
        $pattern,
        $replacement,
        1
    )

    if ($updated -eq $headerContent) {
        throw "Array links navbar tidak ditemukan. Script dihentikan supaya aman."
    }

    Write-Utf8NoBom -Path $headerFile -Content $updated
    Write-Host "  Home ditambahkan sebagai menu pertama." -ForegroundColor DarkGray
}

Write-Host "[2/2] Merombak grid halaman Projects..." -ForegroundColor Yellow

$projectsCode = @'
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  BlueprintLayer,
  MicroLabel,
  TechnicalArc,
  displayFont,
} from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { DatabaseImage } from "./media";
import { projectModel, type SiteData } from "./data";

const projectLayouts = [
  {
    wrapper: "md:col-span-7 xl:col-span-7",
    media: "aspect-[16/11] md:aspect-[16/10]",
    shape:
      "[clip-path:polygon(0%_0%,92%_0%,100%_12%,97%_100%,0%_100%)]",
    label:
      "[clip-path:polygon(0%_0%,94%_0%,100%_25%,96%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-5 md:pt-14 xl:col-span-5 xl:pt-20",
    media: "aspect-[16/10] md:aspect-[16/9]",
    shape:
      "[clip-path:polygon(8%_0%,100%_0%,100%_88%,92%_100%,0%_100%,0%_13%)]",
    label:
      "[clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%,0%_24%)]",
  },
  {
    wrapper: "md:col-span-5 xl:col-span-5 xl:pl-8",
    media: "aspect-[5/4]",
    shape:
      "[clip-path:polygon(0%_0%,100%_0%,96%_88%,86%_100%,0%_100%,4%_14%)]",
    label:
      "[clip-path:polygon(0%_0%,100%_0%,96%_100%,7%_100%,0%_74%)]",
  },
  {
    wrapper: "md:col-span-7 md:pt-10 xl:col-span-7 xl:pt-16",
    media: "aspect-[16/9]",
    shape:
      "[clip-path:polygon(0%_8%,7%_0%,100%_0%,100%_100%,10%_100%,0%_90%)]",
    label:
      "[clip-path:polygon(0%_0%,96%_0%,100%_35%,100%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-8 xl:col-span-8",
    media: "aspect-[16/9]",
    shape:
      "[clip-path:polygon(0%_0%,90%_0%,100%_18%,96%_100%,6%_100%,0%_86%)]",
    label:
      "[clip-path:polygon(0%_0%,95%_0%,100%_28%,97%_100%,0%_100%)]",
  },
  {
    wrapper: "md:col-span-4 md:pt-16 xl:col-span-4 xl:pt-24",
    media: "aspect-[4/5]",
    shape:
      "[clip-path:polygon(12%_0%,100%_0%,100%_90%,88%_100%,0%_94%,0%_10%)]",
    label:
      "[clip-path:polygon(8%_0%,100%_0%,100%_100%,0%_100%,0%_20%)]",
  },
];

export function FormworkProjects({ data }: { data: SiteData }) {
  const projects = data.projects.map(projectModel);
  const hero = projects[0];

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />

      <main>
        <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20 lg:py-24">
          <BlueprintLayer />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
            <div>
              <MicroLabel>P-01 / Selected works</MicroLabel>

              <h1
                className={`${displayFont} mt-7 max-w-[680px] text-[clamp(3rem,5.1vw,5.35rem)] font-black uppercase leading-[.86] tracking-[-.052em]`}
              >
                Pekerjaan nyata membentuk arsip kami.
              </h1>

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#566476]">
                Dokumentasi proyek yang memperlihatkan konteks, proses, dan hasil
                pekerjaan dari berbagai kebutuhan konstruksi.
              </p>
            </div>

            <div className="relative min-h-[450px] sm:min-h-[500px] lg:min-h-[520px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(9%_0%,84%_0%,100%_10%,100%_74%,92%_100%,27%_100%,14%_93%,0%_79%,0%_17%)]">
                <DatabaseImage
                  src={LOCAL_MEDIA.projectsHero || hero?.image || ""}
                  alt={hero?.title ?? "Project"}
                  className="h-full min-h-[450px] w-full object-cover object-center sm:min-h-[480px] lg:min-h-[500px]"
                />
              </div>

              <div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
                <div className="px-4 py-3">
                  <MicroLabel>Portofolio proyek / P-02</MicroLabel>
                  <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
                    Setiap proyek menyimpan keputusan, progres, dan hasil yang
                    dapat dilihat secara nyata.
                  </p>
                </div>

                <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
                  WORK / RECORD
                </div>
              </div>

              <TechnicalArc
                label="WORK / ARCHIVE"
                className="bottom-[-10%] left-[12%] h-[360px] w-[500px] rotate-[17deg]"
              />
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-5 md:gap-y-14 lg:gap-x-6 lg:gap-y-16">
              {projects.map((project, index) => {
                const layout = projectLayouts[index % projectLayouts.length];

                return (
                  <Link
                    key={project.id}
                    href={project.slug ? `/projects/${project.slug}` : "/projects"}
                    className={`group block min-w-0 ${layout.wrapper}`}
                  >
                    <article className="relative">
                      <div
                        className={`relative overflow-hidden bg-[#d8d1c6] ${layout.media} ${layout.shape}`}
                      >
                        <DatabaseImage
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#091b34]/40 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-45" />

                        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-[#14243f]/55 text-white backdrop-blur-sm transition duration-300 group-hover:rotate-45 group-hover:bg-[#dcb458] group-hover:text-[#14243f]">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>

                      <div
                        className={`relative z-10 -mt-12 ml-[4%] w-[92%] bg-[#14243f]/96 px-4 py-4 text-white shadow-[0_16px_35px_rgba(20,36,63,0.13)] backdrop-blur-sm sm:px-5 ${layout.label}`}
                      >
                        <div className="flex items-end justify-between gap-5">
                          <div className="min-w-0">
                            <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[#e5c775]">
                              {project.location}
                              {project.year ? ` / ${project.year}` : ""}
                            </p>

                            <h2
                              className={`${displayFont} mt-1.5 text-[clamp(1.45rem,2.3vw,2rem)] font-black uppercase leading-[.95] tracking-[-.025em]`}
                            >
                              {project.title}
                            </h2>
                          </div>

                          <span className="shrink-0 pb-0.5 font-mono text-[8px] text-white/60">
                            P-{String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="ml-[8%] mt-3 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#dcb458]" />
                        <span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#788394]">
                          {project.category || "Construction"}
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#14243f] py-16 text-white sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
            <div>
              <MicroLabel>Project record / archive</MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-4xl text-4xl font-black uppercase leading-[.92] sm:text-5xl lg:text-6xl`}
              >
                Setiap pekerjaan punya konteks, proses, dan hasil yang dapat
                dipertanggungjawabkan.
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-b border-[#dcb458] pb-2 font-mono text-[9px] uppercase tracking-[.12em] text-[#e5c775] transition hover:gap-5"
            >
              Diskusikan proyek
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <FormworkFooter />
    </div>
  );
}

'@

Write-Utf8NoBom -Path $projectsFile -Content $projectsCode

Write-Host "  - asymmetric 12-column layout" -ForegroundColor DarkGray
Write-Host "  - cut-corner image shapes" -ForegroundColor DarkGray
Write-Host "  - caption polygon, bukan box biasa" -ForegroundColor DarkGray
Write-Host "  - pola berubah setiap beberapa project" -ForegroundColor DarkGray
Write-Host "  - responsive untuk mobile/tablet/desktop" -ForegroundColor DarkGray

Write-Host ""
Write-Host "=== Revisi v19 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
