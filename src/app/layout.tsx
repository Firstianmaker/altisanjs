import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { CartProvider } from "@/components/cart-provider";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";
export const metadata: Metadata = { title: { default: "AJS | Fish Commodity Trading & Supply", template: "%s | AJS" }, description: "Portal procurement komoditas ikan PT Altisan Jaya Sinergi. Lihat ketersediaan dan ajukan kebutuhan bisnis Anda." };
export const dynamic = "force-dynamic";
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  return <html lang="id"><body><CartProvider key={user?.id ?? "guest"} userId={user?.id}>
    <a className="skip-link" href="#main">Lewati ke konten</a>
    <SiteChrome user={user}>{children}</SiteChrome>
  </CartProvider></body></html>;
}
