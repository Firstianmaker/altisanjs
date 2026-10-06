import Link from "next/link";
import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderDetail } from "@/components/order-detail";
import { ReviewControls } from "@/components/admin-controls";
export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  await pageUser("ADMIN");
  const order = await db.order.findUnique({ where: { id: (await params).id }, include: { items: true, buyer: { select: { name: true, email: true } } } });
  if (!order) notFound();
  return <div className="container page-space"><Link className="back-link" href="/admin">← Panel admin</Link><OrderDetail order={order} /><p className="buyer-line"><strong>Buyer:</strong> {order.buyer.name} · {order.buyer.email}</p>{order.status === "Requested" && <ReviewControls orderId={order.id} />}</div>;
}
