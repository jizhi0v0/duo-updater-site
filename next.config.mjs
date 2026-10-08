import { readdirSync } from "node:fs";

import createNextIntlPlugin from "next-intl/plugin";

// What exists, for proxy.ts to tell a real URL from one that would otherwise be
// rendered — and stored — on its first request (see the comment there). Read
// here because this file runs at build time with the content on disk; the
// lists reach the proxy inlined through `env`.
const docSlugs = readdirSync("content/docs")
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.slice(0, -".md".length));

// Files under public/, served at their own path.
const publicFiles = readdirSync("public", { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => `/${entry.parentPath.slice("public".length + 1)}/${entry.name}`.replace("//", "/"));

// The metadata routes at the top of app/, by the URL each is served at. A new
// top-level file fails the build here until it is listed, rather than turning
// into a 404 because the proxy does not know it.
const APP_ROOT_FILES = {
  "apple-icon.png": "/apple-icon.png",
  "icon.png": "/icon.png",
  "icon.svg": "/icon.svg",
  "opengraph-image.tsx": "/opengraph-image",
  "robots.ts": "/robots.txt",
  "sitemap.ts": "/sitemap.xml",
  "global-not-found.tsx": null,
  "globals.css": null,
};
const metadataRoutes = readdirSync("app", { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => {
    if (!(entry.name in APP_ROOT_FILES)) {
      throw new Error(`next.config.mjs: add app/${entry.name} to APP_ROOT_FILES`);
    }
    return APP_ROOT_FILES[entry.name];
  })
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // Content changes only with a deploy, and a deploy replaces every cached
    // page, so nothing here needs to revalidate on a timer. The `max` preset
    // revalidates after 30 days; this keeps the year the pages had before
    // Cache Components (s-maxage=31536000). `expire` is left out, which
    // inherits `default`'s "never".
    deploy: {
      revalidate: 60 * 60 * 24 * 365,
    },
  },
  env: {
    SITE_DOC_SLUGS: docSlugs.join(","),
    SITE_STATIC_FILES: [...publicFiles, ...metadataRoutes].join(","),
  },
  images: {
    // AVIF first, WebP for browsers without it. Measured 2026-10-08 on the
    // home page screenshots: AVIF 30–37% smaller than WebP at every width
    // served (menu bar at w=1080: 67 KB → 42 KB) with no visible difference.
    // Costs: the first encode of each size is slower, and each format is a
    // separate transformation and cache entry.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The root layout is app/[locale]/layout.tsx, so a request the i18n proxy
    // does not match has no layout to render a 404 in; app/global-not-found.tsx
    // is that page.
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        // Screenshots under /public are re-validated on every load by default.
        // They are versioned by filename (see scripts/sync-content.mjs, which
        // overwrites in place), so this is long-cache + SWR rather than
        // immutable: a replaced screenshot reaches returning visitors within a
        // day, and the stale one keeps rendering until it does.
        source: "/(.*\\.(?:png|jpe?g|svg|webp|avif|ico))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

// Finds i18n/request.ts, where each request's locale and messages come from.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
