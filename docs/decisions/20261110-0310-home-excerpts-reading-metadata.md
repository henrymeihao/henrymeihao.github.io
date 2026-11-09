---
time: 2026-11-10T03:10+08:00
kind: reversal
paths: [scripts/content.mjs, scripts/templates.mjs, src/assets/style.css, tests/content.test.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261028-1502-home-feed-limit-no-infinite-scroll, 20261028-1502-full-text-rss-and-home-semantics, 20261028-1230-large-title-with-collapsing-bar]
---

# 首页显示节选，标题下增加字数与预计阅读时间

## 触发
用户说「我现在文章太长了，可能影响体验」，要求「1.写出多少字、预计阅读时间 2.主页的文章就截取一部分，不能全放」。

## 决定
- 首页保留最新 20 篇、时间排序和既有侧栏，每篇显示正文开头最多约 260 字符的纯文本节选，尽量在句末结束，附「阅读全文」链接。
- 节选由正文生成，和用于搜索、分享的 summary 分开；不在首页嵌入全文后用 CSS 隐藏，也不截断 HTML，以免破坏标签。首页不展示正文图片及代码块样式。
- 首页及独立文章页标题下统一显示日期、字数、预计阅读时间。每个汉字、其他语言的单词或数字串分别计一个单位，忽略标点、空白和 HTML 标签；按每分钟约 450 字向上取整，至少 1 分钟。
- 文章源稿、独立文章页全文、RSS 全文、全文搜索保持原有用途；样式缓存版本更新。
- 本条替换旧记录中的首页全文展示要求，其余导航、上限和 RSS 约定继续有效。当前行为归属为 docs/implementation.md 对应章节。

## 放弃的备选
- 直接显示 summary：通常只有一句介绍，不能满足截取正文一部分的要求。
- CSS 限高隐藏全文：仍需下载全部正文与媒体，页面体积未降低，而且可能保留看不到的可聚焦链接。

## 后果与验证
- 首页适合浏览选文，连续阅读全文需要进入文章页；阅读时间只是文本长度估算，不包含观看视频或操作演示的时间。
- npm test 覆盖混合语言计数、节选长度、转义、全文入口及独立页全文保留；npm run build 生成全站；npm run preview 检查桌面和手机宽度下的首页与文章页。
