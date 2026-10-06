import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { kg, rupiah } from "@/lib/format";
export function ProductCard({ product }: { product: Product }) {
  const available = product.available && product.stock > 0;
  return <article className="product-card">
    <Link href={`/catalog/${product.slug}`} className="product-image"><Image src={product.image} alt={product.name} width={500} height={330} /><span className={`stock-label ${available ? "" : "unavailable"}`}>{available ? "Available" : "Unavailable"}</span></Link>
    <div className="product-body"><p className="meta">{product.origin} · {product.condition}</p><Link href={`/catalog/${product.slug}`} className="product-title">{product.name}<span aria-hidden>↗</span></Link><p className="muted">{product.englishName} · Grade {product.grade}</p>
      <div className="product-spec"><span>Tersedia<strong>{kg(product.stock)}</strong></span><span>Min. order<strong>{kg(product.moq)}</strong></span></div>
      <p className="price">{rupiah(product.price)} <small>/ KG</small></p>
    </div>
  </article>;
}
