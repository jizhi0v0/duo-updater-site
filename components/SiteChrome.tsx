import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getTranslations } from "next-intl/server";

import LanguageMenu from "@/components/LanguageMenu";
import type { LocaleID } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { RELEASES_URL, REPO } from "@/lib/release";
import { SITE } from "@/lib/site";

// Header and footer. Links to this site's own pages are next-intl <Link>s —
// prefetched, client-side, and kept in the current language. Links that leave
// the site (GitHub) stay plain <a>: next/link is for routes of this app.
export default async function SiteChrome({
  locale,
  children,
}: {
  locale: LocaleID;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale });

  return (
    <>
      <div className="shell">
        <header className="site-header">
          <div className="wrap">
            <Link className="wordmark" href="/">
              {SITE.name}
            </Link>
            <nav className="site-nav">
              <Link href="/docs">{t("nav.docs")}</Link>
              <Link href="/changelog">{t("nav.changelog")}</Link>
              <a href={`https://github.com/${REPO}`}>{t("nav.github")}</a>
            </nav>
            <LanguageMenu />
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="wrap">
            <span className="spacer">
              {/* Scoped to the app on purpose. Sitting in a footer, an unqualified
                  "no analytics" reads as a claim about the page you are on — which
                  would quietly become untrue the day this site gains any. */}
              {t("footer.appClaim")}
            </span>
            <a href={`https://github.com/${REPO}`}>{t("footer.source")}</a>
            <a href={RELEASES_URL}>{t("footer.releases")}</a>
            <a href={`https://github.com/${REPO}/blob/main/LICENSE`}>{t("footer.licence")}</a>
            <a href={SITE.repo}>{t("footer.thisSite")}</a>
          </div>
          <LanguageMenu variant="list" />
        </footer>
      </div>
      {/* Aggregate page counts only — see /docs/privacy for what it records.
          Kept out of the footer's claim on purpose: that sentence is scoped to
          the app, which still talks to no server of ours. */}
      <Analytics />
      {/* Core Web Vitals from real loads. Same disclosure rule as Analytics
          above: it is a script we ship, so /docs/privacy names it. */}
      <SpeedInsights />
    </>
  );
}
