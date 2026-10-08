import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { cacheLife } from "next/cache";

import { LOCALES, localizedPath } from "@/i18n/locales";

import { renderMarkdown } from "./markdown";
import { typeset } from "./typeset";

export type Doc = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  /** Set when the English original is standing in for a missing translation. */
  lang?: "en";
};

// English lives at content/docs/<slug>.md and decides which docs exist; a
// translation lives at content/docs/<locale>/<slug>.md. A language missing a
// doc shows the English one, marked so — the same fallback the changelog uses.
const DOCS_DIR = join(process.cwd(), "content", "docs");

// Each doc opens with an HTML comment carrying its title, one-line summary and
// sort order, so the index page can be built without parsing the prose or
// pulling in a front-matter dependency for four fields.
const META = /^<!--\s*title:\s*(.+?)\s*\|\s*summary:\s*(.+?)\s*\|\s*order:\s*(\d+)\s*-->/;

async function readFrom(path: string, slug: string) {
  const source = await readFile(join(DOCS_DIR, path), "utf8");
  const match = source.match(META);
  if (!match) throw new Error(`content/docs/${path} is missing its metadata comment`);
  return {
    meta: {
      slug,
      title: match[1],
      summary: match[2],
      order: Number(match[3]),
    } as Doc,
    body: source.slice(match[0].length).trim(),
  };
}

async function read(slug: string, locale: string) {
  if (locale !== "en") {
    try {
      return await readFrom(join(locale, `${slug}.md`), slug);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  const english = await readFrom(`${slug}.md`, slug);
  if (locale !== "en") english.meta.lang = "en";
  return english;
}

async function englishSlugs(): Promise<string[]> {
  const files = await readdir(DOCS_DIR);
  return files.filter((name) => name.endsWith(".md")).map((name) => name.replace(/\.md$/, ""));
}

export async function listDocs(locale = "en"): Promise<Doc[]> {
  "use cache";
  cacheLife("deploy");
  const slugs = await englishSlugs();
  const docs = await Promise.all(slugs.map(async (slug) => (await read(slug, locale)).meta));
  return docs.sort((a, b) => a.order - b.order);
}

export async function readDoc(
  slug: string,
  locale = "en",
): Promise<{ doc: Doc; html: string }> {
  const found = await readKnownDoc(slug, locale);
  if (!found) throw new Error(`No doc named ${slug}`);
  return found;
}

// Returns null rather than throwing for an unknown slug. Observed on Next 16.4.0:
// throwing inside this "use cache" function turned /de/docs/nope into a 500,
// although DocPage catches the error and calls notFound().
async function readKnownDoc(
  slug: string,
  locale: string,
): Promise<{ doc: Doc; html: string } | null> {
  "use cache";
  cacheLife("deploy");
  // Only an English slug is a doc; this also keeps `slug` from reaching the
  // filesystem as anything but a known name.
  if (!(await englishSlugs()).includes(slug)) return null;
  const { meta, body } = await read(slug, locale);
  const html = await renderMarkdown(body);
  return { doc: meta, html: meta.lang ? html : typeset(locale, html) };
}

/**
 * hreflang map for the docs index (no slug) or one doc:
 * English plus every language that has its own text for it. A language
 * showing the English fallback is left out — it is not a version of the page.
 */
export async function docsAlternates(slug?: string): Promise<Record<string, string>> {
  "use cache";
  cacheLife("deploy");
  const path = slug ? `/docs/${slug}` : "/docs";
  const translated = await Promise.all(
    LOCALES.map(async (locale) => {
      if (locale.id === "en" || !slug) return true;
      return !(await read(slug, locale.id)).meta.lang;
    }),
  );
  return {
    ...Object.fromEntries(
      LOCALES.filter((_, i) => translated[i]).map((l) => [l.tag, localizedPath(l.id, path)]),
    ),
    "x-default": path,
  };
}
