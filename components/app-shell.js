import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/ui/toast";

/** Top bar (with mobile menu and theme toggle), page area, footer. */
export function AppShell({ children }) {
  return (
    <ToastProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-tight focus:left-tight focus:z-50 focus:rounded-full focus:bg-field focus:px-base focus:py-tight focus:text-brand"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none mx-auto w-full max-w-[1200px] flex-1 px-base md:px-section">
        {children}
      </main>
      <footer className="mt-block border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-hair px-base py-group text-sm text-ink-soft md:flex-row md:items-center md:justify-between md:px-section">
          <p>Five project proposals. Every prototype uses mock data only.</p>
          <p>No backend, no accounts, no real AI calls.</p>
        </div>
      </footer>
    </ToastProvider>
  );
}
