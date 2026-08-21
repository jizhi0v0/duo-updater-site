import type { Metadata } from "next";

import { listDocs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How Duo Updater decides what has an update, what it checks before replacing an app, and what macOS will ask you for.",
  alternates: { canonical: "/docs" },
};

export default async function DocsIndexPage() {
  const docs = await listDocs();

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Docs</h1>
        <p>
          How it decides what has an update, what it checks before replacing an
          app, and what macOS will ask you for.
        </p>
      </div>

      <div className="doc-list">
        {docs.map((doc) => (
          <a key={doc.slug} href={`/docs/${doc.slug}`}>
            <strong>{doc.title}</strong>
            <span>{doc.summary}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
