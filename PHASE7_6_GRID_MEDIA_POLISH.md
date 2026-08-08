# Lunar Konstruksi — Fase 7.6 Grid & Media Polish

Fase ini mempertahankan bahasa visual Field Archive dari Fase 7.5, lalu memperbaiki ritme grid dan pemakaian media CMS.

## Perubahan
- Project Archive home menjadi bento/asymmetric grid.
- Service Dossiers home menjadi staggered image cards.
- Team Archive home menjadi personnel mosaic.
- About / Services / Projects memakai collection-aware asymmetric grid.
- Tinggi gambar dibatasi agar tidak mendominasi satu layar.
- Resolver media diperluas untuk field media custom dan nested Cloudinary.
- Media database tetap selalu diprioritaskan; placeholder hanya jika record benar-benar tidak memiliki media.

## Prinsip
- Tidak ada foto stok/foto AI.
- Tidak ada grid 3 kolom lurus yang monoton untuk koleksi utama.
- Image crop menggunakan object-cover dan ukuran yang terkontrol.
