import { notFound } from "next/navigation";

// Any path under a locale that no route matches: render that locale's 404
// (app/[locale]/not-found.tsx) inside its own header and footer.
//
// ensureStatic = "navigation" (root layout) requires every dynamic segment to
// list at least one value, so each language's 404 is prerendered at
// /<locale>/404. proxy.ts sends every path that is not a page there, so no
// other value of `rest` is rendered on demand and kept in the route cache.
export function generateStaticParams() {
  return [{ rest: ["404"] }];
}

export default function CatchAllPage() {
  notFound();
}
