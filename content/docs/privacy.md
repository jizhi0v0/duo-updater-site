<!-- title: Privacy | summary: No telemetry, no analytics, no server — and the three cases that read outside our own container. | order: 4 -->

There is no telemetry, no analytics SDK, and no server of ours. Every network
request goes straight to the vendor whose app is being checked — or to
`api.github.com` and `formulae.brew.sh` — and carries nothing about you beyond
what that request needs: the app's own version, so that a vendor's feed can
answer for the right channel.

Three things are worth calling out explicitly, because they involve reading
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

## Credentials stay in the Keychain

Anything you enter yourself — a GitHub token, an Alcove licence — is stored in
the login Keychain as `AfterFirstUnlockThisDeviceOnly`. Not synced to iCloud, not
written to a plist.

## Vendor pages do not leave cookies behind

Release notes that can only be shown as the vendor's own web page are rendered in
a `WKWebView` with a non-persistent data store, so vendor cookies do not survive
a relaunch.

## This website

Everything above is about the app. This page you are reading is a separate thing,
and it does collect something, so it is worth stating plainly rather than leaving
you to infer it from the app's behaviour.

The site runs **Vercel Web Analytics**, which counts page views. Per Vercel's own
documentation it records, for each view: the time, the URL and its route pattern,
the referrer, filtered query parameters, an approximate location (country, region,
city), the browser and operating system with versions, and the device type.

What it does not do: there are no third-party cookies. A visitor is identified by
a hash derived from the incoming request rather than by anything stored on your
machine, and that identity is discarded after 24 hours — so it cannot follow you
across sites, and it cannot reconstruct what you did here a week ago. Vercel
states the data points are not tied to an IP address.

There is nothing else. No advertising network, no session recording, no
third-party scripts of any kind. The download button links straight to GitHub,
and the release notes come from a file in this site's own repository.

If you would rather not be counted, any content blocker will drop the script, and
the site works exactly the same without it.
