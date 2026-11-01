import test from 'node:test';
import assert from 'node:assert/strict';
import { home, article, searchIndex, shiftHeadings, site } from '../scripts/templates.mjs';

const make = n => Array.from({length: n}, (_, i) => ({title:`文章${i}`, slug:`post-${i}`, date:'2026-10-27', category:'工作', summary:'摘要', tags:[], html:'<h2>小节</h2><p>正文</p>'}));

test('sidebar groups articles into category folders and opens only the current one', () => {
  const posts = make(3);
  posts[0].category = '生活';
  const folders = html => [...html.matchAll(/<details class="sidebar-folder" data-category="([^"]+)"( open)?>/g)].map(m => m[1] + (m[2] ? ':open' : ''));
  assert.deepEqual(folders(home(posts)), ['工作', '生活']);
  assert.deepEqual(folders(article(posts[0], posts)), ['工作', '生活:open']);
});
test('headings inside articles move down one level and stop at h6', () => {
  assert.equal(shiftHeadings('<h1>a</h1><h2 id="x">b</h2><h6>c</h6><p>h2</p>'), '<h2>a</h2><h3 id="x">b</h3><h6>c</h6><p>h2</p>');
});
test('home feed: article titles are the only h2, in-article headings are h3', () => {
  const html = home(make(2));
  assert.equal((html.match(/<h2 class="flow-heading">/g) || []).length, 2);
  assert.equal((html.match(/<h3>小节<\/h3>/g) || []).length, 2);
  assert.doesNotMatch(html, /<h2>小节/);
});
test('home feed shows at most homeLimit articles and links to the rest', () => {
  const many = home(make(site.homeLimit + 3));
  assert.equal((many.match(/<article class="flow-article"/g) || []).length, site.homeLimit);
  assert.match(many, /更早的文章/);
  const few = home(make(3));
  assert.equal((few.match(/<article class="flow-article"/g) || []).length, 3);
  assert.doesNotMatch(few, /更早的文章/);
});
test('article body text is in search.json, not in every page', () => {
  const posts = make(2);
  posts[1].html = '<p>只在第二篇正文里的词</p>';
  assert.doesNotMatch(article(posts[0], posts), /只在第二篇正文里的词/);
  assert.match(JSON.parse(searchIndex(posts))['/writing/post-1/'], /只在第二篇正文里的词/);
});
test('article pages carry share image and BlogPosting data that cannot break out of the script', () => {
  const [post] = make(1);
  post.title = '</script><b>标题';
  const html = article(post, [post]);
  assert.match(html, /<meta property="og:image" content="https:\/\/henrymeihao\.github\.io\/assets\/og-cover\.png">/);
  assert.match(html, /<meta property="article:published_time" content="2026-10-27T00:00:00\+08:00">/);
  const ld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1];
  assert.doesNotMatch(ld, /</);
  const data = JSON.parse(ld);
  assert.equal(data['@type'], 'BlogPosting');
  assert.equal(data.headline, '</script><b>标题');
  assert.equal(data.datePublished, '2026-10-27T00:00:00+08:00');
});
test('home has a descriptive document title', () => {
  assert.match(home(make(1)), /<title>Henry Mei · 关于 AI、产品与生活的个人写作<\/title>/);
});
