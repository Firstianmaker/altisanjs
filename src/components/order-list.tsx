import Link from "next/link";
import type { Order, OrderItem, User } from "@prisma/client";
import { dateText, kg, orderNumber, rupiah } from "@/lib/format";
import { Status } from "./status";
export function OrderList({ orders, admin = false }: { orders: (Order & { items: OrderItem[]; buyer?: Pick<User, "name" | "email"> })[]; admin?: boolean }) {
  if (!orders.length) return <div className="empty"><h3>{admin ? "Belum ada request masuk." : "Belum ada order request."}</h3><p>{admin ? "Request yang dikirim buyer akan tampil di sini untuk ditinjau." : "Pilih komoditas dan quantity untuk mengirim kebutuhan pertama Anda."}</p>{!admin && <Link className="button" href="/catalog">Pilih komoditas →</Link>}</div>;
  return <div className="order-list">{orders.map(order => <Link className="order-row" key={order.id} href={`${admin ? "/admin" : "/buyer"}/orders/${order.id}`}><div><strong>{orderNumber(order.id)}</strong><p>{dateText(order.createdAt)} WIB{admin && ` · ${order.buyer?.name}`}</p><p>{order.items.map(i => `${i.productName} ${kg(i.quantity)}`).join(" · ")}</p></div><div className="order-row-end"><Status status={order.status} /><strong>{rupiah(order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0))} <span aria-hidden>↗</span></strong></div></Link>)}</div>;
}
