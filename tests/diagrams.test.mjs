import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { renderDiagrams, diagramHash } from '../scripts/diagrams.mjs';

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 620.4 300.6"></svg>';
const post = html => ({slug:'a', html});

test('Mermaid blocks become lazy SVG images sized from the viewBox, captioned by the nearest heading', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'diagrams-'));
  const rendered = [];
  const [out] = await renderDiagrams([post('<h3>系统 &amp; 架构</h3><pre><code class="language-mermaid">flowchart TB\n  A[&quot;a&quot;] --&gt; B\n</code></pre><p>正文</p>')], dir, async sources => { rendered.push(...sources); return sources.map(() => svg); });
  const hash = diagramHash('flowchart TB\n  A["a"] --> B\n');
  assert.deepEqual(rendered, ['flowchart TB\n  A["a"] --> B\n']);
  assert.equal(out.html, `<h3>系统 &amp; 架构</h3><figure class="diagram"><img src="/assets/diagrams/${hash}.svg" alt="图表：系统 &amp; 架构" width="620" height="301" loading="lazy" decoding="async"></figure><p>正文</p>`);
  assert.deepEqual(await readdir(dir), [`${hash}.svg`]);
});

test('cached diagrams are not rendered again, and renders no post uses are removed', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'diagrams-'));
  const hash = diagramHash('graph TD\n');
  await writeFile(path.join(dir, `${hash}.svg`), svg);
  await writeFile(path.join(dir, 'stale.svg'), svg);
  const posts = [post('<pre><code class="language-mermaid">graph TD\n</code></pre>'), post('<p>没有图</p>')];
  const out = await renderDiagrams(posts, dir, async () => assert.fail('cached diagram was rendered again'));
  assert.match(out[0].html, /<figure class="diagram"><img src="\/assets\/diagrams\/[0-9a-f]{16}\.svg" alt="图表"/);
  assert.equal(out[1], posts[1]);
  assert.deepEqual(await readdir(dir), [`${hash}.svg`]);
});
