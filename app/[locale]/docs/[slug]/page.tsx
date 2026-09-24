import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { listDocs, readDoc } from "@/lib/docs";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return (await listDocs()).map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { doc } = await readDoc(slug);
    return {
      title: doc.title,
      description: doc.summary,
      alternates: { canonical: `/docs/${slug}` },
    };
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
    // English under every locale prefix; `lang` says so to screen readers and
    // to the browser's translate offer, since <html lang> is the chrome's.
    <div className="wrap" lang="en">
      <div className="page-head">
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
      </div>

      <div className="prose">
        <Link className="back-link" href="/docs">
          ← All docs
        </Link>
        <div
          className="table-scroll"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
