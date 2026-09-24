import Image from "next/image";

import DownloadButton from "@/components/DownloadButton";
import type { Messages, Rich } from "@/lib/i18n";
import { ENGLISH, type Locale } from "@/lib/i18n/locales";
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

// The languages the app itself ships in, which is not the same list as the
// languages this page is translated into. Each is written in its own language,
// so the sentence stays true on every translation of the page.
const APP_LANGUAGES = ["English", "简体中文", "日本語", "Deutsch", "Español", "Français", "Русский"];

function renderRich(parts: Rich) {
  return parts.map((part, index) =>
    typeof part === "string" ? part : <strong key={index}>{part.strong}</strong>,
  );
}

// The list's position and the punctuation around it belong to the translation
// (a full stop is "。" in Japanese), so the string carries a placeholder rather
// than the code gluing a sentence on.
function withAppLanguages(body: string, list: string) {
  if (!body.includes("{languages}")) {
    throw new Error(`differently.language.body is missing {languages}: ${body}`);
  }
  return body.replace("{languages}", list);
}

export default async function HomePage({
  locale,
  t,
}: {
  locale: Locale | typeof ENGLISH;
  t: Messages;
}) {
  const release = await fetchLatestRelease();
  const isEnglish = locale === ENGLISH;
  const pageURL = isEnglish ? SITE.url : `${SITE.url}/${locale.segment}`;
  // en-GB for English: the page's own copy has no serial comma.
  const appLanguages = new Intl.ListFormat(isEnglish ? "en-GB" : locale.tag, {
    type: "conjunction",
  }).format(APP_LANGUAGES);

  // Structured data for the one thing this page is about: a downloadable macOS
  // application. Version and download URL are read from the same release fetch
  // the button uses, so the two cannot describe different builds.
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    description: t.meta.description,
    url: pageURL,
    ...(isEnglish ? {} : { inLanguage: locale.tag }),
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
          {t.hero.title[0]}
          <br />
          {t.hero.title[1]}
        </h1>
        <p>{t.hero.body}</p>
        <DownloadButton t={t.download} />
      </section>

      <figure className="shot">
        <Image
          src={menuBarShot}
          alt={t.menuBar.alt}
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
          priority
        />
        {/* Two paragraphs rather than one long caption: `text-wrap: balance`
            stops applying past a browser-imposed line ceiling (see the rule in
            globals.css), and a merged caption would sail past it. */}
        <figcaption>
          <p>{renderRich(t.menuBar.caption[0])}</p>
          <p>{t.menuBar.caption[1]}</p>
        </figcaption>
      </figure>

      <h2 className="section-title">{t.differently.title}</h2>
      <div className="points">
        {[
          t.differently.handsOver,
          t.differently.neverForceQuits,
          t.differently.checksSigner,
          {
            ...t.differently.language,
            body: withAppLanguages(t.differently.language.body, appLanguages),
          },
          t.differently.noServer,
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
          alt={t.workbench.alt}
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>{t.workbench.caption}</figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={releaseLogShot}
          alt={t.releaseLog.alt}
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
        />
        <figcaption>{t.releaseLog.caption}</figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={settingsShot}
          alt={t.settings.alt}
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>{t.settings.caption}</figcaption>
      </figure>
    </div>
  );
}
