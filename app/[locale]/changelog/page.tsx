import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { localizedPath, LOCALES, type LocaleID } from "@/i18n/locales";
import { readReleases } from "@/lib/changelog";
import { RELEASES_URL } from "@/lib/release";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/changelog">): Promise<Metadata> {
  const locale = (await params).locale as LocaleID;
  const t = await getTranslations({ locale, namespace: "changelog" });
  return {
    title: t("title"),
    description: t("description"),
    // Unlike the docs, each language's changelog is its own text (the app's
    // translated release notes), so each is canonical and they cross-link.
    alternates: {
      canonical: localizedPath(locale, "/changelog"),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l.tag, localizedPath(l.id, "/changelog")]),
        ),
        "x-default": "/changelog",
      },
    },
  };
}

export default async function ChangelogPage({ params }: PageProps<"/[locale]/changelog">) {
  const locale = (await params).locale as LocaleID;
  const [releases, t] = await Promise.all([
    readReleases(locale),
    getTranslations({ locale, namespace: "changelog" }),
  ]);
  const hasEnglishFallback = releases.some((release) => release.lang === "en");

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{t("title")}</h1>
        <p>
          {/* External: GitHub's releases page, so a plain anchor. */}
          {t.rich("intro", { link: (chunks) => <a href={RELEASES_URL}>{chunks}</a> })}
          {/* Chinese and Japanese run sentences together after 。 with no space. */}
          {hasEnglishFallback && (
            <>
              {/^(ja|zh)/.test(locale) ? "" : " "}
              {t("olderInEnglish")}
            </>
          )}
        </p>
      </div>

      <div className="prose">
        {releases.map((release) => (
          <article
            className="release"
            key={release.version}
            id={release.version}
            lang={release.lang}
          >
            <div className="release-version">
              <a href={`#${release.version}`}>{release.version}</a>
            </div>
            <div
              className="release-body"
              dangerouslySetInnerHTML={{ __html: release.html }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
