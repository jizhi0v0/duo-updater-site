import type { Metadata } from "next";

import { Link } from "@/i18n/navigation";
import { listDocs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How DuoUpdater decides what has an update, what it checks before replacing an app, and what macOS will ask you for.",
  // The English URL under every locale prefix: `/de/docs` is the same English
  // text inside a German header, not a translation of it.
  alternates: { canonical: "/docs" },
};

export default async function DocsIndexPage() {
  const docs = await listDocs();

  return (
    <div className="wrap" lang="en">
      <div className="page-head">
        <h1>Docs</h1>
        <p>
          How it decides what has an update, what it checks before replacing an
          app, and what macOS will ask you for.
        </p>
      </div>

      <div className="doc-list">
        {docs.map((doc) => (
          <Link key={doc.slug} href={`/docs/${doc.slug}`}>
            <strong>{doc.title}</strong>
            <span>{doc.summary}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
