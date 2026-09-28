import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { localizedPath, type LocaleID } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { docsAlternates, listDocs } from "@/lib/docs";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/docs">): Promise<Metadata> {
  const locale = (await params).locale as LocaleID;
  const t = await getTranslations({ locale, namespace: "docs" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localizedPath(locale, "/docs"),
      languages: await docsAlternates(),
    },
  };
}

export default async function DocsIndexPage({ params }: PageProps<"/[locale]/docs">) {
  const locale = (await params).locale as LocaleID;
  const [docs, t] = await Promise.all([
    listDocs(locale),
    getTranslations({ locale, namespace: "docs" }),
  ]);

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{t("title")}</h1>
        <p>{t("intro")}</p>
      </div>

      <div className="doc-list">
        {docs.map((doc) => (
          <Link key={doc.slug} href={`/docs/${doc.slug}`} lang={doc.lang}>
            <strong>{doc.title}</strong>
            <span>{doc.summary}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
