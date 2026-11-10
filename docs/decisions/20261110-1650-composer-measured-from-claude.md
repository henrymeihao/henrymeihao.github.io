---
time: 2026-11-10T16:50+08:00
kind: revision
paths: [src/assets/style.css, scripts/templates.mjs, docs/implementation.md]
relates: [20261110-1620-article-comments-composer]
---

# 输入框尺寸改为实测 Claude 的数值

## 触发
用户说「https://claude.ai/new 你对比一下，现在其实有点问题，比如边距不一致。你要让它更还原一点」，截图圈出发送按钮右侧和下方的间距不一致。

## 决定
在用户已登录的 claude.ai/new 读取输入框的计算样式，照搬：外框 20px 圆角、1px rgba(0,0,0,.12) 描边加 0 4px 20px rgba(0,0,0,.075) 阴影、四边 14px 内距、文字与底栏间距 12px、文字 15px/20px 且上和左各 6px 内距、发送按钮 28px 见方 8px 圆角 #c6613f，贴齐右下内距。原来是上 14 右 14 下 10 左 18 的不等内距和 32px 按钮。

## 放弃的备选
- 只把下内距改成 14px：其余数值仍是估的，和 Claude 并排看还是对不上。

## 后果与验证
- 本地预览实测：文字距框上、左都是 14px，按钮距框右、下都是 14px，按钮 28×28，文字底到按钮顶 12px。深色模式的描边和阴影不是实测值，因为没有读取 Claude 的深色主题。
