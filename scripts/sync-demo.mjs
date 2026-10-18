// The home page's live popover: which apps it lists, what they look like, and
// every word it shows. All of it is read from the real product at sync time and
// committed, for the same reason as the rest of `npm run sync` — a deploy must
// not depend on this Mac.
//
// - Apps, versions and sources: `duo check --json`, the CLI built on the same
//   engine as the menu-bar app, so a row says what DuoUpdater itself said about
//   that app on the day of the sync.
// - Icons: the icon macOS draws for each installed bundle (NSWorkspace), so
//   they match Finder and the app's own rows.
// - Words: the app's own string catalog, in every language it ships, plus the
//   one system string the popover borrows from SwiftUI (the empty search).
//   Nothing in the popover is translated by this site.

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Popular open-source projects and AI apps, picked by hand. `runtime` is the
// mark the app draws beside the name; the CLI does not report it, so it is
// written here and was checked against each bundle's Frameworks folder.
// Every bundle id must be installed on the Mac running the sync, or it fails.
const DEMO_APPS = [
  { bundleID: "com.google.antigravity", runtime: "electron" },
  { bundleID: "com.bitwarden.desktop", runtime: "electron" },
  { bundleID: "com.usebruno.app", runtime: "electron" },
  { bundleID: "com.anthropic.claudefordesktop", runtime: "electron" },
  { bundleID: "com.microsoft.VSCode", runtime: "electron" },
  { bundleID: "com.todesktop.230313mzl4w4u92", runtime: "electron" },
  { bundleID: "com.mitchellh.ghostty", runtime: "native" },
  { bundleID: "com.electron.goose", runtime: "electron" },
  { bundleID: "com.pais.handy", runtime: "tauri" },
  { bundleID: "com.colliderli.iina", runtime: "native" },
  { bundleID: "jan.ai.app", runtime: "tauri" },
  { bundleID: "org.keepassxc.keepassxc", runtime: "qt" },
  { bundleID: "dev.kiro.desktop", runtime: "electron" },
  { bundleID: "org.localsend.localsendApp", runtime: "flutter" },
  { bundleID: "org.p0deje.Maccy", runtime: "native" },
  { bundleID: "app.cyan.markedit", runtime: "native" },
  { bundleID: "ai.opencode.desktop", runtime: "electron" },
  { bundleID: "com.raycast.macos", runtime: "native" },
  { bundleID: "com.knollsoft.Rectangle", runtime: "native" },
  { bundleID: "com.carriez.rustdesk", runtime: "flutter" },
  { bundleID: "com.utmapp.UTM", runtime: "native" },
];

// The keys the popover shows, as the app's catalog spells them. A key missing
// from the catalog — renamed in the app — fails the sync rather than leaving
// English on a translated page.
const APP_STRINGS = [
  "Update",
  "Update All",
  "Updated",
  "Up to date",
  "Show all",
  "Search apps",
  "Queued",
  "Checking",
  "Verifying",
  "Extracting",
  "Installing",
  "just now",
  "%lld updates available",
  "%lld apps · up to date",
  "Checking %lld apps…",
  "%lld updates",
  "Other tools",
  "Running brew upgrade…",
  "Rescan and check for updates",
  "Settings",
  "Quit",
  "Release Log — when the apps you track shipped each version",
  "Network — what keeping these apps updated has cost, and every request behind it",
  "Open Window — release notes and settings",
  "What's New — DuoUpdater's own release notes",
  "Native",
  "A native Mac app — built straight on Apple's frameworks, not a cross-platform runtime.",
  "Built with Electron — it bundles its own copy of Chromium.",
  "Built with Tauri — a Rust app drawing into the system WebView.",
  "Built with Flutter.",
  "Built with Qt.",
];

// Site locale id → the app catalog's language, and → macOS's own folder name
// for the same language in system frameworks.
const LANGUAGES = [
  { site: "en", app: "en", system: "en" },
  { site: "de", app: "de", system: "de" },
  { site: "es", app: "es", system: "es" },
  { site: "fr", app: "fr", system: "fr" },
  { site: "it", app: "it", system: "it" },
  { site: "pt-br", app: "pt-BR", system: "pt_BR" },
  { site: "ru", app: "ru", system: "ru" },
  { site: "tr", app: "tr", system: "tr" },
  { site: "ja", app: "ja", system: "ja" },
  { site: "zh-hans", app: "zh-Hans", system: "zh_CN" },
  { site: "zh-hant", app: "zh-Hant", system: "zh_TW" },
];

const SWIFTUI_STRINGS =
  "/System/Library/Frameworks/SwiftUI.framework/Versions/A/Resources/Localizable.loctable";
const NO_RESULTS = "ContentUnavailableView_Search_Text %@";
const NO_RESULTS_HINT = "ContentUnavailableView_Search_Secondary_Text";

const ICON_PIXELS = 64;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

/** "%lld" and "%@" become "{n}" and "{s}", which the page fills in. */
function placeholders(value) {
  return value.replace(/%(lld|d|ld)/g, "{n}").replace(/%@/g, "{s}");
}

async function readCatalogStrings(appRepo) {
  const catalog = JSON.parse(await readFile(join(appRepo, "App/Resources/Localizable.xcstrings"), "utf8"));
  const system = JSON.parse(
    execFileSync("plutil", ["-convert", "json", "-o", "-", SWIFTUI_STRINGS], { encoding: "utf8" }),
  );
  const out = {};
  for (const { site, app, system: systemLang } of LANGUAGES) {
    const strings = {};
    for (const key of APP_STRINGS) {
      const entry = catalog.strings[key];
      if (!entry) fail(`the app's string catalog has no "${key}"`);
      const localized = entry.localizations?.[app];
      if (localized?.stringUnit) {
        strings[key] = placeholders(localized.stringUnit.value);
      } else if (localized?.variations?.plural) {
        strings[key] = Object.fromEntries(
          Object.entries(localized.variations.plural).map(([form, unit]) => [
            form,
            placeholders(unit.stringUnit.value),
          ]),
        );
      } else if (app === catalog.sourceLanguage) {
        // The source language stores nothing for a key that is its own text.
        strings[key] = placeholders(key);
      } else {
        fail(`"${key}" has no ${app} translation in the app's catalog`);
      }
    }
    const table = system[systemLang];
    if (!table?.[NO_RESULTS] || !table?.[NO_RESULTS_HINT]) {
      fail(`SwiftUI has no ${systemLang} empty-search strings`);
    }
    strings.noResults = placeholders(table[NO_RESULTS]);
    strings.noResultsHint = table[NO_RESULTS_HINT];
    out[site] = strings;
  }
  return out;
}

// The vendor's own artwork: the bundle's .icns, which is the same in light and
// dark. NSWorkspace would draw what this Mac's Finder shows instead, and that
// follows this Mac's icon style — dark or tinted variants that a visitor on a
// default setup would not see. It is the fallback for a bundle with no .icns
// (an icon only in an asset catalog).
const ICON_SCRIPT = `
ObjC.import("AppKit");
function run(argv) {
  const [path, out, size] = [argv[0], argv[1], Number(argv[2])];
  const image = $.NSWorkspace.sharedWorkspace.iconForFile(path);
  const rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
    null, size, size, 8, 4, true, false, $.NSDeviceRGBColorSpace, 0, 0);
  $.NSGraphicsContext.saveGraphicsState;
  $.NSGraphicsContext.setCurrentContext($.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep));
  image.drawInRectFromRectOperationFraction($.NSMakeRect(0, 0, size, size), $.NSZeroRect, $.NSCompositingOperationCopy, 1);
  $.NSGraphicsContext.restoreGraphicsState;
  rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $()).writeToFileAtomically(out, true);
}`;

function bundleIcns(bundlePath) {
  const info = JSON.parse(
    execFileSync("plutil", ["-convert", "json", "-o", "-", join(bundlePath, "Contents/Info.plist")], {
      encoding: "utf8",
    }),
  );
  const name = info.CFBundleIconFile;
  if (!name) return null;
  const file = join(bundlePath, "Contents/Resources", name.endsWith(".icns") ? name : `${name}.icns`);
  return existsSync(file) ? file : null;
}

function renderIcon(bundlePath, out) {
  const icns = bundleIcns(bundlePath);
  if (icns) {
    execFileSync("sips", ["-s", "format", "png", "-z", String(ICON_PIXELS), String(ICON_PIXELS), icns, "--out", out], {
      stdio: "ignore",
    });
  } else {
    execFileSync("osascript", ["-l", "JavaScript", "-e", ICON_SCRIPT, bundlePath, out, String(ICON_PIXELS)]);
  }
  if (!existsSync(out)) fail(`no icon written for ${bundlePath}`);
}

function duoCheck(ids) {
  // `check` exits 1 when anything has an update — the normal case here.
  let raw;
  try {
    raw = execFileSync("duo", ["check", "--json", "--all", ...ids], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    if (error.status !== 1 || !error.stdout) {
      fail(`duo check failed: ${error.stderr || error.message}`);
    }
    raw = error.stdout;
  }
  return raw.split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

export async function syncDemo({ appRepo, siteRoot, selfVersion }) {
  const rows = duoCheck(DEMO_APPS.map((app) => app.bundleID));
  const iconDir = join(siteRoot, "public", "demo", "icons");
  await rm(iconDir, { recursive: true, force: true });
  await mkdir(iconDir, { recursive: true });

  const apps = [];
  for (const { bundleID, runtime } of DEMO_APPS) {
    // The first copy the CLI lists, as the popover would.
    const row = rows.find((candidate) => candidate.bundleID === bundleID);
    if (!row) fail(`duo check said nothing about ${bundleID} — is it installed?`);
    if (!row.latestVersion) fail(`duo check found no version for ${row.name} (${bundleID})`);
    const icon = `${bundleID}.png`;
    renderIcon(row.path, join(iconDir, icon));
    apps.push({
      bundleID,
      name: row.name,
      runtime,
      source: row.source,
      installed: row.installedVersion,
      latest: row.latestVersion,
      hasUpdate: row.hasUpdate,
      icon: `/demo/icons/${icon}`,
    });
  }
  apps.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

  // The two command-line rows under the list: Homebrew's outdated packages, and
  // every other tool the CLI tab tracks.
  const brew = JSON.parse(execFileSync("brew", ["outdated", "--json=v2"], {
    encoding: "utf8",
    // Read what brew already knows; a sync is not the time to update Homebrew.
    env: { ...process.env, HOMEBREW_NO_AUTO_UPDATE: "1" },
  }));
  const allTools = duoCheck([]).filter((row) => row.tool);
  const demo = {
    syncedAt: new Date().toISOString().slice(0, 10),
    selfVersion,
    apps,
    homebrewUpdates: brew.formulae.length + brew.casks.length,
    otherToolUpdates: allTools.filter((row) => row.hasUpdate).length,
  };
  await writeFile(join(siteRoot, "content", "demo-apps.json"), `${JSON.stringify(demo, null, 2)}\n`);
  const updates = apps.filter((app) => app.hasUpdate).length;
  console.log(`→ content/demo-apps.json (${apps.length} apps, ${updates} with an update)`);

  const strings = await readCatalogStrings(appRepo);
  await writeFile(join(siteRoot, "content", "app-strings.json"), `${JSON.stringify(strings, null, 2)}\n`);
  console.log(`→ content/app-strings.json (${APP_STRINGS.length + 2} strings × ${LANGUAGES.length} languages)`);
}
