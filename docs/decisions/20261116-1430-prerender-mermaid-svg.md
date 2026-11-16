---
time: 2026-11-16T14:30+08:00
kind: revision
paths: [scripts/diagrams.mjs, scripts/build.mjs, scripts/templates.mjs, scripts/mermaid-browser.mjs, src/assets/diagrams/, src/assets/style.css, tests/diagrams.test.mjs, package.json, README.md, docs/implementation.md]
relates: [20261116-0025-mermaid-original-article]
---

# Mermaid 图表改为构建时渲染成 SVG

## 触发
优化建议里写到 Mermaid 脚本 5.4 MB（压缩后约 1.5 MB），手机网络下含图文章明显变慢。用户选了「最佳方案：构建时生成 SVG」，原话：「把这个做了然后提交上去」。

## 决定
- 构建时用 Playwright 的无头 Chromium 加载本地 `mermaid/dist/mermaid.min.js` 渲染每张图，存为 `src/assets/diagrams/<hash>.svg`。哈希包含 Mermaid 版本、渲染设置和图表源码。只渲染缺失的哈希，不再使用的文件会被删除。
- 文章里的 Mermaid 代码块换成 `<figure class="diagram"><img loading="lazy">`，宽高取自 viewBox，alt 用最近的标题。删除 `scripts/mermaid-browser.mjs`、`assets/mermaid.js` 和 esbuild 依赖。
- 标签改用 SVG 文字（`htmlLabels:false`），避免 `<img>` 里的 foreignObject 在部分浏览器不显示。深色模式下给图片加浅色底，主题仍是 neutral。
- 渲染结果提交进仓库：日常构建不需要浏览器，只有新增或修改图表时才需要 Chromium。

## 放弃的备选
- @mermaid-js/mermaid-cli：每次 `npm ci` 都会通过 puppeteer 下载一份 Chrome；Playwright 不会自动下载，本机已有对应的 Chromium。
- 内联 SVG：同一页多张图的 id 和样式要另外去重，文章 HTML 也会变大；单独的 SVG 文件可以懒加载和缓存。
- 只在图表滚动到可视区域时再加载脚本：仍要下载 1.5 MB，只是推迟了。
- 每次构建都重新渲染：每次都要启动浏览器，构建变慢，没有必要。

## 后果与验证
- SVG 里的文字宽度是在构建机的 Chromium 里测量的。读者的字体不同时，个别标签可能略超出方框；在本机渲染结果中，两张图共 22 个节点没有文字超出方框。
- 图表源码不再进入搜索索引和 RSS 正文，RSS 里改为图片。
- 新电脑第一次渲染新图前要运行 `npx playwright install chromium`，否则构建报错并给出这条命令。
- npm test 覆盖代码块替换、实体解码、尺寸和 alt、缓存命中不重复渲染、清理无用文件。本地预览确认文章页不加载 Mermaid 脚本，两张图都能显示，390px 宽度不横向溢出，深色模式有浅色底。两张 SVG 分别为 37 KB 和 21 KB。
