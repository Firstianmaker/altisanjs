import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StockList } from "@/components/admin-controls";
export const metadata = { title: "Stock & Availability" };
export default async function AdminStock() {
  await pageUser("ADMIN");
  const products = await db.product.findMany({ orderBy: { id: "asc" } });
  return <div className="container page-space admin-list-page">
    <div className="page-intro"><p className="eyebrow">AJS internal</p><h1>Stock & Availability</h1><p>Perbarui stock dan ketersediaan komoditas untuk buyer.</p></div>
    <section aria-label="Pengaturan stock komoditas">
      <div className="section-heading compact"><h2>Komoditas</h2><span className="muted">Quantity dalam KG</span></div>
      <StockList products={products} />
    </section>
  </div>;
}
