# Blog relaunch — 2026-10-27

## Scope
Rebuild the existing public blog at https://mbr000.github.io/. Remove the six legacy articles and old theme assets from the current checkout, retaining Git history. Do not import or publish private Obsidian files. New articles are selected separately by the owner.

## Design
Personal editorial site: warm paper background, generous typography, orange accent, an abstract orbital illustration, article index, and a concise about page. Responsive at 375–1440 px. Dark mode respects the system and remembers explicit selection. Motion respects reduced-motion settings. Empty article collection is presented honestly without invented writing, dates, or metrics.

## Architecture
Node build script reads explicitly published Markdown from content/posts. Static HTML provides reading and navigation without JavaScript. Progressive JavaScript adds theme selection and article search. Existing GitHub Pages main/root publishing is retained. Generated paths are limited to index.html, writing/, about/, assets/, 404.html, feed.xml, sitemap.xml, robots.txt and .nojekyll. No external fonts, tracking or remote runtime dependencies.

## Implementation and validation
- [x] Test publication boundaries, unsafe slugs, duplicate URLs, dates and HTML sanitization.
- [x] Implement Markdown rendering, page templates, styling, and optional browser interactions.
- [x] Remove explicitly authorized legacy files; build the replacement in the repository root.
- [x] Check desktop/mobile rendering, theme, no-JavaScript navigation, empty search and sample article flow.
- [ ] Commit and push to main; verify GitHub Pages build and the live homepage.

## Maintenance
Add a Markdown file with title/date/slug/summary/tags/published frontmatter. Only published: true is eligible. Build, test, commit and push source plus generated output. Never commit private drafts to this public repository; use the Obsidian vault for drafts.
