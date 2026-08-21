// Copies the two things this site does not own — the changelog and the
// screenshots — out of the app repository and into version control here.
//
// Deliberately a copy rather than a build-time fetch: CHANGELOG.md is the single
// source of truth for release notes (the app repo's publish script reads the
// same file), and a deploy should never be able to fail, or silently ship
// different prose, because GitHub's raw CDN was lagging or rate-limiting.
// Run `npm run sync` after a release, then commit what changed.

import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const appRepo = resolve(process.env.APP_REPO ?? join(siteRoot, "..", "duo-updater"));

const SCREENSHOTS = [
  "menu-bar.png",
  "changelog.png",
  "settings.png",
  "release-log-timeline.png",
];

// The app's own icon, used as this site's favicon and as the face of the
// Open Graph card. Copied for the same reason as everything else here: a deploy
// must not depend on a sibling checkout being present.
const ICONS = [
  { from: "App/Resources/Assets.xcassets/AppIcon.appiconset/icon_256.png", to: "app/icon.png" },
  { from: "App/Resources/Assets.xcassets/AppIcon.appiconset/icon_1024.png", to: "app/apple-icon.png" },
  { from: "App/Resources/Assets.xcassets/AppIcon.appiconset/icon_512.png", to: "assets/icon.png" },
];

if (!existsSync(join(appRepo, "CHANGELOG.md"))) {
  console.error(`✗ no CHANGELOG.md under ${appRepo}`);
  console.error("  Set APP_REPO to the duo-updater checkout if it lives elsewhere.");
  process.exit(1);
}

/** Numeric-segment compare; -1, 0 or 1 for a < b, a == b, a > b. */
function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

// CHANGELOG.md is written ahead of the release — the section for the version
// being prepared is added as the work lands, and `scripts/publish-release.sh`
// reads it when that version actually ships. Copying the file wholesale
// therefore published unreleased notes: the site would describe a version
// nobody could download yet.
//
// The tags are the release record, and they are already in this checkout, so
// this needs no network. Note the filter is "newer than the newest tag", not
// "has a tag": the first 21 sections predate the public repository and have no
// tag, and dropping those would throw away most of the history.
function latestReleasedVersion() {
  const out = execFileSync("git", ["-C", appRepo, "tag", "--sort=-v:refname"], {
    encoding: "utf8",
  });
  const newest = out.split("\n").map((l) => l.trim()).filter(Boolean)[0];
  if (!newest) {
    console.error(`✗ no tags in ${appRepo} — cannot tell which versions shipped.`);
    console.error("  Run `git fetch --tags` there, then try again.");
    process.exit(1);
  }
  return newest.replace(/^v/, "");
}

const released = latestReleasedVersion();
const changelogSource = await readFile(join(appRepo, "CHANGELOG.md"), "utf8");

const SECTION = /^## +(\S+) *$/gm;
const starts = [...changelogSource.matchAll(SECTION)].map((m) => ({
  version: m[1],
  at: m.index,
}));

// Sections run newest-first, so anything unreleased sits at the top. Keep the
// preamble, then resume at the first section that has actually shipped —
// slicing at the unreleased section instead would keep the preamble and throw
// away every release below it.
const unreleased = starts.filter((s) => compareVersions(s.version, released) > 0);
const firstReleased = starts.find((s) => compareVersions(s.version, released) <= 0);
const changelog = unreleased.length && firstReleased
  ? changelogSource.slice(0, starts[0].at) + changelogSource.slice(firstReleased.at)
  : changelogSource;

await mkdir(join(siteRoot, "content"), { recursive: true });
await writeFile(join(siteRoot, "content", "changelog.md"), changelog);
console.log(`→ content/changelog.md (${changelog.length} bytes, through ${released})`);
if (unreleased.length) {
  console.log(
    `  held back ${unreleased.length} unreleased: ${unreleased.map((u) => u.version).join(", ")}`,
  );
}

await mkdir(join(siteRoot, "public", "screenshots"), { recursive: true });
for (const name of SCREENSHOTS) {
  const from = join(appRepo, "assets", name);
  if (!existsSync(from)) {
    console.error(`✗ missing screenshot: ${from}`);
    process.exit(1);
  }
  await cp(from, join(siteRoot, "public", "screenshots", name));
  console.log(`→ public/screenshots/${name}`);
}

for (const { from, to } of ICONS) {
  const source = join(appRepo, from);
  if (!existsSync(source)) {
    console.error(`✗ missing icon: ${source}`);
    process.exit(1);
  }
  await mkdir(dirname(join(siteRoot, to)), { recursive: true });
  await cp(source, join(siteRoot, to));
  console.log(`→ ${to}`);
}
