# Lunar Konstruksi — Admin CMS UI (Fase 6)

Fase 6 mengaktifkan workspace admin di `/admin/cms` tanpa mengganti CRUD lama.

## Workspace

- `/admin/cms` — overview CMS.
- `/admin/cms/pages` — system/custom pages.
- `/admin/cms/pages/[id]` — page, SEO, section order, visibility, variant, source, dan content.
- `/admin/cms/navigation` — header/footer navigation + submenu.
- `/admin/cms/settings` — identity, contact, social links, footer, default SEO.
- `/admin/cms/content` — registry-aware hub menuju Services, Projects, Team, Testimonials, FAQ.
- `/admin/cms/leads` — inquiry inbox.
- `/admin/cms/leads/[id]` — status, note, history, WhatsApp follow-up.
- `/admin/cms/media` — media hub menuju record yang memiliki lifecycle Cloudinary.

## Arsitektur

UI admin tidak menulis Firestore langsung. Browser mendapatkan Firebase ID token lalu memanggil API admin existing. API memanggil service/repository domain dari fase sebelumnya.

```
Admin UI -> Bearer token -> /api/admin/* -> requireAdmin -> service -> repository -> Firestore
```

Page/Navigation/Site Settings editor tetap mengikuti validator dan business rule server. System page tidak dapat dihapus atau mengganti route identity melalui UI maupun service.

## Controlled section editor

Section editor hanya menawarkan block type/variant yang terdaftar di CMS registry. Field umum disediakan dalam form, sedangkan `Advanced JSON` mempertahankan fleksibilitas untuk content field baru tanpa membuat page builder bebas.

## Media

Fase 6 sengaja mempertahankan media bersama record pemiliknya. Existing project/service/team/testimonial upload mempunyai lifecycle cleanup Cloudinary; global free-form library baru aman dibuat setelah reference tracking tersedia.

## Public revalidation

Fase 6 menambahkan endpoint admin `/api/admin/cms/revalidate` agar editor bisa memicu revalidation tree publik setelah konten struktural disimpan. Cache 5 menit dari Fase 4 tetap menjadi fallback.
