import NewsletterForm from "./NewsletterForm";

export default function Footer({ siteTitle }: { siteTitle: string }) {
  return (
    <footer className="mt-auto border-t border-foreground/10 px-6 py-8 text-sm">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <NewsletterForm />
        <div className="opacity-60">
          © {new Date().getFullYear()} {siteTitle}
        </div>
      </div>
    </footer>
  );
}
