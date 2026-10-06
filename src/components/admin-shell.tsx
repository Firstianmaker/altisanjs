"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { LogoutButton } from "./nav";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const open = openPath === pathname;
  const stockActive = pathname === "/admin/stock";
  return <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
    <aside className="admin-sidebar" onKeyDown={event => {
      if (event.key === "Escape" && open) { setOpenPath(null); toggle.current?.focus(); }
    }}>
      <div className="admin-sidebar-heading">
        <Link href="/admin" className="admin-brand" onClick={() => setOpenPath(null)} aria-label="AJS panel admin">AJS<span>↗</span><small>Panel admin</small></Link>
        <button className="admin-sidebar-toggle" type="button" aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"} title={collapsed ? "Buka sidebar" : "Tutup sidebar"} aria-expanded={!collapsed} aria-controls="admin-navigation" onClick={() => setCollapsed(!collapsed)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /><path d={collapsed ? "m13 9 3 3-3 3" : "m16 9-3 3 3 3"} /></svg>
        </button>
        <button ref={toggle} type="button" className="admin-menu-toggle" aria-label={open ? "Tutup menu" : "Buka menu"} title={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpenPath(open ? null : pathname)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d={open ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      <div id="admin-navigation" className={`admin-navigation ${open ? "is-open" : ""}`}>
        <nav className="admin-nav" aria-label="Navigasi admin">
          <Link href="/admin" aria-current={!stockActive ? "page" : undefined} onClick={() => setOpenPath(null)}>Order Request <span aria-hidden>→</span></Link>
          <Link href="/admin/stock" aria-current={stockActive ? "page" : undefined} onClick={() => setOpenPath(null)}>Stock & Availability <span aria-hidden>→</span></Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/catalog" onClick={() => setOpenPath(null)}>Lihat Komoditas <span aria-hidden>↗</span></Link>
          <LogoutButton className="admin-logout" />
          <p>PT Altisan Jaya Sinergi</p>
        </div>
      </div>
    </aside>
    <div className="admin-content">{children}</div>
  </div>;
}
