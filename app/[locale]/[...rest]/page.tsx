import { notFound } from "next/navigation";

// Any path under a locale that no route matches: render that locale's 404
// (app/[locale]/not-found.tsx) inside its own header and footer.
export default function CatchAllPage() {
  notFound();
}
