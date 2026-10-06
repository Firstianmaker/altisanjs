# AJS Fish Commodity Supply Portal

MVP procurement B2B untuk PT Altisan Jaya Sinergi: website publik, portal Buyer, dan panel Admin. Dibangun dengan Next.js App Router, TypeScript, MySQL, Prisma, dan Tailwind CSS.

## Persiapan

- Node.js 22.17 atau lebih baru; npm.
- MySQL 8.4 dengan dua database terpisah: `ajs_portal` dan `ajs_portal_test` (database kedua hanya untuk integration test).
- Tidak membutuhkan Laravel, PHP, Redis, atau layanan eksternal.

```sql
CREATE DATABASE ajs_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE ajs_portal_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ajs'@'localhost' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_LOKAL';
GRANT ALL PRIVILEGES ON ajs_portal.* TO 'ajs'@'localhost';
GRANT ALL PRIVILEGES ON ajs_portal_test.* TO 'ajs'@'localhost';
```

1. Salin `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL` dan `TEST_DATABASE_URL` dengan kredensial MySQL. URL-encode karakter khusus pada password.
3. Sesuaikan `APP_URL` dengan alamat persis yang dibuka di browser, misalnya `http://localhost:3000`. Pemeriksaan origin menggunakan nilai ini.
4. Siapkan password demo pada `.env`, minimal 12 karakter.

```sh
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Buka **http://localhost:3000**. Di PowerShell yang membatasi eksekusi `npm.ps1`, gunakan `npm.cmd` sebagai pengganti `npm`.

Untuk menjalankan preview di latar belakang pada Windows setelah setup selesai: `powershell -ExecutionPolicy Bypass -File scripts/start-preview.ps1`. Log tersimpan di `.runtime/preview.out.log` dan `.runtime/preview.err.log`. Selalu buka `http://localhost:3000` agar sesuai konfigurasi origin login.

Pada workspace Windows tempat project ini dibuat, MySQL portable sudah disiapkan di `.runtime`, hanya mendengarkan localhost port **3307**. Konfigurasi `.env` lokal sudah mengarah ke instance ini. Jika berhenti, jalankan `powershell -ExecutionPolicy Bypass -File scripts/start-local-mysql.ps1`. Folder `.runtime` dan `.env` sengaja tidak masuk submission/repository; reviewer lain menggunakan MySQL sendiri seperti langkah di atas.

## Akun demo

| Role | Email | Password bawaan `.env.example` |
|---|---|---|
| Buyer | buyer@ajs.demo | BuyerDemo!2026 |
| Admin | admin@ajs.demo | AdminDemo!2026 |

Seed menggunakan password dari `.env`; jika nilainya diganti, gunakan nilai tersebut untuk login. Seed ulang memperbarui password akun demo tetapi **tidak mereset stock atau menghapus request**. Gunakan database baru untuk kembali ke kondisi demo awal.

## Alur demo (maksimal 10 menit)

1. Buka homepage dan jelaskan positioning AJS: sourcing Muara Baru, flexible sourcing, cold-chain access.
2. Buka Komoditas, lalu Cakalang. Stock awal 850 KG, MOQ 100 KG.
3. Login Buyer. Isi quantity 300 KG, tambahkan ke cart, periksa ringkasan, Submit Request Order.
4. Detail request menampilkan `Requested`. Stock belum dikurangi.
5. Keluar, login Admin, buka request yang baru masuk.
6. Klik Konfirmasi request, kemudian Ya, konfirmasi. Stock menjadi 550 KG.
7. Pilih **Stock & Availability** di sidebar Admin untuk membuka pengaturan stock. **Order Request** tetap menjadi halaman awal admin, dengan filter Semua, Requested, Confirmed, dan Rejected. Shortcut Lihat Komoditas membuka catalog. Di ponsel, gunakan tombol Menu untuk membuka navigasi.
8. Jelaskan pengembangan lanjutan yang mungkin: registrasi buyer dengan approval, catatan negosiasi harga, dan audit perubahan stock. Ketiganya **belum termasuk MVP**.

## Aturan bisnis

- Semua quantity KG bulat positif, minimal MOQ, maksimal stock available. Batas input defensif 1.000.000 KG.
- Request bukan pembayaran atau transaksi final. Harga adalah data sintetis per KG; total hanya estimasi.
- Cart disimpan per akun di browser; bukan reservasi. Cart dihapus hanya setelah server mengonfirmasi request tersimpan. Browser yang menonaktifkan penyimpanan tetap bisa memakai cart selama halaman terbuka.
- Submit memeriksa stock terkini di server. Harga dari browser tidak dipercaya. Setiap item menyimpan snapshot nama dan harga.
- Setiap cart memiliki submission key untuk mencegah request ganda akibat pengiriman ulang.
- Konfirmasi hanya dari status Requested. Transaksi database Serializable, update bersyarat, dan retry konflik menjaga alokasi seluruh item atomik serta mencegah overselling/konfirmasi ganda.
- Jika salah satu item tidak tersedia, konfirmasi gagal seluruhnya dan status tetap Requested. Admin dapat memperbarui stock atau menolak request.
- Rejected tidak mengubah stock. Status Confirmed/Rejected tidak bisa dikembalikan pada MVP ini.
- Availability mengikuti stock saat disimpan: di atas 0 otomatis Available, dan 0 otomatis Unavailable. Status tampil otomatis pada form.
- Buyer hanya membaca request miliknya; semua mutasi admin diperiksa di server.

## Struktur dan penjelasan kode

- `src/app`: halaman dan route API; server mengecek session/role sebelum mengakses data.
- `src/components`: tampilan, cart, serta form Buyer/Admin.
- `src/lib/orders.ts`: submit, review, dan transaksi stock. Ini pusat aturan procurement.
- `src/lib/rules.ts`: validasi quantity, MOQ, availability, dan bentuk request.
- `src/lib/auth.ts`: session acak, hash token di database, cookie HttpOnly/SameSite, kedaluwarsa 7 hari.
- `src/lib/password.ts`: password di-hash dengan scrypt dan salt acak.
- `prisma`: schema, migration, dan seed; data produk dapat diubah melalui seed/database tanpa mengubah komponen UI.

API: `POST /api/auth/login`, `POST /api/auth/logout`, `GET/POST /api/orders`, `GET /api/orders/:id`, `PATCH /api/admin/orders/:id`, dan `PATCH /api/admin/products/:id`. Operasi tulis memerlukan origin sesuai `APP_URL` dan cookie session (kecuali login). Halaman admin menyediakan daftar request tanpa endpoint tambahan yang tidak diperlukan.

## Pengujian

```sh
npm test
npm run test:db:prepare
npm run test:integration
npm run typecheck
npm run build
npm start
```

Integration test menolak database yang namanya tidak berakhir `_test`. Suite ini **menghapus order/item pada database test**, kemudian mengisi fixture dan menguji submit, MOQ, stock berubah, rollback multi-item, concurrent confirmations, konfirmasi ganda, penolakan, ownership, price snapshot, dan idempotency. Jangan arahkan ke database berisi data yang ingin dipertahankan.

## Deployment oleh pengguna

Gunakan hosting yang mendukung runtime Node.js Next.js dan MySQL; aplikasi tidak dapat diekspor menjadi situs statis. Atur environment variables, gunakan `APP_URL` HTTPS agar cookie Secure aktif, jalankan migration dan seed, lalu build/start. Jangan publish `.env`, `.runtime`, atau kredensial lokal. Password demo harus disesuaikan jika aplikasi dibuka ke publik. Build tidak menggantikan migration.

## Materi dan batasan

Foto diekstrak dari `Compro AJS Sample.pdf` yang diberikan pengguna, untuk prototype challenge. Deskripsi disusun dari konteks brief/company profile; stock, grade, origin, condition, MOQ sesuai brief. Nominal harga sintetis: Cakalang Rp32.000, Deho Rp28.000, Tuna Fillet Rp95.000, Kerapu Rp85.000 per KG. Status harga sintetis didokumentasikan di README; UI menampilkan harga per KG dan keterangan bahwa harga final memerlukan konfirmasi AJS.

Tidak mencakup registrasi, pembayaran, notifikasi, upload foto, CRUD produk lengkap, integrasi warehouse/ERP, atau production hardening. Session dan role dasar tetap berlaku. Tidak ada paginasi untuk volume besar dan belum ada rate limiting login; aplikasi ditujukan sebagai prototype assessment.

Ringkasan submission ada di `docs/SUBMISSION.md`, catatan AI di `docs/AI_USAGE.md`.
