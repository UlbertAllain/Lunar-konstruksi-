Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR COPY] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR COPY] GAGAL: $Message" -ForegroundColor Red
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

function Backup-File([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath) {
  $source = Join-Path $RepoRoot $RelativePath
  if (-not (Test-Path -LiteralPath $source)) { return }
  $target = Join-Path $BackupRoot $RelativePath
  $targetParent = Split-Path -Parent $target
  if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) {
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
  }
  Copy-Item -LiteralPath $source -Destination $target -Force
}

function Replace-Regex([string]$Content, [string]$Pattern, [string]$Replacement) {
  return [System.Text.RegularExpressions.Regex]::Replace(
    $Content,
    $Pattern,
    $Replacement,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "Jalankan script ini dari repository Lunar Konstruksi." }
$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$formworkDir = Join-Path $repoRoot "components/site/formwork"
if (-not (Test-Path -LiteralPath $formworkDir)) {
  Fail "Folder components/site/formwork tidak ditemukan."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/professional-copy-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$formworkFiles = Get-ChildItem -LiteralPath $formworkDir -Filter "*.tsx" -File
foreach ($file in $formworkFiles) {
  Backup-File $repoRoot $backupRoot ("components/site/formwork/" + $file.Name)
}
Step "Backup: $backupRoot"

# =============================================================================
# 1. Global public-facing copy cleanup
# =============================================================================
$copyPairs = [ordered]@{
  'Layout menyesuaikan jumlah personel. Satu orang tampil sebagai dossier horizontal; ketika data bertambah, section otomatis berubah menjadi bento tanpa memakan ruang kosong berlebihan.' = 'Setiap anggota tim memiliki peran dalam menjaga koordinasi, komunikasi, dan kualitas pelaksanaan proyek dari awal hingga selesai.'
  'Satu proyek utama menjadi focal point. Project kedua cukup hadir sebagai record pendukung—tanpa daftar judul yang mengulang informasi yang sudah tampil di visual.' = 'Proyek pilihan kami menampilkan hasil pekerjaan beserta konteks lokasi dan lingkupnya. Proyek lainnya dapat dilihat pada halaman portofolio.'
  'Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja — bukan dipaksa memenuhi halaman dengan grid seragam.' = 'Proyek pilihan kami menampilkan hasil pekerjaan, proses, dan konteks pelaksanaan secara ringkas dan mudah dipahami.'
  'Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja—bukan dipaksa memenuhi halaman dengan grid seragam.' = 'Proyek pilihan kami menampilkan hasil pekerjaan, proses, dan konteks pelaksanaan secara ringkas dan mudah dipahami.'
  'Featured work menjadi bukti utama, bukan sekadar thumbnail katalog.' = 'Setiap proyek ditampilkan untuk memberikan gambaran nyata mengenai lingkup dan hasil pekerjaan kami.'
  'Semua record lengkap tetap tersedia di halaman Projects.' = 'Lihat proyek lainnya untuk mengenal lebih jauh pengalaman dan hasil pekerjaan Lunar Konstruksi.'
  'Personel tampil sebagai bagian dari sistem kerja, bukan card kecil yang meninggalkan ruang kosong di tengah halaman.' = 'Setiap anggota tim memiliki tanggung jawab yang mendukung koordinasi dan kelancaran pelaksanaan proyek.'
  'Tim tidak dipajang sebagai filler. Setiap personel tampil sebagai bagian dari proses koordinasi dan delivery proyek.' = 'Tim kami bekerja bersama untuk menjaga koordinasi, kualitas pekerjaan, dan komunikasi proyek tetap berjalan dengan baik.'
  'Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan bergerak dalam satu alur yang mudah dibaca—bukan saling mengejar ketika pekerjaan sudah berjalan.' = 'Perencanaan, koordinasi, pengendalian mutu, dan pelaksanaan lapangan kami susun dalam satu alur kerja yang jelas sejak awal hingga penyelesaian.'
  'Perencanaan, koordinasi, kontrol mutu, dan pekerjaan lapangan bergerak dalam satu alur yang mudah dibacaâ€”bukan saling mengejar ketika pekerjaan sudah berjalan.' = 'Perencanaan, koordinasi, pengendalian mutu, dan pelaksanaan lapangan kami susun dalam satu alur kerja yang jelas sejak awal hingga penyelesaian.'
  'Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.' = 'Empat tahap utama membantu setiap pekerjaan tetap terarah, dari kebutuhan awal sampai proses serah terima.'
  'Kontrol lapangan bukan satu checklist di akhir. Ia berjalan bersama keputusan, klarifikasi, dan handover sepanjang proyek.' = 'Pengendalian mutu dilakukan sepanjang proyek untuk menjaga pekerjaan tetap sesuai rencana dan mendukung proses serah terima yang tertib.'
  'Setiap layanan tampil sebagai record visual tersendiri. Foto, scope, dan konteks layanan dibaca dari kiri ke kanan tanpa mengubahnya menjadi bento grid yang kaku.' = 'Setiap layanan dirancang untuk membantu kebutuhan proyek pada tahap yang berbeda, dari persiapan hingga penyelesaian.'
  'About / field organisation' = 'Tentang Lunar'
  'Position / responsibility' = 'Cara kami bekerja'
  'Personnel / project team' = 'Tim Lunar'
  'Selected record / editorial note' = 'Proyek pilihan'
  'Selected work / project register' = 'Proyek pilihan'
  '03 / Selected work / project register' = '03 / Proyek pilihan'
  'Record logic' = 'Lingkup pekerjaan'
  'Archive route' = 'Portofolio proyek'
  'Project index' = 'Proyek lainnya'
  'Open full register' = 'Lihat semua proyek'
  'Field crew / personnel' = 'Tim Lunar'
  '06 / Field crew / personnel' = '06 / Tim Lunar'
  'Personnel / 01' = 'Anggota tim / 01'
  'Field coordination' = 'Koordinasi lapangan'
  'Site communication' = 'Komunikasi proyek'
  'Delivery support' = 'Dukungan pelaksanaan'
  'Site note / QC-04' = 'Catatan lapangan / QC-04'
  'Field memo / client record' = 'Cerita klien'
  '07 / Field memo / client record' = '07 / Cerita klien'
  'Closing note / next project' = 'Mulai proyek Anda'
  '08 / Closing note / next project' = '08 / Mulai proyek Anda'
  'Talk to our team' = 'Konsultasikan proyek'
  'years / field practice' = 'tahun pengalaman'
  'projects / documented' = 'proyek terdokumentasi'
  'delivery / coordinated' = 'pekerjaan terkoordinasi'
  'Quality checkpoints' = 'Pemeriksaan mutu'
  'Clarify / close' = 'Klarifikasi teknis'
  'Verify / handover' = 'Serah terima'
  'Media personnel belum diisi' = 'Foto anggota tim belum tersedia'
  'Media team' = 'Foto anggota tim'
  'Media project utama belum diisi' = 'Foto proyek belum tersedia'
  'Media project pendukung belum diisi' = 'Foto proyek belum tersedia'
  'Belum ada project published' = 'Belum ada proyek yang ditampilkan'
}

foreach ($file in $formworkFiles) {
  $content = Read-Text $file.FullName

  foreach ($pair in $copyPairs.GetEnumerator()) {
    $content = $content.Replace([string]$pair.Key, [string]$pair.Value)
  }

  # Generic mojibake cleanup commonly introduced by previous patches.
  $content = $content.Replace('â€”', ' - ')
  $content = $content.Replace('â€“', ' - ')
  $content = $content.Replace('â†’', '→')
  $content = $content.Replace('Â', '')

  Write-Utf8NoBom $file.FullName $content
}
Step "Copywriting global dirapikan."

# =============================================================================
# 2. HOME-specific copy cleanup and remove internal-designer note block
# =============================================================================
$homePagePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
if (Test-Path -LiteralPath $homePagePath) {
  $homeSource = Read-Text $homePagePath

  # Remove old two-column internal note block when present.
  $homeSource = Replace-Regex $homeSource '<div className="mt-12 grid grid-cols-2 gap-4 border-y border-\[#ddd5c8\] py-5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>' '</div>`r`n    </div>'

  # More natural project introduction.
  $homeSource = $homeSource.Replace(
    'Project dibaca sebagai rangkaian keputusan.',
    'Setiap proyek dibangun dari keputusan yang tepat.'
  )

  $homeSource = $homeSource.Replace(
    'Proyek pilihan kami menunjukkan bagaimana kebutuhan, proses, dan hasil pekerjaan ditangani dari awal sampai selesai.',
    'Proyek pilihan kami memberikan gambaran mengenai proses, lingkup pekerjaan, dan hasil yang telah diselesaikan bersama klien.'
  )

  $homeSource = $homeSource.Replace(
    'Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.',
    'Keputusan teknis harus tetap jelas dari perencanaan hingga pelaksanaan.'
  )

  Write-Utf8NoBom $homePagePath $homeSource
  Step "Copywriting Home dirapikan dan catatan internal dihapus."
}

# =============================================================================
# 3. ABOUT-specific copy + Team media fix
# =============================================================================
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
if (Test-Path -LiteralPath $aboutPath) {
  $aboutSource = Read-Text $aboutPath

  $aboutSource = $aboutSource.Replace(
    'Lunar Konstruksi menghubungkan perencanaan, estimasi, koordinasi, dan pelaksanaan agar proyek bergerak dengan struktur kerja yang dapat dibaca dan dipertanggungjawabkan.',
    'Lunar Konstruksi mendampingi proyek melalui perencanaan, estimasi, koordinasi, dan pelaksanaan yang terarah agar setiap keputusan dapat diterapkan dengan jelas di lapangan.'
  )

  $aboutSource = $aboutSource.Replace(
    'Setiap proyek memiliki kondisi berbeda. Karena itu, proses Lunar tidak bergantung pada satu formula visual, tetapi pada disiplin dokumentasi, komunikasi, dan kontrol lapangan.',
    'Setiap proyek memiliki kebutuhan dan kondisi yang berbeda. Kami menyesuaikan pendekatan kerja dengan tetap menjaga komunikasi, dokumentasi, pengendalian mutu, dan koordinasi lapangan secara konsisten.'
  )

  $aboutSource = $aboutSource.Replace(
    'Foto dan data personel diambil dari data Team yang dikelola melalui admin.',
    'Setiap anggota tim berperan dalam mendukung koordinasi, pengawasan, dan pelaksanaan pekerjaan sesuai tanggung jawabnya.'
  )

  $aboutSource = $aboutSource.Replace(
    'Keahlian lintas fungsi.',
    'Kolaborasi lintas fungsi.'
  )

  # Team photos: preserve the whole image instead of aggressively cropping it.
  $aboutSource = Replace-Regex $aboutSource '(src=\{member\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'
  $aboutSource = Replace-Regex $aboutSource '(src=\{team\[[^\]]+\]\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'

  Write-Utf8NoBom $aboutPath $aboutSource
  Step "About dirapikan dan foto Team tidak lagi dipotong paksa."
}

# =============================================================================
# 4. Remaining visible developer-language scan
# =============================================================================
$forbiddenPatterns = @(
  'focal point',
  'bento',
  'dossier',
  'thumbnail katalog',
  'formula visual',
  'dikelola melalui admin',
  'Layout menyesuaikan',
  'record pendukung',
  'Featured work',
  'Archive route',
  'Record logic'
)

$remaining = @()
$formworkFiles = Get-ChildItem -LiteralPath $formworkDir -Filter "*.tsx" -File
foreach ($file in $formworkFiles) {
  $content = Read-Text $file.FullName
  foreach ($pattern in $forbiddenPatterns) {
    if ($content.IndexOf($pattern, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      $remaining += ($file.Name + ' -> ' + $pattern)
    }
  }
}

Write-Host ""
if ($remaining.Count -gt 0) {
  Write-Host "[LUNAR COPY] Catatan: masih ada istilah internal yang perlu ditinjau:" -ForegroundColor Yellow
  $remaining | Sort-Object -Unique | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
} else {
  Write-Host "[LUNAR COPY] Scan istilah internal: bersih." -ForegroundColor Green
}

Write-Host ""
Write-Host "[LUNAR COPY] SELESAI." -ForegroundColor Green
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
