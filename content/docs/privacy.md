<!-- title: Privacy | summary: No telemetry, no analytics, no server — and the four cases that read outside our own container. | order: 4 -->

There is no telemetry, no analytics SDK, and no server of ours. Every network
request goes straight to the vendor whose app is being checked — or to
`api.github.com`, `formulae.brew.sh`, and `xcodereleases.com` (the
community-maintained index Xcode versions are read from) — and carries nothing
about you beyond
what that request needs: the app's own version, so that a vendor's feed can
answer for the right channel.

Four things are worth calling out explicitly, because they involve reading
outside our own container.

**CleanShot X.** If it is installed, its `activationKey` is read from its
preferences and used to request the personalised appcast that CleanShot's own
updater uses. Without the key, CleanShot's feed reports the trial channel and you
would be told about updates you cannot install. The key is sent only to
`legit.maketheweb.io`, is never written to a log, and is excluded from the HTTP
disk cache.

**TablePlus.** Its `IsReceiveBetaBuild` preference is read, so that detection
runs on the same channel the app itself is set to.

**GitHub.** To raise the API rate limit from 60 requests an hour to 5,000, a
token is taken from `GITHUB_TOKEN` / `GH_TOKEN`, or failing that from
`gh auth token`. It is sent only to `api.github.com`, and is stripped from any
redirect that leaves that host.

**Your App Store sign-in.** Whenever TestFlight's data is read, the system
accounts database is read for one thing: whether the active App Store account's
media types include the App Store. It decides whether a TestFlight beta can be
offered to you right now, and keeps the refresh button from starting TestFlight
just to ask you to sign in. Nothing else is read from it — no Apple ID, no name,
no identifier — and nothing read there leaves the Mac.

## Your Apple Developer sign-in (Xcode)

Xcode betas and release candidates download only from Apple's developer site,
behind your Apple ID. If you choose to sign in under Settings → Xcode, the
sign-in happens on Apple's own page inside the app: your password and
two-factor code go to Apple, and the app does not read them. What the app keeps
is the resulting session — the `apple.com` cookies Apple set — saved in the
Keychain so a relaunch does not sign you out. They are sent only to
`*.apple.com`, only to download Xcode, and never written to a log. Settings →
Xcode → Sign Out and Clear deletes them, together with the "trusted device"
cookie, so the next sign-in asks for a code again.

## Credentials stay in the Keychain

Anything you enter yourself — a GitHub token, an Alcove licence, the Apple
Developer session above — is stored in
the login Keychain as `AfterFirstUnlockThisDeviceOnly`. Not synced to iCloud, not
written to a plist.

## Vendor pages do not leave cookies behind

Release notes that can only be shown as the vendor's own web page are rendered in
a `WKWebView` with a non-persistent data store, so vendor cookies do not survive
a relaunch. The one exception is the Apple
Developer sign-in window, which keeps its session on purpose, as described above.

## This website

Everything above is about the app. This page you are reading is a separate thing,
and it does collect something, so it is worth stating plainly rather than leaving
you to infer it from the app's behaviour.

The site runs two scripts, both from Vercel, both first-party.

**Vercel Web Analytics** counts page views. Per Vercel's own documentation it
records, for each view: the time, the URL and its route pattern, the referrer,
filtered query parameters, an approximate location (country, region, city), the
browser and operating system with versions, and the device type.

**Vercel Speed Insights** measures how fast the page actually loaded for you.
Per Vercel's own documentation each measurement carries: the URL and its route
pattern, the Web Vital being reported and the element it was attributed to (a CSS
selector such as `html>body img.header`), the connection class (`4g`, `3g`, …),
the browser, device type and device OS, the country as a two-letter code, the
version of the measuring package, and the time the event was received. Note the
narrower location: country only, where Analytics goes down to city.

What neither does: there are no third-party cookies. Analytics identifies a
visitor by a hash derived from the incoming request rather than by anything
stored on your machine, and discards that identity after 24 hours — so it cannot
follow you across sites, and it cannot reconstruct what you did here a week ago.
Speed Insights has no visitor identity at all; Vercel states it does not collect
or store anything that would let a browsing session be reconstructed across
pages, and that neither feature ties its data points to an IP address.

There is nothing else. No advertising network, no session recording, no
third-party scripts of any kind. The download button links straight to GitHub,
and the release notes come from a file in this site's own repository.

If you would rather not be measured, any content blocker will drop both scripts,
and the site works exactly the same without them.
