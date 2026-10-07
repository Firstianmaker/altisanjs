# Catatan Submission AJS

**Project:** AJS Fish Commodity Supply Portal

**Demo:** [https://altisanjs.vercel.app](https://altisanjs.vercel.app)

## Yang sudah selesai

- Website publik dengan homepage, katalog, dan detail empat komoditas sesuai data brief.
- Login Buyer dan Admin tanpa registrasi; Buyer dapat mengelola cart, mengirim request, serta melihat riwayatnya.
- Panel Admin untuk melihat dan memfilter request, mengonfirmasi/menolak request, mengatur stock/availability, dan membuka katalog.
- Validasi MOQ dan quantity, pengecekan stock di server, pembatasan akses berdasarkan role, serta penyimpanan data di MySQL.
- Catatan setup lokal, akun demo, aturan utama, dan pengujian tersedia di `README.md`.

## Yang belum termasuk

- Pembayaran, registrasi Buyer, notifikasi email/WhatsApp, integrasi ERP/warehouse, unggah foto, dan CRUD produk lengkap.
- Paginasi untuk volume data besar, rate limiting login, dan hardening untuk penggunaan produksi.
- Pengujian visual menyeluruh pada semua halaman dan ukuran layar. Deployment Vercel dikelola pengguna; sebelum submission, pastikan login dan alur request berhasil pada URL demo.

## Keputusan teknis utama

- **Next.js + TypeScript** untuk website dan API dalam satu aplikasi; **MySQL + Prisma** untuk penyimpanan; **Tailwind CSS** untuk UI.
- Cart berada di browser dan tidak mereservasi stock. Server menjadi sumber kebenaran untuk harga, akses, dan validasi saat request dikirim.
- Status request: `Requested` → `Confirmed` atau `Rejected`. Konfirmasi memeriksa ulang seluruh item dan mengurangi stock dalam satu transaksi; kegagalan satu item membatalkan seluruh konfirmasi.
- Harga merupakan data sintetis untuk estimasi. Buyer hanya dapat membaca request miliknya; password di-hash dan session memakai cookie HttpOnly.

## Demo yang disarankan

Buyer mengirim request **300 KG Cakalang** dari stock awal **850 KG**. Stock tetap 850 KG selama request menunggu review, lalu menjadi **550 KG** setelah Admin mengonfirmasi. Hasil pengujian rinci ada di `docs/TEST_RESULTS.md`.
