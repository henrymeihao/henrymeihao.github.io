---
time: 2026-11-13T01:54+08:00
kind: reversal
paths: [src/assets/app.js, src/assets/style.css, scripts/templates.mjs, tests/comments.test.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261110-1600-supabase-guestbook, 20261110-1620-article-comments-composer]
---

# 留言请求失败时保留入口，提供错误提示和手动重试

## 触发
用户报告「留言功能好像出问题了，点不开」。旧代码仅在 Supabase GET 成功后取消整个区块的 hidden，失败则静默忽略，网络慢或不可达会让 #comments / #guestbook 链接没有可见目的地。读取服务的直接 HTTP 检查返回 200，但不能据此确定用户浏览器当时的失败原因。

## 决定
- JavaScript 初始化即显示留言区并处理锚点定位，加载不再决定区块的可见性。没有 JavaScript 时仍隐藏不可工作的表单。
- GET 失败显示网络提示及手动重试；成功后替换列表，只有成功返回空列表才显示暂无留言。
- 读写请求均设 12 秒超时；发送失败保留草稿并恢复发送按钮，不自动重发。
- 复用现有服务、权限及数据库，不迁移存储、不发布测试留言。

## 放弃的备选
- 继续失败时隐藏区块：读者无法区分没有留言功能与服务暂时不可达。
- 自动重试发送：网络错误不能证明服务端没有写入，可能重复留言。

## 后果与验证
- Supabase 不可达时仍无法读取或发送，但入口和错误可见。
- 回归测试执行实际 app.js 留言区块，覆盖请求未完成、网络/HTTP/超时失败、重试恢复与发送失败保留草稿；模板测试检查两种页面的重试控件。npm test 与 npm run build 验证装配和生成页面。
- 浏览器自动化连续超时，未完成真实浏览器点击和真实发帖验证；本地预览 HTTP、静态产物和模拟 DOM 回归不替代该证据。
