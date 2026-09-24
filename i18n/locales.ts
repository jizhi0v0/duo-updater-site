// Every language the site's chrome and home page come in. `id` is next-intl's
// locale and the URL prefix (lowercase, as URLs conventionally are); `tag` is
// the BCP 47 language tag that goes into <html lang> and hreflang, and differs
// from `id` only in case. `name` is the language's name for itself, which is
// what a switcher shows — a German reader looks for "Deutsch", not "German".
//
// Only the home page is translated. Docs and changelog render their English
// text under every prefix, inside the translated header and footer.
export const LOCALES = [
  { id: "en", tag: "en", name: "English" },
  { id: "de", tag: "de", name: "Deutsch" },
  { id: "es", tag: "es", name: "Español" },
  { id: "it", tag: "it", name: "Italiano" },
  { id: "pt-br", tag: "pt-BR", name: "Português (Brasil)" },
  { id: "tr", tag: "tr", name: "Türkçe" },
  { id: "ja", tag: "ja", name: "日本語" },
  { id: "zh-hans", tag: "zh-Hans", name: "简体中文" },
  { id: "zh-hant", tag: "zh-Hant", name: "繁體中文" },
] as const;

export type LocaleID = (typeof LOCALES)[number]["id"];

export function localeInfo(id: string) {
  const locale = LOCALES.find((candidate) => candidate.id === id);
  if (!locale) throw new Error(`Unknown locale: ${id}`);
  return locale;
}

/** A path as it appears in a URL for a locale: English is unprefixed. */
export function localizedPath(id: LocaleID, path: string): string {
  if (id === "en") return path;
  return path === "/" ? `/${id}` : `/${id}${path}`;
}

/** hreflang map for the home page, shared by every language's copy of it. */
export function homeAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale.tag, localizedPath(locale.id, "/")])),
    "x-default": "/",
  };
}
