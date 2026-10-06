import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CartView } from "@/components/cart-view";
export const metadata = { title: "Cart" };
export default async function Cart() {
  await pageUser("BUYER");
  const products = await db.product.findMany();
  return <div className="container page-space"><div className="page-intro"><p className="eyebrow">Kebutuhan Anda</p><h1>Periksa sebelum mengirim.</h1><p>Sesuaikan quantity dan kirim permintaan untuk ditinjau oleh tim AJS.</p></div><CartView products={products} /></div>;
}
