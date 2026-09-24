import { getTranslations } from "next-intl/server";

import type { LocaleID } from "@/i18n/locales";
import { fetchLatestRelease, RELEASES_URL } from "@/lib/release";

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
        {t("note")} <a href={RELEASES_URL}>{t("allReleases")}</a>
      </p>
    </div>
  );
}
