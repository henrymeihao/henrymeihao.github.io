---
time: 2026-11-09T17:00+08:00
kind: decision
paths: [scripts/content.mjs, scripts/feed.mjs, tests/content.test.mjs, content/posts/, README.md, docs/implementation.md]
---

# 同一天的文章按可选的发布时间排序，晚发的在前

## 触发
用户看侧栏时说："时间顺序得改一下，现在好像后发的文章，顺序反了。同一天之内的"，又说"你看看是不是自己判断的时候要更精细一点"。2026-11-09 有三篇：凌晨 01:16 的毕业文章、15:04 的科普动画、15:31 的本篇。原排序同日按 slug 字母序，结果是 ai-video、drawing、graduating，与发布先后无关。

## 决定
- frontmatter 增加可选的 time: "HH:MM"，排序改为 date 降序、time 降序、slug。不写 time 按 00:00。
- RSS 的 pubDate 用该时间（UTC+8）。
- 三篇 11-09 文章写入 time，取自各文件首次提交的时间。

## 放弃的备选
- 构建时读 Git 提交时间：旧文章是 10-29 00:47 一次性导入的，提交时间不代表发布先后；浅克隆和 CI 里也读不到。
- 把 date 改成带时间的日期时间：要改全部 30 篇文章的格式和展示，且 YAML 会把带时间的值解析成 Date 对象。
- 只把 slug 改成能排出想要的顺序：slug 是链接，发布后不应变。

## 后果
- 2026-07-06、2026-07-18、2026-10-25 三组同日旧文没有可靠的先后记录，仍按 slug 排。知道真实顺序后给其中的文章补 time 即可。
