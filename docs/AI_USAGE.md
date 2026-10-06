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
