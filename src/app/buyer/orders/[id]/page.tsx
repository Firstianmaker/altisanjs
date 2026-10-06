import Link from "next/link";
import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderDetail } from "@/components/order-detail";
export default async function BuyerOrder({ params }: { params: Promise<{ id: string }> }) {
  const user = await pageUser("BUYER");
  const order = await db.order.findFirst({ where: { id: (await params).id, buyerId: user.id }, include: { items: true } });
  if (!order) notFound();
  return <div className="container page-space"><Link className="back-link" href="/buyer">← Portal buyer</Link><OrderDetail order={order} /></div>;
}
