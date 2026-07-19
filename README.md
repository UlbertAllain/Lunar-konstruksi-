# Lunar Konstruksi

Company profile dan CMS konstruksi berbasis **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Firebase Authentication**, **Cloud Firestore**, dan **Cloudinary**.

## Fitur

### Admin CMS

- Login Firebase Authentication dengan validasi dokumen admin aktif.
- Dashboard statistik real-time.
- CRUD penuh Services, Projects, Team, Testimonials, dan FAQ.
- Publish/draft atau active/inactive langsung dari tabel.
- Upload gambar dari perangkat ke Cloudinary—bukan input URL manual.
- Cover project, gallery multi-image, cover layanan, foto anggota tim, dan foto testimoni.
- Lifecycle media: media lama dibersihkan dari Cloudinary setelah record diperbarui atau dihapus.
- API admin terproteksi Bearer token dan pemeriksaan role admin.
- Validasi payload dengan Zod.

### Website Publik

- Homepage editorial company profile.
- Halaman portfolio dan detail project.
- Halaman detail layanan.
- Halaman tentang perusahaan dan tim.
- Form konsultasi yang meneruskan data ke WhatsApp.
- Data publik berasal dari Firestore, dengan fallback visual ketika database masih kosong.

## Menjalankan Proyek

1. Salin environment example:

```bash
cp .env.example .env.local
```

2. Isi seluruh kredensial Firebase dan Cloudinary pada `.env.local`.

3. Install dependency:

```bash
npm install
```

4. Buat akun admin pertama. Isi `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, dan `ADMIN_ROLE` pada `.env.local`, lalu jalankan:

```bash
npm run create-admin
```

5. Jalankan development server:

```bash
npm run dev
```

- Website publik: `http://localhost:3000`

## Firebase

Aktifkan **Email/Password** pada Firebase Authentication. Semua akses data website dilakukan melalui Firebase Admin SDK pada server. File `firestore.rules` menolak akses Firestore langsung dari client.

Struktur koleksi:

- `admins/{uid}`
- `services/{id}`
- `projects/{id}`
- `team/{id}`
- `testimonials/{id}`
- `faqs/{id}`


## Cloudinary

Gambar diunggah melalui route server terautentikasi ke folder:

- `lunar-konstruksi/services`
- `lunar-konstruksi/projects/cover`
- `lunar-konstruksi/projects/gallery`
- `lunar-konstruksi/team`
- `lunar-konstruksi/testimonials`

Format yang diterima: JPG, PNG, WEBP, AVIF. Ukuran maksimum setiap gambar: 5 MB. Gallery project maksimum 10 gambar.

## Validasi Sebelum Deploy

```bash
npm run lint
npm run typecheck
npm run build
```

Deploy dapat dilakukan ke Vercel. Masukkan seluruh variabel `.env.example` pada Project Settings → Environment Variables.
