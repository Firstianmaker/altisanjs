"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
export function LogoutButton({ className = "text-button" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function logout() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Belum berhasil keluar. Coba lagi.");
      router.push("/login"); router.refresh();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <div className="logout-control"><button className={className} onClick={logout} disabled={busy}>{busy ? "Keluar…" : "Keluar"}</button>{error && <p className="error" role="alert">{error}</p>}</div>;
}
export function Nav({ user }: { user: { name: string; role: string } | null }) {
  const path = usePathname(); const cart = useCart();
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label="AJS beranda"><span className="brand-monogram">AJS<span>↗</span></span><span className="brand-name">Altisan Jaya Sinergi<small>Fish commodity trading & supply</small></span></Link>
    <nav aria-label="Navigasi utama">
      <Link href="/catalog" aria-current={path.startsWith("/catalog") ? "page" : undefined}>Komoditas</Link>
      {user ? <>
        <Link href={user.role === "ADMIN" ? "/admin" : "/buyer"} aria-current={path === "/admin" || path === "/buyer" ? "page" : undefined}>{user.role === "ADMIN" ? "Panel admin" : "Portal buyer"}</Link>
        {user.role === "BUYER" && <Link href="/cart" className="cart-link" aria-current={path === "/cart" ? "page" : undefined}>Cart <span>{cart.ready ? cart.items.length : 0}</span></Link>}
        <LogoutButton />
      </> : <Link className="button small" href="/login">Masuk portal <span aria-hidden>↗</span></Link>}
    </nav></div></header>;
}
