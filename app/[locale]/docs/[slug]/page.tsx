import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { localizedPath, type LocaleID } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { docsAlternates, listDocs, readDoc } from "@/lib/docs";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return (await listDocs()).map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { doc } = await readDoc(slug, locale);
    return {
      title: doc.title,
      description: doc.summary,
      alternates: {
        // A language still showing the English text points back at it.
        canonical: localizedPath(doc.lang ? "en" : (locale as LocaleID), `/docs/${slug}`),
        languages: await docsAlternates(slug),
      },
    };
  } catch {
    return {};
  }
}

export default async function DocPage({ params }: Params) {
  const { locale, slug } = await params;

  let doc, html;
  try {
    ({ doc, html } = await readDoc(slug, locale));
  } catch {
    notFound();
  }
  const t = await getTranslations({ locale: locale as LocaleID, namespace: "docs" });

  return (
    <div className="wrap">
      {/* `lang` on the English fallback tells screen readers and the browser's
          translate offer that it is not in the page's language. */}
      <div className="page-head" lang={doc.lang}>
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
      </div>

      <div className="prose">
        <Link className="back-link" href="/docs">
          ← {t("allDocs")}
        </Link>
        {doc.lang && <p className="doc-fallback">{t("inEnglish")}</p>}
        <div
          className="table-scroll"
          lang={doc.lang}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
