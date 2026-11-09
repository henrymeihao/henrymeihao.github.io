---
time: 2026-11-09T16:19+08:00
kind: reversal
paths: [src/assets/style.css, scripts/templates.mjs, docs/implementation.md, content/posts/drawing-interstellar-in-javascript.md]
relates: [20261028-1230-large-title-with-collapsing-bar]
---

# 文章内的小标题改为粗体无衬线、分两级字号

## 触发
用户预览新文章时说："该写标题的要写标题，现在读起来没有主次"，随后催促"快一点"。当时 `.prose h1–h6` 都是 `font:inherit`，计算样式与正文相同（18px、400），小标题和段落看不出区别。

## 决定
- 文章内 `h2` 改为 600 22px 无衬线（手机 20px），`h3` 改为 600 18px 无衬线（手机 17px），更深的层级只加粗。
- 首页信息流里标题会整体下移一级，所以 `.flow-article .prose h3/h4` 套用 h2/h3 的样式，同一篇文章在首页和文章页看起来一致。
- 新文章《不用生成模型，我用 JavaScript 画了一段〈星际穿越〉》的分节改用 `###` 小标题（原来是段首加粗）。
- `style.css` 版本号改为 `20261109-1`。

## 放弃的备选
- 只在这篇文章里把段首加粗改成更多加粗：标题仍和正文同字号，用户说的"没有主次"不会解决。
- 只给这篇文章加单独样式：同样的问题在另外 11 篇用了 `##` 的文章里也存在，单独处理会让全站标题不一致。
- 用衬线体做标题：和正文同一字体，只靠字号拉开层级，区分度不如无衬线；无衬线也和文章大标题、关于页 h2 一致。

## 后果
- 推翻了 docs/implementation.md 2026-10-28 一节"headings stay uniform body typography"的做法。12 篇带小标题的旧文章外观一起变化，没有改它们的正文。
- 以后如果觉得标题太抢眼，应先调字号和字重，而不是回到与正文完全相同。
