import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePost, collectPosts, autoSummary } from '../scripts/content.mjs';

const post = (meta = '', body = '正文。') => `---\ntitle: 测试文章\ndate: 2026-10-27\nslug: test-post\ncategory: 工作\nsummary: 一篇文章。\npublished: true\n${meta}---\n${body}`;

test('only explicitly published posts are eligible', () => {
  assert.equal(parsePost('私人草稿', 'private.md'), null);
  assert.equal(parsePost(post().replace('published: true', 'published: false'), 'draft.md'), null);
  assert.equal(parsePost(post().replace('published: true', 'published: "true"'), 'draft.md'), null);
});
test('posts on the same day are ordered by time, newest first, then by slug', () => {
  const p = (slug, time) => ({name:slug+'.md', text:post(time ? 'time: ' + time + '\n' : '').replace('test-post', slug)});
  const order = collectPosts([p('a-first', '09:00'), p('b-late', '15:31'), p('c-untimed'), p('d-late', '15:31')]).map(x => x.slug);
  assert.deepEqual(order, ['b-late', 'd-late', 'a-first', 'c-untimed']);
  assert.throws(() => parsePost(post('time: 25:00\n'), 'bad.md'), /time/);
});
test('rejects traversal and invalid dates before generating paths', () => {
  assert.throws(() => parsePost(post().replace('test-post', '../private'), 'bad.md'), /slug/);
  assert.throws(() => parsePost(post().replace('2026-10-27', '2026-02-30'), 'bad.md'), /date/);
  assert.throws(() => parsePost(post().replace('category: 工作\n', ''), 'bad.md'), /category/);
  assert.throws(() => parsePost(post().replace('category: 工作', 'category: 杂谈'), 'bad.md'), /category/);
});
test('renders Markdown and strips executable HTML', () => {
  const result = parsePost(post('', '# 标题\n\n**加粗**\n\n<script>alert(1)</script>\n\n[危险](javascript:alert%281%29)'), 'good.md');
  assert.match(result.html, /<strong>加粗<\/strong>/);
  assert.doesNotMatch(result.html, /<script|href="javascript:/);
  assert.equal(result.date, '2026-10-27');
});
test('posts without a summary get a one-line description that ends at a sentence', () => {
  const kept = '第一句话写得比较长，用来凑够长度。'.repeat(3);
  const body = `${kept}这一句超出上限会被截掉${'后面的内容'.repeat(16)}。\n\n第二段。`;
  const result = parsePost(post('', body).replace('summary: 一篇文章。\n', ''), 'auto.md');
  assert.equal(result.summary, kept);
  assert.equal(autoSummary('A &amp; B\n\nC'), 'A & B C');
  const noStop = autoSummary('没有句号'.repeat(40));
  assert.equal(noStop.length, 120);
  assert.match(noStop, /…$/);
});
test('duplicate slugs cannot silently overwrite an article', () => {
  assert.throws(() => collectPosts([{name:'a.md', text:post()}, {name:'b.md', text:post()}]), /Duplicate/);
});

test('reading size counts visible Chinese characters and Latin words, excluding markup and punctuation', () => {
  const result = parsePost(post('', '**你好** AI agent 2026。\n\n[链接](https://example.com/long-url) &amp; ![图片](https://example.com/photo.jpg)'), 'mixed.md');
  assert.equal(result.wordCount, 7);
  assert.equal(result.minutes, 1);
  assert.equal(result.excerpt, '你好 AI agent 2026。 链接 &');
  const long = parsePost(post('', '字'.repeat(901)), 'long.md');
  assert.equal(long.wordCount, 901);
  assert.equal(long.minutes, 3);
  assert.equal(long.excerpt.length, 260);
  assert.match(long.excerpt, /…$/);
  const media = parsePost(post('', '## 开篇\n\n这是图片之前的正文。\n\n![封面](https://example.com/photo.jpg)\n\n点击图片播放。\n\n## 下一节\n\n后续正文。'), 'media.md');
  assert.equal(media.excerpt, '这是图片之前的正文。');
});
