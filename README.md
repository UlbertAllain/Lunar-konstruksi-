# Lunar Konstruksi

Company profile konstruksi berbasis Next.js dengan admin CRUD untuk mengelola konten publik. Struktur aplikasi memisahkan routing, presentational UI, business logic, repository, dan public read-model agar perubahan data admin dapat dipublikasikan tanpa menggandakan source of truth.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Cloud Firestore melalui Firebase Admin SDK di server
- Cloudinary untuk media
- Zod untuk validasi payload

## Struktur

```text
app/                    # routing, pages, API routes
components/
  admin/                # komponen UI admin
  site/                 # komponen UI website publik
lib/                    # infrastructure: Firebase, Cloudinary, HTTP helpers
modules/                # domain/business logic + repository
  _shared/
  admin/
  faqs/
  leads/
  media/
  projects/
  public-site/          # public read-model + cache invalidation
  services/
  site-content/
  team/
  testimonials/
shared/                 # helper lintas domain yang masih digunakan
scripts/                # bootstrap/maintenance scripts
public/                 # static assets
```

Setiap domain CRUD menyimpan type, schema, repository, dan service berdekatan. Contoh:

```text
modules/projects/
  project.types.ts
  project.schema.ts
  project.repository.ts
  project.service.ts
```

## Alur data

### Mutation dari admin

```text
Admin UI
  -> API Route
  -> authentication/authorization
  -> domain service
  -> Zod validation
  -> repository
  -> Firestore
  -> invalidate public cache
```

### Read pada website publik

```text
Public Page
  -> modules/public-site/public-site.service.ts
  -> cached public read-model
  -> modules/public-site/public-content.repository.ts
  -> Firestore
```

Cache publik menggunakan tag per resource. Setelah create, update, publish/unpublish, atau delete dari admin, service domain memanggil invalidasi resource terkait sehingga halaman publik tidak harus menunggu TTL cache untuk melihat perubahan.

## Aturan publikasi

- `isPublished` menentukan apakah record boleh muncul di website publik.
- `isFeatured` untuk Services dan Projects menentukan prioritas item di homepage.
- Tampilan, class, layout, dan styling website tetap berada di `components/site`; business logic tidak ditempatkan di komponen presentasional.

## Admin bootstrap

Buat `.env.local` berdasarkan `.env.example`, lalu jalankan:

```bash
npm run create-admin
```

Script akan membuat user Firebase Auth jika belum ada lalu melakukan upsert dokumen admin berdasarkan environment variables `ADMIN_*`.

## Validasi

```bash
npm run lint
npm run typecheck
npm run build
```
