"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@prisma/client";
import { useCart } from "./cart-provider";
import { checkStock } from "@/lib/rules";
import { kg, rupiah } from "@/lib/format";
export function CartSummary() {
  const cart = useCart();
  return <Link className="cart-summary" href="/cart"><div><strong>Cart Anda</strong><p>{cart.ready && cart.items.length ? `${cart.items.length} komoditas siap diperiksa sebelum dikirim.` : "Pilih komoditas untuk menyusun kebutuhan Anda."}</p></div><span>Lihat cart →</span></Link>;
}
export function CartView({ products }: { products: Product[] }) {
  const cart = useCart(); const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  if (!cart.ready) return <p role="status">Memuat cart Anda…</p>;
  if (!cart.items.length) return <div className="empty"><h2>Cart Anda masih kosong.</h2><p>Pilih komoditas dan quantity untuk mulai menyusun request.</p><Link className="button" href="/catalog">Lihat komoditas →</Link></div>;
  const lines = cart.items.map(i => ({ ...i, product: products.find(p => p.id === i.productId) }));
  const total = lines.reduce((sum, i) => sum + i.quantity * (i.product?.price ?? 0), 0);
  async function submit() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      for (const line of lines) {
        if (!line.product) throw new Error("Produk tidak lagi tersedia. Hapus produk tersebut dari cart.");
        checkStock(line.product, line.quantity);
      }
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart.items, submissionKey: cart.submissionKey }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      cart.clear(); router.push(`/buyer/orders/${result.id}`); router.refresh();
    } catch (e) { setError((e as Error).message || "Request belum berhasil. Isi cart tetap tersimpan."); setBusy(false); router.refresh(); }
  }
  return <div className="cart-layout"><div className="cart-lines">{lines.map(line => <article className="cart-item" key={line.productId}>
    {line.product && <Image src={line.product.image} alt={line.product.name} width={170} height={120} />}
    <div className="cart-item-info"><h2>{line.product?.name ?? "Produk tidak tersedia"}</h2><p>{line.product?.origin} · {line.product?.condition}</p><p>{line.product ? `${rupiah(line.product.price)} / KG · Min. ${kg(line.product.moq)}` : "Hapus produk ini untuk melanjutkan."}</p><button className="remove-button" disabled={busy} onClick={() => { cart.setItems(cart.items.filter(i => i.productId !== line.productId)); setError(""); }}>Hapus</button></div>
    <div className="cart-quantity"><label>Quantity (KG)<input aria-label={`Quantity ${line.product?.name ?? "produk"}`} type="number" step={1} min={line.product?.moq ?? 1} max={line.product?.stock ?? 0} disabled={busy} value={line.quantity || ""} onChange={e => { cart.setItems(cart.items.map(i => i.productId === line.productId ? { ...i, quantity: Number(e.target.value) } : i)); setError(""); }} /></label><strong>{rupiah(line.quantity * (line.product?.price ?? 0))}</strong></div>
  </article>)}<Link href="/catalog" className="inline-link">← Tambah komoditas lain</Link></div><aside className="cart-total"><p className="eyebrow">Ringkasan kebutuhan</p><h2>Order request</h2><div className="total-line"><span>{cart.items.length} komoditas</span><span>{kg(cart.items.reduce((s, i) => s + i.quantity, 0))}</span></div><p className="muted">Estimasi total</p><strong className="total-price">{rupiah(total)}</strong><p className="fineprint">Harga final memerlukan konfirmasi AJS.</p><button className="button full" disabled={busy} onClick={submit}>{busy ? "Mengirim request…" : "Submit Request Order"}<span aria-hidden>→</span></button>{error && <p className="error" role="alert">{error}</p>}<p className="fineprint">Stock diperiksa kembali saat submit. Request belum menjadi transaksi final dan tidak mereservasi stock.</p></aside></div>;
}
