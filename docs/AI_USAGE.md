# Catatan penggunaan AI

**Tool:** OpenAI Codex.

Digunakan untuk membaca brief dan company profile, menyusun serta merevisi rencana bersama pengguna, implementasi Next.js/TypeScript/MySQL/Tailwind, desain data Prisma, debugging, pengujian, dan dokumentasi. Foto diambil dari dokumen referensi yang diberikan, bukan gambar baru hasil generasi AI.

Keputusan pengguna: stack, target dua hari, deployment ditangani pengguna, akun demo, harga dummy, serta pemberian kewenangan memilih detail yang belum diatur brief. Keputusan stock saat konfirmasi dan MOQ disampaikan sebelum implementasi.

Bagian yang perlu dipahami kandidat sebelum demo:

1. Browser mengirim product ID dan quantity; server membaca harga dan stock dari MySQL.
2. Requested tidak mereservasi stock; konfirmasi memeriksa ulang dan mengurangi stock dalam transaksi atomik.
3. Pemeriksaan role dan kepemilikan request dilakukan server, bukan hanya menyembunyikan tombol.
4. Session cookie berisi token acak; database menyimpan hash token dan kedaluwarsa.
5. Integration test memakai database terpisah dan benar-benar menguji persaingan dua konfirmasi.

Pemakaian AI tidak menggantikan kewajiban kandidat memahami dan menjelaskan kode. Daftar prompt lengkap bersifat opsional dalam brief; riwayat chat menyimpan keputusan dan instruksi implementasi.

## Ringkasan prompt substantif yang digunakan

Daftar ini merangkum permintaan kerja yang panjang dan relevan. Pertanyaan singkat, percakapan, serta troubleshooting rutin tidak dicantumkan.

1. Membaca dan memahami challenge brief serta company profile terlebih dahulu, tanpa mulai coding, lalu merangkum tujuan, scope MVP, aturan bisnis, acceptance criteria, deliverables, demo, dan batasan AI.
2. Menyusun rencana implementasi realistis untuk 1–2 hari berdasarkan brief, termasuk prioritas MVP, alur Public Website → Buyer → Request Order → Admin, urutan kerja, pengujian, dan hal yang belum diputuskan tanpa membuat asumsi.
3. Mengimplementasikan rencana yang telah disetujui dengan menjaga aturan stock, MOQ, status request, akses Buyer/Admin, dan scope challenge.
4. Memperbaiki tampilan berdasarkan umpan balik pengguna, termasuk halaman login serta navigasi, filter request, dan pengaturan stock di panel Admin.
5. Menyederhanakan README agar berfokus pada cara menjalankan project secara lokal, lalu memperbarui catatan submission satu halaman dan dokumentasi pendukung.

## Contoh prompt panjang

Berikut dua prompt utama yang digunakan. Percakapan singkat dan troubleshooting rutin tidak dicantumkan.

### Memahami dokumen challenge

> Sebelum mengerjakan apa pun, baca dan pahami terlebih dahulu dokumen challenge yang saya lampirkan.
>
> Jadikan dokumen tersebut sebagai sumber utama dan acuan untuk seluruh pengerjaan project ini. Pahami terutama:
>
> - tujuan dan konteks bisnis
> - scope MVP dan fitur wajib
> - business rules
> - data dummy yang diberikan
> - acceptance criteria
> - deliverables
> - penilaian kandidat
> - skenario demo
> - aturan dan batasan penggunaan AI
>
> Untuk tahap ini jangan mulai coding atau implementasi.
>
> Setelah selesai membaca, berikan saya hasil pemahamanmu tentang requirement project ini secara ringkas dan terstruktur. Jangan menambahkan requirement yang tidak ada di dokumen dan jangan mengambil keputusan teknis terlebih dahulu.

### Menyusun rencana implementasi

> Berdasarkan dokumen challenge yang sudah kamu baca dan pahami, sekarang buat planning pengerjaan project ini.
>
> Planning harus berfokus pada bagaimana menyelesaikan challenge dalam target waktu 1–2 hari dengan tetap memenuhi requirement dan acceptance criteria yang diberikan.
>
> Bahas:
>
> 1. Scope dan prioritas MVP.
> 2. User flow utama dari Public Website → Buyer → Order Request → Admin.
> 3. Fitur yang wajib dibuat dan fitur yang tidak perlu dibuat.
> 4. Business rules yang harus dipastikan berjalan.
> 5. Hal-hal yang perlu disiapkan sebelum implementasi.
> 6. Urutan pengerjaan yang paling efektif agar core end-to-end flow selesai terlebih dahulu.
> 7. Checklist testing berdasarkan acceptance criteria dan skenario demo.
> 8. Deliverables yang harus disiapkan untuk submission.
>
> Jangan mulai coding atau implementasi.
>
> Jangan menambahkan fitur yang tidak diperlukan hanya untuk membuat project terlihat lebih kompleks. Jika ada bagian yang belum ditentukan oleh brief dan membutuhkan keputusan, tandai sebagai "perlu keputusan" dan jangan membuat asumsi sendiri seperti harga, tech stack dll.
>
> Buat planning yang praktis dan realistis untuk challenge 1–2 hari, bukan PRD formal yang panjang.
