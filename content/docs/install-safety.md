<!-- title: Install safety | summary: What is checked before an app is replaced, and what is deliberately never done. | order: 2 -->

Owning the install is what makes these checks possible. Every one of them is a
thing that can go wrong when software replaces other software on your Mac.

## It never force-quits a running app

When an update needs the app restarted to take effect, the quit is a plain
`terminate()` — the app runs its own save prompts and can refuse. An app that
refuses is left running and keeps a **Restart** button, so unsaved work is never
at risk from a forced exit.

Worth knowing: the restart happens *after* the new version is already on disk. So
if you decline the quit, you have an updated bundle sitting beside a process
still running the old code, until you relaunch it yourself. That is what the
Restart button on the row means.

## Signatures are checked against the app being replaced

Where a feed provides an EdDSA signature, it is verified. Then, regardless of
source, the downloaded bundle's Developer ID signature, Team ID and bundle
identifier all have to match the app it is about to replace. A download that
resolves to a different developer is refused, not installed.

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
