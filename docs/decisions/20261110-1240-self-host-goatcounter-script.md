---
time: 2026-11-10T12:40+08:00
kind: revision
paths: [scripts/templates.mjs, src/assets/goatcounter-count.js, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261110-1158-goatcounter-cloudflare-analytics]
---

# GoatCounter 计数脚本改为本站托管

## 触发
本地预览时 `window.goatcounter` 一直不存在。在同一台电脑上测试，`curl https://gc.zgo.at/count.js` 20 秒超时；`https://henrymeihao.goatcounter.com` 正常响应，Cloudflare 的 beacon.min.js 0.8 秒返回 200。

## 决定
把 GoatCounter 仓库 `public/count.js` 在 commit 478f026eb9deacb9378a46b96db72e11e9f20557 时的版本原样复制到 `src/assets/goatcounter-count.js`（ISC 许可，文件头保留），页面改为加载 `/assets/goatcounter-count.js?v=478f026`。计数请求仍发往 `henrymeihao.goatcounter.com/count`。

## 放弃的备选
- 继续用 gc.zgo.at：国内读者打不开，等于大部分访问不计数。
- 换用 jsDelivr 等 CDN 镜像：仍是第三方地址，国内可用性同样没有保证。

## 后果与验证
- 官方脚本更新不会自动同步，需要手动重新复制。
- 读者仍需能访问 goatcounter.com 才会被计数，这一点没有改变。
- npm test 检查脚本地址；本地预览确认脚本加载后 `window.goatcounter` 存在。
