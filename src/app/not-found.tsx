import Link from "next/link";
export default function NotFound() { return <div className="container page-space"><h1>Halaman tidak ditemukan.</h1><p>Produk atau request ini tidak tersedia untuk akun Anda.</p><Link className="button" href="/catalog">Kembali ke catalog</Link></div>; }
