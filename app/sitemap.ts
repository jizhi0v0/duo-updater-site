import type { MetadataRoute } from "next";

import { docsAlternates, listDocs } from "@/lib/docs";
import { homeAlternates, localizedPath, LOCALES } from "@/i18n/locales";
import { fetchLatestRelease } from "@/lib/release";
import { SITE } from "@/lib/site";

// The root stays bare ("https://duoupdater.app", no trailing slash), as before.
function absolute(path: string) {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [docs, release] = await Promise.all([listDocs(), fetchLatestRelease()]);
  const docPaths = [undefined, ...docs.map((doc) => doc.slug)];
  const docLanguages = await Promise.all(
    docPaths.map(async (slug) =>
      Object.fromEntries(
        Object.entries(await docsAlternates(slug)).map(([tag, path]) => [tag, absolute(path)]),
      ),
    ),
  );

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
  const changelogLanguages = {
    ...Object.fromEntries(
      LOCALES.map((l) => [l.tag, absolute(localizedPath(l.id, "/changelog"))]),
    ),
    "x-default": absolute("/changelog"),
  };
  const homeLanguages = Object.fromEntries(
    Object.entries(homeAlternates()).map(([tag, path]) => [tag, absolute(path)]),
  );

  return [
    // Every language's home page lists all of them, itself included, as the
    // sitemap form of hreflang.
    ...LOCALES.map(({ id }) => ({
      url: absolute(localizedPath(id, "/")),
      priority: id === "en" ? 1 : undefined,
      lastModified: released,
      alternates: { languages: homeLanguages },
    })),
    // Each language's changelog is its own text (the app's translated release
    // notes), so all of them are listed and cross-linked.
    ...LOCALES.map(({ id }) => ({
      url: absolute(localizedPath(id, "/changelog")),
      lastModified: released,
      alternates: { languages: changelogLanguages },
    })),
    // The docs: every language that has its own text for a page, cross-linked.
    // One still showing the English fallback is left out; it canonicalises to
    // the English page.
    ...docLanguages.flatMap((languages) =>
      Object.entries(languages)
        .filter(([tag]) => tag !== "x-default")
        .map(([, url]) => ({ url, alternates: { languages } })),
    ),
  ];
}
