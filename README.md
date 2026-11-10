# MEIHAO · 个人博客

线上地址：https://henrymeihao.github.io/

静态个人博客，Node.js 构建，GitHub Pages 从 `main` 分支根目录发布。无第三方字体。访问统计用 GoatCounter 和 Cloudflare Web Analytics，见下文「访问统计」。旧文章已从当前网站移除，可通过 Git 历史恢复。

## 发一篇文章

私密草稿继续放在 Obsidian。**这是公开仓库，不要把私人内容作为草稿提交到这里**，`published: false` 只是不生成网页，不能隐藏 GitHub 中的源文件。

1. 选好要公开的文章后，放入 `content/posts/英文短名.md`。
2. 添加以下开头，正文使用普通 Markdown：

```markdown
---
title: 你的文章标题
date: 2026-10-27
time: "15:30"
slug: your-article-slug
category: 工作
summary: 用一两句话介绍这篇文章。
tags: [AI, 产品]
published: true
---

这里写正文。
```

`summary` 会作为搜索引擎和分享卡片里的描述，建议每篇都写；不写时取正文开头一段（120 字内，在句号处截断）。`slug` 只能用小写英文字母、数字和连字符。`category` 决定文章在侧栏哪个文件夹里，必须是 `实践`、`行业`、`工作`、`社会`、`生活`、`文化` 之一，不填或填错会构建失败；要增减文件夹，改 `scripts/content.mjs` 里的 `categories`。文章发布后尽量保留 slug，避免链接变化。日期填写实际发布日期。同一天发布多篇时，用可选的 `time: "HH:MM"` 写上发布时间，晚发的排在前面；不写按 00:00 算，时间相同再按 slug 排序。只有 `published: true` 的文章会生成；首页按日期倒序展示最新 20 篇文章的开头节选（最多约 260 字符，尽量在句末截断），点击「阅读全文」进入文章页（上限是 `scripts/templates.mjs` 里的 `site.homeLimit`，更早的文章从侧栏、搜索和 `/writing/` 进入）。首页和文章页的标题下显示字数和预计阅读时间：中文单字、英文单词及数字串各计一个单位，不计标点和空白，按每分钟约 450 字估算，至少 1 分钟。文章标题在滚动时吸顶，由下一篇自然接替。左上角按钮展开文章、关于和主题切换侧栏。

3. 在仓库目录执行：

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

浏览 `http://127.0.0.1:4173` 检查后停止预览。提交文章和重新生成的页面，再推送到 `main`：

```powershell
git status --short
git add content/posts index.html writing about assets 404.html feed.xml sitemap.xml robots.txt search.json
git commit -m "Publish new writing"
git push origin main
```

GitHub Pages 会自动发布这次提交。修改文章后也需要重新 build。删除文章源文件后重新 build，会同时移除旧文章页面。

## 修改样式和介绍

- `src/assets/style.css`：主题与响应式样式。
- `src/assets/app.js`：主题切换、文章搜索（正文索引在构建生成的 `search.json`，首次打开搜索时加载）。
- `src/assets/og-cover.png`：分享卡片封面图（1200×630）。
- `scripts/templates.mjs`：页面布局、首页与关于页文字。
- `scripts/content.mjs`：文章读取和校验。
- `scripts/build.mjs`：生成页面与 RSS。

改完后运行 `npm.cmd test` 和 `npm.cmd run build`，将源码与生成页面一起提交。不要只改根目录的生成文件，下次构建会覆盖它。

生成器只清理 `writing/`、`about/`、`assets/` 三个输出目录；不要在这些目录保存源稿。

## 访问统计

统计配置在 `scripts/templates.mjs` 的 `site.analytics`：

- `goatcounter`：GoatCounter 站点代码（`代码.goatcounter.com` 里的“代码”）。填写后每个页面加载 GoatCounter 计数脚本，脚注显示「© 年份 Henry Mei · All rights reserved · N visits」，名字链接到 GitHub，N 是全站总访问数（GoatCounter 的 visits：同一人 8 小时内重复打开同一页只算一次），来自 `https://代码.goatcounter.com/counter/TOTAL.json`。GoatCounter 的 Settings 里要勾选 “Allow adding visitor counts on your website”，否则取不到数字，脚注只显示版权。总数最多缓存 4 小时，新访问不会立刻体现。
- `cloudflareToken`：Cloudflare Web Analytics 的站点 token（JS snippet 里 `data-cf-beacon` 的 `token`）。填写后加载 Cloudflare 统计脚本，数据只在 Cloudflare 控制台查看。

留空的服务不会出现在页面里。本地预览（127.0.0.1）不计入 GoatCounter。

GoatCounter 的计数脚本放在本站 `src/assets/goatcounter-count.js`，是官方 `count.js` 在 commit 478f026 时的原样副本，因为官方脚本地址 `gc.zgo.at` 在国内网络下打不开。升级时从 GoatCounter 仓库重新复制，并同步改 `scripts/templates.mjs` 里的 `?v=`。

## 留言板

关于页底部是留言板，侧栏「留言板」链接到 `/about/#guestbook`。留言存在 Supabase 项目 henrymeihao-blog，地址和公开的 publishable key 在 `scripts/templates.mjs` 的 `site.guestbook`；两项留空就不显示留言板和侧栏入口。数据库结构、权限和限流写在 `supabase/guestbook.sql`，在 Supabase SQL Editor 运行一次即可重建。

- 隐藏一条留言：Supabase 控制台 → Table Editor → `guestbook_messages`，把那一行的 `hidden` 改成 `true`。
- 限制：内容最多 500 字，名字最多 24 字；同一 IP 10 分钟最多 3 条，全站 1 分钟最多 20 条。
- Supabase 免费项目连续一周没有请求会被暂停，暂停后留言板不显示，需要到控制台恢复。

## 阅读界面

侧栏逐篇列出文章，点击进入独立文章页，不使用首页锚点。桌面端记住侧栏的展开状态，手机端默认收起。独立文章页顶部固定标题栏，下拉可切换文章；正文底部可复制文章链接。首页显示文章节选；文章页和 RSS 保留全文。
