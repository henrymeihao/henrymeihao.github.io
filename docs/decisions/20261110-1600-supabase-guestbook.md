---
time: 2026-11-10T16:00+08:00
kind: decision
paths: [scripts/templates.mjs, src/assets/app.js, src/assets/style.css, tests/templates.test.mjs, supabase/guestbook.sql, _config.yml, README.md, docs/implementation.md]
relates: [20261110-1158-goatcounter-cloudflare-analytics]
---

# 关于页底部加 Supabase 留言板

## 触发
用户在讨论文章评论与全站留言后选择「就留言板」，此前同意的位置是关于页底部加侧栏入口；随后在 Supabase 建好账号，说「帮我cdp codex插件操作吧」。

## 决定
- Supabase 项目 henrymeihao-blog（新加坡）存留言，表与函数见 `supabase/guestbook.sql`。网页只用公开的 publishable key：只能读未隐藏留言的四个字段，写入只能调用 `post_guestbook_message`。
- 函数校验内容 1–500 字、名字最多 24 字（空名为「路过的朋友」），同一 IP 10 分钟最多 3 条，全站 1 分钟最多 20 条。IP 只以加随机盐的哈希保存，网页读不到。
- 留言板在关于页正文之后，侧栏主导航加「留言板」链接到 `/about/#guestbook`。没有 JavaScript 或读取失败时整块不显示。只做纯留言，不接 AI 回复和实时推送；发送成功后直接插到列表顶部。
- 管理方式：在 Supabase Table Editor 里把 `hidden` 设为 true 即隐藏一条。

## 放弃的备选
- Edge Function 写入：要部署和维护一份 Deno 代码，数据库函数已能完成校验和限流。
- Giscus：要求评论者有 GitHub 账号。
- 每篇文章下评论：用户选择只做全站留言板。
- 先审核后显示：留言会延迟出现，访客不知道是否发送成功；先直接显示，靠限流和隐藏处理垃圾内容。

## 后果与验证
- 访客浏览器要能访问 hrjwekhotmpiarvkryli.supabase.co；免费项目连续一周没有请求会被 Supabase 暂停，需要到控制台恢复。
- 限流按请求 IP，同一公司或学校出口 IP 的读者共享额度。
- npm test 检查关于页留言区与侧栏入口；curl 验证 publishable key 读不到 ip_hash、不能直接插入、空内容和超频被拒；本地预览在桌面和 390px 宽度下读取、发送成功和超频提示都正常，测试留言已删除。
