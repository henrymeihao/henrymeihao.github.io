# 通用产物模板

优先使用宿主仓库既有的格式。这些是兜底的语义模板，不是强制的文件名、标题、状态或目录。

## 工作提案

```markdown
# Proposal: <决策标题>

Status: proposed

## Problem

<描述用户、维护者、运维者或系统的问题，不预设解决方案。>

## Proposal

<陈述拟定的决策、归属、真实消费者路径，以及迁移方案（如有）。>

## <技术细节（如需要）>

<拓扑、协议、schema、不变量、生命周期或兼容性。>

## Alternatives considered

**<真实的替代方案>。** <在既定约束下它为何落选。>

## Acceptance criteria

- <通过真实消费者路径可观察到的行为或缺失。>
- <失败、清理、持久性、兼容性或反向保证。>
- <当前文档和生成产物与交付的契约一致。>

## Risks

- <可能的失败及对应证据。>
- <有意放弃的能力、灵活性或兼容性。>
```

## 稳定决策

改写提案；不要只是重命名标题。

```markdown
# Decision: <决策标题>

Status: implemented

## Problem

<保持与解决方案无关的动机是最新的。>

## Decision

<用现在时描述仓库现在做什么，使用当前路径和名称。>

## <技术细节（如仍有用）>

<当前拓扑、协议、schema、不变量或兼容性。>

## Alternatives considered

**<替代方案>。** <当前决策为何胜出。>

## Consequences

<这个决策换来了什么、付出了什么、禁止了什么、移除了什么、推迟了什么。>

## Verification

- `<确切命令或运行时路径>` — <实际结果及覆盖的主张>。
- Not run: <检查及缺失条件>（如适用）。
```

## 被否决的提案

```markdown
# Proposal: <决策标题>

Status: rejected — <简要结论>

## Problem
## Proposal
## Alternatives considered
## Acceptance criteria
## Risks
```

只在该结论还能防止一个可能重复的错误时保留。

## 需求差异

```markdown
| 项目 | 之前接受的状态 | 新接受的状态 | 处置 |
|---|---|---|---|
| 结果 / 非目标 | ... | ... | 保留 / 替换 / 撤回 / 新增 |
| 验收 | ... | ... | 保留 / 替换 / 撤回 / 新增 |
| 源码 / 契约 | ... | ... | 保留 / 修订 / 删除 |
| 测试 / 证据 | ... | ... | 保留 / 修订 / 删除 |
| 当前文档 | ... | ... | 保留 / 修订 / 删除 |
| 理由 | ... | ... | 活跃修订 / 稳定替换 |
```

## 交付摘要

```markdown
## Outcome

<现在什么已经成立。>

## Decision ownership

- Owner: `<路径或标识>`
- Lifecycle: `<created proposal | updated proposal | accepted current decision | rejected>`
- Relationship: `<none | replaces | partially replaces | consolidates>`

## Authority surfaces changed

- Source/contracts: <路径>
- Executable evidence: <路径>
- Current docs/generated references: <路径>

## Verification

- `<命令>` — <实际结果>
- Not run: <检查及原因>

## Requirement delta

- <撤回、替换或新授权的需求；无则省略。>

## Remaining work

- <仅真实处于提案或被阻塞状态的工作；无则省略。>
```

## 决策日志条目

每个决策事件一个文件。提交后不再修改；用一条引用它的新条目来回应。

```markdown
---
time: <带时区偏移的 ISO 8601 时间>
card: <任务或卡片号，宿主使用时填写>
kind: decision # decision | revision | reversal | rejection
paths: [<当时的路径或目录>]
supersedes: [<更早的条目>] # 可选；reverts 和 relates 用法相同
---

# <一句话说明决定了什么>

## 触发

<原始证据：用户原话、评审发现、测量或报错。引用原文。>

## 决定

<选了什么，影响到哪。>

## 放弃的备选

<每个备选及其落选原因。没有真实备选就写“无”。>

## 后果

<放弃的能力、已知风险，以及重新评估的条件。>
```
