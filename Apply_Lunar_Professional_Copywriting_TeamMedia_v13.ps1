Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Message) {
  Write-Host "[LUNAR COPY V13] $Message" -ForegroundColor Cyan
}

function Fail([string]$Message) {
  Write-Host "[LUNAR COPY V13] GAGAL: $Message" -ForegroundColor Red
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

function Apply-Replacements([string]$Content, [object[]]$Pairs) {
  $result = $Content
  foreach ($pair in $Pairs) {
    $oldValue = [string]$pair[0]
    $newValue = [string]$pair[1]
    if ($result.Contains($oldValue)) {
      $result = $result.Replace($oldValue, $newValue)
    }
  }
  return $result
}

function Replace-RegexSafe([string]$Content, [string]$Pattern, [string]$Replacement) {
  $regex = New-Object System.Text.RegularExpressions.Regex(
    $Pattern,
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )
  return $regex.Replace($Content, $Replacement)
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
$backupRoot = Join-Path $repoRoot (".lunar-backups/professional-copy-v13-" + $timestamp)
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$formworkFiles = Get-ChildItem -LiteralPath $formworkDir -Filter "*.tsx" -File
foreach ($sourceFile in $formworkFiles) {
  Backup-File $repoRoot $backupRoot ("components/site/formwork/" + $sourceFile.Name)
}
Step "Backup: $backupRoot"

$globalPairs = @(
  @(
    'Layout menyesuaikan jumlah personel. Satu orang tampil sebagai dossier horizontal; ketika data bertambah, section otomatis berubah menjadi bento tanpa memakan ruang kosong berlebihan.',
    'Setiap anggota tim memiliki peran dalam menjaga koordinasi, komunikasi, dan kualitas pekerjaan dari awal hingga penyelesaian proyek.'
  ),
  @(
    'Satu proyek utama menjadi focal point. Project kedua cukup hadir sebagai record pendukung',
    'Proyek pilihan kami menampilkan lingkup pekerjaan dan hasil yang telah diselesaikan, sementara proyek lainnya dapat dilihat pada halaman portofolio.'
  ),
  @(
    'Satu proyek utama menjadi focal point. Record lain berfungsi sebagai indeks dan bukti kerja',
    'Proyek pilihan kami memberikan gambaran mengenai lingkup pekerjaan, proses pelaksanaan, dan hasil yang telah diselesaikan.'
  ),
  @(
    'Featured work menjadi bukti utama, bukan sekadar thumbnail katalog.',
    'Setiap proyek ditampilkan untuk memberikan gambaran nyata mengenai lingkup dan hasil pekerjaan kami.'
  ),
  @(
    'Semua record lengkap tetap tersedia di halaman Projects.',
    'Lihat proyek lainnya untuk mengenal lebih jauh pengalaman dan hasil pekerjaan Lunar Konstruksi.'
  ),
  @(
    'Personel tampil sebagai bagian dari sistem kerja, bukan card kecil yang meninggalkan ruang kosong di tengah halaman.',
    'Setiap anggota tim memiliki tanggung jawab yang mendukung koordinasi dan kelancaran pelaksanaan proyek.'
  ),
  @(
    'Tim tidak dipajang sebagai filler. Setiap personel tampil sebagai bagian dari proses koordinasi dan delivery proyek.',
    'Tim kami bekerja bersama untuk menjaga koordinasi, kualitas pekerjaan, dan komunikasi proyek tetap berjalan dengan baik.'
  ),
  @(
    'Empat tahap utama, tetapi setiap keputusan tetap punya catatan, owner, dan dampak ke tahap berikutnya.',
    'Empat tahap utama membantu pekerjaan tetap terarah, dari kebutuhan awal hingga proses serah terima.'
  ),
  @(
    'Kontrol lapangan bukan satu checklist di akhir. Ia berjalan bersama keputusan, klarifikasi, dan handover sepanjang proyek.',
    'Pengendalian mutu dilakukan sepanjang proyek untuk menjaga pekerjaan tetap sesuai rencana dan mendukung proses serah terima yang tertib.'
  ),
  @(
    'Setiap layanan tampil sebagai record visual tersendiri. Foto, scope, dan konteks layanan dibaca dari kiri ke kanan tanpa mengubahnya menjadi bento grid yang kaku.',
    'Setiap layanan dirancang untuk membantu kebutuhan proyek pada tahap yang berbeda, dari persiapan hingga penyelesaian.'
  ),
  @('About / field organisation', 'Tentang Lunar'),
  @('Position / responsibility', 'Cara kami bekerja'),
  @('Personnel / project team', 'Tim Lunar'),
  @('Selected record / editorial note', 'Proyek pilihan'),
  @('Selected work / project register', 'Proyek pilihan'),
  @('03 / Selected work / project register', '03 / Proyek pilihan'),
  @('Record logic', 'Proses pekerjaan'),
  @('RECORD LOGIC', 'PROSES PEKERJAAN'),
  @('Archive route', 'Lihat proyek'),
  @('ARCHIVE ROUTE', 'LIHAT PROYEK'),
  @('Project index', 'Proyek lainnya'),
  @('Open full register', 'Lihat semua proyek'),
  @('Field crew / personnel', 'Tim Lunar'),
  @('06 / Field crew / personnel', '06 / Tim Lunar'),
  @('Personnel / 01', 'Anggota tim / 01'),
  @('Field coordination', 'Koordinasi lapangan'),
  @('Site communication', 'Komunikasi proyek'),
  @('Delivery support', 'Dukungan pelaksanaan'),
  @('Site note / QC-04', 'Catatan lapangan / QC-04'),
  @('Field memo / client record', 'Cerita klien'),
  @('07 / Field memo / client record', '07 / Cerita klien'),
  @('Closing note / next project', 'Mulai proyek Anda'),
  @('08 / Closing note / next project', '08 / Mulai proyek Anda'),
  @('Talk to our team', 'Konsultasikan proyek'),
  @('years / field practice', 'tahun pengalaman'),
  @('projects / documented', 'proyek terdokumentasi'),
  @('delivery / coordinated', 'pekerjaan terkoordinasi'),
  @('Quality checkpoints', 'Pemeriksaan mutu'),
  @('Clarify / close', 'Klarifikasi teknis'),
  @('Verify / handover', 'Serah terima'),
  @('Media personnel belum diisi', 'Foto anggota tim belum tersedia'),
  @('Media team', 'Foto anggota tim'),
  @('Media project utama belum diisi', 'Foto proyek belum tersedia'),
  @('Media project pendukung belum diisi', 'Foto proyek belum tersedia'),
  @('Belum ada project published', 'Belum ada proyek yang ditampilkan'),
  @('Field package / note', 'Lingkup layanan'),
  @('Service reading / 02', 'Layanan Lunar'),
  @('Register note', 'Proyek pilihan'),
  @('Featured register', 'Proyek utama'),
  @('Project archive', 'Portofolio proyek'),
  @('Work / archive', 'Proyek Lunar'),
  @('Scope / flow', 'Lingkup layanan'),
  @('Brief / intake', 'Konsultasi proyek'),
  @('Team / field', 'Tim Lunar')
)

# Character sequences are created from code points so the PS1 file stays ASCII-only.
$badNbsp = ([string][char]0x00C2) + ([string][char]0x00A0)
$badDashA = ([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201D)
$badDashB = ([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201C)

foreach ($sourceFile in $formworkFiles) {
  $content = Read-Text $sourceFile.FullName
  $content = Apply-Replacements $content $globalPairs
  $content = $content.Replace($badNbsp, ' ')
  $content = $content.Replace($badDashA, ' - ')
  $content = $content.Replace($badDashB, ' - ')
  Write-Utf8NoBom $sourceFile.FullName $content
}
Step "Copywriting global dirapikan."

$homePagePath = Join-Path $repoRoot "components/site/formwork/home.tsx"
if (Test-Path -LiteralPath $homePagePath) {
  $homeSource = Read-Text $homePagePath

  $homePairs = @(
    @('Project dibaca sebagai rangkaian keputusan.', 'Setiap proyek dibangun dari keputusan yang tepat.'),
    @('Proyek pilihan kami menunjukkan bagaimana kebutuhan, proses, dan hasil pekerjaan ditangani dari awal sampai selesai.', 'Proyek pilihan kami memberikan gambaran mengenai proses, lingkup pekerjaan, dan hasil yang telah diselesaikan bersama klien.'),
    @('Keputusan teknis tidak boleh hilang di antara rapat dan lapangan.', 'Keputusan teknis harus tetap jelas dari perencanaan hingga pelaksanaan.'),
    @('Rencana harus bisa dibangun.', 'Perencanaan yang siap diterapkan di lapangan.'),
    @('Presisi menjaga semuanya tetap terhubung.', 'Kontrol yang konsisten menjaga kualitas pekerjaan.'),
    @('Tim lapangan dan koordinasi.', 'Tim yang menjaga proyek tetap berjalan.'),
    @('Mari bangun sesuatu yang bertahan.', 'Wujudkan proyek Anda bersama Lunar Konstruksi.'),
    @('Struktur layanan harus langsung terbaca.', 'Layanan yang sesuai untuk setiap kebutuhan proyek.'),
    @('Layanan harus langsung terbaca.', 'Layanan yang sesuai untuk setiap kebutuhan proyek.'),
    @('Geser untuk melihat layanan lainnya.', 'Jelajahi layanan kami untuk menemukan solusi yang sesuai dengan kebutuhan proyek Anda.'),
    @('Scope / detail / delivery', 'Lingkup / proses / hasil'),
    @('Lihat detail', 'Selengkapnya')
  )

  $homeSource = Apply-Replacements $homeSource $homePairs
  Write-Utf8NoBom $homePagePath $homeSource
  Step "Copywriting Home dirapikan."
}

$aboutPath = Join-Path $repoRoot "components/site/formwork/about.tsx"
if (Test-Path -LiteralPath $aboutPath) {
  $aboutSource = Read-Text $aboutPath

  $aboutPairs = @(
    @(
      'Lunar Konstruksi menghubungkan perencanaan, estimasi, koordinasi, dan pelaksanaan agar proyek bergerak dengan struktur kerja yang dapat dibaca dan dipertanggungjawabkan.',
      'Lunar Konstruksi mendampingi proyek melalui perencanaan, estimasi, koordinasi, dan pelaksanaan yang terarah agar setiap keputusan dapat diterapkan dengan jelas di lapangan.'
    ),
    @(
      'Setiap proyek memiliki kondisi berbeda. Karena itu, proses Lunar tidak bergantung pada satu formula visual, tetapi pada disiplin dokumentasi, komunikasi, dan kontrol lapangan.',
      'Setiap proyek memiliki kebutuhan dan kondisi yang berbeda. Kami menyesuaikan pendekatan kerja dengan tetap menjaga komunikasi, dokumentasi, pengendalian mutu, dan koordinasi lapangan secara konsisten.'
    ),
    @(
      'Foto dan data personel diambil dari data Team yang dikelola melalui admin.',
      'Setiap anggota tim berperan dalam mendukung koordinasi, pengawasan, dan pelaksanaan pekerjaan sesuai tanggung jawabnya.'
    ),
    @('Keahlian lintas fungsi.', 'Kolaborasi lintas fungsi.'),
    @('Clarity', 'Kejelasan'),
    @('Integration', 'Koordinasi'),
    @('Accountability', 'Tanggung jawab')
  )

  $aboutSource = Apply-Replacements $aboutSource $aboutPairs

  # Team images: preserve the full source image instead of cropping faces/body.
  $aboutSource = Replace-RegexSafe $aboutSource '(src=\{member\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'
  $aboutSource = Replace-RegexSafe $aboutSource '(src=\{team\[[^\]]+\]\.image\}[\s\S]*?className=")([^"]*?)object-cover([^"]*")' '$1$2object-contain object-center bg-[#ebe6dc]$3'

  Write-Utf8NoBom $aboutPath $aboutSource
  Step "About dirapikan dan crop foto Team diperbaiki."
}

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
  Write-Host "[LUNAR COPY V13] Masih ada istilah internal yang perlu ditinjau:" -ForegroundColor Yellow
  $remaining | Sort-Object -Unique | ForEach-Object {
    Write-Host ("  - " + $_) -ForegroundColor Yellow
  }
} else {
  Write-Host "[LUNAR COPY V13] Scan istilah internal: bersih." -ForegroundColor Green
}

Write-Host ""
Write-Host "[LUNAR COPY V13] SELESAI." -ForegroundColor Green
Write-Host "Validasi:" -ForegroundColor Cyan
Write-Host "  npm run lint"
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
