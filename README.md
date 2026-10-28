# MEIHAO · 个人博客

线上地址：https://mbr000.github.io/

静态个人博客，Node.js 构建，GitHub Pages 从 `main` 分支根目录发布。无第三方字体、无追踪脚本。旧文章已从当前网站移除，可通过 Git 历史恢复。

## 发一篇文章

私密草稿继续放在 Obsidian。**这是公开仓库，不要把私人内容作为草稿提交到这里**，`published: false` 只是不生成网页，不能隐藏 GitHub 中的源文件。

1. 选好要公开的文章后，放入 `content/posts/英文短名.md`。
2. 添加以下开头，正文使用普通 Markdown：

```markdown
---
title: 你的文章标题
date: 2026-10-27
slug: your-article-slug
summary: 用一两句话介绍这篇文章。
tags: [AI, 产品]
published: true
---

这里写正文。
```

`slug` 只能用小写英文字母、数字和连字符。文章发布后尽量保留 slug，避免链接变化。日期填写实际发布日期。只有 `published: true` 的文章会生成；首页按日期倒序、单列连续展示最新 20 篇文章的全文（上限是 `scripts/templates.mjs` 里的 `site.homeLimit`，更早的文章从侧栏、搜索和 `/writing/` 进入）。文章标题在滚动时吸顶，由下一篇自然接替。左上角按钮展开文章、关于和主题切换侧栏。

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
git add content/posts index.html writing about assets 404.html feed.xml sitemap.xml robots.txt
git commit -m "Publish new writing"
git push origin main
```

GitHub Pages 会自动发布这次提交。修改文章后也需要重新 build。删除文章源文件后重新 build，会同时移除旧文章页面。

## 修改样式和介绍

- `src/assets/style.css`：主题与响应式样式。
- `src/assets/app.js`：主题切换、文章搜索。
- `scripts/templates.mjs`：页面布局、首页与关于页文字。
- `scripts/content.mjs`：文章读取和校验。
- `scripts/build.mjs`：生成页面与 RSS。

改完后运行 `npm.cmd test` 和 `npm.cmd run build`，将源码与生成页面一起提交。不要只改根目录的生成文件，下次构建会覆盖它。

生成器只清理 `writing/`、`about/`、`assets/` 三个输出目录；不要在这些目录保存源稿。

## 阅读界面

侧栏逐篇列出文章，点击进入独立文章页，不使用首页锚点。桌面端记住侧栏的展开状态，手机端默认收起。独立文章页顶部固定标题栏，下拉可切换文章；正文底部可复制文章链接。首页继续显示全文流。
