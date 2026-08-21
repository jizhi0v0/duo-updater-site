<!-- title: How it works | summary: Where each version number comes from, and why the install route differs per app. | order: 1 -->

Duo Updater scans `/Applications`, `/Applications/Utilities` and `~/Applications`,
then checks what it found against several update sources, in priority order:

1. **Mac App Store** — Apple's iTunes lookup API, with storefront and region
   awareness. Only native `mac-software` results are trusted; iOS-on-Mac apps are
   skipped, because their version numbers move independently and would otherwise
   show up as updates that can never be installed.
2. **Sparkle** — the app's own `SUFeedURL` appcast, which is the same feed the
   app's built-in updater reads.
3. **Homebrew Cask** — matched by `.app` filename, falling back to bundle id, so
   casks that install a `pkg` rather than an app bundle are still found.
4. **Per-app recipes** — for vendors that publish neither a feed nor a store
   listing, a hand-written rule against that vendor's own endpoint.

## It updates each app the way that app expects

Most updaters pick one mechanism and push every app through it. This one uses
whatever the app already ships with, which is why the button does something
different depending on the row:

| Channel | What happens when you press Update |
| --- | --- |
| Sparkle | Download, verify (EdDSA signature, Developer ID, Team ID), swap the bundle, relaunch |
| Mac App Store | Install through the store, or open its page when that is the only route available |
| Self-updating (Electron, Squirrel) | Open the app and let its own updater do the work |
| Homebrew app cask | `brew install --cask --force` |
| Homebrew `pkg` cask | Download the official package and open the system installer |

When an app ships its own updater, Duo Updater hands over instead of fighting it.
When it cannot do something safely, it says so on the row rather than guessing.

## Command-line tools and fonts

A single row at the bottom of the list covers everything Homebrew installs that
**is not an app**: command-line formulae, and casks that install no `.app` at all
— a CLI, a font, a driver. None of those need a per-app decision, and they have
no bundle to scan, so without that row they would be invisible entirely.

A cask that *does* install an app gets an ordinary row like anything else, and is
never touched by the upgrade in that bottom row, so nothing is counted twice.
