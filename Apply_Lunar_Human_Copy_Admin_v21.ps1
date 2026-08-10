# Lunar Konstruksi - Human Copy + FAQ Home + Admin Visual v21
# Jalankan setelah revisi v20 dari root project:
# powershell -ExecutionPolicy Bypass -File .\Apply_Lunar_Human_Copy_Admin_v21.ps1

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

    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8)
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
    $destinationDirectory = Split-Path -Parent $destination

    if ($destinationDirectory) {
        New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
    }

    Copy-Item -Force $Source $destination
}

function Replace-Safe {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Old,
        [Parameter(Mandatory = $true)][string]$New
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "File tidak ditemukan: $Path"
        return
    }

    $content = [System.IO.File]::ReadAllText($Path)

    if ($content.Contains($Old)) {
        $content = $content.Replace($Old, $New)
        Write-Utf8NoBom -Path $Path -Content $content
    }
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

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups\human-copy-admin-v21-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$targets = @(
    "components\site\formwork\home.tsx",
    "components\site\formwork\services.tsx",
    "components\site\formwork\contact.tsx",
    "components\site\projects-detail-page.tsx",
    "components\site\project-detail-page.tsx",
    "components\site\service-detail-page.tsx",
    "components\site\formwork\projects.tsx",
    "components\admin\header.tsx",
    "components\admin\sidebar.tsx",
    "components\admin\dashboard-client.tsx",
    "components\admin\resource-list.tsx",
    "components\admin\forms\form-elements.tsx",
    "app\admin\(dashboard)\layout.tsx",
    "app\admin\login\page.tsx",
    "app\globals.css"
)

foreach ($relative in $targets) {
    Backup-File `
        -Source (Join-Path $repoRoot $relative) `
        -BackupRoot $backupRoot `
        -RelativePath $relative
}

Write-Host ""
Write-Host "=== Lunar Konstruksi / Human Copy + FAQ + Admin v21 ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray
Write-Host ""

# =========================================================
# 1. MOVE FAQ SERVICES -> HOME
# =========================================================

Write-Host "[1/6] Memindahkan FAQ dari Services ke Home..." -ForegroundColor Yellow

$homeFile = Join-Path $repoRoot "components\site\formwork\home.tsx"
$servicesFile = Join-Path $repoRoot "components\site\formwork\services.tsx"

$homeContent = [System.IO.File]::ReadAllText($homeFile)

if (-not $homeContent.Contains("faqModel,")) {
    $homeContent = $homeContent.Replace(
        "import {`n  projectModel,",
        "import {`n  faqModel,`n  projectModel,"
    )

    if (-not $homeContent.Contains("faqModel,")) {
        $homeContent = $homeContent.Replace(
            "import {`r`n  projectModel,",
            "import {`r`n  faqModel,`r`n  projectModel,"
        )
    }
}

if (-not $homeContent.Contains("const faqs = data.faqs.map(faqModel)")) {
    $homeContent = $homeContent.Replace(
        "  const services = data.services.map(serviceModel);",
        "  const services = data.services.map(serviceModel);`n  const faqs = data.faqs.map(faqModel);"
    )
}

if (-not $homeContent.Contains("Hal yang biasanya ditanyakan sebelum proyek dimulai.")) {
    $testimonialMarker = "        {/* TESTIMONIAL"

    $markerIndex = $homeContent.IndexOf($testimonialMarker)

    if ($markerIndex -lt 0) {
        throw "Marker TESTIMONIAL pada home.tsx tidak ditemukan."
    }

    $faqSection = @'
        {/* FAQ — dipindahkan dari halaman layanan */}
        {faqs.length ? (
          <section className="relative border-b border-[#d9d4ca] py-16 sm:py-20">
            <BlueprintLayer className="opacity-[0.045]" />

            <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
              <div className="grid gap-7 border-b border-[#cfc8bd] pb-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
                <div>
                  <MicroLabel>06 / Pertanyaan umum</MicroLabel>
                  <h2
                    className={`${displayFont} mt-4 max-w-[560px] text-[clamp(2.15rem,3.3vw,3.35rem)] font-black uppercase leading-[.92] tracking-[-.035em]`}
                  >
                    Hal yang biasanya ditanyakan sebelum proyek dimulai.
                  </h2>
                </div>

                <p className="max-w-xl text-[13px] leading-6 text-[#657184] lg:justify-self-end">
                  Beberapa jawaban singkat untuk membantu Anda memahami proses
                  awal sebelum berdiskusi lebih lanjut dengan Lunar Konstruksi.
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {faqs.slice(0, 6).map((faq, index) => (
                  <article
                    key={faq.id}
                    className="group relative min-h-[210px] overflow-hidden border border-[#cec7bc] bg-[#faf7f0] p-5 transition duration-300 hover:border-[#b89a54] sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[8px] font-semibold uppercase tracking-[.14em] text-[#b58c2f]">
                        Q-{String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-2 w-2 rounded-full border border-[#dcb458]" />
                    </div>

                    <h3
                      className={`${displayFont} mt-8 text-[1.3rem] font-black uppercase leading-[.96] tracking-[-.02em] text-[#14243f]`}
                    >
                      {faq.question}
                    </h3>

                    <p className="mt-4 text-[12px] leading-6 text-[#657184]">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}


'@

    $homeContent =
        $homeContent.Substring(0, $markerIndex) +
        $faqSection +
        $homeContent.Substring($markerIndex)
}

$homeContent = $homeContent.Replace(
    "<MicroLabel>06 / Cerita klien</MicroLabel>",
    "<MicroLabel>07 / Cerita klien</MicroLabel>"
)
$homeContent = $homeContent.Replace(
    "<MicroLabel>07 / Mulai proyek Anda</MicroLabel>",
    "<MicroLabel>08 / Mulai proyek Anda</MicroLabel>"
)

Write-Utf8NoBom -Path $homeFile -Content $homeContent

$servicesContent = [System.IO.File]::ReadAllText($servicesFile)

$servicesContent = $servicesContent.Replace(
    "faqModel, ",
    ""
)
$servicesContent = $servicesContent.Replace(
    "faqModel,",
    ""
)

$servicesContent = [System.Text.RegularExpressions.Regex]::Replace(
    $servicesContent,
    '(?m)^\s*const faqs = data\.faqs\.map\(faqModel\);\s*\r?\n',
    ''
)

$servicesContent = [System.Text.RegularExpressions.Regex]::Replace(
    $servicesContent,
    '(?s)\s*\{faqs\.length \? \(.*?\) : null\}',
    ''
)

Write-Utf8NoBom -Path $servicesFile -Content $servicesContent

Write-Host "  FAQ sekarang tampil di Home dan tidak lagi di halaman Services." -ForegroundColor DarkGray

# =========================================================
# 2. HUMAN COPY + TYPOGRAPHY HOME / SERVICES / PROJECTS
# =========================================================

Write-Host "[2/6] Membuat copywriting publik lebih manusiawi..." -ForegroundColor Yellow

Replace-Safe $homeFile `
    "Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan bergerak dalam satu alur yang mudah dibaca - bukan saling mengejar ketika pekerjaan sudah berjalan." `
    "Dari perencanaan sampai pekerjaan selesai, setiap tahap kami susun agar keputusan lebih jelas, koordinasi lebih rapi, dan pekerjaan di lapangan tetap terarah."

Replace-Safe $homeFile `
    "Struktur, urutan pekerjaan, dan kontrol lapangan dibaca sebagai satu jalur keputusan." `
    "Perencanaan, urutan pekerjaan, dan kontrol lapangan kami susun agar setiap keputusan mudah dipahami."

Replace-Safe $homeFile `
    "Proyek pilihan kami menampilkan lingkup pekerjaan dan hasil yang telah diselesaikan, sementara proyek lainnya dapat dilihat pada halaman portofolio. - tanpa daftar judul yang mengulang informasi yang sudah tampil di visual." `
    "Lihat beberapa pekerjaan yang telah kami tangani, lengkap dengan lokasi, lingkup pekerjaan, dan dokumentasi hasilnya."

Replace-Safe $homeFile `
    '["01", "PLAN", "Survey lokasi, kebutuhan, risiko, dan baseline scope."],' `
    '["01", "SURVEI", "Kami memahami lokasi, kebutuhan, kondisi awal, dan hal penting yang perlu diperhatikan."],'

Replace-Safe $homeFile `
    '["02", "COORDINATE", "Desain, estimasi, material, dan shop drawing diselaraskan."],' `
    '["02", "PERENCANAAN", "Desain, estimasi, material, dan kebutuhan teknis disusun dalam satu rencana kerja."],'

Replace-Safe $homeFile `
    '["03", "BUILD", "Eksekusi bergerak bersama kontrol mutu dan catatan perubahan."],' `
    '["03", "PELAKSANAAN", "Pekerjaan berjalan bersama kontrol mutu dan pemantauan perubahan di lapangan."],'

Replace-Safe $homeFile `
    '["04", "DELIVER", "Inspection, close-out, dan handover dirapikan sebagai satu record."],' `
    '["04", "SERAH TERIMA", "Pekerjaan diperiksa kembali, dirapikan, dan disiapkan untuk proses serah terima."],'

Replace-Safe $homeFile `
    "Keputusan teknis harus tetap jelas dari perencanaan hingga pelaksanaan." `
    "Keputusan teknis perlu tetap jelas dari awal sampai pekerjaan selesai."

Replace-Safe $homeFile `
    '["RFI", "12", "Klarifikasi teknis", "Pertanyaan teknis ditutup dengan jawaban yang bisa dilacak kembali."],' `
    '["INFO", "12", "Klarifikasi teknis", "Pertanyaan teknis dibahas dan dicatat agar keputusan tidak membingungkan di lapangan."],'

Replace-Safe $homeFile `
    '["H/O", "100%", "Serah terima", "Penyerahan akhir dirapikan menjadi close-out yang mudah dibaca."],' `
    '["DONE", "100%", "Serah terima", "Pekerjaan akhir diperiksa dan disiapkan agar proses serah terima lebih tertib."],'

Replace-Safe $homeFile `
    "Mulai dari kebutuhan, kondisi lapangan, dan keputusan yang benar-benar perlu diselesaikan terlebih dahulu." `
    "Ceritakan kebutuhan dan kondisi proyek Anda. Kami bantu menentukan langkah awal yang paling sesuai."

# Typography home: turunkan beberapa heading terakhir yang masih agresif.
Replace-Safe $homeFile `
    'text-[clamp(3rem,5.2vw,5.35rem)]' `
    'text-[clamp(2.8rem,4.7vw,4.8rem)]'

Replace-Safe $homeFile `
    'text-[clamp(2.5rem,3.9vw,4.15rem)]' `
    'text-[clamp(2.25rem,3.35vw,3.45rem)]'

Replace-Safe $homeFile `
    'text-[clamp(2.4rem,3.6vw,3.75rem)]' `
    'text-[clamp(2.15rem,3.15vw,3.25rem)]'

Replace-Safe $homeFile `
    'text-[clamp(2.5rem,4vw,4.35rem)]' `
    'text-[clamp(2.2rem,3.3vw,3.4rem)]'

Replace-Safe $homeFile `
    'text-[clamp(2.55rem,4.1vw,4.35rem)]' `
    'text-[clamp(2.2rem,3.35vw,3.45rem)]'

# Services page human copy.
Replace-Safe $servicesFile `
    "Layanan harus saling terhubung." `
    "Layanan konstruksi yang terkoordinasi dari awal sampai selesai."

Replace-Safe $servicesFile `
    "Ruang lingkup dapat disusun sesuai konteks proyek, dari satu pekerjaan teknis sampai koordinasi design-build yang lebih terintegrasi." `
    "Setiap proyek memiliki kebutuhan yang berbeda. Kami menyesuaikan lingkup pekerjaan mulai dari kebutuhan teknis tertentu hingga pelaksanaan yang lebih menyeluruh."

Replace-Safe $servicesFile `
    "Layanan dibaca sebagai paket kerja yang bergerak dari persiapan sampai penyelesaian." `
    "Setiap layanan dapat disesuaikan dengan kebutuhan, kondisi, dan target proyek."

Replace-Safe $servicesFile `
    "View scope →" `
    "Lihat detail layanan →"

Replace-Safe $servicesFile `
    "Dari brief ke handover." `
    "Dari kebutuhan awal sampai serah terima."

Replace-Safe $servicesFile `
    "Susun ruang lingkup yang tepat sebelum pekerjaan dimulai." `
    "Pastikan kebutuhan proyek jelas sebelum pekerjaan dimulai."

Replace-Safe $servicesFile `
    "Cerita kebutuhan, kondisi proyek, dan hasil yang ingin dicapai. Kami bantu menyusun langkah awal yang lebih terukur." `
    "Ceritakan kebutuhan, kondisi proyek, dan hasil yang ingin dicapai. Kami bantu menyusun langkah awal yang lebih terukur."

Replace-Safe $servicesFile `
    "Susun ruang lingkup yang benar sejak awal." `
    "Pastikan kebutuhan proyek jelas sejak awal."

Replace-Safe $servicesFile `
    "Start a project →" `
    "Konsultasikan proyek →"

Replace-Safe $servicesFile `
    'text-[clamp(3rem,5.1vw,5.25rem)]' `
    'text-[clamp(2.8rem,4.7vw,4.7rem)]'

# Process card labels from v18.
Replace-Safe $servicesFile "Survey & Brief" "Survei & Kebutuhan"
Replace-Safe $servicesFile "Plan & Coordinate" "Rencana & Koordinasi"
Replace-Safe $servicesFile "Build & Control" "Pelaksanaan & Kontrol"
Replace-Safe $servicesFile "Inspect & Deliver" "Pemeriksaan & Serah Terima"

# Projects v20 hero slightly calmer.
$projectsFile = Join-Path $repoRoot "components\site\formwork\projects.tsx"
Replace-Safe $projectsFile `
    'text-[clamp(2.8rem,4.8vw,5rem)]' `
    'text-[clamp(2.7rem,4.35vw,4.55rem)]'

# =========================================================
# 3. CONTACT HUMAN COPY
# =========================================================

Write-Host "[3/6] Merapikan halaman Contact..." -ForegroundColor Yellow

$contactCode = @'
import {
  BlueprintLayer,
  MicroLabel,
  TechnicalArc,
  displayFont,
} from "./decor";
import { FormworkFooter } from "./footer";
import { FormworkHeader } from "./header";
import { LOCAL_MEDIA } from "./local-assets";
import { TechnicalContactForm } from "./contact-form";
import { DatabaseImage } from "./media";
import { type SiteData } from "./data";

export function FormworkContact({ data }: { data: SiteData }) {
  void data;

  const email =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@lunarkonstruksi.id";
  const phone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+62 812 0000 0000";

  return (
    <div className="overflow-hidden bg-[#f5f1e8] text-[#182d4d] [font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]">
      <FormworkHeader />

      <main>
        <section className="relative border-b border-[#d9d4ca] py-14 sm:py-18 lg:py-20">
          <BlueprintLayer />

          <div className="relative mx-auto grid w-full max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
            <div>
              <MicroLabel>C-01 / Konsultasi proyek</MicroLabel>

              <h1
                className={`${displayFont} mt-7 max-w-[650px] text-[clamp(2.8rem,4.7vw,4.7rem)] font-black uppercase leading-[.88] tracking-[-.048em]`}
              >
                Ceritakan proyek yang ingin Anda kerjakan.
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#5f6976]">
                Sampaikan jenis pekerjaan, lokasi, kebutuhan, dan target Anda.
                Informasi awal ini membantu kami memahami proyek sebelum masuk ke
                pembahasan yang lebih rinci.
              </p>
            </div>

            <div className="relative min-h-[460px]">
              <div className="absolute inset-y-[2%] right-[-2%] w-[98%] overflow-hidden border border-[#d8d1c6]/60 bg-[#f5f1e8] shadow-[0_22px_60px_rgba(20,36,63,0.10)] [clip-path:polygon(14%_0%,84%_0%,100%_18%,95%_70%,100%_86%,83%_100%,17%_94%,0%_76%,4%_19%)]">
                <DatabaseImage
                  src={LOCAL_MEDIA.contactHero}
                  alt="Konsultasi proyek Lunar Konstruksi"
                  className="h-[430px] w-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="absolute bottom-[9%] left-[3%] z-30 hidden w-[220px] -rotate-[6deg] overflow-hidden border border-[#d9d1c4] bg-[#f9f6ef]/95 shadow-[0_20px_50px_rgba(20,36,63,0.13)] backdrop-blur-[2px] [clip-path:polygon(9%_0%,100%_0%,92%_100%,0%_89%,0%_16%)] lg:block">
                <div className="px-4 py-3">
                  <MicroLabel>Informasi awal / C-02</MicroLabel>
                  <p className="mt-2 text-[11px] leading-5 text-[#4f5968]">
                    Semakin jelas kebutuhan awalnya, semakin mudah menentukan
                    langkah berikutnya.
                  </p>
                </div>

                <div className="border-t border-[#e5ddd1] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-[#748092]">
                  PROJECT / INPUT
                </div>
              </div>

              <TechnicalArc
                label="PROJECT / INPUT"
                className="bottom-[-9%] left-[10%] h-[360px] w-[500px] rotate-[17deg]"
              />
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-10">
            <div>
              <MicroLabel>Hubungi Lunar Konstruksi</MicroLabel>

              <h2
                className={`${displayFont} mt-5 max-w-[520px] text-[clamp(2.15rem,3.4vw,3.45rem)] font-black uppercase leading-[.92] tracking-[-.035em]`}
              >
                Mulai dengan kebutuhan Anda. Kami bantu susun langkahnya.
              </h2>

              <div className="mt-9 border-t border-[#c0bbb2] pt-5 text-sm leading-7 text-[#5f6976]">
                <p>{email}</p>
                <p>{phone}</p>
                <p className="mt-2 text-xs text-[#87909b]">
                  Jadwal pertemuan dapat disesuaikan melalui konfirmasi terlebih
                  dahulu.
                </p>
              </div>
            </div>

            <div>
              <MicroLabel>Informasi proyek</MicroLabel>
              <div className="mt-7">
                <TechnicalContactForm />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#14243f] py-14 text-white sm:py-16">
          <div className="mx-auto grid w-full max-w-[1480px] gap-3 px-5 sm:px-8 md:grid-cols-3 lg:px-10">
            {[
              [
                "01",
                "Kebutuhan",
                "Ceritakan jenis pekerjaan dan hasil yang ingin dicapai.",
              ],
              [
                "02",
                "Kondisi",
                "Informasikan lokasi, waktu, anggaran, akses, atau batasan yang sudah diketahui.",
              ],
              [
                "03",
                "Langkah berikutnya",
                "Kami pelajari kebutuhan awal lalu menentukan pembahasan yang paling relevan.",
              ],
            ].map(([number, title, text]) => (
              <article
                key={number}
                className="border border-white/12 bg-white/[0.035] p-5"
              >
                <p className="font-mono text-[9px] text-[#dcb458]">
                  {number}
                </p>
                <h3
                  className={`${displayFont} mt-8 text-[1.45rem] font-black uppercase leading-[.94]`}
                >
                  {title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-white/55">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <FormworkFooter />
    </div>
  );
}

'@

Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\site\formwork\contact.tsx") `
    -Content $contactCode

# Detail pages: humanize static copy and calm typography.
$projectDetail = Join-Path $repoRoot "components\site\project-detail-page.tsx"
$serviceDetail = Join-Path $repoRoot "components\site\service-detail-page.tsx"

Replace-Safe $projectDetail `
    "Lingkup dan pelaksanaan dibaca dalam satu konteks." `
    "Lingkup pekerjaan dan pelaksanaannya kami jelaskan secara ringkas."

Replace-Safe $projectDetail `
    "Project facts / scope" `
    "Informasi proyek"

Replace-Safe $projectDetail `
    "Narrative / execution" `
    "Pelaksanaan pekerjaan"

Replace-Safe $projectDetail `
    "Scope of work" `
    "Lingkup pekerjaan"

Replace-Safe $projectDetail `
    'text-[clamp(2.9rem,5vw,5.35rem)]' `
    'text-[clamp(2.65rem,4.5vw,4.65rem)]'

Replace-Safe $projectDetail `
    'text-[clamp(2.2rem,3.4vw,3.7rem)]' `
    'text-[clamp(2rem,3vw,3.15rem)]'

Replace-Safe $serviceDetail `
    "Dari kebutuhan menuju detail yang dapat dibangun." `
    "Kebutuhan proyek diterjemahkan menjadi langkah kerja yang jelas."

Replace-Safe $serviceDetail `
    "Lingkup kerja yang dapat disesuaikan dengan proyek." `
    "Lingkup pekerjaan dapat disesuaikan dengan kebutuhan proyek."

Replace-Safe $serviceDetail `
    "Susun ruang lingkup yang tepat sebelum pekerjaan dimulai." `
    "Pastikan kebutuhan proyek jelas sebelum pekerjaan dimulai."

Replace-Safe $serviceDetail `
    'text-[clamp(2.9rem,5vw,5.25rem)]' `
    'text-[clamp(2.65rem,4.5vw,4.6rem)]'

Replace-Safe $serviceDetail `
    'text-[clamp(2.2rem,3.4vw,3.6rem)]' `
    'text-[clamp(2rem,3vw,3.1rem)]'

# =========================================================
# 4. ADMIN THEME
# =========================================================

Write-Host "[4/6] Menyamakan shell Admin dengan identitas publik..." -ForegroundColor Yellow

$adminHeaderCode = @'
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  MessageSquareQuote,
  Wrench,
  X,
} from "lucide-react";

import { logoutAdmin } from "@/lib/firebase/auth";

const mobileMenu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Layanan", href: "/admin/services", icon: Wrench },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban },
  {
    name: "Testimoni",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { name: "FAQ", href: "/admin/faqs", icon: CircleHelp },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/admin/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#d8d1c6] bg-[#f5f1e8]/95 px-4 text-[#14243f] backdrop-blur-xl sm:px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="admin-icon-button lg:hidden"
            aria-label="Buka menu admin"
          >
            <Menu size={18} />
          </button>

          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Lunar / Content
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14243f]">
              Panel Pengelolaan Website
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="admin-button-secondary hidden sm:inline-flex"
          >
            <ExternalLink size={15} />
            Lihat website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-icon-button"
            aria-label="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0b1729]/65 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          />

          <aside className="absolute inset-y-0 left-0 w-[min(88vw,330px)] bg-[#14243f] p-5 text-[#f8f4ec] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <Link
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/lunar-logo-mark.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.08em]">
                    Lunar
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#dcb458]">
                    Admin workspace
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/65 transition hover:text-white"
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-6 space-y-1">
              {mobileMenu.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 border-l-2 px-3 py-3 text-sm transition ${
                      active
                        ? "border-[#dcb458] bg-white/[0.06] text-white"
                        : "border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\admin\header.tsx") `
    -Content $adminHeaderCode

$adminSidebarCode = @'
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  FolderKanban,
  Home,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Layanan", href: "/admin/services", icon: Wrench },
  { name: "Proyek", href: "/admin/projects", icon: FolderKanban },
  {
    name: "Testimoni",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { name: "FAQ", href: "/admin/faqs", icon: CircleHelp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[270px] shrink-0 border-r border-white/10 bg-[#14243f] px-5 py-6 text-[#f8f4ec] lg:block">
      <Link href="/admin/dashboard" className="flex items-center gap-3 px-1">
        <Image
          src="/lunar-logo-mark.png"
          alt=""
          width={64}
          height={64}
          priority
          className="h-11 w-11 object-contain"
        />

        <span>
          <span className="block text-sm font-black uppercase tracking-[0.08em]">
            Lunar
          </span>
          <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#dcb458]">
            Content workspace
          </span>
        </span>
      </Link>

      <div className="my-7 h-px bg-white/10" />

      <p className="mb-3 px-3 font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-white/35">
        Kelola konten
      </p>

      <nav className="space-y-1">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "border-[#dcb458] bg-white/[0.065] text-white"
                  : "border-transparent text-white/52 hover:bg-white/[0.035] hover:text-white"
              }`}
            >
              <Icon size={17} />
              <span>{item.name}</span>

              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#dcb458]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-5">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#dcb458]">
          Public website
        </p>
        <p className="mt-2 text-[11px] leading-5 text-white/42">
          Perubahan yang dipublikasikan akan tampil pada website Lunar
          Konstruksi.
        </p>
      </div>
    </aside>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\admin\sidebar.tsx") `
    -Content $adminSidebarCode

$adminLayoutCode = @'
import type { ReactNode } from "react";

import AdminProtected from "@/components/admin/admin-protected";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="flex min-h-screen bg-[#eee8df] text-[#14243f]">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader />
          <main className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProtected>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "app\admin\(dashboard)\layout.tsx") `
    -Content $adminLayoutCode

# =========================================================
# 5. ADMIN DASHBOARD / LIST / FORMS / LOGIN
# =========================================================

Write-Host "[5/6] Merapikan dashboard, list, form, dan login Admin..." -ForegroundColor Yellow

$adminDashboardCode = @'
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CircleHelp,
  FolderKanban,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { adminFetch, type ApiEnvelope } from "@/lib/api";
import type { FAQ } from "@/modules/faqs/faq.types";
import type { Project } from "@/modules/projects/project.types";
import type { ConstructionService } from "@/modules/services/service.types";
import type { Testimonial } from "@/modules/testimonials/testimonial.types";

type Summary = {
  services: ConstructionService[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};

const initialSummary: Summary = {
  services: [],
  projects: [],
  testimonials: [],
  faqs: [],
};

export default function DashboardClient() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      adminFetch<ApiEnvelope<ConstructionService[]>>("/api/admin/services"),
      adminFetch<ApiEnvelope<Project[]>>("/api/admin/projects"),
      adminFetch<ApiEnvelope<Testimonial[]>>("/api/admin/testimonials"),
      adminFetch<ApiEnvelope<FAQ[]>>("/api/admin/faqs"),
    ])
      .then(([services, projects, testimonials, faqs]) => {
        if (!active) return;

        setSummary({
          services: services.data,
          projects: projects.data,
          testimonials: testimonials.data,
          faqs: faqs.data,
        });
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Dashboard gagal dimuat.",
        ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      label: "Layanan",
      count: summary.services.length,
      published: summary.services.filter((item) => item.isPublished).length,
      href: "/admin/services",
      icon: Wrench,
    },
    {
      label: "Proyek",
      count: summary.projects.length,
      published: summary.projects.filter((item) => item.isPublished).length,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Testimoni",
      count: summary.testimonials.length,
      published: summary.testimonials.filter((item) => item.isPublished).length,
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      label: "FAQ",
      count: summary.faqs.length,
      published: summary.faqs.filter((item) => item.isPublished).length,
      href: "/admin/faqs",
      icon: CircleHelp,
    },
  ];

  const recentProjects = summary.projects.slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="admin-panel overflow-hidden !border-[#263b59] !bg-[#14243f] !text-[#f8f4ec]">
        <div className="relative z-10 max-w-3xl py-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#dcb458]">
            Dashboard / overview
          </span>

          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,3vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.035em]">
            Kelola isi website dari satu tempat.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Perbarui layanan, proyek, testimoni, dan pertanyaan umum yang tampil
            di website Lunar Konstruksi.
          </p>
        </div>

        <div className="absolute right-0 top-0 hidden h-full w-1/3 admin-dashboard-grid opacity-20 lg:block" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="admin-panel group overflow-hidden transition hover:-translate-y-0.5 hover:!border-[#b58c2f]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#8b8173]">
                  M-{String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-[#a59c90] transition group-hover:text-[#b58c2f]"
                />
              </div>

              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-black tracking-[-0.04em] text-[#14243f]">
                    {loading ? "—" : card.count}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#263b58]">
                    {card.label}
                  </p>
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8d1c6] bg-[#eee8df] text-[#14243f] transition group-hover:border-[#dcb458] group-hover:bg-[#e9ddbf]">
                  <Icon size={17} />
                </span>
              </div>

              <p className="mt-4 text-xs text-[#7b8490]">
                {card.published} sudah dipublikasikan
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="admin-panel !p-0">
          <div className="flex items-center justify-between gap-4 border-b border-[#ded7cb] p-5">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#b58c2f]">
                Project record
              </p>
              <h2 className="mt-2 font-bold text-[#14243f]">Proyek terbaru</h2>
              <p className="mt-1 text-xs text-[#737e8c]">
                Akses cepat ke proyek yang terakhir tersedia di CMS.
              </p>
            </div>

            <Link
              href="/admin/projects/create"
              className="admin-button-secondary"
            >
              Tambah proyek
            </Link>
          </div>

          {recentProjects.length ? (
            <div className="divide-y divide-[#e3ddd3]">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}/edit`}
                  className="flex items-center gap-4 p-4 transition hover:bg-[#f1ece3]"
                >
                  <div className="h-14 w-20 overflow-hidden bg-[#e4ddd2] [clip-path:polygon(0_0,90%_0,100%_18%,96%_100%,0_100%)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage.url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#14243f]">
                      {project.title}
                    </p>
                    <p className="mt-1 text-xs text-[#737e8c]">
                      {project.location} · {project.year}
                    </p>
                  </div>

                  <span
                    className={
                      project.isPublished
                        ? "admin-status-active"
                        : "admin-status-inactive"
                    }
                  >
                    {project.isPublished ? "Tayang" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-sm text-[#737e8c]">
              Belum ada proyek yang ditambahkan.
            </div>
          )}
        </div>

        <div className="admin-panel">
          <span className="admin-eyebrow">Status publikasi</span>
          <h2 className="mt-3 text-xl font-bold text-[#14243f]">
            Kesiapan konten
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#737e8c]">
            Persentase item yang sudah aktif atau dipublikasikan.
          </p>

          <div className="mt-6 space-y-5">
            {cards.map((card) => {
              const percentage = card.count
                ? Math.round((card.published / card.count) * 100)
                : 0;

              return (
                <div key={card.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#4f5d70]">
                      {card.label}
                    </span>
                    <span className="font-mono text-[9px] text-[#8a8175]">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden bg-[#e3ddd3]">
                    <div
                      className="h-full bg-[#dcb458] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\admin\dashboard-client.tsx") `
    -Content $adminDashboardCode

$resourceListCode = @'
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { adminFetch, type ApiEnvelope } from "@/lib/api";

type BaseItem = {
  id?: string;
  isPublished?: boolean;
  isActive?: boolean;
};

type Column<T> = {
  label: string;
  className?: string;
  render: (item: T) => React.ReactNode;
};

type Props<T extends BaseItem> = {
  title: string;
  description: string;
  endpoint: string;
  createHref: string;
  editHref: (item: T) => string;
  searchText: (item: T) => string;
  columns: Column<T>[];
  statusField?: "isPublished" | "isActive";
  statusLabels?: [string, string];
  emptyLabel: string;
};

export function ResourceList<T extends BaseItem>({
  title,
  description,
  endpoint,
  createHref,
  editHref,
  searchText,
  columns,
  statusField,
  statusLabels = ["Draft", "Tayang"],
  emptyLabel,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    adminFetch<ApiEnvelope<T[]>>(endpoint)
      .then((result) => {
        if (active) setItems(result.data);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Data gagal dimuat.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      searchText(item).toLowerCase().includes(keyword),
    );
  }, [items, query, searchText]);

  async function toggleStatus(item: T) {
    if (!statusField || !item.id) return;

    const nextValue = !Boolean(item[statusField]);

    try {
      setProcessingId(item.id);

      await adminFetch(`${endpoint}/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [statusField]: nextValue }),
      });

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, [statusField]: nextValue }
            : entry,
        ),
      );

      toast.success("Status berhasil diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Status gagal diperbarui.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function removeItem(item: T) {
    if (
      !item.id ||
      !window.confirm(
        "Hapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.",
      )
    ) {
      return;
    }

    try {
      setProcessingId(item.id);

      await adminFetch(`${endpoint}/${item.id}`, {
        method: "DELETE",
      });

      setItems((current) =>
        current.filter((entry) => entry.id !== item.id),
      );

      toast.success("Data berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Data gagal dihapus.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="admin-panel flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="admin-eyebrow">Pengelolaan konten</span>
          <h1 className="mt-3 text-[clamp(1.9rem,3vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687587]">
            {description}
          </p>
        </div>

        <Link href={createHref} className="admin-button-primary shrink-0">
          <Plus size={16} />
          Tambah data
        </Link>
      </section>

      <section className="admin-panel !p-0">
        <div className="flex items-center justify-between gap-4 border-b border-[#ded7cb] p-4">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b94a0]"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Cari ${title.toLowerCase()}...`}
              className="admin-input pl-10"
            />
          </div>

          <span className="hidden font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8b8173] sm:block">
            {filteredItems.length} data
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-[#737e8c]">
            <LoaderCircle size={18} className="animate-spin text-[#b58c2f]" />
            Memuat data...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="min-h-52 p-8 text-center">
            <p className="font-semibold text-[#14243f]">{emptyLabel}</p>
            <p className="mt-2 text-sm text-[#737e8c]">
              Tambahkan data baru atau gunakan kata pencarian lain.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-[#eee8df] font-mono text-[9px] uppercase tracking-[0.13em] text-[#687587]">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label}
                      className={`px-5 py-4 font-semibold ${
                        column.className ?? ""
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}

                  {statusField ? (
                    <th className="px-5 py-4 font-semibold">Status</th>
                  ) : null}

                  <th className="px-5 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e3ddd3]">
                {filteredItems.map((item, index) => {
                  const id = item.id ?? String(index);
                  const active = statusField
                    ? Boolean(item[statusField])
                    : false;
                  const processing = processingId === item.id;

                  return (
                    <tr
                      key={id}
                      className="transition hover:bg-[#f1ece3]"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.label}
                          className={`px-5 py-4 align-middle text-[#4f5d70] ${
                            column.className ?? ""
                          }`}
                        >
                          {column.render(item)}
                        </td>
                      ))}

                      {statusField ? (
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => toggleStatus(item)}
                            disabled={processing}
                            className={
                              active
                                ? "admin-status-active"
                                : "admin-status-inactive"
                            }
                          >
                            {active ? statusLabels[1] : statusLabels[0]}
                          </button>
                        </td>
                      ) : null}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={editHref(item)}
                            className="admin-icon-button"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            disabled={processing}
                            className="admin-icon-button !text-red-700 hover:!border-red-200 hover:!bg-red-50"
                            aria-label="Hapus"
                          >
                            {processing ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\admin\resource-list.tsx") `
    -Content $resourceListCode

$formElementsCode = @'
"use client";

import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";

export function FormHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="admin-panel">
      <span className="admin-eyebrow">{eyebrow}</span>
      <h1 className="mt-3 text-[clamp(1.9rem,3vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14243f]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687587]">
        {description}
      </p>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="mb-5 border-b border-[#ded7cb] pb-4">
        <h2 className="font-bold text-[#14243f]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[#737e8c]">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function FormActions({
  cancelHref,
  saving,
  label = "Simpan Data",
}: {
  cancelHref: string;
  saving: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 border border-[#d8d1c6] bg-[#f5f1e8]/95 p-4 shadow-[0_18px_55px_rgba(20,36,63,0.10)] backdrop-blur">
      <Link href={cancelHref} className="admin-button-secondary">
        Batal
      </Link>

      <button
        type="submit"
        disabled={saving}
        className="admin-button-primary"
      >
        {saving ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {saving ? "Menyimpan..." : label}
      </button>
    </div>
  );
}

export function BooleanField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-[#d8d1c6] bg-[#faf7f0] p-4 transition hover:border-[#b58c2f] hover:bg-[#f2ead8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[#b58c2f]"
      />

      <span>
        <span className="block text-sm font-semibold text-[#14243f]">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[#737e8c]">
          {description}
        </span>
      </span>
    </label>
  );
}

export function LoadingForm() {
  return (
    <div className="admin-panel min-h-64 animate-pulse !bg-[#eee8df]" />
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "components\admin\forms\form-elements.tsx") `
    -Content $formElementsCode

$loginCode = @'
"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { adminFetch } from "@/lib/api";
import { loginAdmin, logoutAdmin } from "@/lib/firebase/auth";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin/dashboard");
    }
  }, [loading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await loginAdmin(email.trim(), password);
      await adminFetch("/api/admin/session");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (caughtError) {
      await logoutAdmin().catch(() => undefined);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Email atau password tidak valid.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#14243f] text-[#f8f4ec]">
      <div className="absolute inset-0 admin-login-grid opacity-25" />
      <div className="absolute -bottom-36 -right-24 h-[420px] w-[420px] rounded-full border border-[#dcb458]/20" />
      <div className="absolute -bottom-20 -right-6 h-[300px] w-[300px] rounded-full border border-white/10" />

      <div className="relative mx-auto grid min-h-screen max-w-[1320px] items-center gap-14 px-6 py-12 lg:grid-cols-[1.05fr_460px] lg:px-10">
        <section className="hidden lg:block">
          <div className="flex items-center gap-4">
            <Image
              src="/lunar-logo-mark.png"
              alt=""
              width={76}
              height={76}
              priority
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="text-lg font-black uppercase tracking-[0.09em]">
                Lunar
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#dcb458]">
                Konstruksi / Admin
              </p>
            </div>
          </div>

          <h1 className="mt-12 max-w-xl text-[clamp(2.8rem,4.5vw,4.8rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]">
            Kelola website dengan tampilan yang tetap satu identitas.
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
            Gunakan panel ini untuk memperbarui layanan, proyek, testimoni, dan
            pertanyaan umum yang tampil di website.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-px border border-white/12 bg-white/12">
            {[
              ["01", "Layanan"],
              ["02", "Proyek"],
              ["03", "Publikasi"],
            ].map(([number, label]) => (
              <div key={number} className="bg-[#14243f] p-5">
                <p className="font-mono text-[9px] text-[#dcb458]">
                  {number}
                </p>
                <p className="mt-8 text-sm font-medium text-white/65">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-white/14 bg-[#f5f1e8] p-6 text-[#14243f] shadow-[0_28px_80px_rgba(0,0,0,0.22)] sm:p-9 [clip-path:polygon(0_0,94%_0,100%_7%,100%_100%,6%_100%,0_93%)]">
          <div className="mb-8">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]">
              Admin access
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em]">
              Masuk ke panel
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d7888]">
              Masukkan akun admin Lunar Konstruksi untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="admin-label">Email</span>
              <span className="relative block">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b94a0]"
                  size={17}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="admin-input pl-12"
                  placeholder="admin@lunarkonstruksi.id"
                />
              </span>
            </label>

            <label className="block">
              <span className="admin-label">Password</span>
              <span className="relative block">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b94a0]"
                  size={17}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="admin-input pl-12"
                  placeholder="••••••••"
                />
              </span>
            </label>

            {error ? (
              <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="admin-button-primary !mt-6 !h-12 !w-full"
            >
              {submitting ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
              {submitting ? "Memverifikasi..." : "Masuk dashboard"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

'@
Write-Utf8NoBom `
    -Path (Join-Path $repoRoot "app\admin\login\page.tsx") `
    -Content $loginCode

# =========================================================
# 6. GLOBAL ADMIN COMPONENT TOKENS
# =========================================================

Write-Host "[6/6] Mengubah warna dan komponen Admin ke navy / cream / gold..." -ForegroundColor Yellow

$globalsFile = Join-Path $repoRoot "app\globals.css"
$globalsContent = [System.IO.File]::ReadAllText($globalsFile)

$adminReplacements = @{
'  .admin-panel { @apply relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-6; }' =
'  .admin-panel { @apply relative border border-[#d8d1c6] bg-[#faf7f0] p-5 shadow-sm shadow-[#14243f]/[0.035] sm:p-6; }';

'  .admin-eyebrow { @apply text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600; }' =
'  .admin-eyebrow { @apply font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58c2f]; }';

'  .admin-label { @apply mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600; }' =
'  .admin-label { @apply mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#59677a]; }';

'  .admin-input { @apply h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-100; }' =
'  .admin-input { @apply h-11 w-full border border-[#cfc8bd] bg-[#fffdf8] px-3.5 text-sm text-[#14243f] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#b58c2f] focus:ring-3 focus:ring-[#dcb458]/15; }';

'  .admin-textarea { @apply w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-100; }' =
'  .admin-textarea { @apply w-full resize-y border border-[#cfc8bd] bg-[#fffdf8] px-3.5 py-3 text-sm leading-6 text-[#14243f] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#b58c2f] focus:ring-3 focus:ring-[#dcb458]/15; }';

'  .admin-button-primary { @apply inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-orange-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50; }' =
'  .admin-button-primary { @apply inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#14243f] px-5 text-sm font-semibold text-[#f8f4ec] transition hover:bg-[#dcb458] hover:text-[#14243f] disabled:cursor-not-allowed disabled:opacity-50; }';

'  .admin-button-secondary { @apply inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50; }' =
'  .admin-button-secondary { @apply inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#cfc8bd] bg-[#faf7f0] px-4 text-sm font-semibold text-[#14243f] transition hover:border-[#b58c2f] hover:bg-[#eee8df] disabled:cursor-not-allowed disabled:opacity-50; }';

'  .admin-button-danger { @apply inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50; }' =
'  .admin-button-danger { @apply inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50; }';

'  .admin-icon-button { @apply inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50; }' =
'  .admin-icon-button { @apply inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#cfc8bd] bg-[#faf7f0] text-[#526074] transition hover:border-[#b58c2f] hover:bg-[#eee8df] hover:text-[#14243f] disabled:cursor-not-allowed disabled:opacity-50; }';

'  .admin-status-active { @apply inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700; }' =
'  .admin-status-active { @apply inline-flex rounded-full border border-[#d7c899] bg-[#f2ead8] px-2.5 py-1 text-[11px] font-semibold text-[#6f5720]; }';

'  .admin-status-inactive { @apply inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600; }' =
'  .admin-status-inactive { @apply inline-flex rounded-full border border-[#d8d1c6] bg-[#eee8df] px-2.5 py-1 text-[11px] font-semibold text-[#677383]; }'
}

foreach ($pair in $adminReplacements.GetEnumerator()) {
    if ($globalsContent.Contains($pair.Key)) {
        $globalsContent = $globalsContent.Replace($pair.Key, $pair.Value)
    }
}

$globalsContent = $globalsContent.Replace(
    '::selection { background: #f97316; color: #111827; }',
    '::selection { background: #dcb458; color: #14243f; }'
)

Write-Utf8NoBom -Path $globalsFile -Content $globalsContent

Write-Host ""
Write-Host "=== Revisi v21 selesai ===" -ForegroundColor Green
Write-Host "Backup: $backupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Perubahan utama:" -ForegroundColor Cyan
Write-Host "  - FAQ pindah dari /services ke homepage"
Write-Host "  - copywriting public dibuat lebih natural"
Write-Host "  - heading besar diturunkan lagi"
Write-Host "  - halaman Contact dibuat lebih mudah dipahami"
Write-Host "  - Admin memakai navy / cream / gold seperti public"
Write-Host "  - Team disembunyikan dari navigasi admin karena tidak dipakai public"
Write-Host "  - data/route Team tidak dihapus"
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host ""
Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Cek khusus:" -ForegroundColor Cyan
Write-Host "  /"
Write-Host "  /services"
Write-Host "  /contact"
Write-Host "  /projects"
Write-Host "  /admin/login"
Write-Host "  /admin/dashboard"
Write-Host "  /admin/services"
Write-Host "  /admin/projects"
Write-Host "  /admin/testimonials"
Write-Host "  /admin/faqs"
Write-Host ""
