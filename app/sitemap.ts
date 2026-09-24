import type { MetadataRoute } from "next";

import { listDocs } from "@/lib/docs";
import { homeAlternates, homePath, LOCALES } from "@/lib/i18n/locales";
import { fetchLatestRelease } from "@/lib/release";
import { SITE } from "@/lib/site";

// The root stays bare ("https://duoupdater.app", no trailing slash), as before.
function absolute(path: string) {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [docs, release] = await Promise.all([listDocs(), fetchLatestRelease()]);

  // `lastModified` only where the date is a fact. The home page and the
  // changelog both change when a release ships — the download button, the
  // structured data, the top entry — so the release's own publication date is
  // the honest answer for them.
  //
  // The docs pages get none. Their prose changes on no schedule this file can
  // see, and a date invented to fill the field is exactly why crawlers discount
  // `lastmod` in the first place; an absent value is read as "unknown", which is
  // true, rather than as a claim that turns out to be wrong.
  const released = release.publishedAt ? new Date(release.publishedAt) : undefined;
  const homeLanguages = Object.fromEntries(
    Object.entries(homeAlternates()).map(([tag, path]) => [tag, absolute(path)]),
  );

  return [
    // Every language's home page lists all of them, itself included, as the
    // sitemap form of hreflang.
    ...[{ segment: "" as const }, ...LOCALES].map(({ segment }) => ({
      url: absolute(homePath(segment)),
      priority: segment ? undefined : 1,
      lastModified: released,
      alternates: { languages: homeLanguages },
    })),
    { url: `${SITE.url}/changelog`, lastModified: released },
    { url: `${SITE.url}/docs` },
    ...docs.map((doc) => ({ url: `${SITE.url}/docs/${doc.slug}` })),
  ];
}
