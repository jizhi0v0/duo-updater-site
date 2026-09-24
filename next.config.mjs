/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Two root layouts (English, and the translated home pages) leave no single
    // layout for an unmatched URL; app/global-not-found.tsx fills that role.
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

export default nextConfig;
