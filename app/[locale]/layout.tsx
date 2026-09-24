import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import SiteChrome from "@/components/SiteChrome";
import { localeInfo, localizedPath } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

import "../globals.css";

// Only the listed languages exist. Anything else in the first segment — which
// is what a path the proxy skipped, like /missing.txt, arrives as — is a 404
// rather than a page rendered on demand for a locale called "missing.txt".
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "meta" });
  const home = localizedPath(locale, "/");
  // app/opengraph-image.tsx sits outside [locale], where the file convention
  // does not attach it to these pages, so it is named here. It is the app icon
  // and name — the same card for every language.
  const card = {
    url: "/opengraph-image",
    type: "image/png",
    width: 1200,
    height: 630,
    alt: t("title"),
  };

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("title"),
      template: `%s — ${SITE.name}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      url: home === "/" ? SITE.url : `${SITE.url}${home}`,
      siteName: SITE.name,
      title: t("title"),
      description: t("description"),
      images: [card],
    },
    twitter: { card: "summary_large_image", images: [card] },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={localeInfo(locale).tag}>
      <body>
        {/* Client components here need the locale (the language menu, and
            next-intl's Link) but no messages: every string is rendered on the
            server, so none are shipped to the browser. */}
        <NextIntlClientProvider messages={null}>
          <SiteChrome locale={locale}>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
