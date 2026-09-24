import type { Metadata } from "next";

import HomePage from "@/components/HomePage";
import { messagesFor } from "@/lib/i18n";
import { ENGLISH, homeAlternates } from "@/lib/i18n/locales";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: homeAlternates() },
};

export default function EnglishHomePage() {
  return <HomePage locale={ENGLISH} t={messagesFor("")} />;
}
