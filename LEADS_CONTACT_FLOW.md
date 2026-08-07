# Leads & Contact Business Flow

Fase 5 mengubah formulir kontak Lunar Konstruksi dari sekadar pembuka WhatsApp
menjadi jalur akuisisi lead yang tercatat di server.

## Public flow

1. Visitor mengisi form `/contact`.
2. Browser mengirim JSON ke `POST /api/public/leads`.
3. Zod memvalidasi payload.
4. Honeypot menahan bot sederhana.
5. Rate limiter Firestore membatasi 3 submit per 10 menit per fingerprint.
6. Firebase Admin SDK menyimpan lead ke collection `leads`.
7. Visitor menerima nomor referensi.
8. WhatsApp tersedia sebagai langkah lanjutan opsional.

Browser tidak menulis Firestore langsung.

## Collections

### `leads/{id}`

Field utama:

- `name`
- `phone`
- `email`
- `projectType`
- `location`
- `message`
- `source`
- `status`
- `adminNote`
- `createdAtMs`
- `updatedAtMs`
- `statusHistory`
- `createdAt`
- `updatedAt`

Status:

- `new`
- `contacted`
- `qualified`
- `won`
- `lost`
- `spam`

### `leadRateLimits/{fingerprint}`

Collection operasional untuk throttling form. Fingerprint dibuat dari SHA-256
IP + user-agent. IP mentah tidak disimpan.

## Admin API

Semua endpoint admin menggunakan `requireAdmin()`.

- `GET /api/admin/leads`
- `GET /api/admin/leads?status=new&limit=100`
- `GET /api/admin/leads/{id}`
- `PATCH /api/admin/leads/{id}`

Contoh PATCH:

```json
{
  "status": "contacted",
  "adminNote": "Sudah dihubungi melalui WhatsApp."
}
```

UI pengelolaan leads dibuat pada Fase 6 bersama Admin Full CMS UI.

## Security notes

- Firestore client rules tetap dapat menolak akses langsung.
- Lead dibuat melalui Firebase Admin SDK pada server.
- Payload divalidasi ulang di server.
- Honeypot tidak disimpan.
- Rate limit berjalan dengan Firestore transaction sehingga lebih aman terhadap
  concurrent request dibanding counter in-memory pada serverless instance.
- Data contact tidak pernah dimasukkan ke public CMS resolver.