<!-- title: The duo command | summary: The same engine as a command-line tool, and the two things it refuses to half-do. | order: 5 -->

The same engine has a command line. `duo` links the real `DuoUpdaterCore`, so it
uses the same sources in the same order, the same install policy, and the same
ignore and skip rules as the menu bar — a disagreement between the two is a bug,
not a difference of opinion.

```sh
make cli          # → ~/.local/libexec/duo, symlinked at ~/.local/bin/duo

duo list                     # what's installed, without touching the network
duo check --json             # what has an update, one JSON object per line
duo install Cursor           # apply one, or --all
duo doctor                   # whether this machine can actually install anything
duo backups                  # list rollback points, or put one back
```

`duo check` and `duo list` also take `--source sparkle,github,…` and
`--include-hidden`. `duo ignore` and `duo skip` write the same preferences the
app reads, so hiding something in one hides it in the other.

## Two things it refuses rather than half-doing

**App Store updates.** That route needs either the privileged helper — whose
`SMAppService` registration requires an app bundle — or the Accessibility API
driving App Store.app. A command-line tool has neither, so it says so instead of
failing part-way through.

**Taking the install lock by force.** If the menu-bar app is mid-install, `duo`
exits and names the holder rather than swapping a bundle out from underneath it.

## The maintenance side

`duo verify`, `duo triage` and `duo reconcile` sweep every hand-written recipe
against its live endpoint, ask a model why a broken one broke, and turn the
result into issues. That is what the nightly check runs. They are not needed for
ordinary use.
