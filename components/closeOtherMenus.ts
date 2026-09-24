import type { SyntheticEvent } from "react";

/** onToggle for a header <details>: opening one closes the other, so the two
 *  dropdowns never sit on top of each other. */
export function closeOtherMenus(event: SyntheticEvent<HTMLDetailsElement>) {
  const opened = event.currentTarget;
  if (!opened.open) return;
  for (const other of document.querySelectorAll<HTMLDetailsElement>(".header-menu[open]")) {
    if (other !== opened) other.open = false;
  }
}
