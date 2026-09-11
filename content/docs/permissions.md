<!-- title: Permissions | summary: What macOS will ask for, what each one buys, and what you lose by declining. | order: 3 -->

macOS asks for some permissions the first time they are needed, and for one of
them it never asks at all. **Nothing here is required to see your apps** — the
list, the version checks and the release notes all work with everything denied.
What follows is what each permission buys, which of your apps it matters for, and
the cost of going without. The Full Disk Access and Automation sections were
measured on macOS 27 with an app that had been granted nothing.

## Full Disk Access — only for TestFlight betas and CotEditor

macOS never asks for this one: you add DuoUpdater yourself in **System Settings →
Privacy & Security → Full Disk Access**. Because the app is signed with a stable
identity, the grant survives every future update. It matters only if you have one
of these:

- **A beta installed from TestFlight.** DuoUpdater reads the builds TestFlight
  offers you from TestFlight's own records. Without it the beta is still
  recognized, but its row shows a question mark instead of the latest build.
- **CotEditor.** It keeps its update channel inside its sandbox container.
  Without it, CotEditor is checked against its stable releases even if you asked
  it for prereleases; a prerelease you already run is still recognized from its
  version.

Nothing else DuoUpdater looks at needs it. The release channel of Fork,
TablePlus, OrbStack, IINA, Tailscale, CleanShot and the other apps it knows, your
App Store storefront, and files under Application Support are all read without
it.

Without Full Disk Access, DuoUpdater doesn't attempt those two reads at all —
every attempt would be refused, and on macOS 27 a refused TestFlight read posts a
"Data Access Blocked" notice. If you do have a TestFlight beta or CotEditor,
opening the menu explains what the permission is for and where to grant it: once,
and once more only if another such app turns up. The welcome window and
**Settings → Diagnostics** always show whether it's granted, with a button that
opens the right place in System Settings. Tapping the question mark on a
TestFlight row says why it's there, and offers the same button when a missing
grant is the reason. A stable CotEditor carries a small lock beside its name
that does the same.

## App Management — required to install anything

Replacing an app in `/Applications` that some other installer put there is gated
on this, and macOS provides no API to request it in advance, so the first install
triggers the system prompt. Deny it and detection still works; installs fail, and
DuoUpdater opens the setting for you.

## Notifications — entirely optional

Asked for at launch, only for telling you updates were found and for the Dock
badge count. Note the badge needs the **Badges** switch specifically, not just
alerts — with Badges off the count is silently dropped even though notifications
appear.

## Background helper — for App Store updates

App Store updates run through a background item that macOS asks you to approve
once, under **Login Items & Extensions**. Without it, App Store updates fail and
DuoUpdater tells you where to switch it on.

## Accessibility — not needed by default

Used if you switch App Store installs to the GUI route in Settings, and to close
Installer's window after a package update; without it that window stays open for
you to close. The default App Store route uses a full download and asks for
nothing extra.

## Automation — not requested

Quitting and relaunching an app after updating it does not ask for it.
