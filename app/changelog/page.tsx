import type { Metadata } from "next";

import { readReleases } from "@/lib/changelog";
import { RELEASES_URL } from "@/lib/release";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every release of Duo Updater, and what changed in it.",
};

export default async function ChangelogPage() {
  const releases = await readReleases();

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Changelog</h1>
        <p>
          Every release, newest first — the same notes the app shows you when it
          updates itself. Downloads are on{" "}
          <a href={RELEASES_URL}>the releases page</a>.
        </p>
      </div>

      <div className="prose">
        {releases.map((release) => (
          <article className="release" key={release.version} id={release.version}>
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
