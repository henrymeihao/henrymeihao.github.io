import test from 'node:test';
import assert from 'node:assert/strict';
import { home, shiftHeadings, site } from '../scripts/templates.mjs';

const make = n => Array.from({length: n}, (_, i) => ({title:`文章${i}`, slug:`post-${i}`, date:'2026-10-27', summary:'摘要', tags:[], html:'<h2>小节</h2><p>正文</p>'}));

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
test('home has a descriptive document title', () => {
  assert.match(home(make(1)), /<title>Meihao · 关于 AI、产品与生活的个人写作<\/title>/);
});
