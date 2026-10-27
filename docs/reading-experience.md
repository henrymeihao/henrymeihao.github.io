# Reading experience — 2026-10-28

The owner approved proposal items 1 and 3: preserve reading position, highlight the currently read article, and connect related writing. Keep the existing full-text feed and minimal visual language.

Implementation and acceptance:
- Add a home-only reading script. Track the article crossing a 100px reading line and mark its sidebar link aria-current=location. Keep direct article navigation.
- Save article slug, paragraph index, viewport offset and fallback scroll position in the history entry and session storage. Restore on pageshow, including browser Back and sidebar Home. Explicit fragment links take precedence. Storage errors must not break reading.
- Add curated relationships in content/related.json. Resolve only published posts, exclude self and duplicates, limit to three. With two published articles show one counterpart and a short connection sentence. Render only at the end of dedicated pages; no card backgrounds. Homepage omits related links and standalone-reading footer links. Mobile feed titles are centered before sticking and left aligned when sticky. Recommendation titles and reasons use separate block elements.
- Verify browser Back, sidebar Home, reload, hash links, narrow screens, blocked storage and dynamic highlighting. Check related routes, dark mode and screenshots. Run existing search regression and content tests, build, then deploy and repeat browser checks against production.

Owner revision: navigation now says 阅读全部. The feed does not select individual sidebar articles; only dedicated article routes do. Preserve reading restoration and mobile sticky title handling. Remove the visible RSS sidebar entry.
