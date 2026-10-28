---
time: 2026-10-28T11:18+08:00
kind: decision
paths: [AGENTS.md, .agents/skills/ds-spec-loop, docs/decisions]
---

# 在仓库里内置 ds-spec-loop skill，并用 AGENTS.md 接入

## 触发
用户原话："把pc-oreate里面的那个ds-spec-loop的skill给我加进去，目的是帮助这个repo后续的自己的修改"。

## 决定
把 `pc-oreateai/.agents/skills/ds-spec-loop` 的中文版原样复制到 `.agents/skills/ds-spec-loop/`，并附上上游的 MIT LICENSE。新增 `AGENTS.md`，写明生成产物不手改、提交前的检查、缓存版本号规则，以及 skill 各职责在本仓库对应的文件。本仓库没有 ADR 体系，所以当前设计继续放在 `docs/implementation.md`，决策日志放在 `docs/decisions/`。

## 放弃的备选
- 只装到用户目录 `~/.codex/skills`：不随仓库走，换机器或换工具就失效，也不会被仓库指令引用。
- 照搬 pc-oreateai 的整套约定（`docs/decision-log.md`、`card` 字段、团队评审流程）：对单人博客过重，`card` 字段在这里没有意义。
- 删减 skill 正文：会和上游文本分叉，以后同步更新要手工对账。

## 后果
- 仓库开着 `.nojekyll`，`.agents/` 下的文件可能随 Pages 一起被公开访问。skill 本身是 MIT 协议，不含内部信息，所以可以接受。
- 日志规则目前靠约定，没有 hook 强制。
- 上游 skill 更新后需要手动同步。
