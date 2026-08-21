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
                No telemetry, no analytics, no server. Apple Silicon, macOS 14+.
              </span>
              <a href={`https://github.com/${REPO}`}>Source</a>
              <a href={RELEASES_URL}>Releases</a>
              <a href={`https://github.com/${REPO}/blob/main/LICENSE`}>Licence</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
