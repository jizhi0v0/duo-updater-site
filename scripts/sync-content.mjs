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
