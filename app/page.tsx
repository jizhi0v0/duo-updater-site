import DownloadButton from "@/components/DownloadButton";

export default function HomePage() {
  return (
    <div className="wrap">
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
        <img
          src="/screenshots/menu-bar.png"
          alt="The Duo Updater menu bar popover, listing apps with an update available: each row shows the installed version, the new version, and either an Update or a Relaunch button."
          width={420}
          height={520}
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
        <img
          src="/screenshots/changelog.png"
          alt="The workbench window: a sidebar listing every scanned app, and the release notes for the selected one rendered as native text — version heading, date, and one bullet per change."
          width={760}
          height={520}
        />
        <figcaption>
          Opening the window gives you everything it scanned, and the release
          notes for whatever you select. Where a vendor publishes notes in a form
          worth parsing, they are pulled apart and rendered as native text
          instead of an embedded web page.
        </figcaption>
      </figure>

      <figure className="shot">
        <img
          src="/screenshots/release-log-timeline.png"
          alt="The Release Log timeline: releases grouped by day, each showing the app, version, source, and either an exact publish time or an approximate window."
          width={420}
          height={520}
        />
        <figcaption>
          Every version it sees gets recorded, so over time you get a log of when
          the software you use actually ships. A release time is only called exact
          when the vendor&rsquo;s own feed timestamps it; everything else is shown
          as a window with a <code>≈</code>, because that is all we honestly know.
        </figcaption>
      </figure>

      <figure className="shot">
        <img
          src="/screenshots/settings.png"
          alt="Duo Updater's General settings: check interval, post-update behaviour including automatic restart and rollback backups, concurrency, and install routing for App Store and self-updating apps."
          width={760}
          height={520}
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
