# Lunar Konstruksi

Company profile konstruksi berbasis Next.js dengan admin CRUD klasik untuk mengelola konten bisnis. Full CMS/page builder sudah dipensiunkan agar struktur aplikasi lebih sederhana dan mudah dirawat.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Cloud Firestore melalui Firebase Admin SDK di server
- Cloudinary untuk media
- Zod untuk validasi payload

## Admin

Admin menggunakan pola CRUD yang jelas:

- Dashboard
- Services
- Projects
- Team
- Testimonials
- FAQ

Tidak ada Pages/Sections builder, CMS Workspace, atau editor layout dinamis.

## Struktur

```text
app/                    # routing, pages, API routes
components/             # UI admin dan website publik
lib/                    # infrastructure: Firebase, Cloudinary, HTTP helpers
modules/                # business/domain backend
  _shared/              # primitives lintas domain
  admin/
  faqs/
  leads/
  media/
  projects/
  public-site/          # read-model website publik; bukan CMS
  services/
  team/
  testimonials/
shared/                 # helper aplikasi lintas domain
scripts/                # maintenance/bootstrap scripts
public/                 # static assets
```

Setiap domain menyimpan type, schema, repository, dan service di folder yang sama. Contoh:

```text
modules/projects/
  project.types.ts
  project.schema.ts
  project.repository.ts
  project.service.ts
  index.ts
  server.ts
```

## Data publik

Website publik membaca koleksi Services, Projects, Team, Testimonials, dan FAQ langsung melalui read-model server `modules/public-site`.

Data `siteSettings/general` dan `navigation/main` yang sudah pernah tersimpan tetap dibaca sebagai konfigurasi tampilan global, tetapi tidak ada lagi UI Full CMS untuk mengubah layout/section halaman.

## Alur backend

```text
Admin API Route
  -> requireAdmin
  -> domain service
  -> Zod schema
  -> domain repository
  -> Firestore / Cloudinary
```

## Validasi

```bash
npm run lint
npm run typecheck
npm run build
```
