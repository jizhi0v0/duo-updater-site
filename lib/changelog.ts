import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { renderMarkdown } from "./markdown";
import { typeset } from "./typeset";

export type ReleaseEntry = {
  version: string;
  html: string;
  /** Set when the entry is the English original standing in for a translation. */
  lang?: "en";
};

// CHANGELOG.md opens with a note to whoever edits it, then one `## <version>`
// section per release, newest first. Only the sections are of interest here —
// the preamble is addressed to contributors, not to readers of this site. The
// translations have the same shape, with a preamble addressed to the app.
const SECTION = /^## +(\S+) *$/gm;

async function readSections(file: string): Promise<Map<string, string>> {
  const source = await readFile(join(process.cwd(), "content", file), "utf8");

  const starts: { version: string; index: number }[] = [];
  for (const match of source.matchAll(SECTION)) {
    starts.push({ version: match[1], index: match.index + match[0].length });
  }

  return new Map(
    starts.map(({ version, index }, i) => {
      const end = i + 1 < starts.length
        ? source.lastIndexOf("## ", starts[i + 1].index)
        : source.length;
      return [version, source.slice(index, end).trim()];
    }),
  );
}

/**
 * Every release, newest first, in `locale` where a translation exists. The
 * translations cover the recent versions only; older ones are the English
 * original, marked so — the same fallback the app's What's New window uses.
 * The English file decides which versions exist and their order.
 */
export async function readReleases(locale: string): Promise<ReleaseEntry[]> {
  const english = await readSections("changelog.md");
  const translated = locale === "en" ? null : await readSections(`changelog/${locale}.md`);

  return Promise.all(
    [...english].map(async ([version, markdown]) => {
      const localized = translated?.get(version);
      return localized
        ? { version, html: typeset(locale, await renderMarkdown(localized)) }
        : { version, html: await renderMarkdown(markdown), ...(translated ? { lang: "en" as const } : {}) };
    }),
  );
}
