---
time: 2026-11-16T11:30+08:00
kind: reversal
paths: [src/assets/app.js, src/assets/style.css, scripts/templates.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261031-0330-page-level-seo]
---

# /writing/ 不再一进入就弹出搜索框

## 触发
用户原话：「https://henrymeihao.github.io/writing/ 进入这个页面以后，不要一开始就弹搜索框，搜索按钮也要精致一点」。

## 决定
- 删掉 `app.js` 里 `/writing/` 载入时自动调用 `openSearch()` 的逻辑。页面首先是全部文章列表。
- 页面上的「搜索文章」按钮改成整行搜索框样式：图标、提示文字「搜索标题、正文或标签」、右侧 ⌘ K 键帽（非 Apple 平台显示 Ctrl K，触屏隐藏）。圆角、细环和柔和阴影沿用留言输入框的做法，悬停时加深。
- 搜索仍走同一个弹窗；侧栏「搜索文章」和 ⌘K / Ctrl+K 的行为不变。

## 放弃的备选
- 在页面内直接放一个可输入的搜索框、就地过滤列表：要维护第二套搜索交互，与全站弹窗的全文搜索重复。
- 保留自动弹出、只改按钮样式：用户明确不要一进来就弹。

## 后果与验证
- 从侧栏点「搜索文章」仍会打开弹窗；直接访问或刷新 `/writing/` 不再弹出。
- npm test 检查按钮结构；本地预览（1280px 和 390px）确认进入时弹窗关闭、点击按钮能打开、Esc 能关闭、窄屏不横向溢出。
