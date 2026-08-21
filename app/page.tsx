import Image from "next/image";

import type { Metadata } from "next";

import DownloadButton from "@/components/DownloadButton";
import { fetchLatestRelease, REPO } from "@/lib/release";
import { SITE } from "@/lib/site";

// Static imports so the intrinsic size comes from the file rather than from a
// number typed by hand. The hand-typed ones were wrong — every figure claimed a
// height of 520 against four different aspect ratios, so the browser reserved the
// wrong box and the page jumped when each image landed.
import changelogShot from "@/public/screenshots/changelog.png";
import menuBarShot from "@/public/screenshots/menu-bar.png";
import releaseLogShot from "@/public/screenshots/release-log-timeline.png";
import settingsShot from "@/public/screenshots/settings.png";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const release = await fetchLatestRelease();

  // Structured data for the one thing this page is about: a downloadable macOS
  // application. Version and download URL are read from the same release fetch
  // the button uses, so the two cannot describe different builds.
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 14 or later, Apple Silicon",
    downloadUrl: release.downloadURL,
    releaseNotes: `${SITE.url}/changelog`,
    isAccessibleForFree: true,
    license: `https://github.com/${REPO}/blob/main/LICENSE`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(release.version ? { softwareVersion: release.version } : {}),
    ...(release.publishedAt ? { datePublished: release.publishedAt } : {}),
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        // The value is built above from our own constants and the GitHub API's
        // release fields, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
      <section className="hero">
        <h1>
          Update your Mac apps the way
          <br />
          each one expects to be updated.
        </h1>
        <p>
          Most updaters pick one mechanism and push every app through it. Duo
          Updater reads each app&rsquo;s own release channel — its Sparkle
          appcast, its App Store listing, its Homebrew cask, its vendor&rsquo;s
          release feed — and uses that.
        </p>
        <DownloadButton />
      </section>

      <figure className="shot">
        <Image
          src={menuBarShot}
          alt="The Duo Updater menu bar popover, listing apps with an update available: each row shows the installed version, the new version, and either an Update or a Relaunch button."
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
          priority
        />
        <figcaption>
          Each row says what you are going from and to, and the button says what
          will actually happen: <strong>Update</strong> installs;{" "}
          <strong>Relaunch</strong> means it is already updated on disk and only
          the running copy is stale. A green dot marks an app that is running, so
          you know before you click whether something is about to be quit and
          reopened.
        </figcaption>
      </figure>

      <h2 className="section-title">What it does differently</h2>
      <div className="points">
        <div className="point">
          <h3>It hands over rather than fighting</h3>
          <p>
            When an app ships its own updater, that updater does the work. When
            something cannot be done safely, the row says so instead of guessing.
          </p>
        </div>
        <div className="point">
          <h3>It never force-quits</h3>
          <p>
            The quit is a plain terminate — your app runs its own save prompts and
            can refuse. One that refuses keeps a Restart button instead.
          </p>
        </div>
        <div className="point">
          <h3>It checks who signed the download</h3>
          <p>
            EdDSA where the app publishes a key, then a Developer ID signature,
            Team ID, bundle id and architecture that all have to match the app
            being replaced — plus a backup you can roll back to.
          </p>
        </div>
        <div className="point">
          <h3>It has no server</h3>
          <p>
            No telemetry and no analytics SDK. Every request goes straight to the
            vendor whose app is being checked, carrying nothing about you.
          </p>
        </div>
      </div>

      <figure className="shot">
        <Image
          src={changelogShot}
          alt="The workbench window: a sidebar listing every scanned app, and the release notes for the selected one rendered as native text — version heading, date, and one bullet per change."
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>
          Opening the window gives you everything it scanned, and the release
          notes for whatever you select. Where a vendor publishes notes in a form
          worth parsing, they are pulled apart and rendered as native text
          instead of an embedded web page.
        </figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={releaseLogShot}
          alt="The Release Log timeline: releases grouped by day, each showing the app, version, source, and either an exact publish time or an approximate window."
          className="shot-narrow"
          sizes="(max-width: 52rem) 100vw, 420px"
        />
        <figcaption>
          Every version it sees gets recorded, so over time you get a log of when
          the software you use actually ships. A release time is only called exact
          when the vendor&rsquo;s own feed timestamps it; everything else is shown
          as a window with a ≈, because that is all we honestly know.
        </figcaption>
      </figure>

      <figure className="shot">
        <Image
          src={settingsShot}
          alt="Duo Updater's General settings: check interval, post-update behaviour including automatic restart and rollback backups, concurrency, and install routing for App Store and self-updating apps."
          className="shot-wide"
          sizes="(max-width: 52rem) 100vw, 760px"
        />
        <figcaption>
          Most of the settings are about how much autonomy you want to give it —
          whether to restart apps for you, whether to keep a rollback backup, and
          how to route the two awkward cases: Mac App Store apps, and apps that
          ship their own updater.
        </figcaption>
      </figure>
    </div>
  );
}
