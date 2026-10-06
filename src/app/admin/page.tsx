import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderList } from "@/components/order-list";
import Link from "next/link";
import { FishFilter } from "@/components/fish-filter";

export const metadata = { title: "Order Request" };
export default async function Admin({ searchParams }: { searchParams: Promise<{ status?: string; fish?: string | string[] }> }) {
  await pageUser("ADMIN");
  const statuses = ["Requested", "Confirmed", "Rejected"] as const;
  const query = await searchParams;
  const selected = statuses.find(status => status === query.status);
  const products = await db.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const requestedFish = Array.isArray(query.fish) ? query.fish : query.fish ? [query.fish] : [];
  const fish = products.filter(product => requestedFish.includes(product.id)).map(product => product.id);
  function statusHref(status?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    fish.forEach(id => params.append("fish", id));
    return `/admin${params.size ? `?${params}` : ""}`;
  }
  const orders = await db.order.findMany({
    include: { items: true, buyer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  const sorted = orders.sort((a, b) => Number(b.status === "Requested") - Number(a.status === "Requested"));
  const fishOrders = fish.length ? sorted.filter(order => order.items.some(item => fish.includes(item.productId))) : sorted;
  const filtered = selected ? fishOrders.filter(order => order.status === selected) : fishOrders;
  return <div className="container page-space admin-list-page">
    <div className="page-intro"><p className="eyebrow">AJS internal</p><h1>Kelola kebutuhan masuk.</h1><p>Tinjau, konfirmasi, atau tolak order request dari buyer.</p></div>
    <section aria-label="Daftar order request">
      <div className="section-heading compact"><h2>Order Request</h2><span className="status status-requested">{orders.filter(o => o.status === "Requested").length} menunggu review</span></div>
      <div className="order-filter-toolbar">
        <nav className="order-filters" aria-label="Filter status order request">
          <Link href={statusHref()} aria-current={!selected ? "page" : undefined}>Semua <span>{fishOrders.length}</span></Link>
          {statuses.map(status => <Link key={status} href={statusHref(status)} aria-current={selected === status ? "page" : undefined}>{status} <span>{fishOrders.filter(order => order.status === status).length}</span></Link>)}
          <FishFilter products={products} selected={fish} status={selected} />
        </nav>
      </div>
      {fish.length > 0 && <p className="filter-summary">Ikan: {products.filter(product => fish.includes(product.id)).map(product => product.name).join(", ")} · {filtered.length} request</p>}
      {(selected || fish.length > 0) && filtered.length === 0 ? <div className="empty"><h3>Tidak ada request yang sesuai filter.</h3><p>Pilih status atau ikan lain, atau tampilkan seluruh request.</p><Link className="button secondary" href="/admin">Tampilkan semua</Link></div> : <OrderList orders={filtered} admin />}
    </section>
  </div>;
}
