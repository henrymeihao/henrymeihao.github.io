import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir, rm, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { escapeHtml as e, plainText } from './content.mjs';

// Mermaid blocks become static SVG files at build time, so readers download no diagram JavaScript.
// Rendered files are kept in src/assets/diagrams/ under a hash of source, settings and Mermaid version;
// a headless browser starts only when a diagram is new or changed.
const require = createRequire(import.meta.url);
const mermaidScript = require.resolve('mermaid/dist/mermaid.min.js');
const mermaidVersion = require('mermaid/package.json').version;
// SVG text labels instead of HTML labels: browsers render SVG files in <img> without foreignObject support issues.
const settings = {startOnLoad:false, securityLevel:'strict', theme:'neutral', htmlLabels:false, flowchart:{htmlLabels:false}};
const block = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
const entities = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"};
const decode = text => text.replace(/&(?:amp|lt|gt|quot|#39);/g, m => entities[m]);
export const diagramHash = source => createHash('sha256').update(JSON.stringify([mermaidVersion, settings, source])).digest('hex').slice(0, 16);

// Replaces each Mermaid block with an <img> of its SVG. render(sources) returns SVG strings for sources missing from dir.
export async function renderDiagrams(posts, dir, render = renderWithBrowser) {
  await mkdir(dir, {recursive:true});
  const cached = new Set(await readdir(dir));
  const sources = new Map();
  for (const post of posts) for (const [, code] of post.html.matchAll(block)) sources.set(diagramHash(decode(code)), decode(code));
  const missing = [...sources].filter(([hash]) => !cached.has(`${hash}.svg`));
  if (missing.length) {
    const svgs = await render(missing.map(([, source]) => source));
    await Promise.all(missing.map(([hash], i) => writeFile(path.join(dir, `${hash}.svg`), svgs[i])));
  }
  // Drop renders that no published diagram uses any more.
  await Promise.all([...cached].filter(name => name.endsWith('.svg') && !sources.has(name.slice(0, -4))).map(name => rm(path.join(dir, name))));
  return Promise.all(posts.map(async post => {
    if (!post.html.includes('<code class="language-mermaid">')) return post;
    const parts = [];
    let last = 0, heading = '';
    for (const match of post.html.matchAll(block)) {
      const before = post.html.slice(last, match.index);
      heading = [...before.matchAll(/<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/g)].map(h => plainText(h[1])).at(-1) ?? heading;
      const hash = diagramHash(decode(match[1]));
      const svg = await readFile(path.join(dir, `${hash}.svg`), 'utf8');
      const [, , width, height] = svg.match(/viewBox="([-\d.]+ ){2}([\d.]+) ([\d.]+)"/) ?? [];
      parts.push(before, `<figure class="diagram"><img src="/assets/diagrams/${hash}.svg" alt="${e(heading ? `图表：${heading}` : '图表')}" width="${Math.round(width)}" height="${Math.round(height)}" loading="lazy" decoding="async"></figure>`);
      last = match.index + match[0].length;
    }
    return {...post, html: parts.join('') + post.html.slice(last)};
  }));
}

async function renderWithBrowser(sources) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch().catch(error => { throw new Error(`Rendering Mermaid diagrams needs Playwright's Chromium: run "npx playwright install chromium".\n${error.message}`); });
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
    await page.addScriptTag({path:mermaidScript});
    return await page.evaluate(async ([settings, sources]) => {
      window.mermaid.initialize(settings);
      const svgs = [];
      for (const [i, source] of sources.entries()) {
        // Give the file a fixed intrinsic size (Mermaid emits width=100%) and serialize it as well-formed XML for <img>.
        const root = new DOMParser().parseFromString((await window.mermaid.render(`diagram-${i}`, source)).svg, 'image/svg+xml').documentElement;
        const [, , width, height] = root.getAttribute('viewBox').split(' ').map(Number);
        root.setAttribute('width', Math.round(width));
        root.setAttribute('height', Math.round(height));
        root.removeAttribute('style');
        svgs.push(new XMLSerializer().serializeToString(root));
      }
      return svgs;
    }, [settings, sources]);
  } finally {
    await browser.close();
  }
}
