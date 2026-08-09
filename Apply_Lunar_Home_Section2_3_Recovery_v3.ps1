Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR RECOVERY] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR RECOVERY] GAGAL: $Message" -ForegroundColor Red
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

function Replace-SectionByMarker {
  param(
    [string]$Content,
    [string[]]$Markers,
    [string]$Replacement
  )

  $markerIndex = -1
  foreach ($marker in $Markers) {
    $candidate = $Content.IndexOf($marker, [System.StringComparison]::Ordinal)
    if ($candidate -ge 0) {
      $markerIndex = $candidate
      break
    }
  }

  if ($markerIndex -lt 0) {
    throw "Marker section tidak ditemukan: $($Markers -join ' | ')"
  }

  $sectionStart = $Content.LastIndexOf("<section", $markerIndex, [System.StringComparison]::Ordinal)
  if ($sectionStart -lt 0) {
    throw "Pembuka <section> sebelum marker tidak ditemukan."
  }

  $sectionClose = $Content.IndexOf("</section>", $markerIndex, [System.StringComparison]::Ordinal)
  if ($sectionClose -lt 0) {
    throw "Penutup </section> setelah marker tidak ditemukan."
  }

  $sectionEnd = $sectionClose + "</section>".Length
  return $Content.Substring(0, $sectionStart) + $Replacement + $Content.Substring($sectionEnd)
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
  Fail "Jalankan script ini dari repository Lunar Konstruksi."
}

$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$homePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
if (-not (Test-Path -LiteralPath $homePath)) {
  Fail "components/site/formwork/home.tsx tidak ditemukan."
}

# -----------------------------------------------------------------------------
# 1) Cari backup otomatis dari sebelum patch Section 02/03 yang merusak Home.
# -----------------------------------------------------------------------------
$backupBase = Join-Path $repoRoot ".lunar-backups"
if (-not (Test-Path -LiteralPath $backupBase)) {
  Fail "Folder .lunar-backups tidak ditemukan."
}

$recoveryCandidates = @(
  Get-ChildItem -LiteralPath $backupBase -Directory -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Name -like "home-section2-3-rebuild-*" -and
      (Test-Path -LiteralPath (Join-Path $_.FullName "home.tsx"))
    } |
    Sort-Object LastWriteTime -Descending
)

if ($recoveryCandidates.Count -eq 0) {
  Fail "Backup home-section2-3-rebuild-* tidak ditemukan. Jangan lanjut manual dulu."
}

$recoveryDir = $recoveryCandidates[0]
$recoveryHome = Join-Path $recoveryDir.FullName "home.tsx"
Step "Recovery source: $recoveryHome"

# Simpan kondisi rusak sekarang juga supaya tetap bisa diperiksa.
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$currentBackup = Join-Path $backupBase "before-home-recovery-v3-$timestamp"
New-Item -ItemType Directory -Force -Path $currentBackup | Out-Null
Copy-Item -LiteralPath $homePath -Destination (Join-Path $currentBackup "home.tsx") -Force
Step "Current broken Home disimpan: $currentBackup"

# Restore baseline yang masih punya Section 01 + 02.
Copy-Item -LiteralPath $recoveryHome -Destination $homePath -Force
$homeSource = Read-Text $homePath

if ($homeSource -notmatch 'General contracting / field coordination') {
  Fail "Backup yang ditemukan tidak memiliki Section 01. Recovery dihentikan agar tidak menimpa source dengan baseline salah."
}
if ($homeSource -notmatch 'Capabilities / field package') {
  Fail "Backup yang ditemukan tidak memiliki Section 02. Recovery dihentikan."
}
Step "Section 01 + Section 02 berhasil direstore dari backup."

# -----------------------------------------------------------------------------
# 2) Section 02 — capabilities menjadi asymmetric service cards.
#    Tidak memakai decorative image collage lagi.
# -----------------------------------------------------------------------------
$section2 = @'
<section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
  <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
    <div className="grid gap-10 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
      <div className="lg:pt-4">
        <MicroLabel>02 / Capabilities / field package</MicroLabel>
        <h2 className={`${displayFont} mt-5 max-w-[520px] text-[clamp(2.9rem,4.8vw,5.4rem)] font-black uppercase leading-[.9] tracking-[-.038em] text-[#14243f]`}>
          Layanan harus langsung terbaca.
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-8 text-[#5f6976]">
          Capabilities sekarang berfungsi sebagai service showcase. Pengguna bisa langsung melihat apa yang Lunar kerjakan tanpa harus membaca collage visual terlebih dahulu.
        </p>

        <div className="mt-8 hidden max-w-[300px] border-l-2 border-[#dcb458] bg-[#f8f4ec] px-4 py-4 lg:block">
          <MicroLabel>Scope reading / 02</MicroLabel>
          <p className="mt-3 text-[12px] leading-6 text-[#5f6976]">
            Tiap layanan diposisikan sebagai bagian dari alur kerja: persiapan, struktur, instalasi, finishing, sampai handover.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(92px,auto)]">
        {services.slice(0, 6).map((service, index) => {
          const layout = [
            "lg:col-span-7 lg:row-span-2 min-h-[235px]",
            "lg:col-span-5 min-h-[170px] lg:translate-y-5",
            "lg:col-span-4 min-h-[180px]",
            "lg:col-span-8 min-h-[180px] lg:-translate-y-3",
            "lg:col-span-5 min-h-[165px] lg:translate-y-3",
            "lg:col-span-7 min-h-[170px]",
          ][index] ?? "lg:col-span-6 min-h-[170px]";

          const shapes = [
            "polygon(8% 0%,100% 0%,100% 86%,92% 100%,0% 100%,0% 14%)",
            "polygon(0% 0%,92% 0%,100% 15%,100% 100%,10% 100%,0% 82%)",
            "polygon(10% 0%,100% 0%,92% 100%,0% 100%,0% 12%)",
          ];

          return (
            <Link
              key={service.id}
              href={service.slug ? `/services/${service.slug}` : "/services"}
              className={`group relative flex overflow-hidden border border-[#d9d1c4] bg-[#f8f4ec] p-5 shadow-[0_12px_30px_rgba(20,36,63,.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,36,63,.09)] ${layout}`}
              style={{ clipPath: shapes[index % shapes.length] }}
            >
              <span className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full border border-[#dcb458]/35 bg-[#dcb458]/10" />

              <div className="relative flex w-full flex-col justify-between gap-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <MicroLabel>{`SRV-${String(index + 1).padStart(2, "0")}`}</MicroLabel>
                    <span className="font-mono text-[8px] uppercase tracking-[.15em] text-[#7c8593]">Field package</span>
                  </div>

                  <h3 className="mt-6 max-w-[13ch] text-[clamp(1.55rem,2.35vw,2.65rem)] font-semibold uppercase leading-[.94] tracking-[-.04em] text-[#14243f]">
                    {service.name}
                  </h3>

                  <p className="mt-4 max-w-[34ch] text-[12px] leading-6 text-[#5f6976]">
                    Ruang lingkup, koordinasi, dan eksekusi layanan dirapikan sebagai satu paket kerja yang mudah dibaca.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#e3dacb] pt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[.16em] text-[#7c8593]">Scope / detail / delivery</span>
                  <span className="text-sm text-[#14243f] transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
</section>
'@

# -----------------------------------------------------------------------------
# 3) Section 03 — visual kiri, statement kanan.
#    Project Index yang mengulang dua judul DIHAPUS TOTAL.
# -----------------------------------------------------------------------------
$section3 = @'
<section className="relative border-b border-[#d8d1c6] py-16 sm:py-20 lg:py-24">
  <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-10">
    <div className="grid gap-10 xl:grid-cols-[1.16fr_.84fr] xl:gap-16 xl:items-center">
      <div>
        <MicroLabel>03 / Selected work / project register</MicroLabel>

        {featuredProject ? (
          <div className="relative mt-7 min-h-[520px] sm:min-h-[570px]">
            <Link
              href={projectHref(featuredProject.slug)}
              className="group absolute inset-x-0 top-0 overflow-hidden border border-[#d8d1c6] bg-[#e7e0d5] shadow-[0_16px_34px_rgba(20,36,63,.07)] sm:right-[16%]"
              style={{ clipPath: "polygon(0% 0%,92% 0%,100% 10%,100% 88%,92% 100%,8% 100%,0% 90%)" }}
            >
              <DatabaseImage
                src={featuredProject.image}
                alt={featuredProject.title}
                className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-[1.015] sm:h-[420px]"
                placeholderLabel="Media project utama belum diisi"
              />
              <div className="border-t border-[#ddd5c8] bg-[#f8f4ec] px-5 py-5">
                <MicroLabel>Featured record / 01</MicroLabel>
                <h3 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold uppercase leading-[.95] tracking-[-.04em] text-[#14243f]">
                  {featuredProject.title}
                </h3>
                <p className="mt-3 max-w-xl text-[12px] leading-6 text-[#5f6976]">
                  {featuredProject.location}{featuredProject.year ? ` / ${featuredProject.year}` : ""}
                </p>
              </div>
            </Link>

            {secondaryProjects[0] ? (
              <Link
                href={projectHref(secondaryProjects[0].slug)}
                className="group absolute bottom-0 right-0 hidden w-[36%] overflow-hidden border border-[#d8d1c6] bg-[#f8f4ec] shadow-[0_16px_34px_rgba(20,36,63,.09)] sm:block"
                style={{ clipPath: "polygon(10% 0%,100% 0%,100% 90%,90% 100%,0% 100%,0% 14%)" }}
              >
                <DatabaseImage
                  src={secondaryProjects[0].image}
                  alt={secondaryProjects[0].title}
                  className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  placeholderLabel="Media project pendukung belum diisi"
                />
                <div className="px-4 py-4">
                  <MicroLabel>File / 02</MicroLabel>
                  <p className="mt-2 text-[1.05rem] font-semibold uppercase leading-[.95] tracking-[-.025em] text-[#14243f]">
                    {secondaryProjects[0].title}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-[#bdb6ac] px-6 py-12 text-center">
            <MicroLabel>Belum ada project published</MicroLabel>
          </div>
        )}
      </div>

      <div className="xl:pl-4">
        <div className="border-t border-[#cfc8bd] pt-6">
          <MicroLabel>Selected record / editorial note</MicroLabel>
          <h2 className={`${displayFont} mt-5 max-w-[520px] text-[clamp(3rem,4.7vw,5.3rem)] font-black uppercase leading-[.89] tracking-[-.04em] text-[#14243f]`}>
            Project dibaca sebagai rangkaian keputusan.
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#5f6976]">
            Satu proyek utama menjadi focal point. Project kedua cukup hadir sebagai record pendukung—tanpa daftar judul yang mengulang informasi yang sudah tampil di visual.
          </p>

          <Link
            href="/projects"
            className="mt-7 inline-flex items-center gap-3 border-b border-[#dcb458]/75 pb-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#14243f]"
          >
            Open full register <span className="h-px w-10 bg-[#dcb458]" /> →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-y border-[#ddd5c8] py-5">
          <div>
            <MicroLabel>Record logic</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Featured work menjadi bukti utama, bukan sekadar thumbnail katalog.</p>
          </div>
          <div>
            <MicroLabel>Archive route</MicroLabel>
            <p className="mt-2 text-[12px] leading-6 text-[#5f6976]">Semua record lengkap tetap tersedia di halaman Projects.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
'@

try {
  $homeSource = Replace-SectionByMarker -Content $homeSource -Markers @(
    '<MicroLabel>02 / Capabilities / field package</MicroLabel>',
    '<MicroLabel>Capabilities / field package</MicroLabel>'
  ) -Replacement $section2

  $homeSource = Replace-SectionByMarker -Content $homeSource -Markers @(
    '<MicroLabel>03 / Selected work / project register</MicroLabel>',
    '<MicroLabel>Selected work / project register</MicroLabel>'
  ) -Replacement $section3
}
catch {
  # Jangan tinggalkan hasil setengah jadi.
  Copy-Item -LiteralPath $recoveryHome -Destination $homePath -Force
  Fail ("Pemasangan section gagal dan Home sudah direstore kembali. Detail: " + $_.Exception.Message)
}

Write-Utf8NoBom $homePath $homeSource

# -----------------------------------------------------------------------------
# 4) Sanity check: section 1, 2, 3, 4 semuanya harus tetap ada.
# -----------------------------------------------------------------------------
$finalCheck = Read-Text $homePath
$requiredMarkers = @(
  "General contracting / field coordination",
  "02 / Capabilities / field package",
  "03 / Selected work / project register",
  "Site sequence / work logic"
)

$missingMarkers = @($requiredMarkers | Where-Object { $finalCheck -notmatch [regex]::Escape($_) })
if ($missingMarkers.Count -gt 0) {
  Copy-Item -LiteralPath $recoveryHome -Destination $homePath -Force
  $missingMarkers | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
  Fail "Sanity check gagal. Home otomatis dikembalikan ke backup."
}

if ($finalCheck -match '<MicroLabel>Project index</MicroLabel>') {
  Copy-Item -LiteralPath $recoveryHome -Destination $homePath -Force
  Fail "Project Index lama masih terdeteksi. Home otomatis dikembalikan ke backup."
}

Write-Host ""
Write-Host "[LUNAR RECOVERY] SELESAI." -ForegroundColor Green
Write-Host "  - Section 01 kembali" -ForegroundColor Green
Write-Host "  - Section 02 = asymmetric service cards" -ForegroundColor Green
Write-Host "  - Section 03 = visual kiri + statement kanan" -ForegroundColor Green
Write-Host "  - Project Index / dua judul berulang dihapus total" -ForegroundColor Green
Write-Host "  - Section 04 dan seterusnya tidak disentuh" -ForegroundColor Green
Write-Host ""
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
Write-Host "  npm run dev"
