---
time: 2026-11-13T19:00+08:00
kind: decision
paths: [scripts/content.mjs, scripts/templates.mjs, scripts/build.mjs, content/posts/drawing-interstellar-in-javascript.md, tests/content.test.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261031-0330-page-level-seo]
---

# 文章可以用自己的分享图

## 触发
准备把《不用生成模型，我用 JavaScript 画了一段〈星际穿越〉》发到 X。检查发现这篇的分享卡片用的是全站封面 `og-cover.png`，看不出是动画。提议换成文章里巨浪那一帧，用户回复「改」。

## 决定
- front matter 新增可选的 `cover: {path, width, height, alt}`，形状和 `site.cover` 一致。不写时仍用全站封面。
- `path` 只接受 `/assets/` 下的 jpg/png（小写字母、数字、连字符），宽高必须是正整数，`alt` 必填；构建在清空生成目录之前检查文件存在于 `src/assets/`。
- 文章页的 `og:image`、宽高、`og:image:alt` 和 JSON-LD `image` 都用这张图。首页、全部文章、关于页不变。
- 《星际穿越》这篇用 `mountains.jpg`（1200×675），复用正文里已有的图和 alt。

## 放弃的备选
- 自动取正文第一张图：这篇第一张是鲸鱼，和标题不对应；自动规则也会让以前的文章悄悄换卡片图。
- 只写路径、构建时读图片尺寸：要解析 JPEG/PNG 头或加依赖；宽高手写四个字就够，`img` 标签里本来也要写。
- 每篇生成分享图：20261031-0330 已因需要构建期渲染依赖而放弃，条件没变。

## 后果
- 手写的宽高和图片实际尺寸不一致时，构建不会发现。
- X 等平台会缓存卡片；已经分享过的链接要等平台重新抓取才会换图。
