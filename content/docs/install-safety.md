<!-- title: Install safety | summary: What is checked before an app is replaced, and what is deliberately never done. | order: 2 -->

Owning the install is what makes these checks possible. Every one of them is a
thing that can go wrong when software replaces other software on your Mac.

## It never force-quits a running app

The installer never quits anything. Restarting an updated app is a separate
step, on by default and switchable off in Settings — and when it runs, the quit
is a plain `terminate()`. The app runs its own save prompts and can refuse. One
that refuses is left running and keeps a **Restart** button, so unsaved work is
never at risk from a forced exit.

Worth knowing: the restart happens *after* the new version is already on disk. So
if you decline the quit, you have an updated bundle sitting beside a process
still running the old code, until you relaunch it yourself. That is what the
Restart button on the row means.

## Five checks before anything is replaced

**EdDSA**, when the app itself supplies a public key. Some vendors ship an
unsigned feed; those are not refused outright, they simply have to clear the
remaining checks on their own. An app that *does* publish a key must produce a
valid signature — with one deliberate exception, below.

Then, regardless of source, four checks on the downloaded bundle:

- **Developer ID signature**, validated strictly and all the way down — every
  architecture, and nested code included, not just the outer bundle.
- **Team ID**, which has to match the app being replaced.
- **Bundle identifier**, taken from the *signature* rather than from the
  `Info.plist`, so a rewritten plist cannot talk its way past this.
- **Runnable architecture**, read from the real Mach-O slices. A build this Mac
  cannot launch is refused rather than installed and left broken.

A download that resolves to a different developer is refused, not installed.

The exception: when a vendor rotates its signing key without shipping a
transition build, the old key can no longer validate anything they publish. Rather
than stranding the app forever, an invalid EdDSA signature is held rather than
thrown, and the install may still proceed **if the other four checks pass** and
the downloaded bundle carries a new key that validates the feed. The Developer ID
and Team ID gates are what carry the trust in that case.

## Major version upgrades are gated

A jump to a new major version is put behind a warning rather than a one-click
button, because for a commercial app it may need a new licence. You decide;
Duo Updater does not decide for you by making it easy.

## Everything is re-checked immediately before installing

A list that has been sitting open for an hour is stale. Before the swap, the
check runs again, so a redundant install never fires against an app that was
already updated by something else in the meantime.

## Rollback backups

The bundle being replaced is kept, and can be put back. `duo backups` lists the
rollback points from the command line; the app exposes the same thing.

## Restart detection

If an app was updated on disk but is still running an older build — compared via
LaunchServices, not guessed — it is surfaced with a **Restart** action rather
than being reported as up to date. The version on disk and the version running
are two different facts, and the row tells you which one is stale.
