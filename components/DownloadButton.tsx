import type { Messages } from "@/lib/i18n";
import { fetchLatestRelease, RELEASES_URL } from "@/lib/release";

export default async function DownloadButton({ t }: { t: Messages["download"] }) {
  const release = await fetchLatestRelease();

  return (
    <div className="cta">
      <a className="button" href={release.downloadURL}>
        {t.button}
        {release.version ? ` — ${release.version}` : ""}
      </a>
      <p className="cta-note">
        {t.note} <a href={RELEASES_URL}>{t.allReleases}</a>
      </p>
    </div>
  );
}
