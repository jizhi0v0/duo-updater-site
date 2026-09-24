import { defineRouting } from "next-intl/routing";

import { LOCALES } from "./locales";

export const routing = defineRouting({
  locales: LOCALES.map((locale) => locale.id),
  defaultLocale: "en",
  // English keeps the URLs it has always had (`/`, `/docs`); every other
  // language is prefixed (`/de`, `/de/docs`).
  localePrefix: "as-needed",
  // The URL alone decides the language. No redirect from `/` based on
  // Accept-Language, so a shared link shows the recipient what the sender saw,
  // and crawlers see one stable page per URL.
  localeDetection: false,
  // Without detection the cookie has nothing to do, and the privacy page says
  // what this site stores — which is nothing.
  localeCookie: false,
  // The middleware would advertise `/de/docs` as the German version of
  // `/docs`, but the docs are English under every prefix. hreflang is declared
  // in the pages that really are translated (the home pages) instead.
  alternateLinks: false,
});
