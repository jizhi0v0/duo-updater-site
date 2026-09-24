"use client";

import { useRef } from "react";

import { useHeaderMenu } from "@/components/useHeaderMenu";
import { Link, usePathname } from "@/i18n/navigation";

type Item = { href: string; label: string; external?: boolean };

// The header's nav on a phone. The inline links do not fit beside the wordmark
// and the language menu in every language (Portuguese and Russian labels
// pushed the globe onto a second row at 375px), so below the breakpoint they
// fold into this menu and the header stays one row. Same links, same order.
export default function NavMenu({ label, items }: { label: string; items: Item[] }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  useHeaderMenu(menu, pathname);

  return (
    <details className="header-menu nav-menu" ref={menu}>
      <summary aria-label={label}>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </summary>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? <a href={item.href}>{item.label}</a> : <Link href={item.href}>{item.label}</Link>}
          </li>
        ))}
      </ul>
    </details>
  );
}
