import { getTranslations } from "next-intl/server";

import type { LocaleID } from "@/i18n/locales";
import { typeset } from "@/lib/typeset";
import { fetchLatestRelease, RELEASES_URL } from "@/lib/release";

// The cask lives in jizhi0v0/homebrew-tap and is bumped by the app's release script.
// It is `auto_updates`, so after the install Sparkle keeps the app current.
const BREW_INSTALL = "brew install --cask jizhi0v0/tap/duoupdater";

export default async function DownloadButton({ locale }: { locale: LocaleID }) {
  const [release, t] = await Promise.all([
    fetchLatestRelease(),
    getTranslations({ locale, namespace: "download" }),
  ]);

  // Both links leave the site (a GitHub download, the releases page), so they
  // are plain anchors rather than next/link.
  return (
    <div className="cta">
      <a className="button" href={release.downloadURL}>
        {t("button")}
        {release.version ? ` — ${release.version}` : ""}
      </a>
      <p className="cta-note">
        {typeset(locale, t("note"))} <a href={RELEASES_URL}>{t("allReleases")}</a>
      </p>
      <p className="cta-note cta-brew">
        {typeset(locale, t("brew"))} <code>{BREW_INSTALL}</code>
      </p>
    </div>
  );
}
