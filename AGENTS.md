# 仓库指令

静态个人博客，Node 构建，GitHub Pages 从 `main` 分支根目录发布。发布步骤见 [README.md](./README.md)，设计背景见 [docs/implementation.md](./docs/implementation.md)。

## 每次修改都要遵守

- 只改源文件：`content/posts/`、`src/assets/`、`scripts/`、`tests/`。`index.html`、`writing/`、`about/`、`assets/`、`404.html`、`feed.xml`、`sitemap.xml`、`robots.txt` 由 `npm run build` 生成，不手改。
- 提交前依次运行 `npm test`、`npm run build`，再用 `npm run preview`（http://127.0.0.1:4173）看过页面。源文件和重新生成的文件放进同一个提交。
- 改了 `src/assets/` 里的样式或脚本，同步改 `scripts/templates.mjs` 里对应文件的 `?v=` 版本号，否则读者会在缓存期内（10 分钟）拿到旧文件。
- 推送到 `main` 就是发布到线上，没有预发布环境。
- 这是公开仓库。不提交私人草稿、凭证或内部资料。
- Pages 会公开发布仓库根目录下的所有文件，只有 `_config.yml` 的 `exclude` 列表里的除外（`.agents/`、`AGENTS.md`、源码和文档都在其中）。新增不想在网站上被访问的文件或目录，要先加进这个列表。不要恢复 `.nojekyll`，它会让 `exclude` 失效。

## 非机械变更

改变行为、样式规范、构建或发布流程、测试策略、内容格式，或任何以后可能被重新审视的选择，按 [.agents/skills/ds-spec-loop/SKILL.md](./.agents/skills/ds-spec-loop/SKILL.md) 的流程做。纯机械改动（错别字、格式化、不改行为的重命名）不需要。

skill 里的职责在本仓库对应如下：

| 职责 | 本仓库 |
|---|---|
| 仓库规则 | 本文件 |
| 当前设计与稳定决策 | `docs/implementation.md`，按日期分章，过时内容直接改写 |
| 决策日志（只追加，不改不删） | `docs/decisions/YYYYMMDD-HHMM-slug.md`，格式见 `.agents/skills/ds-spec-loop/references/decision-journal.md`，第一次需要时创建目录 |
| 当前用户文档 | `README.md` |
| 验收证据 | `npm test`、`npm run build`、本地预览 |

动手改某个路径之前，先 `rg -l '<路径>' docs/decisions/`，读相关条目，尤其是 `reversal` 和 `rejection`。
