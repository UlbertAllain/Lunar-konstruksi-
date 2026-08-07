# Lunar Konstruksi — Fase 7.4 Database-Synced Reference Match

Tujuan fase ini:

1. Mengikuti bahasa visual referensi construction/equipment website yang diberikan user dengan lebih dekat: white canvas, large black modules, orange accent, modular asymmetric composition, dense data, dan typography tegas.
2. Menghapus fallback foto eksternal / stock / AI-looking dari public UI.
3. Menjadikan Firestore/CMS sebagai sumber utama untuk Services, Projects, Team, Testimonials, Navigation, Site Settings, dan media.
4. Memperkuat resolver media agar field Cloudinary dalam bentuk string, object, nested object, atau array tetap ditemukan.

## Aturan media

Urutan media yang dicari antara lain:

- `photoUrl`, `profilePhotoUrl`, `profileImageUrl`, `avatarUrl`
- `coverImageUrl`, `coverUrl`, `thumbnailUrl`, `featuredImageUrl`, `mainImageUrl`, `heroImageUrl`, `imageUrl`, `mediaUrl`
- `photo`, `avatar`, `image`, `cover`, `thumbnail`, `featuredImage`, `mainImage`, `heroImage`
- `images`, `photos`, `gallery`, `media`, `mediaItems`, `projectImages`, `imageUrls`
- nested Cloudinary fields seperti `secure_url`, `secureUrl`, `url`, `src`, `assetUrl`

Jika semuanya kosong, frontend menggunakan technical SVG placeholder Lunar. Tidak ada foto manusia/proyek buatan sebagai fallback.

## Mapping data homepage

- Hero visual → project published pertama.
- Metrics → jumlah published Projects, Services, Team, Testimonials + CMS stat jika tersedia.
- Featured project browser → Projects collection.
- Capability/service modules → Services collection.
- People → Team collection, termasuk foto asli database.
- Client stories → Testimonials collection.
- Project inquiry → Leads Flow dari Fase 5.
