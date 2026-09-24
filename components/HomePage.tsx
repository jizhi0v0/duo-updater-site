import Image from "next/image";

import { getTranslations } from "next-intl/server";

import DownloadButton from "@/components/DownloadButton";
import { localeInfo, localizedPath, type LocaleID } from "@/i18n/locales";
import { typeset } from "@/lib/typeset";
import { fetchLatestRelease, REPO } from "@/lib/release";
import { SITE } from "@/lib/site";

// Static imports so the intrinsic size comes from the file rather than from a
// number typed by hand. The hand-typed ones were wrong — every figure claimed a
// height of 520 against four different aspect ratios, so the browser reserved the
// wrong box and the page jumped when each image landed.
import changelogShot from "@/public/screenshots/changelog.png";
import menuBarShot from "@/public/screenshots/menu-bar.png";
import releaseLogShot from "@/public/screenshots/release-log-timeline.png";
import settingsShot from "@/public/screenshots/settings.png";

// The languages the app itself ships in. It follows the app's releases, not
// this site's translations: until the release that added it, pt-BR, tr and
// zh-Hant, the app had seven and this page said so. Each is written in its own
// language, so the sentence stays true on every page.
const APP_LANGUAGES = [
  "English",
  "简体中文",
  "繁體中文",
  "日本語",
  "Deutsch",
  "Español",
  "Français",
  "Italiano",
  "Português (Brasil)",
  "Русский",
  "Türkçe",
];

export default async function HomePage({ locale }: { locale: LocaleID }) {
  const [release, translate] = await Promise.all([
    fetchLatestRelease(),
    getTranslations({ locale }),
  ]);
  // Every string on the page goes through the CJK line-break fixes.
  const t = Object.assign(
    (key: Parameters<typeof translate>[0], values?: Parameters<typeof translate>[1]) =>
      typeset(locale, translate(key, values)),
    { rich: translate.rich },
  );
  const isEnglish = locale === "en";
  const pageURL = isEnglish ? SITE.url : `${SITE.url}${localizedPath(locale, "/")}`;
  // en-GB for English: the page's own copy has no serial comma.
  const appLanguages = new Intl.ListFormat(isEnglish ? "en-GB" : localeInfo(locale).tag, {
    type: "conjunction",
  })
    .formatToParts(APP_LANGUAGES)
    // Chinese joins the last two with 和 and no spaces, which runs it into the
    // Latin names on either side ("Français和Русский"). Chinese text puts a
    // space between CJK and Latin words, so the page does here too.
    .map((part) => (part.type === "literal" && part.value === "和" ? " 和 " : part.value))
    .join("");

  // Structured data for the one thing this page is about: a downloadable macOS
  // application. Version and download URL are read from the same release fetch
  // the button uses, so the two cannot describe different builds.
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    description: t("meta.description"),
    url: pageURL,
    ...(isEnglish ? {} : { inLanguage: localeInfo(locale).tag }),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 15 or later, Apple Silicon",
    downloadUrl: release.downloadURL,
    releaseNotes: `${SITE.url}/changelog`,
    isAccessibleForFree: true,
    license: `https://github.com/${REPO}/blob/main/LICENSE`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(release.version ? { softwareVersion: release.version } : {}),
    ...(release.publishedAt ? { datePublished: release.publishedAt } : {}),
  };

  // The site's own name, which Google reads from the home page only — the
  // English one, which is the site's root. The other spelling goes in
  // alternateName rather than competing with it in the title.
  const websiteLD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        // The value is built above from our own constants and the GitHub API's
        // release fields, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      {isEnglish && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLD) }}
        />
      )}
      <section className="hero">
        <h1>
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </h1>
        <p>{t("hero.body")}</p>
        <DownloadButton locale={locale} />
      </section>

      <figure className="shot">
        <Image
          src={menuBarShot}
          alt={t("menuBar.alt")}
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
          priority
        />
        {/* Two paragraphs rather than one long caption: `text-wrap: balance`
            stops applying past a browser-imposed line ceiling (see the rule in
            globals.css), and a merged caption would sail past it. */}
        <figcaption>
          <p>{t.rich("menuBar.caption1", { strong: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t("menuBar.caption2")}</p>
        </figcaption>
      </figure>

      <h2 className="section-title">{t("differently.title")}</h2>
      <div className="points">
        {[
          { title: t("differently.handsOver.title"), body: t("differently.handsOver.body") },
          {
            title: t("differently.neverForceQuits.title"),
            body: t("differently.neverForceQuits.body"),
          },
          { title: t("differently.checksSigner.title"), body: t("differently.checksSigner.body") },
          {
            title: t("differently.language.title"),
            body: t("differently.language.body", { languages: appLanguages }),
          },
          { title: t("differently.noServer.title"), body: t("differently.noServer.body") },
        ].map((point) => (
          <div className="point" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </div>
        ))}
      </div>

      <figure className="shot">
        <Image
          src={changelogShot}
          alt={t("workbench.alt")}
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>{t("workbench.caption")}</figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={releaseLogShot}
          alt={t("releaseLog.alt")}
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
        />
        <figcaption>{t("releaseLog.caption")}</figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={settingsShot}
          alt={t("settings.alt")}
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>{t("settings.caption")}</figcaption>
      </figure>
    </div>
  );
}
