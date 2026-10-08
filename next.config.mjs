import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
