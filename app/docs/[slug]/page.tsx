import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listDocs, readDoc } from "@/lib/docs";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await listDocs()).map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { doc } = await readDoc(slug);
    return { title: doc.title, description: doc.summary };
  } catch {
    return {};
  }
}

export default async function DocPage({ params }: Params) {
  const { slug } = await params;

  let doc, html;
  try {
    ({ doc, html } = await readDoc(slug));
  } catch {
    notFound();
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
      </div>

      <div className="prose">
        <a className="back-link" href="/docs">
          ← All docs
        </a>
        <div
          className="table-scroll"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
