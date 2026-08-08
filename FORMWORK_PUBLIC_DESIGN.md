# Lunar Konstruksi — Form / Work Technical Redesign

Frontend publik dirombak dengan bahasa visual technical-editorial konstruksi yang mengambil struktur dari referensi Form / Work yang diberikan pengguna.

## Prinsip
- warm paper / blueprint grid / charcoal / construction orange;
- headline condensed industrial;
- foto berasal dari database Project / Service / Team, bukan foto random;
- hero menggunakan curved construction photography;
- service sebagai capability register;
- project sebagai technical collage / bento archive;
- process sebagai sequence line;
- dark precision band;
- testimonial minimal;
- CTA besar dan bersih.

## Halaman
- Home
- About
- Services
- Projects
- Contact
- Header & Footer

Detail Project dan Service tidak dihapus atau diubah business logic-nya pada installer ini. Mereka tetap memakai data/route existing dan dapat dipoles setelah public foundation ini tervalidasi.

## Data compatibility
Installer mendeteksi otomatis:
1. `modules/public-site/server.ts` setelah Total Codebase Cleanup;
2. `features/public-site/server.ts` dari fase public-data sebelumnya;
3. `components/site/use-public-overview.ts` pada struktur classic.

Tidak ada dependency baru.
