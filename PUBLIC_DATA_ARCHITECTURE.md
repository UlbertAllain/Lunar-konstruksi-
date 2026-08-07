# Public Data Architecture

Fase 4 memisahkan jalur baca website publik dari CRUD admin.

## Prinsip

- Public pages membaca data di Server Components, bukan `useEffect` dari browser.
- Tidak ada fallback portfolio/service/team palsu saat database kosong.
- Query Firestore hanya mengambil record yang boleh dipublikasikan.
- Data publik memiliki cache 5 menit agar company profile tetap ringan.
- CMS page, site settings, navigation, dan SEO memiliki resolver publik terpusat.
- Section CMS dapat di-hydrate dari source `services`, `projects`, `team`, `testimonials`, atau `faqs`.

## Flow

```text
Public route
  -> Server Component
  -> features/public-site
  -> filtered Firestore query
  -> cached public read model
  -> rendered HTML
```

## Publication fields

| Collection | Public condition |
| --- | --- |
| services | `isPublished == true` |
| projects | `isPublished == true` |
| team | `isActive == true` |
| testimonials | `isPublished == true` |
| faqs | `isPublished == true` |

## CMS section hydration

Source-backed blocks mengambil data dari public read model. `content.featuredOnly` dan `content.limit` didukung secara terkontrol. Renderer visual final akan memakai hasil hydration ini pada fase redesign, sehingga block tidak melakukan query sendiri.

## Legacy compatibility

Endpoint `/api/public/overview`, `use-public-overview.ts`, dan `public-data.ts` boleh tetap berada sementara sampai seluruh detail page/route selesai dimigrasikan. Home, About, Services, dan Projects tidak lagi membutuhkan browser overview fetch setelah patch Fase 4 diterapkan.
