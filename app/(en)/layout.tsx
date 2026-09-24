import type { Metadata } from "next";

import SiteChrome, { rootMetadata } from "@/components/SiteChrome";
import { messagesFor } from "@/lib/i18n";
import { ENGLISH } from "@/lib/i18n/locales";

import "../globals.css";

export const metadata: Metadata = rootMetadata(ENGLISH, messagesFor(""));

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome locale={ENGLISH} t={messagesFor("")}>
      {children}
    </SiteChrome>
  );
}
