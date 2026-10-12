import Image, { type StaticImageData } from "next/image";

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
import cliShot from "@/public/screenshots/cli.png";
import menuBarShot from "@/public/screenshots/menu-bar.png";
import releaseLogShot from "@/public/screenshots/release-log-timeline.png";
import settingsShot from "@/public/screenshots/settings.png";
import xcodeShot from "@/public/screenshots/xcode.png";

// The languages the app itself ships in; the page states how many. It follows
// the app's releases, not this site's translations: until the release that
// added pt-BR, tr and zh-Hant, the app had seven and this page said so.
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
  const t = (key: Parameters<typeof translate>[0], values?: Parameters<typeof translate>[1]) =>
    typeset(locale, translate(key, values));
  const isEnglish = locale === "en";
  const pageURL = isEnglish ? SITE.url : `${SITE.url}${localizedPath(locale, "/")}`;

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

      <Feature
        title={t("menuBar.title")}
        body={t("menuBar.body")}
        shot={menuBarShot}
        alt={t("menuBar.alt")}
        narrow
        priority
      />

      <section className="points-section">
        <h2 className="section-title reveal">{t("differently.title")}</h2>
        <div className="points">
          {(
            [
              "handsOver",
              "neverForceQuits",
              "checksSigner",
              "language",
              "noServer",
            ] as const
          ).map((key) => (
            <div className="point reveal" key={key}>
              <h3>{t(`differently.${key}.title`)}</h3>
              <p>{t(`differently.${key}.body`, { count: APP_LANGUAGES.length })}</p>
            </div>
          ))}
        </div>
      </section>

      <Feature
        title={t("workbench.title")}
        body={t("workbench.body")}
        shot={changelogShot}
        alt={t("workbench.alt")}
      />
      <Feature title={t("cli.title")} body={t("cli.body")} shot={cliShot} alt={t("cli.alt")} />
      <Feature
        title={t("releaseLog.title")}
        body={t("releaseLog.body")}
        shot={releaseLogShot}
        alt={t("releaseLog.alt")}
        narrow
      />
      <Feature
        title={t("settings.title")}
        body={t("settings.body")}
        shot={settingsShot}
        alt={t("settings.alt")}
      />
      <Feature
        title={t("xcode.title")}
        body={t("xcode.body")}
        shot={xcodeShot}
        alt={t("xcode.alt")}
      />
    </div>
  );
}

// One feature: a short name, one line saying what it does, and the screenshot
// that shows it. The detail lives in the docs, not under the picture.
function Feature({
  title,
  body,
  shot,
  alt,
  narrow = false,
  priority = false,
}: {
  title: string;
  body: string;
  shot: StaticImageData;
  alt: string;
  narrow?: boolean;
  priority?: boolean;
}) {
  return (
    <section className="feature">
      <header className="feature-head reveal">
        <h2>{title}</h2>
        <p>{body}</p>
      </header>
      <figure className="shot reveal">
        <Image
          src={shot}
          alt={alt}
          className={narrow ? "shot-narrow" : "shot-wide"}
          sizes={narrow ? "(max-width: 52rem) 100vw, 420px" : "(max-width: 52rem) 100vw, 760px"}
          priority={priority}
        />
      </figure>
    </section>
  );
}
