import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import { RELEASES_URL, REPO } from "@/lib/release";
import { SITE } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — update your Mac apps the way they expect`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.tagline,
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — update your Mac apps the way they expect`,
    description: SITE.tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="wrap">
              <a className="wordmark" href="/">
                Duo Updater
              </a>
              <nav className="site-nav">
                <a href="/docs">Docs</a>
                <a href="/changelog">Changelog</a>
                <a href={`https://github.com/${REPO}`}>GitHub</a>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <div className="wrap">
              <span className="spacer">
                {/* Scoped to the app on purpose. Sitting in a footer, an unqualified
                    "no analytics" reads as a claim about the page you are on — which
                    would quietly become untrue the day this site gains any. */}
                The app sends no telemetry and talks to no server of ours. Apple
                Silicon, macOS 14+.
              </span>
              <a href={`https://github.com/${REPO}`}>Source</a>
              <a href={RELEASES_URL}>Releases</a>
              <a href={`https://github.com/${REPO}/blob/main/LICENSE`}>Licence</a>
              <a href={SITE.repo}>This site</a>
            </div>
          </footer>
        </div>
        {/* Aggregate page counts only — see /docs/privacy for what it records.
            Kept out of the footer's claim on purpose: that sentence is scoped to
            the app, which still talks to no server of ours. */}
        <Analytics />
      </body>
    </html>
  );
}
