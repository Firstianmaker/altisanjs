# Hasil pengujian — 6 Oktober 2026

## Pemeriksaan otomatis

- Unit test: **6/6 lulus** — quantity/MOQ/availability, bentuk request, manipulasi harga, dan password hashing.
- Integration test pada MySQL 8.4.11: **12/12 lulus** — alur 300 KG, stock berubah, rollback multi-item, konfirmasi bersamaan, konfirmasi ganda, penolakan, stock habis, akses buyer, idempotency, dan snapshot harga.
- TypeScript: lulus, termasuk setelah perbaikan feedback form admin.
- Production build: berhasil untuk semua halaman dan API pada implementasi awal. Perubahan terakhir setelah build adalah konfigurasi root Turbopack, feedback form stock, dan penanganan body review null; TypeScript diperiksa ulang setelah perubahan tersebut.
- Audit dependensi sesudah pembaruan dependency pendukung: **0 vulnerability dilaporkan npm** pada saat pemeriksaan.

## Pengujian browser yang dilakukan

- Login Buyer dan dashboard kosong berhasil.
- Detail Cakalang menampilkan stock 850 KG, MOQ 100 KG, harga dummy Rp32.000/KG.
- Quantity 99 KG ditolak dengan pesan minimum order.
- Quantity 300 KG berhasil masuk cart; estimasi Rp9.600.000.
- Submit berhasil menyimpan request Requested dan mengosongkan cart.
- Logout Buyer, login Admin, serta request yang sama terlihat di daftar/detail Admin.
- Konfirmasi berhasil, status menjadi Confirmed, stock Cakalang menjadi **550 KG**.
- Form update stock Admin berhasil menyimpan perubahan Deho dari 1.200 menjadi **1.199 KG** sebagai data uji UI.
- Dashboard buyer dan cart diperiksa visual desktop. Panel Admin diperiksa pada viewport 390 × 844; form tersusun vertikal tanpa terpotong pada bagian yang diperiksa.

Data demo lokal memuat request hasil pengujian. Seed ulang tidak mereset stock. Gunakan database baru untuk demo yang memerlukan kondisi awal persis seperti brief.

## Preview lokal

Server preview sempat berhenti setelah sesi perintah berakhir. Server dan MySQL kemudian dijalankan ulang sebagai proses latar belakang. `http://localhost:3000` diverifikasi kembali memberikan HTTP 200.

Pemeriksaan visual seluruh halaman pada semua ukuran layar belum diklaim lengkap; preview lokal siap untuk review dan revisi UI pengguna.

## Demo deployment Vercel — 7 Oktober 2026

Aplikasi tersedia di [https://altisanjs.vercel.app](https://altisanjs.vercel.app). Setelah konfigurasi `APP_URL` diperbaiki menggunakan URL HTTPS lengkap, pengguna mengonfirmasi bahwa demo pada deployment dijalankan ulang. Pengujian awal di atas tetap merujuk pada sesi lokal tanggal 6 Oktober 2026.
