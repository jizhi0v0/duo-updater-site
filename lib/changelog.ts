import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { renderMarkdown } from "./markdown";

export type ReleaseEntry = {
  version: string;
  html: string;
};

// CHANGELOG.md opens with a note to whoever edits it, then one `## <version>`
// section per release, newest first. Only the sections are of interest here —
// the preamble is addressed to contributors, not to readers of this site.
const SECTION = /^## +(\S+) *$/gm;

export async function readReleases(): Promise<ReleaseEntry[]> {
  const source = await readFile(
    join(process.cwd(), "content", "changelog.md"),
    "utf8",
  );

  const starts: { version: string; index: number }[] = [];
  for (const match of source.matchAll(SECTION)) {
    starts.push({ version: match[1], index: match.index + match[0].length });
  }

  return Promise.all(
    starts.map(async ({ version, index }, i) => {
      const end = i + 1 < starts.length
        ? source.lastIndexOf("## ", starts[i + 1].index)
        : source.length;
      return { version, html: await renderMarkdown(source.slice(index, end).trim()) };
    }),
  );
}
