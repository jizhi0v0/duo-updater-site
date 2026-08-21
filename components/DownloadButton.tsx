import { fetchLatestRelease, RELEASES_URL } from "@/lib/release";

export default async function DownloadButton() {
  const release = await fetchLatestRelease();

  return (
    <div className="cta">
      <a className="button" href={release.downloadURL}>
        Download for Mac
        {release.version ? ` — ${release.version}` : ""}
      </a>
      <p className="cta-note">
        Apple Silicon, macOS 14 or later. Free and open source.{" "}
        <a href={RELEASES_URL}>All releases</a>
      </p>
    </div>
  );
}
