# Lunar Konstruksi — Fase 7 Full Public Redesign

Fase 7 merombak wajah publik Lunar Konstruksi menjadi lebih premium, editorial, dan profesional tanpa mengorbankan fondasi CMS yang dibangun di fase sebelumnya.

## Arah visual
- **Structura** → tulang punggung hero & editorial spacing.
- **Poliform / LG** → tipografi besar, rasio whitespace, premium section rhythm.
- **LAS** → grid portfolio / projects.
- **FNJI** → CTA, footer, dan suasana warm-natural.
- **Referensi tambahan company profile** → sentuhan dark-luxury + gold accent yang lebih cocok untuk konstruksi / arsitektur.

## Prinsip desain
- Bukan template SaaS generik.
- Tidak memakai tagline kosong atau copy bombastis tanpa makna.
- Konten tetap dipasok oleh CMS Page + Section + Settings + Navigation.
- Jika konten CMS kosong, sistem menampilkan fallback copy yang tetap profesional dan ringkas.

## Halaman yang diperbarui
- Header publik
- Footer publik
- Home
- About
- Services
- Projects
- Contact

## Bahasa desain
- Background: kombinasi neutral ivory / warm stone / carbon black.
- Accent: muted gold / brass.
- Hero: sinematik, architectural, image-first.
- Cards: radius besar, border halus, shadow tipis.
- Copy: lugas, profesional, tidak berbunyi AI-generic.

## Integrasi CMS
Renderer publik membaca `PublicPageContext` dari Fase 4 lalu memetakan section CMS ke komponen visual:
- hero
- intro
- stats
- services
- process
- projects
- team
- testimonials
- faq
- cta

Variant yang diprioritaskan:
- hero.structura / hero.editorial
- intro.editorial
- services.poliform
- projects.las-grid
- process.timeline / editorial
- cta.fnji

## Contact flow
Contact page tetap terhubung ke Leads Flow Fase 5 (`POST /api/public/leads`).
WhatsApp tetap menjadi tindakan lanjutan, bukan penyimpan data utama.
