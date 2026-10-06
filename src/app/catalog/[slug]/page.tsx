import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { kg, rupiah } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, user] = await Promise.all([db.product.findUnique({ where: { slug } }), currentUser()]);
  if (!product) notFound();
  return <div className="container page-space"><Link className="back-link" href="/catalog">← Semua komoditas</Link><div className="detail-grid"><div><div className="detail-photo"><Image src={product.image} alt={product.name} width={700} height={470} priority /></div><p className="fineprint">Foto referensi dari company profile AJS.</p><div className="detail-description"><h2>Tentang komoditas</h2><p>{product.description}</p></div></div><div className="detail-info"><p className="eyebrow">{product.origin}</p><h1>{product.name}</h1><p className="subtitle">{product.englishName}</p><span className={`status ${product.available && product.stock > 0 ? "status-confirmed" : "status-rejected"}`}>{product.available && product.stock > 0 ? "Available" : "Unavailable"}</span><dl className="spec-grid"><div><dt>Grade</dt><dd>{product.grade}</dd></div><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Available quantity</dt><dd>{kg(product.stock)}</dd></div><div><dt>Minimum order</dt><dd>{kg(product.moq)}</dd></div></dl><div className="order-box"><p className="detail-price">{rupiah(product.price)}<span> / KG</span></p><p className="fineprint">Harga final dikonfirmasi AJS</p><AddToCart product={product} role={user?.role} /><p className="fineprint">Cart tidak mereservasi stock. Request akan ditinjau sebelum pesanan dikonfirmasi.</p></div></div></div></div>;
}
