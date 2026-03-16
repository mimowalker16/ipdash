import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "IP Lookup & DNS Tool — What Is My IP Address?",
    template: "%s | IPDash",
  },
  description:
    "Instantly find your IP address, location, ISP, and ASN. Run DNS lookups for any domain. Free, fast, and no-signup required.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        ── EZOIC SETUP ──────────────────────────────────────────────────────────
        1. Go to https://pubdashboard.ezoic.com and add your site.
        2. Verify ownership via the DNS TXT record method.
        3. Set NEXT_PUBLIC_EZOIC_SITE_ID in .env.local (and on your VPS).
        4. Once verified, remove the comment wrapper below so the script loads.
        ─────────────────────────────────────────────────────────────────────────
      */}
      {process.env.NEXT_PUBLIC_EZOIC_SITE_ID && (
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="afterInteractive"
        />
      )}
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-indigo-600">
              IPDash
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              My IP
            </Link>
            <Link href="/dns-lookup" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              DNS Lookup
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} IPDash &mdash; Free IP &amp; DNS lookup tool
        </footer>
      </body>
    </html>
  );
}
