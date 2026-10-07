import Link from "next/link";
import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { kg } from "@/lib/format";
import { OrderList } from "@/components/order-list";
import { CartSummary } from "@/components/cart-view";
export const metadata = { title: "Portal buyer" };
export default async function Buyer() {
  const user = await pageUser("BUYER");
  const [orders, products] = await Promise.all([
    db.order.findMany({ where: { buyerId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } }),
    db.product.findMany({ orderBy: { id: "asc" } }),
  ]);
  return <div className="container page-space buyer-page"><div className="section-heading"><div><p className="eyebrow">Portal buyer</p><h1>Selamat datang, {user.name}.</h1><p>Lihat ketersediaan komoditas dan pantau kebutuhan yang sudah Anda ajukan.</p></div><Link className="button" href="/catalog">Ajukan kebutuhan <span aria-hidden>+</span></Link></div><CartSummary /><section className="availability-panel"><div className="section-heading compact"><h2>Ketersediaan komoditas</h2><Link href="/catalog" className="inline-link">Lihat catalog →</Link></div><div className="availability-grid">{products.map(p => <Link key={p.id} href={`/catalog/${p.slug}`}><span>{p.name}</span><strong>{kg(p.stock)}</strong><small>{p.available && p.stock > 0 ? "Available" : "Unavailable"} · Min. {kg(p.moq)}</small></Link>)}</div></section><section className="section-small"><div className="section-heading compact"><h2>Order request Anda</h2><span className="muted">{orders.filter(o => o.status === "Requested").length} menunggu review</span></div><OrderList orders={orders} /><p className="fineprint">Estimasi harga memerlukan konfirmasi AJS. Request belum menjadi transaksi final.</p></section></div>;
}
