# Blog relaunch — 2026-10-27

## Claude-style reading layout — 2026-10-28
Latest owner objective supersedes anchor navigation: every sidebar article link opens its dedicated /writing/slug/ route, and the current route alone controls article highlighting. Desktop sidebar starts open and remembers user preference across page navigation; mobile starts closed. Sidebar uses a serif wordmark, compact icon navigation, collapsible scrollable article list and neutral selected row. Right reading panel uses a white background, article-only fixed-height sticky title toolbar with a functional article switcher and centered serif article text, without a duplicate title bubble. Homepage still shows the full chronological article stream. Test reference: .qa/claude-check.mjs verifies real navigations, persistence, push animation, toolbar, copy/share, mobile and long-list behavior; local screenshots compare against the owner's attachment.

## Push sidebar refinement — 2026-10-28
Desktop (>760px): a 280px sidebar slides in while the reading frame's left margin transitions with the same 360ms easing. No backdrop, scroll lock, or inert reading pane on desktop. Mobile keeps modal navigation. All pages include Home/About plus a scrollable chronological article directory pointing into the homepage stream. Active article follows scrolling. Reduced-motion users get immediate state changes. Native details remains as the no-JavaScript fallback; enhanced state keeps its content rendered for closing animations.

## Full-text stream revision — 2026-10-28
Latest owner request supersedes the list-only revision: homepage displays complete article bodies in date order. Each title uses CSS sticky within its own article so the next article takes over. Neutral off-white background, charcoal text, muted brown links reference the provided Codex screenshots. Top-left native details control opens Articles/About sidebar; enhanced JavaScript handles Escape, backdrop close, focus containment and inert background. Existing direct article links, RSS and publication boundaries remain intact.

## Current design revision — 2026-10-28
The owner requested a minimal top-to-bottom article list and a muted Monet-inspired palette, with Kimi's clean interface as a reference. This supersedes the original editorial design below: remove hero, orbit illustration, topic strip, article numbering and promotional copy; show every published article on the homepage as title, summary and date. Use pale sage, mist blue and muted lilac backgrounds, charcoal text and a narrow single-column reading width. Retain small navigation, theme control, RSS, and Markdown publishing. New articles still await owner selection.

## Scope
Rebuild the existing public blog at https://mbr000.github.io/. Remove the six legacy articles and old theme assets from the current checkout, retaining Git history. Do not import or publish private Obsidian files. New articles are selected separately by the owner.

## Design
Personal editorial site: warm paper background, generous typography, orange accent, an abstract orbital illustration, article index, and a concise about page. Responsive at 375–1440 px. Dark mode respects the system and remembers explicit selection. Motion respects reduced-motion settings. Empty article collection is presented honestly without invented writing, dates, or metrics.

## Architecture
Node build script reads explicitly published Markdown from content/posts. Static HTML provides reading and navigation without JavaScript. Progressive JavaScript adds theme selection and article search. Existing GitHub Pages main/root publishing is retained. Generated paths are limited to index.html, writing/, about/, assets/, 404.html, feed.xml, sitemap.xml, robots.txt. No external fonts, tracking or remote runtime dependencies.

## Implementation and validation
- [x] Test publication boundaries, unsafe slugs, duplicate URLs, dates and HTML sanitization.
- [x] Implement Markdown rendering, page templates, styling, and optional browser interactions.
- [x] Remove explicitly authorized legacy files; build the replacement in the repository root.
- [x] Check desktop/mobile rendering, theme, no-JavaScript navigation, empty search and sample article flow.
- [ ] Commit and push to main; verify GitHub Pages build and the live homepage.

## Maintenance
Add a Markdown file with title/date/slug/summary/tags/published frontmatter. Only published: true is eligible. Build, test, commit and push source plus generated output. Never commit private drafts to this public repository; use the Obsidian vault for drafts.

Search opens an in-place native dialog from every sidebar, with compact article results, title and body matching, keyboard selection and focus restoration. Non-article pages have no page toolbar. The /writing/ route retains a compact no-JavaScript fallback list. Verification: .qa/search-check.mjs covers desktop/mobile layouts, routes, modal search, keyboard actions and fallback navigation.

## Claude measured-token alignment — 2026-10-28
Values were read from the owner's logged-in claude.ai chat (light theme) and the login page, not estimated from screenshots. Applied: sidebar #fafafa and 288px wide; 32px rows with 8px radius and 14px labels; selected row rgba(0,0,0,.1); hairlines rgba(0,0,0,.1); text rgba(0,0,0,.9); muted rgba(0,0,0,.6) (Claude uses .467, raised here for contrast); minimum UI text 12px; accent clay #d97757 for focus and favicon; link/hover #c6613f (Claude brand-emphasized, about 4.0:1 on white, underlined). Dark palette is unchanged apart from the accent, because Claude's dark theme was not measured. Not changed on purpose: article body stays 18px/1.8 serif for long-form reading (Claude chat uses 15px/1.4), toolbar stays 52px (Claude 45px), headings stay uniform body typography.

## Large article title with a collapsed top bar — 2026-10-28
Home feed: each article starts with a 28px (mobile 24px) title and the date. A zero-height sticky wrapper holds a 52px compact bar with the same title (16px, one line, ellipsis). The bar is hidden until the large title has scrolled past the top, then fades in and stays until the article ends, when the next article's bar takes over. Because the wrapper has no height, showing or hiding the bar never moves the text. The bar is aria-hidden and not focusable; the large title is the heading. Article pages show the same large title and date, and the toolbar title (with the article switcher) appears once the large title has scrolled away. Without JavaScript the toolbar title stays visible.
