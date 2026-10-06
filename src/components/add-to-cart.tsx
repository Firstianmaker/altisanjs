"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { checkStock } from "@/lib/rules";
import { useCart } from "./cart-provider";
import { kg, rupiah } from "@/lib/format";
export function AddToCart({ product, role }: { product: Product; role?: string }) {
  const cart = useCart(); const [quantity, setQuantity] = useState(String(product.moq)); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  if (!role) return <Link className="button full" href={`/login?next=/catalog/${product.slug}`}>Login untuk Request Order <span aria-hidden>↗</span></Link>;
  if (role === "ADMIN") return <Link className="button full" href="/admin">Kelola stock di panel admin</Link>;
  function add() {
    setError(""); setMessage("");
    try {
      const value = Number(quantity);
      checkStock(product, value);
      const existing = cart.items.find(i => i.productId === product.id);
      const total = (existing?.quantity ?? 0) + value;
      checkStock(product, total);
      cart.setItems([...cart.items.filter(i => i.productId !== product.id), { productId: product.id, quantity: total }]);
      setMessage(`${kg(value)} ${product.name} ditambahkan ke cart.`);
    } catch (e) { setError((e as Error).message); }
  }
  return <div className="form-stack"><label>Quantity (KG)<input type="number" min={product.moq} max={product.stock} step={1} value={quantity} onChange={e => { setQuantity(e.target.value); setMessage(""); setError(""); }} /></label>
    <p className="muted">Minimum {kg(product.moq)} · Estimasi {rupiah(Math.max(0, Number(quantity) || 0) * product.price)}</p>
    <button className="button full" disabled={!cart.ready || !product.available || product.stock < product.moq} onClick={add}>Tambahkan ke cart <span aria-hidden>+</span></button>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <div className="success" role="status">{message} <Link href="/cart">Lihat cart →</Link></div>}
  </div>;
}
