import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Maps `/` and `/docs` onto the English routes under app/[locale], and
// redirects a superfluous `/en/...` to its unprefixed URL.
export default createMiddleware(routing);

export const config = {
  // Everything except Next's internals, Vercel's, and files — anything with a
  // dot (robots.txt, sitemap.xml, icon.png) or the OG image route, which is
  // served from app/ directly and has no locale.
  matcher: "/((?!_next|_vercel|opengraph-image|.*\\..*).*)",
};
