---
time: 2026-11-10T02:45+08:00
kind: reversal
paths: [scripts/content.mjs, content/posts/, tests/content.test.mjs, tests/templates.test.mjs, README.md, docs/implementation.md]
relates: [20261101-0400-sidebar-category-folders, 20261101-1535-category-labels-and-open-folders]
---

# 文章改为实践、行业、工作、社会、生活、文化六类

## 触发
博客已有 31 篇文章。「职场」同时容纳工程实践、职业选择和工作意义，「项目」不足以涵盖方法经验。用户询问「你觉得分类可以怎么变，我的 这么多文章」，看过六类方案后回复「改」。

## 决定
- 分类顺序为实践、行业、工作、社会、生活、文化，继续使用一层、每篇一个分类。
- 原「项目」改为「实践」，原「职场」改为「工作」；Coding Agent 管理者一文从工作移入实践。
- 《纪念碑谷和我的世界》及两篇《奥德赛》相关文章从生活移入文化。其余文章沿用原归属。
- 按文章主要回答的问题归类；实践包括作品与工程方法，工作包括职业成长和工作意义，文化包括从电影、游戏、阅读出发的思考。
- 本条只替换早先记录中的分类名称、数量及上述文章归属；默认展开、会话记忆、时间排序和现有导航方式继续有效。当前行为归属为 docs/implementation.md 的 Sidebar category folders 一节。

## 放弃的备选
继续保留原五类：无法区分已经出现的实践方法与职业讨论，文化文章仍混在生活经历中。用户采用六类方案；沿用单层分类，避免细类只有一两篇。

## 后果与验证
- 31 篇分布为实践 7、行业 5、工作 8、社会 4、生活 4、文化 3；文章正文、slug 和日期不变。
- 文化目前只有三篇；后续按实际内容增长评估，不预建更细分类。
- 验证使用 npm test、npm run build 和 npm run preview 检查真实侧栏；通过 Git 对比确认文章仅修改 category。
