export const REPO = "jizhi0v0/duo-updater";
export const RELEASES_URL = `https://github.com/${REPO}/releases`;
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`;

export type LatestRelease = {
  version: string;
  publishedAt: string | null;
  /** Direct link to the notarized zip, or the releases page if it can't be resolved. */
  downloadURL: string;
};

// The releases page always works as a download link, so a failed or rate-limited
// API call costs the version number and nothing else — never the button itself.
const FALLBACK: LatestRelease = {
  version: "",
  publishedAt: null,
  downloadURL: LATEST_RELEASE_URL,
};

export async function fetchLatestRelease(): Promise<LatestRelease> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) return FALLBACK;

    const release = (await response.json()) as {
      tag_name?: string;
      published_at?: string;
      assets?: { name: string; browser_download_url: string }[];
    };

    const zip = release.assets?.find((asset) => asset.name.endsWith("-macos.zip"));
    return {
      version: (release.tag_name ?? "").replace(/^v/, ""),
      publishedAt: release.published_at ?? null,
      downloadURL: zip?.browser_download_url ?? LATEST_RELEASE_URL,
    };
  } catch {
    return FALLBACK;
  }
}
