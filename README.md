# Lunar Konstruksi

Company profile konstruksi berbasis Next.js dengan admin CRUD untuk mengelola konten publik. Struktur aplikasi memisahkan routing, presentational UI, business logic, repository, dan public read-model agar perubahan data admin dapat dipublikasikan tanpa menggandakan source of truth.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Cloud Firestore melalui Firebase Admin SDK di server
- Cloudinary untuk media
- Zod untuk validasi payload
- GSAP `3.15.1`, ScrollTrigger, dan `@gsap/react` `2.1.2` untuk animasi homepage
- Plus Jakarta Sans dan CSS art-directed layout untuk tampilan editorial

## Motion design & interaksi

Homepage Lunar Konstruksi menggunakan pendekatan **art-directed motion**: setiap section memiliki ritme dan gerak yang mengikuti hierarki konten. Animasi tidak dijalankan sebagai efek masuk yang seragam, melainkan disusun dalam timeline yang bisa saling **overlap**, sehingga transisinya terasa terhubung.

### Library dan teknik

| Teknologi / teknik | Penggunaan |
| --- | --- |
| **GSAP 3.15.1** | Tween, timeline, easing, transform, dan koordinasi animasi. |
| **GSAP ScrollTrigger** | Menjalankan animasi berdasarkan posisi section dan menghubungkan progres ke scroll melalui \`scrub\`. |
| **@gsap/react 2.1.2** | Hook \`useGSAP\` untuk menginisialisasi dan membersihkan animasi pada komponen React client. |
| **\`gsap.timeline()\`** | Menentukan urutan, \`stagger\`, durasi, serta overlap menggunakan position parameter seperti \`"-=0.68"\`. |
| **\`clip-path\` + \`scale\`** | Image reveal yang berkembang dari bidang sempit menjadi foto penuh (efek morph/reveal). |
| **2D/3D transforms** | \`x\`, \`y\`, \`rotation\`, \`rotationX\`, \`rotationY\`, \`skew\`, \`scale\`, dan perspektif untuk memberi kedalaman. |
| **GSAP easing** | \`power3.out\`, \`expo.inOut\`, \`back.out\`, dan \`elastic.out\` untuk karakter gerakan berbeda. |

Tidak menggunakan Framer Motion untuk animasi homepage ini. Interaksi dan scroll choreography utamanya ditangani oleh GSAP.

### Koreografi per section

| Section | Implementasi |
| --- | --- |
| **Hero** | Headline muncul per baris dengan \`stagger\`, statistik masuk berurutan, kemudian foto utama mengalami **expanding mask reveal** melalui \`clip-path\` dan \`scale\`. Layer bangunan kaca yang menonjol dianimasikan terpisah, lalu teks editorial masuk dari arah bergantian dengan \`skewX\` dan \`autoAlpha\`. |
| **About** | Baris headline bergerak bertahap dengan \`skewY\`; foto kecil tumbuh dari mask melingkar, teks pendamping bergeser masuk, dan banner lebar terbuka dari sisi kiri. |
| **Services** | Judul utama terbentuk dari perubahan skala/rotasi, lalu sticky notes mendekat ke posisi akhirnya dengan \`stagger\` dan easing \`back\`. Di desktop, setiap note merespons \`pointermove\` melalui \`rotationX\`/\`rotationY\`; saat pointer keluar, kemiringannya kembali memakai \`elastic.out\`. |
| **Projects** | Judul dan galeri muncul bergiliran melalui perpaduan perpindahan vertikal, skala, dan rotasi perspektif 3D. |
| **Our Process** | Tipografi masuk dari arah bergantian; foto dibuka dengan perubahan \`clip-path\`; empat tahapan muncul secara berurutan dengan \`rotationX\` dan perspektif. |
| **Testimonials** | Kutipan utama terbuka secara horizontal, disusul testimoni pendukung dari arah berbeda. Section hanya tampil bila ada testimoni dari CMS. |
| **CTA** | Dua baris headline bergerak dari arah berlawanan; tombol mengalami perubahan \`clip-path\`, \`scale\`, dan \`border-radius\` hingga menjadi bentuk akhirnya. |

**Urutan Hero di kode:** headline → statistik → mask reveal foto → layer bangunan menonjol → kalimat editorial. Timeline menggunakan overlap antar-tween, jadi beberapa tahapan berlangsung bersamaan; bukan menunggu setiap animasi selesai sepenuhnya.

**Scroll choreography:** Section setelah Hero menggunakan \`ScrollTrigger\` dengan rentang \`start\`/\`end\` dan \`scrub\`. Karena itu, progres animasi dapat mengikuti gerakan scroll, bukan sekadar trigger sekali ketika elemen masuk viewport.

### Arsitektur implementasi

\`\`\`text
components/site/formwork/
  home.tsx                 # Struktur section dan data CMS
  editorial-motion.tsx     # Seluruh koreografi GSAP + ScrollTrigger
  editorial-home.css       # Art direction, layout, posisi, responsive styling
  editorial-assets.ts      # Referensi aset gambar statis
public/lunar-static/
  editorial-*.webp         # Gambar statis yang mengikuti desain
\`\`\`

\`EditorialMotion\` adalah **client component** yang di-mount pada homepage. GSAP menarget elemen dalam \`.lunar-editorial-page\`, bukan dashboard admin. Data proyek, layanan, dan testimoni tetap menggunakan CMS; sebaliknya gambar visual Hero, About, dan Our Process dikunci sebagai aset lokal untuk mempertahankan komposisi yang sudah disetujui.

### Responsive, aksesibilitas, dan QA

- \`gsap.matchMedia()\` membedakan layout desktop (mulai **801px**) dan layout sentuh (hingga **800px**); jarak gerak pada layout kecil dikurangi.
- Jika \`prefers-reduced-motion: reduce\` aktif, koreografi GSAP tidak dijalankan. Styling juga menonaktifkan transisi untuk pengguna tersebut.
- Listener \`pointermove\`/\`pointerleave\` dibersihkan saat effect dihapus; \`media.revert()\` mengembalikan perubahan GSAP saat lifecycle atau kondisi media berubah.
- Saat memodifikasi animasi, uji di desktop dan mobile: pastikan layer Hero tidak membesar/menutupi headline, sticky notes tidak terpencar, seluruh teks tetap terbaca saat scroll cepat, dan konten tetap tersedia dengan reduced motion.
- Perubahan timing atau visual dapat diuji melalui \`npm run lint\`, \`npm run typecheck\`, serta pemeriksaan langsung di browser; pemeriksaan statis saja tidak dapat memvalidasi komposisi visual dan performa animasi.

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
