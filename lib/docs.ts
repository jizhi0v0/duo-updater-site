import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { renderMarkdown } from "./markdown";

export type Doc = {
  slug: string;
  title: string;
  summary: string;
  order: number;
};

const DOCS_DIR = join(process.cwd(), "content", "docs");

// Each doc opens with an HTML comment carrying its title, one-line summary and
// sort order, so the index page can be built without parsing the prose or
// pulling in a front-matter dependency for four fields.
const META = /^<!--\s*title:\s*(.+?)\s*\|\s*summary:\s*(.+?)\s*\|\s*order:\s*(\d+)\s*-->/;

async function read(slug: string) {
  const source = await readFile(join(DOCS_DIR, `${slug}.md`), "utf8");
  const match = source.match(META);
  if (!match) throw new Error(`content/docs/${slug}.md is missing its metadata comment`);
  return {
    meta: {
      slug,
      title: match[1],
      summary: match[2],
      order: Number(match[3]),
    },
    body: source.slice(match[0].length).trim(),
  };
}

export async function listDocs(): Promise<Doc[]> {
  const files = await readdir(DOCS_DIR);
  const docs = await Promise.all(
    files
      .filter((name) => name.endsWith(".md"))
      .map(async (name) => (await read(name.replace(/\.md$/, ""))).meta),
  );
  return docs.sort((a, b) => a.order - b.order);
}

export async function readDoc(slug: string): Promise<{ doc: Doc; html: string }> {
  const { meta, body } = await read(slug);
  return { doc: meta, html: await renderMarkdown(body) };
}
