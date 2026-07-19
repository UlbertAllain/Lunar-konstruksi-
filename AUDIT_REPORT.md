# Audit Teknis dan Penyelesaian Sistem — Lunar Konstruksi

## 1. Ringkasan

Kode awal sudah memiliki fondasi Next.js App Router, Firebase, Firestore, Cloudinary, repository, service, validator, dan beberapa route API. Namun, implementasinya belum membentuk CMS company profile yang utuh: proteksi API admin tidak konsisten, sebagian besar modul belum mempunyai antarmuka admin, dashboard masih statis, input gambar project menggunakan URL manual, dan website publik masih belum dikembangkan menjadi company profile produksi.

Sistem telah direstrukturisasi menjadi aplikasi company profile dan CMS penuh dengan alur data yang konsisten, autentikasi server-side, upload file ke storage Cloudinary, CRUD lima domain utama, frontend publik responsif, fallback data, serta dokumentasi setup.

## 2. Temuan Audit Kode Awal

### Risiko tinggi

1. **Proteksi route admin tidak konsisten.** Sejumlah endpoint admin, terutama operasi baca dan route berdasarkan ID, dapat dipanggil tanpa verifikasi token dan status admin.
2. **Guard admin hanya bergantung pada client.** Pemeriksaan tampilan tidak cukup untuk melindungi API atau data Firestore.
3. **Upload media belum menjadi lifecycle storage.** Form project menerima URL gambar manual; tidak ada pengelolaan `publicId`, penggantian file, atau penghapusan aset lama.
4. **Kontrak Next.js App Router tidak seragam.** Penanganan `params` route dinamis tidak konsisten dengan Next.js 16.

### Risiko menengah

1. Team, Testimonials, dan FAQ memiliki sebagian lapisan backend tetapi belum mempunyai CRUD admin lengkap.
2. Dashboard menampilkan angka statis dan tidak merepresentasikan data Firestore.
3. Struktur error response berbeda antar-route, sehingga frontend sulit menangani kegagalan secara konsisten.
4. Validasi payload dan media masih longgar.
5. Query repository bergantung pada pola yang dapat memerlukan composite index Firestore tanpa dokumentasi.
6. Firebase Admin dan Firebase Client diinisialisasi pada module evaluation, sehingga build dapat gagal sebelum ENV tersedia.
7. Slug belum dijamin unik.
8. Penghapusan record tidak membersihkan file storage terkait.
9. Belum tersedia script bootstrap akun admin, `.env.example` yang lengkap, aturan Firestore yang eksplisit, dan panduan deployment.

### Kualitas produk dan UX

1. Website publik masih berupa halaman awal generik dan belum membaca data CMS.
2. Belum ada halaman indeks/detail portfolio dan layanan yang layak.
3. Navigasi admin belum nyaman pada perangkat mobile.
4. Tidak ada custom 404, sitemap, atau robots policy.
5. Identitas visual belum menunjukkan karakter perusahaan konstruksi.

## 3. Perbaikan dan Implementasi

### Keamanan dan autentikasi

- Firebase Authentication Email/Password digunakan untuk login.
- Token Firebase dikirim sebagai Bearer token pada seluruh request admin.
- Server memverifikasi token dan dokumen `admins/{uid}` termasuk status aktif.
- Seluruh route CRUD admin dan upload media dilindungi server-side.
- Firestore rules menolak akses database langsung dari client; data diakses melalui server Firebase Admin SDK.
- Response sukses dan error distandardisasi.

### Arsitektur data

Alur CRUD final:

```text
Admin Form
  -> authenticated fetch
  -> Next.js Route Handler
  -> requireAdmin()
  -> Zod validation
  -> domain service
  -> repository
  -> Cloud Firestore
```

Alur upload final:

```text
File perangkat
  -> authenticated multipart upload API
  -> validasi MIME/ukuran/jumlah
  -> Cloudinary folder terkontrol
  -> metadata media { url, publicId, width, height, alt }
  -> form dan Firestore
  -> aset lama dihapus setelah update/delete berhasil
```

### Modul admin yang diselesaikan

- Dashboard statistik real-time.
- Services: list, pencarian, create, edit, publish/draft, delete, cover upload.
- Projects: list, pencarian, create, edit, publish/draft, delete, cover dan gallery upload.
- Team: list, pencarian, create, edit, active/inactive, delete, foto upload.
- Testimonials: list, pencarian, create, edit, active/inactive, delete, foto opsional.
- FAQ: list, pencarian, create, edit, active/inactive, delete.
- Slug unik otomatis untuk service dan project.
- Navigasi admin desktop dan mobile.
- Login dan session validation terhadap API server.

### Website publik

- Homepage editorial berbasis data CMS.
- Halaman indeks dan detail layanan.
- Halaman indeks dan detail portfolio.
- Halaman tentang dan tim.
- Halaman kontak dengan penerusan konsultasi ke WhatsApp.
- Header/footer responsif.
- Custom 404, sitemap, dan robots policy.
- Fallback visual lokal agar website tetap layak ketika koleksi Firestore masih kosong.

### Identitas visual

Desain menggunakan pendekatan editorial-arsitektural: warm off-white, charcoal, safety orange, grid teknis, tipografi tegas, ruang negatif, panel konstruktif, dan komposisi asimetris. Elemen ini sengaja menggantikan pola template AI generik seperti gradient berlebihan, glassmorphism acak, dan hero ilustrasi sintetis.

## 4. Konfigurasi dan Operasional

- `.env.example` memuat Firebase Client, Firebase Admin, Cloudinary, URL website, kontak perusahaan, WhatsApp, dan bootstrap admin.
- `npm run create-admin` membuat atau memperbarui user Firebase Auth serta dokumen admin Firestore.
- `firestore.rules` disertakan.
- README menjelaskan instalasi, struktur koleksi, storage folder, dan validasi deployment.

## 5. Quality Gate

Hasil validasi source final:

- `npm run lint`: lulus.
- `npm run typecheck`: lulus.
- `npm run build`: lulus; seluruh route berhasil dikompilasi dan diprerender sesuai tipenya.
- Production smoke test: homepage dan admin login merespons HTTP 200.
- Pemeriksaan source: tidak ada lagi field URL manual untuk upload cover/gallery.

## 6. Audit Dependency

`npm audit --omit=dev` melaporkan:

- 0 critical
- 0 high
- 8 moderate

Temuan berasal dari dependency transitive pada rantai `firebase-admin/@google-cloud/storage/uuid` dan `next/postcss`. Perintah audit menawarkan perubahan major/downgrade yang tidak kompatibel, seperti downgrade Next.js dan Firebase Admin, sehingga tidak diterapkan karena berisiko merusak aplikasi. Periksa kembali setelah upstream menerbitkan patch kompatibel dan lakukan pembaruan terkontrol.

## 7. Checklist Deployment

1. Salin `.env.example` menjadi `.env.local` dan isi seluruh kredensial.
2. Aktifkan Email/Password di Firebase Authentication.
3. Deploy `firestore.rules`.
4. Jalankan `npm run create-admin` sekali untuk admin awal.
5. Pastikan Cloudinary credentials memiliki izin upload dan destroy.
6. Jalankan `npm run lint`, `npm run typecheck`, dan `npm run build`.
7. Masukkan seluruh ENV ke platform deployment.
8. Uji login, CRUD setiap modul, upload/penggantian/penghapusan media, serta form WhatsApp.
9. Setelah domain final aktif, set `NEXT_PUBLIC_SITE_URL` ke domain produksi dan build ulang.
