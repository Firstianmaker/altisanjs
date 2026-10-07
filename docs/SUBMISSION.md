# Ringkasan Submission AJS

## Hasil implementasi

Portal procurement B2B dengan website publik (homepage, katalog, detail komoditas), akses Buyer, dan panel Admin. Buyer dapat mengirim serta memantau request order. Admin dapat memfilter dan meninjau request, mengubah stock/availability, serta membuka katalog dari panel. Katalog berisi empat komoditas dari brief beserta origin, grade, condition, stock, dan MOQ.

## Aturan bisnis yang diterapkan

- Request baru berstatus **Requested** dan tidak menahan stock.
- Quantity harus berupa KG bulat positif, memenuhi MOQ, dan tidak melebihi stock tersedia.
- Saat konfirmasi, stock diperiksa ulang lalu dikurangi dalam satu transaksi. Jika satu item gagal, seluruh konfirmasi dibatalkan. Konfirmasi berulang tidak mengurangi stock lagi.
- Penolakan tidak mengubah stock. Stock di atas 0 berarti **Available**; stock 0 berarti **Unavailable**.
- Harga per KG adalah data sintetis untuk demo. Total hanya estimasi; request bukan pembayaran atau quotation final.
- Buyer hanya dapat melihat request miliknya. Akses Admin dan perubahan data diperiksa di server.

## Keputusan dan batasan

- Stack yang digunakan: Next.js, TypeScript, MySQL, Prisma, dan Tailwind CSS.
- Cart berada di browser dan tidak mereservasi stock. Server menentukan harga dan memvalidasi stock saat submit.
- Login memakai akun demo Buyer/Admin tanpa registrasi. Password di-hash; session disimpan di database.
- Belum termasuk pembayaran, registrasi, notifikasi WhatsApp/email, integrasi warehouse/ERP, upload foto, CRUD produk lengkap, dan paginasi untuk volume besar.
- Deployment ditangani pengguna. Sertakan URL demo setelah alur login dan request berhasil diuji pada domain deployment.

## Skenario demo

1. Buka homepage, katalog, lalu detail Cakalang.
2. Login Buyer dan kirim request **300 KG**. Request berstatus Requested; stock tetap **850 KG**.
3. Login Admin, buka request dan konfirmasi. Stock menjadi **550 KG**.

## Dokumen pendukung

- `README.md`: cara menjalankan lokal, akun demo, aturan utama, dan pengujian.
- `docs/AI_USAGE.md`: penggunaan AI dan bagian kode yang perlu dipahami.
- `docs/TEST_RESULTS.md`: hasil pengujian yang telah dijalankan serta catatan cakupannya.
