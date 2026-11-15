# Restore original article and render Mermaid

Kind: decision. Paths: scripts/build.mjs, scripts/templates.mjs, scripts/mermaid-browser.mjs, content/posts/chatgpt-codex-shared-work-memory.md.

Trigger: 用户要求“反正就那个文章，复制粘贴上去不就行了”，并指出误加图片和缺失 Mermaid。

Decision: Copy the selected original body verbatim, except its title becomes frontmatter. Preserve both Mermaid blocks and bundle Mermaid locally for diagram rendering on article pages with these blocks. No remote runtime or CDN. Remove the unsolicited workflow picture from this article.

Rejected: replacing diagrams with an unrelated old picture or leaving diagram source visible as code. The original article is the publishing authority.

Verification: compare the whole source body with Obsidian; run tests/build; inspect two rendered SVG diagrams and no article bitmap in browser.
