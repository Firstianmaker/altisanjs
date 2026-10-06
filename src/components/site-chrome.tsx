"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "./nav";
export function SiteChrome({ user, children }: { user: { name: string; role: string } | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  return <>
    {!admin && <Nav user={user} />}
    <main id="main">{children}</main>
    {!admin && <footer className="site-footer"><div className="container footer-inner"><div><strong>PT Altisan Jaya Sinergi</strong><p>Fish Commodity Trading & Supply · Jakarta, Indonesia</p></div><div><Link href="/catalog">Lihat komoditas ↗</Link><p>Prototype challenge · Data & harga untuk demo</p></div></div></footer>}
  </>;
}
