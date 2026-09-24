"use client";

import { type RefObject, useEffect } from "react";

// Behaviour shared by the two header dropdowns (languages, and the phone nav).
// A bare <details> only opens and closes on its own summary; a dropdown is
// expected to do more:
//
// - close on a click or tap anywhere outside it, and on Escape;
// - on a device with a real hover (a mouse or trackpad), open on hover and
//   close shortly after the pointer leaves — the delay covers the gap between
//   the summary and the list below it. Touch devices keep tap-to-open.
// - opening one closes the other, so they never overlap.
//
// A client-side navigation keeps this component, and a <details> keeps its
// `open` attribute across it, so `closeOn` closes the menu once the new page
// is in.
export function useHeaderMenu(menu: RefObject<HTMLDetailsElement | null>, closeOn: unknown) {
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [menu, closeOn]);

  useEffect(() => {
    const details = menu.current;
    if (!details) return;
    const summary = details.querySelector("summary");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    const onToggle = () => {
      if (!details.open) return;
      for (const other of document.querySelectorAll<HTMLDetailsElement>(".header-menu[open]")) {
        if (other !== details) other.open = false;
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (details.open && !details.contains(event.target as Node)) details.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !details.open) return;
      details.open = false;
      summary?.focus();
    };
    const onEnter = () => {
      if (!hover.matches) return;
      clearTimeout(closeTimer);
      details.open = true;
    };
    const onLeave = () => {
      if (!hover.matches) return;
      closeTimer = setTimeout(() => {
        details.open = false;
      }, 250);
    };
    // With hover-to-open, the click that follows the hover would otherwise
    // toggle the menu straight back shut. Leaving, clicking outside or Escape
    // close it instead.
    const onSummaryClick = (event: MouseEvent) => {
      if (hover.matches && details.open) event.preventDefault();
    };

    details.addEventListener("toggle", onToggle);
    details.addEventListener("mouseenter", onEnter);
    details.addEventListener("mouseleave", onLeave);
    summary?.addEventListener("click", onSummaryClick);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(closeTimer);
      details.removeEventListener("toggle", onToggle);
      details.removeEventListener("mouseenter", onEnter);
      details.removeEventListener("mouseleave", onLeave);
      summary?.removeEventListener("click", onSummaryClick);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);
}
