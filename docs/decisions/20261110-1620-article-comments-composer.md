---
time: 2026-11-10T16:20+08:00
kind: revision
paths: [scripts/templates.mjs, src/assets/app.js, src/assets/style.css, tests/templates.test.mjs, supabase/comments.sql, README.md, docs/implementation.md]
relates: [20261110-1600-supabase-guestbook]
---

# 每篇文章加评论区，输入框改为仿 Claude 消息框

## 触发
用户说「每个文章的下面也想要加类似的评论板块」，随后附两张 Claude 输入框截图问「ui能不能仿照这种」。

## 决定
- 留言板和文章评论共用一张表：`guestbook_messages` 改名为 `comments`，加 `page` 列（`/about/` 或 `/writing/<slug>/`，旧留言迁为 `/about/`），写入函数改为 `post_comment(page, name, content)`，旧的 `post_guestbook_message` 删除。已在线上项目用一次性迁移 SQL 完成，`supabase/guestbook.sql` 改写为描述当前结构的 `supabase/comments.sql`。
- 每个 IP 的限额改为 10 分钟全站 5 条（原来只有留言板时是 3 条），因为读者可能连着评论几篇文章。
- 评论区放在文章 `<article>` 之后、「接着读」下面，避免评论变多时把相关阅读推远。
- 两处共用一个输入框组件：圆角大框、无边框自动增高的文本框，底栏放选填名字、状态文字和橙色圆角发送按钮；内容为空时按钮禁用。电脑上 Enter 发送、Shift + Enter 换行；触屏设备 Enter 保留换行。

## 放弃的备选
- 为文章评论另建一张表：要重复一套权限、限流和管理入口。
- 保留表名 guestbook_messages：存文章评论后名字不再准确。
- 照搬截图里的加号、模型选择和语音按钮：留言没有附件和模型可选，放了只是摆设。

## 后果与验证
- 迁移到新版网页部署完成之间，线上留言板读不到数据、整块隐藏约一分钟；当时没有留言。
- 文章 slug 改名后旧评论不会跟随，需要手动改 `page`。
- curl 验证 `ip_hash` 仍读不到、非法 page 被拒、旧函数已不存在；本地预览在文章页发送多行评论成功、输入框随内容增高、发送后清空，关于页留言板为空状态，手机宽度布局正常；测试评论已删除。npm test 检查两处评论区的 page 和位置。
