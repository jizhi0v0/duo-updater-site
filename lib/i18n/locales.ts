// The home page exists in these languages. Docs and changelog stay English-only:
// the changelog is copied from the app repo, and the docs are long enough that a
// translation would drift from the English the day either one changes.
//
// `segment` is the URL path (lowercase, as URLs conventionally are); `tag` is the
// BCP 47 language tag that goes into <html lang> and hreflang. They differ only
// in case. `name` is the language's name for itself, which is what a switcher
// shows — a German reader looks for "Deutsch", not "German".
export const LOCALES = [
  { segment: "de", tag: "de", name: "Deutsch" },
  { segment: "es", tag: "es", name: "Español" },
  { segment: "it", tag: "it", name: "Italiano" },
  { segment: "pt-br", tag: "pt-BR", name: "Português (Brasil)" },
  { segment: "tr", tag: "tr", name: "Türkçe" },
  { segment: "ja", tag: "ja", name: "日本語" },
  { segment: "zh-hant", tag: "zh-Hant", name: "繁體中文" },
] as const;

export type Locale = (typeof LOCALES)[number];
export type LocaleSegment = Locale["segment"];

export const ENGLISH = { segment: "", tag: "en", name: "English" } as const;

export function findLocale(segment: string): Locale | undefined {
  return LOCALES.find((locale) => locale.segment === segment);
}

/** Path of the home page in a language; English is the bare root. */
export function homePath(segment: LocaleSegment | ""): string {
  return segment ? `/${segment}` : "/";
}

/** hreflang map for the home page, shared by every language's copy of it. */
export function homeAlternates(): Record<string, string> {
  return {
    en: "/",
    ...Object.fromEntries(LOCALES.map((locale) => [locale.tag, homePath(locale.segment)])),
    "x-default": "/",
  };
}
