---
time: 2026-11-16T11:30+08:00
kind: decision
paths: [scripts/templates.mjs, scripts/build.mjs, scripts/feed.mjs, src/assets/app.js, src/assets/style.css, supabase/comments.sql, tests/templates.test.mjs, tests/comments.test.mjs, README.md, AGENTS.md, docs/implementation.md]
relates: [20261110-1600-supabase-guestbook, 20261110-1620-article-comments-composer, 20261113-0154-comment-loading-failure]
---

# 留言板改为独立页面，并汇集全站留言

## 触发
用户原话：「留言板新开个页面，点击以后进去。所有各个地方的留言，包括关于、文章下的，都在这里表明来源集中展示」。

## 决定
- 新增 `/guestbook/` 页面，侧栏「留言板」改为链接到这里。页面有自己的输入框，留言存为 `page = '/guestbook/'`。
- 页面下方读取全站未隐藏留言（不按 page 过滤，最新 100 条），每条右侧显示来源：「留言板」「关于」或《文章标题》，后两者链接到对应页面的 `#comments`。来源名称在构建时由文章列表生成，嵌在页面里；找不到的 page 显示「已下线的文章」。
- 关于页保留留言区，标题改为「留言」，id 改为 `comments`（与文章页一致），并提示留言会汇集到留言板。文章页留言区不变。
- 线上数据库已在 SQL Editor 跑过一次性迁移：`comments.page` 的 check 约束和 `post_comment` 的校验都放行 `/guestbook/`。`supabase/comments.sql` 同步改成当前结构。
- sitemap 加入 `/guestbook/`（不带 lastmod）；构建清理并生成 `guestbook/` 目录。

## 放弃的备选
- 把关于页的留言板整体搬到新页面、继续用 `/about/` 作为存储键：不用改数据库，但存储键和页面对不上；用户也把「关于」列为一个独立来源。
- 新页面只汇总、不能留言：「留言板」就不能留言了。
- 汇总页做分页或按来源筛选：目前留言很少，先不做；超过 100 条后最早的留言只在原页面能看到。

## 后果与验证
- 旧链接 `/about/#guestbook` 仍能打开关于页，只是不再定位到留言区。
- 迁移前用 publishable key 调 `post_comment('/guestbook/', '', '')` 返回 `bad_page`；迁移后返回 `empty`，`/nope/` 仍返回 `bad_page`，内容和名字长度约束保留。没有发布测试留言。
- npm test 覆盖三处留言区的模板、汇总页请求不带 page 过滤、来源标签与链接、新发留言标为「留言板」。本地预览用注入的假数据检查了 1280px 和 390px 下来源标签的截断和不溢出；关于页从线上 Supabase 读取正常。
