import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
export const metadata = { title: "Masuk portal" };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await currentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/buyer");
  const requested = (await searchParams).next;
  const next = requested && /^\/catalog\/[a-z0-9-]+$/.test(requested) ? requested : "/buyer";
  return <div className="container login-layout"><section className="login-story"><p className="eyebrow">AJS procurement portal</p><h1>Satu pintu untuk kebutuhan <em>komoditas Anda.</em></h1><p>Lihat ketersediaan. Ajukan kebutuhan.<br />Pantau konfirmasi dari tim AJS.</p><span className="login-location">Muara Baru · Jakarta, Indonesia</span></section><section className="login-panel"><p className="eyebrow">Buyer & Admin</p><h2>Masuk ke portal</h2><p className="muted">Gunakan akun yang telah disiapkan untuk Anda.</p><LoginForm next={next} /></section></div>;
}
