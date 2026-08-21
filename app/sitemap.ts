import type { MetadataRoute } from "next";

import { listDocs } from "@/lib/docs";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await listDocs();
  return [
    { url: SITE.url, priority: 1 },
    { url: `${SITE.url}/docs` },
    { url: `${SITE.url}/changelog` },
    ...docs.map((doc) => ({ url: `${SITE.url}/docs/${doc.slug}` })),
  ];
}
