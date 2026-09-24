import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomePage from "@/components/HomePage";
import { messagesFor } from "@/lib/i18n";
import { findLocale, homeAlternates, homePath } from "@/lib/i18n/locales";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = findLocale((await params).locale);
  if (!locale) notFound();
  return {
    alternates: { canonical: homePath(locale.segment), languages: homeAlternates() },
  };
}

export default async function LocaleHomePage({ params }: PageProps<"/[locale]">) {
  const locale = findLocale((await params).locale);
  if (!locale) notFound();
  return <HomePage locale={locale} t={messagesFor(locale.segment)} />;
}
