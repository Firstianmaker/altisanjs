# AJS Fish Commodity Supply Portal

Portal procurement B2B untuk PT Altisan Jaya Sinergi. Buyer dapat melihat komoditas dan mengirim request order; Admin dapat meninjau request serta mengatur stock. Aplikasi menggunakan Next.js, TypeScript, MySQL, Prisma, dan Tailwind CSS.

## Menjalankan secara lokal

Siapkan Node.js 22.17+, npm, dan MySQL 8.4. Buat database `ajs_portal` (misalnya lewat phpMyAdmin atau jalankan SQL berikut):

```sql
CREATE DATABASE ajs_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Salin `.env.example` menjadi `.env`. Isi koneksi MySQL dan password demo di `.env` (minimal 12 karakter). `APP_URL` harus sesuai alamat yang dibuka, misalnya `http://localhost:3000`.

Jalankan dari folder project:

```sh
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Buka http://localhost:3000. Di PowerShell Windows, gunakan `npm.cmd` jika perintah `npm` diblokir.

## Akun demo

| Role | Email | Password bawaan |
|---|---|---|
| Buyer | `buyer@ajs.demo` | `BuyerDemo!2026` |
| Admin | `admin@ajs.demo` | `AdminDemo!2026` |

Password aktif adalah nilai `DEMO_BUYER_PASSWORD` dan `DEMO_ADMIN_PASSWORD` saat seed dijalankan. Seed ulang memperbarui password akun demo, tetapi tidak mereset stock atau menghapus order.

## Alur dan aturan utama

1. Buyer memilih komoditas, mengisi cart, lalu mengirim Request Order. Request tersimpan dengan status **Requested**; cart tidak menahan stock.
2. Admin dapat mengonfirmasi atau menolak request yang masih Requested. Saat konfirmasi, server memeriksa ulang stock dan menguranginya dalam satu transaksi. Penolakan tidak mengubah stock.
3. Quantity harus berupa KG bulat positif, minimal MOQ, dan tidak melebihi stock yang tersedia. Stock di atas 0 berarti Available; stock 0 berarti Unavailable.
4. Buyer hanya dapat melihat request miliknya. Perubahan Admin dan hak akses diperiksa oleh server.
5. Harga per KG adalah data sintetis untuk demo; total hanya estimasi dan harga final perlu konfirmasi AJS.

## Menjalankan pengujian

```sh
npm test
npm run typecheck
npm run build
```

Integration test memerlukan database MySQL terpisah dengan nama berakhiran `_test`, diatur lewat `TEST_DATABASE_URL`:

```sh
npm run test:db:prepare
npm run test:integration
```

Integration test menghapus dan membuat ulang data order pada database test. Jangan arahkan `TEST_DATABASE_URL` ke database berisi data yang ingin dipertahankan.

Jangan commit `.env` atau membagikan connection string/password.

## Dokumen tambahan

- `docs/SUBMISSION.md`: ringkasan implementasi dan keputusan project.
- `docs/AI_USAGE.md`: penggunaan AI dan bagian kode yang perlu dipahami.
- `docs/TEST_RESULTS.md`: hasil pengujian yang pernah dijalankan.
