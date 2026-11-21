import { Figtree, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-code", display: "swap" });

const description = "Five project proposals. Read each one, then try its prototype.";

export const metadata = {
  title: { default: "Project Proposals", template: "%s · Project Proposals" },
  description,
  openGraph: { title: "Project Proposals", description, type: "website", siteName: "Project Proposals" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#121513" },
  ],
};

// Runs before first paint: applies the saved theme (if any) so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${figtree.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
