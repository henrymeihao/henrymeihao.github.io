---
time: 2026-10-28T15:02+08:00
kind: decision
paths: [scripts/feed.mjs, scripts/build.mjs, scripts/templates.mjs, tests/feed.test.mjs, tests/templates.test.mjs]
---

# RSS 输出全文并在侧栏放可见入口，首页标题层级和 <title> 修正

## 触发
用户原话："首页标题层级、首页title、rss可以改"，以及"但我好像也没有rss"。站点其实已有 `/feed.xml`，但只含摘要，页面上也没有可见入口。

## 决定
- 新增 `scripts/feed.mjs`，RSS 每篇带 `content:encoded` 全文（CDATA，文中的 `]]>` 拆开，相对链接补成绝对地址），频道名统一为「Meihao 的文章」。侧栏底部加「RSS」链接。
- 首页文章内部的标题整体下移一级（h2→h3），首页只有文章标题是 h2。
- 首页 `<title>` 和 og:title 改为「Meihao · 关于 AI、产品与生活的个人写作」，其他页面保持「标题 · Meihao」。

## 放弃的备选
- RSS 仍只放摘要：订阅阅读器里要点回网站才能读，对想订阅的同行不友好。
- 在 `build.mjs` 里继续内联拼 RSS：无法给 CDATA 和链接处理写测试。
- 只改首页 `<title>`、不改 og:title：分享时仍显示「阅读全部 · Meihao」。

## 后果
- feed.xml 变大（7 篇约 28KB，压缩后约 12KB），篇数增长后会线性变大。
- 文章里若出现站内相对链接，RSS 会把它们改成 `https://mbr000.github.io/…`。
