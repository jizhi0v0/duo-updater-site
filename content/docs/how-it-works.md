<!-- title: How it works | summary: Where each version number comes from, and why the install route differs per app. | order: 1 -->

Duo Updater scans `/Applications`, `/Applications/Utilities` and `~/Applications`,
then checks what it found against several update sources, in priority order. The
first source that recognises an app answers for it; the rest are not consulted.

1. **Mac App Store** — Apple's iTunes lookup API, with storefront and region
   awareness. Only native `mac-software` results are trusted; iOS-on-Mac apps are
   skipped, because their version numbers move independently and would otherwise
   show up as updates that can never be installed.
2. **Xcode Releases** — the Xcode builds that do not come from the App Store:
   every beta and release candidate, matched to the channel you actually have
   installed. A store-installed Xcode is already answered above.
3. **Sparkle** — the app's own `SUFeedURL` appcast, which is the same feed the
   app's built-in updater reads.
4. **Homebrew Cask** — matched by `.app` filename, falling back to bundle id, so
   casks that install a `pkg` rather than an app bundle are still found.
5. **GitHub Releases** — channel-aware matching for apps distributed that way.
   Detection only, unless a per-app rule has named and vetted an installable Mac
   asset for that app.
6. **Alcove** — its authenticated update endpoint, and only if you have entered a
   licence. Without one this source is absent entirely, and Alcove falls through
   to the public vendor probe below.
7. **Vendor probes** — hand-written rules against a vendor's own endpoint, for
   everything that publishes neither a feed nor a store listing.

## Two kinds of app skip that list entirely

An app managed by **JetBrains Toolbox**, and an app installed from
**TestFlight**, are answered before any of the seven above is consulted. Toolbox
and TestFlight each own the update for those apps, and there is no useful second
opinion to be had, so the list never runs for them.

## It updates each app the way that app expects

Most updaters pick one mechanism and push every app through it. This one uses
whatever the app already ships with, which is why the button does something
different depending on the row:

| Channel | What happens when you press Update |
| --- | --- |
| Sparkle | Download, run the checks below, swap the bundle — then quit and reopen the app, unless you have turned that off |
| Mac App Store | A full download through the store. Where that is not possible — the background helper is not approved, or the app is locked to another region — the row hands off to the App Store app instead |
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
