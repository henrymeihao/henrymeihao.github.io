---
time: 2026-11-10T17:20+08:00
kind: decision
paths: [src/assets/apple-touch-icon.png, scripts/templates.mjs, tests/templates.test.mjs, docs/implementation.md]
relates: [20261031-0330-page-level-seo]
---

# 加 iPhone 主屏图标

## 触发
升级建议第 5 项「手机主屏图标」，用户回复「5可以做」。

## 决定
每个页面加 `<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">`。图标是现有 favicon.svg 的图形，去掉圆角铺满 180×180，不透明 PNG，在浏览器里按 2 倍渲染后缩小。

## 放弃的备选
- 直接用带圆角的 favicon：iOS 会再套一层圆角，透明角会变成黑边。
- 加 web app manifest：博客不需要离线或安装成应用，只为一个图标不值得多一个文件。

## 后果与验证
- 改了 favicon.svg 的图形后，要重新生成这张 PNG。
- npm test 检查页面带图标链接；构建产物里的文件为 180×180 PNG。
