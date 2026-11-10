---
time: 2026-11-10T11:58+08:00
kind: reversal
paths: [scripts/templates.mjs, src/assets/app.js, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: []
---

# 接入 GoatCounter 与 Cloudflare Web Analytics，脚注显示全站访问次数

## 触发
用户说「用GoatCounter吧，只记载全站的次数，展示在脚注里。用GoatCounter 加 Cloudflare」。此前 README 和 docs/implementation.md 写明站点无追踪脚本，本条推翻这一约定。

## 决定
- 每个页面加载 GoatCounter 计数脚本和 Cloudflare Web Analytics 脚本。站点代码与 token 放在 `site.analytics`，留空即不加载对应服务。
- 脚注在版权后显示 GoatCounter 的全站总数（TOTAL），由 app.js 读取公开计数接口；读取失败或为零时不显示，不放占位文字。
- 只展示全站总数，不在页面上显示单篇文章的访问数。

## 放弃的备选
- 用 Supabase 自建访问记录表：要维护数据库函数和防刷，也没有来源、地区等报表。
- GoatCounter 官方 visit_count 组件：渲染成带边框和品牌文字的小卡片，与一行纯文字的脚注不搭。
- 只用 Cloudflare：没有公开计数接口，脚注无法显示数字。
- 百度统计、Google Analytics：前者收集的数据更多、后台广告多；后者在中国大陆无法加载。

## 后果与验证
- 页面开始向 gc.zgo.at、goatcounter.com 和 static.cloudflareinsights.com 发请求。广告拦截或网络不通时统计会漏记，脚注只显示版权。两家服务器都在海外，国内读者可能漏记较多。
- GoatCounter 总数最多缓存 4 小时，且要在 GoatCounter 设置里开启 “Allow adding visitor counts on your website”。
- npm test 检查留空时页面没有第三方脚本，填写后首页与文章页都带两个脚本和脚注计数节点。本地预览确认脚注能显示真实 GoatCounter 计数接口返回的数字，接口不可达时脚注只剩版权。
