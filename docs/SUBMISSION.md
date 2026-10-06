# Catatan submission AJS

## Implementasi

Website publik (homepage, catalog, detail), login Buyer/Admin, dashboard buyer, cart, pengiriman dan riwayat request, review admin Confirmed/Rejected, serta update stock/availability. Data dan akun tersimpan di MySQL. Empat komoditas, stock awal, grade, origin, condition, dan MOQ mengikuti brief. Harga per KG merupakan dummy yang dicatat di README; UI menampilkan estimasi dan keterangan konfirmasi harga tanpa pembayaran.

## Keputusan utama

Next.js full-stack + TypeScript + MySQL + Prisma + Tailwind dipilih agar frontend/backend berada dalam satu project. Cart di browser tidak mengikat stock. Submit memeriksa availability/quantity; admin mengonfirmasi melalui transaksi Serializable, pemeriksaan ulang stock, dan update bersyarat. Jika satu item gagal, seluruh konfirmasi dibatalkan. Submission key mencegah duplikasi request saat retry; snapshot nama/harga menjaga riwayat.

Login menggunakan scrypt dan session database dengan cookie HttpOnly. Buyer hanya dapat membaca order miliknya. Semua perubahan admin dibatasi role di server. Quantity memakai KG bulat dan MOQ diterapkan sebagai minimum.

## Belum termasuk

Deployment ditangani pengguna. Tidak ada payment, registrasi, WhatsApp/email, integrasi warehouse/ERP, CRUD produk lengkap, upload foto, advanced permissions, paginasi volume besar, dan hardening produksi. Data produk selain stock dapat dikelola melalui database/seed. Harga belum merupakan quotation final. Detail autentikasi dan aturan stock perlu dijelaskan kandidat dalam demo.

## Verifikasi

Hasil eksekusi pengujian dicatat pada `docs/TEST_RESULTS.md` setelah pemeriksaan selesai. Skenario demo: 300 KG Cakalang dari stock awal 850 KG; submit tetap 850, konfirmasi menjadi 550. README memuat setup, akun demo, dan langkah demo maksimal 10 menit.
