import { pageUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await pageUser("ADMIN");
  return <AdminShell>{children}</AdminShell>;
}
