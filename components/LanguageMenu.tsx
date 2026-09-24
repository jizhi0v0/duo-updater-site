"use client";

import { useLocale } from "next-intl";
import NextLink from "next/link";
import { useEffect, useRef } from "react";

import { LOCALES, localizedPath } from "@/i18n/locales";
import { usePathname } from "@/i18n/navigation";

// The same page in each language. next-intl's own <Link locale="…"> would do
// this too, but it always writes the prefix (`/en/docs`, then a redirect to
// `/docs`) and turns prefetching off — both to keep a locale cookie current,
// which this site does not set (see i18n/routing.ts). So the href is built
// here, and plain next/link carries it: prefetched, no redirect.
export default function LanguageMenu({ variant = "menu" }: { variant?: "menu" | "list" }) {
  const current = useLocale();
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  // A client-side navigation keeps this component, and a <details> keeps its
  // `open` attribute across renders — so close it once the new page is in.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname, current]);

  const items = LOCALES.map((locale) =>
    locale.id === current ? (
      <span key={locale.id} lang={locale.tag} aria-current="page">
        {locale.name}
      </span>
    ) : (
      <NextLink
        key={locale.id}
        href={localizedPath(locale.id, pathname)}
        lang={locale.tag}
        hrefLang={locale.tag}
      >
        {locale.name}
      </NextLink>
    ),
  );

  if (variant === "list") {
    return <div className="wrap languages">{items}</div>;
  }

  const currentLocale = LOCALES.find((locale) => locale.id === current);
  return (
    // The footer lists the languages too, but a visitor who arrived on the
    // wrong one should not have to scroll past the whole page to find that out.
    <details className="lang-menu" ref={menu}>
      <summary>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M1.5 8h13M8 1.5c-2 2-2.8 4-2.8 6.5S6 12.5 8 14.5M8 1.5c2 2 2.8 4 2.8 6.5S10 12.5 8 14.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span lang={currentLocale?.tag}>{currentLocale?.name}</span>
      </summary>
      <ul>
        {items.map((item) => (
          <li key={item.key}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
