import type { Metadata } from "next";

import HomePage from "@/components/HomePage";
import { homeAlternates, localizedPath, type LocaleID } from "@/i18n/locales";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as LocaleID;
  return {
    alternates: { canonical: localizedPath(locale, "/"), languages: homeAlternates() },
  };
}

export default async function LocaleHomePage({ params }: PageProps<"/[locale]">) {
  return <HomePage locale={(await params).locale as LocaleID} />;
}
