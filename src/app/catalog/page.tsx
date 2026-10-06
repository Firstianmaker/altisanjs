import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
export const metadata = { title: "Komoditas" };
export default async function Catalog() {
  const products = await db.product.findMany({ orderBy: { id: "asc" } });
  return <div className="container page-space"><div className="page-intro"><p className="eyebrow">Supply catalog</p><h1>Komoditas tersedia.</h1><p>Pilih komoditas untuk melihat spesifikasi dan mengajukan kebutuhan bisnis Anda.</p></div><div className="catalog-bar"><span>{products.length} komoditas · Frozen</span><span>Quantity dalam KG · Review oleh AJS</span></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>{products.length === 0 && <div className="empty">Belum ada komoditas tersedia. Silakan kembali setelah tim AJS memperbarui catalog.</div>}<p className="notice">Harga ditampilkan per KG. Estimasi total bukan penawaran final dan masih memerlukan konfirmasi AJS.</p></div>;
}
