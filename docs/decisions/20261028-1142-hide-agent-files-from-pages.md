---
time: 2026-10-28T11:42+08:00
kind: revision
paths: [_config.yml, .nojekyll, scripts/build.mjs, AGENTS.md, .agents/skills/ds-spec-loop]
relates: [20261028-1118-adopt-ds-spec-loop]
---

# 去掉 .nojekyll，用 _config.yml 的 exclude 把 skill 和 AGENTS.md 挡在网站之外

## 触发
用户原话："我不想让访问，但是想要把这个skill存在仓库上，帮我处理"。起因是 `.nojekyll` 存在时，Pages 会公开发布根目录下所有文件，包括 `.agents/` 和 `AGENTS.md`，线上访问返回 200。

## 决定
删除 `.nojekyll`，并让 `scripts/build.mjs` 不再生成它。新增 `_config.yml`，用 `exclude` 列出不该上线的文件：`.agents`、`AGENTS.md`、`README.md`、`docs`、`content`、`scripts`、`src`、`tests`、`node_modules` 和两个 package 文件。这些文件仍在仓库里。站点页面本身不变，还是由 `npm run build` 生成的静态文件。

## 放弃的备选
- 把 skill 加进 `.gitignore`：文件不进仓库，目的落空。
- 改用 GitHub Actions 只上传生成文件：最彻底，但要改 Pages 的发布来源设置，改动面比这个问题大得多。
- 把 skill 和 AGENTS.md 挪出根目录：Codex 找不到 `.agents/skills`，仓库指令也不再自动生效。

## 后果
- 站点现在由 Jekyll 构建。`content/posts/*.md` 带有 front matter，必须保留在 `exclude` 里，否则 Jekyll 会把它们当页面渲染。
- 新增不想公开的文件，要先加进 `exclude`。这条已写进 `AGENTS.md`。
- 仓库本身是公开的，skill 在 github.com 上仍然可以读到；这个决定只关闭了 mbr000.github.io 下的访问。
- 如果 Pages 构建失败，线上会停留在上一次成功的版本，此时应回退这次提交。
