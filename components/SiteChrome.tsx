import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import type { Messages } from "@/lib/i18n";
import { ENGLISH, homePath, type Locale, LOCALES } from "@/lib/i18n/locales";
import { RELEASES_URL, REPO } from "@/lib/release";
import { SITE } from "@/lib/site";

// Shared by both root layouts. There are two because <html lang> can only be set
// by a root layout, and the English pages and the translated home pages need
// different values of it.
export function rootMetadata(locale: Locale | typeof ENGLISH, t: Messages): Metadata {
  // app/opengraph-image.tsx sits above both route groups, where the file
  // convention no longer attaches it to their pages, so it is named here. It is
  // the app icon and name — the same card for every language.
  const card = { url: "/opengraph-image", width: 1200, height: 630, alt: t.meta.title };
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t.meta.title,
      template: `%s — ${SITE.name}`,
    },
    description: t.meta.description,
    openGraph: {
      type: "website",
      url: locale.segment ? `${SITE.url}/${locale.segment}` : SITE.url,
      siteName: SITE.name,
      title: t.meta.title,
      description: t.meta.description,
      images: [card],
    },
    twitter: { card: "summary_large_image", images: [card] },
  };
}

export default function SiteChrome({
  locale,
  t,
  children,
}: {
  locale: Locale | typeof ENGLISH;
  t: Messages;
  children: React.ReactNode;
}) {
  const languages = [ENGLISH, ...LOCALES];

  return (
    <html lang={locale.tag}>
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="wrap">
              <a className="wordmark" href={homePath(locale.segment)}>
                {SITE.name}
              </a>
              <nav className="site-nav">
                <a href="/docs">{t.nav.docs}</a>
                <a href="/changelog">{t.nav.changelog}</a>
                <a href={`https://github.com/${REPO}`}>{t.nav.github}</a>
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
                {t.footer.appClaim}
              </span>
              <a href={`https://github.com/${REPO}`}>{t.footer.source}</a>
              <a href={RELEASES_URL}>{t.footer.releases}</a>
              <a href={`https://github.com/${REPO}/blob/main/LICENSE`}>{t.footer.licence}</a>
              <a href={SITE.repo}>{t.footer.thisSite}</a>
            </div>
            <div className="wrap languages">
              {languages.map((language) =>
                language === locale ? (
                  <span key={language.tag} lang={language.tag} aria-current="page">
                    {language.name}
                  </span>
                ) : (
                  <a
                    key={language.tag}
                    href={homePath(language.segment)}
                    lang={language.tag}
                    hrefLang={language.tag}
                  >
                    {language.name}
                  </a>
                ),
              )}
            </div>
          </footer>
        </div>
        {/* Aggregate page counts only — see /docs/privacy for what it records.
            Kept out of the footer's claim on purpose: that sentence is scoped to
            the app, which still talks to no server of ours. */}
        <Analytics />
        {/* Core Web Vitals from real loads. Same disclosure rule as Analytics
            above: it is a script we ship, so /docs/privacy names it. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
