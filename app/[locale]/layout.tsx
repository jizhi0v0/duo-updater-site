import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SiteChrome, { rootMetadata } from "@/components/SiteChrome";
import { messagesFor } from "@/lib/i18n";
import { findLocale, LOCALES } from "@/lib/i18n/locales";

import "../globals.css";

// Only the listed languages exist; any other first path segment is a 404 rather
// than a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale: locale.segment }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = findLocale((await params).locale);
  if (!locale) notFound();
  return rootMetadata(locale, messagesFor(locale.segment));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = findLocale((await params).locale);
  if (!locale) notFound();

  return (
    <SiteChrome locale={locale} t={messagesFor(locale.segment)}>
      {children}
    </SiteChrome>
  );
}
