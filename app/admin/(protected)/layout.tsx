import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import { getSession } from "@/lib/auth/session";

// Proxy only redirects for UX; every page under this layout re-checks the
// session itself (per Next.js's own guidance not to rely on Proxy alone),
// which also forces the whole admin subtree to render dynamically.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin">Innlegg</Link>
          <Link href="/admin/categories">Kategorier</Link>
          <Link href="/admin/settings">Innstillinger</Link>
        </nav>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
