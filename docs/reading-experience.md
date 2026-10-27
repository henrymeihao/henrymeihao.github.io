# Reading experience — 2026-10-28

The owner approved proposal items 1 and 3: preserve reading position, highlight the currently read article, and connect related writing. Keep the existing full-text feed and minimal visual language.

Implementation and acceptance:
- Add a home-only reading script. Track the article crossing a 100px reading line and mark its sidebar link aria-current=location. Keep direct article navigation.
- Save article slug, paragraph index, viewport offset and fallback scroll position in the history entry and session storage. Restore on pageshow, including browser Back and sidebar Home. Explicit fragment links take precedence. Storage errors must not break reading.
- Add curated relationships in content/related.json. Resolve only published posts, exclude self and duplicates, limit to three. With two published articles show one counterpart and a short connection sentence. Render at the end of both feed articles and dedicated pages; no card backgrounds.
- Verify browser Back, sidebar Home, reload, hash links, narrow screens, blocked storage and dynamic highlighting. Check related routes, dark mode and screenshots. Run existing search regression and content tests, build, then deploy and repeat browser checks against production.
