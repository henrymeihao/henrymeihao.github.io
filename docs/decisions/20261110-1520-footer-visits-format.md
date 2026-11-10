---
time: 2026-11-10T15:20+08:00
kind: revision
paths: [scripts/templates.mjs, src/assets/app.js, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261110-1158-goatcounter-cloudflare-analytics]
---

# 脚注改为「© 年份 Henry Mei · All rights reserved · N visits」

## 触发
用户给出参考格式「© 2026 JacksonHe04 · All rights reserved · 182 visitors · 548 views」，问能否照改；得知 GoatCounter 只能公开一个数后回复「暂时先只用只用 GoatCounter，展示一个数吧」。

## 决定
脚注名字链接到 https://github.com/henrymeihao，后接 All rights reserved 和 GoatCounter 的全站 visits（1 时写 visit）。数字为零或读取失败时仍只显示版权部分。

## 放弃的备选
- 同时显示 visitors 和 views：GoatCounter 公开计数接口只有 visits；浏览次数要用带 API Key 的接口，Key 会公开在网页里，且该接口每秒限 4 次请求，所有读者共用。
- 用 Supabase 自建两个计数：用户选择暂不接入，留待留言板接入 Supabase 时再议。
- 把 visits 标成 visitors：同一人看三篇文章会算三次，不是访客人数。

## 后果与验证
- 脚注从中文改为英文措辞。npm test 检查脚注结构；本地预览检查数字文字。
