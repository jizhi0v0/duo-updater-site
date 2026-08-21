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
