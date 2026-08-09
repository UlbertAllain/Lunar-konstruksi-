Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR COPY V12] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR COPY V12] GAGAL: $Message" -ForegroundColor Red
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
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Backup-File([string]$RepoRoot, [string]$BackupRoot, [string]$RelativePath) {
  $sourcePath = Join-Path $RepoRoot $RelativePath
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    return
  }

  $targetPath = Join-Path $BackupRoot $RelativePath
  $targetParent = Split-Path -Parent $targetPath
  if ($targetParent -and -not (Test-Path -LiteralPath $targetParent)) {
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
  }

  Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force
}

function Replace-Literal([string]$Content, [string]$OldValue, [string]$NewValue) {
  if ($Content.Contains($OldValue)) {
    return $Content.Replace($OldValue, $NewValue)
  }
  return $Content
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
if (-not $repoRoot) {
  Fail "Jalankan script ini dari repository Lunar Konstruksi."
}

$repoRoot = $repoRoot.Trim()
Set-Location $repoRoot
Step "Repo: $repoRoot"

$formworkDir = Join-Path $repoRoot "components/site/formwork"
if (-not (Test-Path -LiteralPath $formworkDir)) {
  Fail "Folder components/site/formwork tidak ditemukan."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $repoRoot ".lunar-backups/professional-copy-v12-$timestamp"
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$formworkFiles = Get-ChildItem -LiteralPath $formworkDir -Filter "*.tsx" -File
foreach ($sourceFile in $formworkFiles) {
  Backup-File $repoRoot $backupRoot ("components/site/formwork/" + $sourceFile.Name)
}
Step "Backup: $backupRoot"

# -----------------------------------------------------------------------------
# Global copy cleanup.
# All script text is ASCII-only for Windows PowerShell 5.1 compatibility.
# -----------------------------------------------------------------------------
foreach ($sourceFile in $formworkFiles) {
  $content = Read-Text $sourceFile.FullName

  $content = Replace-Literal $content 'Layout menyesuaikan jumlah personel. Satu orang tampil sebagai dossier horizontal; ketika data bertambah, section otomatis berubah menjadi bento tanpa memakan ruang kosong berlebihan.' 'Setiap anggota tim memiliki peran dalam menjaga koordinasi, komunikasi, dan kualitas pekerjaan dari awal hingga penyelesaian proyek.'

  $content = Replace-Literal $content 'Satu proyek utama menjadi focal point. Project kedua cukup hadir sebagai record pendukung' 'Proyek pilihan kami menampilkan lingkup pekerjaan dan hasil yang telah diselesaikan, sementara proyek lainnya dapat dilihat pada halaman portofolio.'

  $content = Replace-Literal $content 'Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja' 'Proyek pilihan kami memberikan gambaran mengenai lingkup pekerjaan, proses pelaksanaan, dan hasil yang telah diselesaikan.'

  $content = Replace-Literal $content 'Featured work menjadi bukti utama, bukan sekadar thumbnail katalog.' 'Setiap proyek ditampilkan untuk memberikan gambaran nyata mengenai lingkup dan hasil pekerjaan kami.'

  $content = Replace-Literal $content 'Semua record lengkap tetap tersedia di halaman Projects.' 'Lihat proyek lainnya untuk mengenal lebih jauh pengalaman dan hasil pekerjaan Lunar Konstruksi.'

  $content = Replace-Literal $content 'Personel tampil sebagai bagian dari sistem kerja, bukan card kecil yang meninggalkan ruang kosong di tengah halaman.' 'Setiap anggota tim memiliki tanggung jawab yang mendukung koordinasi dan kelancaran pelaksanaan proyek.'

  $content = Replace-Literal $content 'Tim tidak dipajang sebagai filler. Setiap personel tampil sebagai bagian dari proses koordinasi dan delivery proyek.' 'Tim kami bekerja bersama untuk menjaga koordinasi, kualitas pekerjaan, dan komunikasi proyek tetap berjalan dengan baik.'

  $content = Replace-Literal $content 'Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.' 'Empat tahap utama membantu pekerjaan tetap terarah, dari kebutuhan awal hingga proses serah terima.'

  $content = Replace-Literal $content 'Kontrol lapangan bukan satu checklist di akhir. Ia berjalan bersama keputusan, klarifikasi, dan handover sepanjang proyek.' 'Pengendalian mutu dilakukan sepanjang proyek untuk menjaga pekerjaan tetap sesuai rencana dan mendukung proses serah terima yang tertib.'

  $content = Replace-Literal $content 'Setiap layanan tampil sebagai record visual tersendiri. Foto, scope, dan konteks layanan dibaca dari kiri ke kanan tanpa mengubahnya menjadi bento grid yang kaku.' 'Setiap layanan dirancang untuk membantu kebutuhan proyek pada tahap yang berbeda, dari persiapan hingga penyelesaian.'

  $content = Replace-Literal $content 'About / field organisation' 'Tentang Lunar'
  $content = Replace-Literal $content 'Position / responsibility' 'Cara kami bekerja'
  $content = Replace-Literal $content 'Personnel / project team' 'Tim Lunar'
  $content = Replace-Literal $content 'Selected record / editorial note' 'Proyek pilihan'
  $content = Replace-Literal $content 'Selected work / project register' 'Proyek pilihan'
  $content = Replace-Literal $content '03 / Selected work / project register' '03 / Proyek pilihan'
  $content = Replace-Literal $content 'Record logic' 'Proses pekerjaan'
  $content = Replace-Literal $content 'RECORD LOGIC' 'PROSES PEKERJAAN'
  $content = Replace-Literal $content 'Archive route' 'Lihat proyek'
  $content = Replace-Literal $content 'ARCHIVE ROUTE' 'LIHAT PROYEK'
  $content = Replace-Literal $content 'Project index' 'Proyek lainnya'
  $content = Replace-Literal $content 'Open full register' 'Lihat semua proyek'
  $content = Replace-Literal $content 'Field crew / personnel' 'Tim Lunar'
  $content = Replace-Literal $content '06 / Field crew / personnel' '06 / Tim Lunar'
  $content = Replace-Literal $content 'Personnel / 01' 'Anggota tim / 01'
  $content = Replace-Literal $content 'Field coordination' 'Koordinasi lapangan'
  $content = Replace-Literal $content 'Site communication' 'Komunikasi proyek'
  $content = Replace-Literal $content 'Delivery support' 'Dukungan pelaksanaan'
  $content = Replace-Literal $content 'Site note / QC-04' 'Catatan lapangan / QC-04'
  $content = Replace-Literal $content 'Field memo / client record' 'Cerita klien'
  $content = Replace-Literal $content '07 / Field memo / client record' '07 / Cerita klien'
  $content = Replace-Literal $content 'Closing note / next project' 'Mulai proyek Anda'
  $content = Replace-Literal $content '08 / Closing note / next project' '08 / Mulai proyek Anda'
  $content = Replace-Literal $content 'Talk to our team' 'Konsultasikan proyek'
  $content = Replace-Literal $content 'years / field practice' 'tahun pengalaman'
  $content = Replace-Literal $content 'projects / documented' 'proyek terdokumentasi'
  $content = Replace-Literal $content 'delivery / coordinated' 'pekerjaan terkoordinasi'
  $content = Replace-Literal $content 'Quality checkpoints' 'Pemeriksaan mutu'
  $content = Replace-Literal $content 'Clarify / close' 'Klarifikasi teknis'
  $content = Replace-Literal $content 'Verify / handover' 'Serah terima'
  $content = Replace-Literal $content 'Media personnel belum diisi' 'Foto anggota tim belum tersedia'
  $content = Replace-Literal $content 'Media team' 'Foto anggota tim'
  $content = Replace-Literal $content 'Media project utama belum diisi' 'Foto proyek belum tersedia'
  $content = Replace-Literal $content 'Media project pendukung belum diisi' 'Foto proyek belum tersedia'
  $content = Replace-Literal $content 'Belum ada project published' 'Belum ada proyek yang ditampilkan'

  # Clean common mojibake without putting non-ASCII characters into this script.
  $content = Replace-Regex $content 'a\x{00C2}\x{00A0}' ' '
  $content = Replace-Regex $content 'A\x{00C2}' 'A'

  Write-Utf8NoBom $sourceFile.FullName $content
}
Step "Copywriting global dirapikan."

# -----------------------------------------------------------------------------
# Home copy cleanup.
# -----------------------------------------------------------------------------
$homePagePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
if (Test-Path -LiteralPath $homePagePath) {
  $homeSource = Read-Text $homePagePath

  $homeSource = Replace-Literal $homeSource 'Project dibaca sebagai rangkaian keputusan.' 'Setiap proyek dibangun dari keputusan yang tepat.'
  $homeSource = Replace-Literal $homeSource 'Proyek pilihan kami menunjukkan bagaimana kebutuhan, proses, dan hasil pekerjaan ditangani dari awal sampai selesai.' 'Proyek pilihan kami memberikan gambaran mengenai proses, lingkup pekerjaan, dan hasil yang telah diselesaikan bersama klien.'
  $homeSource = Replace-Literal $homeSource 'Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.' 'Keputusan teknis harus tetap jelas dari perencanaan hingga pelaksanaan.'
  $homeSource = Replace-Literal $homeSource 'Rencana harus bisa dibangun.' 'Perencanaan yang siap diterapkan di lapangan.'
  $homeSource = Replace-Literal $homeSource 'Presisi menjaga semuanya tetap terhubung.' 'Kontrol yang konsisten menjaga kualitas pekerjaan.'
  $homeSource = Replace-Literal $homeSource 'Tim lapangan dan koordinasi.' 'Tim yang menjaga proyek tetap berjalan.'
  $homeSource = Replace-Literal $homeSource 'Mari bangun sesuatu yang bertahan.' 'Wujudkan proyek Anda bersama Lunar Konstruksi.'

  Write-Utf8NoBom $homePagePath $homeSource
  Step "Copywriting Home dirapikan."
}

# -----------------------------------------------------------------------------
# About copy and team media crop fix.
# -----------------------------------------------------------------------------
$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
if (Test-Path -LiteralPath $aboutPath) {
  $aboutSource = Read-Text $aboutPath

  $aboutSource = Replace-Literal $aboutSource 'Lunar Konstruksi menghubungkan perencanaan, estimasi, koordinasi, dan pelaksanaan agar proyek bergerak dengan struktur kerja yang dapat dibaca dan dipertanggungjawabkan.' 'Lunar Konstruksi mendampingi proyek melalui perencanaan, estimasi, koordinasi, dan pelaksanaan yang terarah agar setiap keputusan dapat diterapkan dengan jelas di lapangan.'

  $aboutSource = Replace-Literal $aboutSource 'Setiap proyek memiliki kondisi berbeda. Karena itu, proses Lunar tidak bergantung pada satu formula visual, tetapi pada disiplin dokumentasi, komunikasi, dan kontrol lapangan.' 'Setiap proyek memiliki kebutuhan dan kondisi yang berbeda. Kami menyesuaikan pendekatan kerja dengan tetap menjaga komunikasi, dokumentasi, pengendalian mutu, dan koordinasi lapangan secara konsisten.'

  $aboutSource = Replace-Literal $aboutSource 'Foto dan data personel diambil dari data Team yang dikelola melalui admin.' 'Setiap anggota tim berperan dalam mendukung koordinasi, pengawasan, dan pelaksanaan pekerjaan sesuai tanggung jawabnya.'

  $aboutSource = Replace-Literal $aboutSource 'Keahlian lintas fungsi.' 'Kolaborasi lintas fungsi.'

  # Preserve full team images instead of cropping them aggressively.
  $aboutSource = Replace-Regex $aboutSource '(src=\{member\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'
  $aboutSource = Replace-Regex $aboutSource '(src=\{team\[[^\]]+\]\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'

  Write-Utf8NoBom $aboutPath $aboutSource
  Step "About dirapikan dan crop foto Team diperbaiki."
}

# -----------------------------------------------------------------------------
# Scan for internal/designer-facing language still visible in source.
# -----------------------------------------------------------------------------
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
foreach ($sourceFile in $formworkFiles) {
  $content = Read-Text $sourceFile.FullName
  foreach ($pattern in $forbiddenPatterns) {
    if ($content.IndexOf($pattern, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      $remaining += ($sourceFile.Name + " -> " + $pattern)
    }
  }
}

Write-Host ""
if ($remaining.Count -gt 0) {
  Write-Host "[LUNAR COPY V12] Masih ada istilah internal yang perlu ditinjau:" -ForegroundColor Yellow
  $remaining | Sort-Object -Unique | ForEach-Object {
    Write-Host ("  - " + $_) -ForegroundColor Yellow
  }
} else {
  Write-Host "[LUNAR COPY V12] Scan istilah internal: bersih." -ForegroundColor Green
}

Write-Host ""
Write-Host "[LUNAR COPY V12] SELESAI." -ForegroundColor Green
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
