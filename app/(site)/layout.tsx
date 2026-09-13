import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/theme/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteTitle={settings.siteTitle} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
      <Footer siteTitle={settings.siteTitle} />
    </div>
  );
}
