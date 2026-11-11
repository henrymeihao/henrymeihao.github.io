---
time: 2026-11-11T10:10+08:00
kind: decision
paths: [scripts/content.mjs, scripts/templates.mjs, src/assets/style.css, tests/content.test.mjs, tests/templates.test.mjs, content/posts/, docs/implementation.md]
relates: [20261031-0330-page-level-seo]
---

# 长文目录、补齐摘要、文末引导

## 触发
用户回复优化建议：「文章末尾引导下一步可以」「补摘要并提交搜索引擎——可以」「长文目录——可以」。

## 决定
- 渲染时给每个二级标题加 `section-N` 编号 id；小节数不少于 4 的文章在标题下显示目录（当前 7 篇）。
- 文末在复制链接按钮之后加一行 RSS 订阅和留言引导。订阅渠道暂时只有 RSS，用户以后定了邮件或公众号再加。
- 16 篇缺 summary 的文章由 Codex 根据正文写了一句摘要，用户可直接改 front matter。

## 放弃的备选
- 用标题文字生成 id：中文会变成百分号编码，链接难读，改标题还会让旧链接失效（编号 id 只在插入或删除小节时变）。
- 侧边悬浮目录：正文区只有 800px 宽，右侧没有空间，手机上也放不下。
- 所有文章都显示目录：短文只有一两节，目录比内容还占地方。

## 后果与验证
- 在文章中间插入新的二级标题，后面小节的 id 会顺延，别人分享的小节链接会跳错位置。
- npm test 检查 id 生成、目录门槛和文末引导；本地预览确认目录点击后小节标题停在工具栏下方。
