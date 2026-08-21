export const SITE = {
  name: "Duo Updater",
  // Set once the domain is registered; used for canonical URLs and the sitemap.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://duoupdater.com",
  tagline:
    "A macOS menu-bar app that finds updates for the apps you already have, and installs them the way each app expects to be updated.",
} as const;
