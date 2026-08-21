# duo-updater-site

The website for [Duo Updater](https://github.com/jizhi0v0/duo-updater). Next.js
16, App Router, deployed on Vercel.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Content

Two things here are copies, not originals:

- `content/changelog.md` — copied from the app repo's `CHANGELOG.md`, which is
  the single source of truth for release notes.
- `public/screenshots/*.png` — copied from the app repo's `assets/`.

`npm run sync` refreshes both from a sibling `../duo-updater` checkout (override
with `APP_REPO=/path/to/duo-updater`). **Run it after every app release, then
commit what changed.** The copies are deliberate: a deploy should never fail, or
silently ship different prose, because GitHub's raw CDN was lagging.

`content/docs/*.md` are written for this site and have no upstream — each one
opens with an HTML comment carrying its title, summary and sort order.

The download button reads the latest release from the GitHub API at build time
and revalidates hourly; if that call fails it falls back to the releases page, so
the button always works.
