"use client";

import { useEffect, type RefObject } from "react";

import type { GlassOptions } from "@avenra/liquid-glass";

// Liquid glass from @avenra/liquid-glass: an SVG displacement map, computed from
// the element's size and corner radius, applied through `backdrop-filter: url()`
// so what is behind the element bends at its rim. Only Chromium can reference an
// SVG filter from backdrop-filter; there the library falls back to a plain CSS
// blur, which is set here to the frost of the app's own popover material rather
// than the library's lighter 8px.
const FALLBACK_FILTER = "blur(24px) saturate(1.8)";

export function useLiquidGlass(ref: RefObject<HTMLElement | null>, options: GlassOptions, enabled = true) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    // Loaded on the client after first paint: the maps are computed with a
    // canvas, and the page reads fine before they arrive.
    import("@avenra/liquid-glass").then(({ createLiquidGlass, supportsBackdropFilter }) => {
      if (cancelled) return;
      const handle = createLiquidGlass(element, options);
      if (!supportsBackdropFilter()) {
        const inner = element.querySelector<HTMLElement>(":scope > .lg-inner");
        if (inner) {
          inner.style.backdropFilter = FALLBACK_FILTER;
          inner.style.setProperty("-webkit-backdrop-filter", FALLBACK_FILTER);
        }
      }
      destroy = () => handle.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
    // The options are literals at each call site; rebuilding on identity would
    // recreate the filter on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled]);
}
