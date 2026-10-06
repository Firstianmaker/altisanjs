"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@prisma/client";
export function StockList({ products }: { products: Product[] }) {
  const [feedback, setFeedback] = useState<{ productId: string; message: string } | null>(null);
  const editVersion = useRef(0);
  function beginEdit() {
    setFeedback(null);
    return ++editVersion.current;
  }
  function saved(productId: string, version: number) {
    if (version === editVersion.current) setFeedback({ productId, message: `Stock ${products.find(p => p.id === productId)?.name} disimpan.` });
  }
  return <div className="stock-list">{products.map(product => <StockForm key={product.id} product={product} message={feedback?.productId === product.id ? feedback.message : ""} beginEdit={beginEdit} saved={saved} />)}</div>;
}
function StockForm({ product, message, beginEdit, saved }: { product: Product; message: string; beginEdit: () => number; saved: (productId: string, version: number) => void }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [stock, setStock] = useState(String(product.stock));
  useEffect(() => {
    setStock(String(product.stock));
  }, [product.stock, product.available, product.updatedAt]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const version = beginEdit();
    const data = new FormData(e.currentTarget);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: Number(data.get("stock")) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      saved(product.id, version); router.refresh();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} onFocusCapture={() => beginEdit()} onChange={() => { beginEdit(); setError(""); }} className="stock-form"><div className="stock-product"><strong>{product.name}</strong><p>{product.origin} · Grade {product.grade}</p></div><label>Stock (KG)<input name="stock" type="number" min={0} max={1000000} step={1} value={stock} disabled={busy} onChange={e => setStock(e.target.value)} required /></label><label>Availability (otomatis)<input readOnly value={Number(stock) > 0 ? "Available" : "Unavailable"} /></label><button className="button secondary" disabled={busy}>{busy ? "Menyimpan…" : "Simpan stock"}</button>{error && <p className="error stock-feedback" role="alert">{error}</p>}{message && <p className="success stock-feedback" role="status">{message}</p>}</form>;
}
export function ReviewControls({ orderId }: { orderId: string }) {
  const router = useRouter(); const [decision, setDecision] = useState<"Confirmed" | "Rejected" | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function review() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: decision }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.refresh(); setDecision(null);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <section className="review-box"><h2>Review request</h2><p>Konfirmasi memeriksa ulang seluruh item dan mengurangi stock. Penolakan tidak mengubah stock.</p>{!decision ? <div className="button-row"><button className="button" onClick={() => setDecision("Confirmed")}>Konfirmasi request</button><button className="button danger-outline" onClick={() => setDecision("Rejected")}>Tolak request</button></div> : <div className="review-confirm"><strong>{decision === "Confirmed" ? "Konfirmasi dan alokasikan stock untuk request ini?" : "Tolak request ini?"}</strong><p>Status yang sudah ditinjau tidak dapat diubah kembali dalam MVP ini.</p><div className="button-row"><button className="button" onClick={review} disabled={busy}>{busy ? "Memproses…" : decision === "Confirmed" ? "Ya, konfirmasi" : "Ya, tolak"}</button><button className="button secondary" onClick={() => { setDecision(null); setError(""); }} disabled={busy}>Batal</button></div></div>}{error && <p className="error" role="alert">{error}</p>}</section>;
}
