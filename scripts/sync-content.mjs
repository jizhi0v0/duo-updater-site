// Copies the two things this site does not own — the changelog and the
// screenshots — out of the app repository and into version control here.
//
// Deliberately a copy rather than a build-time fetch: CHANGELOG.md is the single
// source of truth for release notes (the app repo's publish script reads the
// same file), and a deploy should never be able to fail, or silently ship
// different prose, because GitHub's raw CDN was lagging or rate-limiting.
// Run `npm run sync` after a release, then commit what changed.

import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
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

const changelog = await readFile(join(appRepo, "CHANGELOG.md"), "utf8");
await mkdir(join(siteRoot, "content"), { recursive: true });
await writeFile(join(siteRoot, "content", "changelog.md"), changelog);
console.log(`→ content/changelog.md (${changelog.length} bytes)`);

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
