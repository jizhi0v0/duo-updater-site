import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/lib/site";

import "./globals.css";

// Only for requests the i18n proxy does not match — paths with a dot in them,
// like /missing.txt. Everything else 404s inside its locale, via
// app/[locale]/not-found.tsx. There is no locale here to translate into.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Page not found",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="wrap">
          <div className="page-head">
            <h1>404</h1>
            <p>
              This page could not be found. <Link href="/">{SITE.name}</Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
