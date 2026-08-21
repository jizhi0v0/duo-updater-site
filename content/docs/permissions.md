<!-- title: Permissions | summary: What macOS will ask for, what each one buys, and what you lose by declining. | order: 3 -->

macOS asks for several permissions, usually at the moment they are first needed
and without much explanation. **Nothing here is required to see your apps** — the
list, the version checks and the release notes all work with everything denied.
What follows is what each permission buys, including the cost of saying no.

## Full Disk Access — the one worth granting up front

The prompt reads *"DuoUpdater would like to access data from other apps"*, which
tells you nothing. What it actually covers is reading a handful of other apps'
own preferences and containers, because that is the only place some facts live:

- **Which release channel an app is set to** — CleanShot, TablePlus, Fork, IINA,
  OrbStack, Tailscale. Denied, they are assumed to be on stable, so a beta
  install may be told it is out of date against the stable feed, or the reverse.
- **Whether an app came from TestFlight** rather than the App Store. Denied, a
  TestFlight build can be mistaken for a release build.
- **Your App Store storefront**, used to flag region-locked apps.

Denying it degrades those specific answers **silently** — the app still lists
everything and still installs updates, it is just wrong about those apps. Grant
it once in **System Settings → Privacy & Security → Full Disk Access**. Because
the app is signed with a stable identity, that grant survives every future
update. Without it, the prompt returns on every launch.

## App Management — required to install anything

Replacing an app in `/Applications` that some other installer put there is gated
on this, and macOS provides no API to request it in advance, so the first install
triggers the system prompt. Deny it and detection still works; installs fail.

## Automation — required to relaunch after updating

Needed to quit and relaunch an app so the new version actually takes effect. Deny
it and the update still installs; the row keeps a **Relaunch** button for you to
press yourself.

## Notifications — entirely optional

Only for telling you updates were found, and for the Dock badge count. Note the
badge needs the **Badges** switch specifically, not just alerts — with Badges off
the count is silently dropped even though notifications appear.

## Accessibility — not needed by default

Used only if you switch App Store installs to the GUI route in Settings. The
default route uses a full download and asks for nothing extra.
