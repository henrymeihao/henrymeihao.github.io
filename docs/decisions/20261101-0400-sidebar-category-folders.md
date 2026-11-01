---
time: 2026-11-01T04:00+08:00
kind: decision
paths: [scripts/content.mjs, scripts/templates.mjs, src/assets/style.css, src/assets/app.js, content/posts/, tests/content.test.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
supersedes: []
relates: [20261028-1230-large-title-with-collapsing-bar]
---

# 侧栏「文章」拆成五个分类文件夹

## 触发
用户指着侧栏「文章 ⌄」说："我觉得其实就这里，分类分几个就好了，重点是这个怎么分比较好"，并附了 Codex 侧栏文件夹的截图。确认五个分类后用户回复："可以。然后ui你参考一下"，附图标出「Pinned ▾」「Chats and tasks ▾」两个分组标题，并注明右侧筛选按钮"不要"。

## 决定
- front matter 新增必填字段 `category`，取值限定为 项目、AI 行业、工作、社会、生活，顺序即侧栏顺序。按"读者为什么点进来"划分，不按文章是否提到 AI 划分。
- 侧栏每个分类一个原生 `<details>` 文件夹，标题是 13px 文字加实心小三角，不加右侧按钮。首页、关于页、搜索页全部收起；文章页只展开所在文件夹。
- 读者展开的文件夹在本次浏览会话内保留（sessionStorage），让已有的侧栏滚动位置恢复仍然落在同一行。
- 26 篇现有文章的归类：《拒绝 PUA》归社会（核心是批评优绩主义）；《如果今天高考》归工作（讲职业选择，教育只有这一篇）；《伊萨卡》与《奥德赛》影评都归生活。

## 放弃的备选
- 七个大类加细类（用 AI 做东西、AI 行业与产品、AI 与工作、AI 与分配、社会观察、生活与自我、电影）：用户认为侧栏只需要分几个，细类下多数只有一两篇，侧栏显得零碎。
- 用 `tags` 分组：现有 `tags` 大多为空、且一篇可有多个，不能保证每篇恰好出现在一个文件夹。
- 所有文件夹默认展开：26 篇全部展开时和原来的长列表差别不大，分类起不到导航作用。

## 后果
- 新文章不写 `category` 会构建失败。
- 增减分类要改 `scripts/content.mjs` 的 `categories` 并重新归类相关文章。
- 文章工具栏里的文章切换器仍按时间列出全部文章，没有分组。
- 某个分类文章数增长到侧栏难以浏览时，再考虑细分。
