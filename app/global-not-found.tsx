import type { Metadata } from "next";

import SiteChrome from "@/components/SiteChrome";
import { messagesFor } from "@/lib/i18n";
import { ENGLISH } from "@/lib/i18n/locales";
import { SITE } from "@/lib/site";

import "./globals.css";

// With two root layouts there is no single layout for an unmatched URL to render
// inside, so this file supplies the whole document — in English, with the same
// header and footer as every other page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Page not found",
};

export default function GlobalNotFound() {
  return (
    <SiteChrome locale={ENGLISH} t={messagesFor("")}>
      <div className="wrap">
        <div className="page-head">
          <h1>404</h1>
          <p>This page could not be found.</p>
        </div>
      </div>
    </SiteChrome>
  );
}
