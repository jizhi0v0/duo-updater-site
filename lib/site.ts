export const SITE = {
  name: "Duo Updater",
  // Registered 2026-08-21 at Cloudflare. `.app` is HSTS-preloaded, so this is
  // https-only by force of the TLD, not just by preference.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://duoupdater.app",
  tagline:
    "A macOS menu-bar app that finds updates for the apps you already have, and installs them the way each app expects to be updated.",
} as const;
