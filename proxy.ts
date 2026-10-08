import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";

// Maps `/` and `/docs` onto the English routes under app/[locale], and
// redirects a superfluous `/en/...` to its unprefixed URL.
const intl = createMiddleware(routing);

// Lists computed from the content at build time (next.config.mjs).
const DOC_SLUGS = new Set(process.env.SITE_DOC_SLUGS!.split(","));
const STATIC_FILES = new Set(process.env.SITE_STATIC_FILES!.split(","));
const LOCALES = new Set<string>(routing.locales);
// Vercel Web Analytics and Speed Insights load their script and send their
// beacons under this prefix (a per-project hex directory, set by Vercel at build
// time; @vercel/analytics and @vercel/speed-insights read the same variable).
// Without it, locally, they use /_vercel/, which the matcher already skips.
const OBSERVABILITY = process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;

// Under Cache Components a dynamic segment cannot set `dynamicParams = false`,
// so a path no page lists — /wp-login.php, /de/docs/nope — would be rendered on
// its first request and kept in the route cache like a real page. Every such
// path is answered here instead, with its language's 404 page, which is
// prerendered at /<locale>/404 (app/[locale]/[...rest]).
function isPage(rest: string[]): boolean {
  if (rest.length === 0) return true;
  if (rest.length === 1) return rest[0] === "changelog" || rest[0] === "docs";
  return rest.length === 2 && rest[0] === "docs" && DOC_SLUGS.has(rest[1]);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (STATIC_FILES.has(pathname)) return NextResponse.next();
  if (OBSERVABILITY && pathname.startsWith(`${OBSERVABILITY}/`)) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const locale = LOCALES.has(segments[0]) ? segments[0] : routing.defaultLocale;
  const rest = LOCALES.has(segments[0]) ? segments.slice(1) : segments;
  if (!isPage(rest)) {
    // The 404 status comes from the page (notFound()); a status passed to
    // rewrite() is not applied — observed on 16.4.0, the response stays 200.
    return NextResponse.rewrite(new URL(`/${locale}/404`, request.url));
  }
  return intl(request);
}

export const config = {
  // Everything except Next's internals and Vercel's: files included, since a
  // path like /missing.txt that matches no file would otherwise reach
  // app/[locale] as a locale called "missing.txt".
  matcher: "/((?!_next/|_vercel/).*)",
};
