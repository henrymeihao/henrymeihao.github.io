import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePost, collectPosts } from '../scripts/content.mjs';

const post = (meta = '', body = '正文。') => `---\ntitle: 测试文章\ndate: 2026-10-27\nslug: test-post\nsummary: 一篇文章。\npublished: true\n${meta}---\n${body}`;

test('only explicitly published posts are eligible', () => {
  assert.equal(parsePost('私人草稿', 'private.md'), null);
  assert.equal(parsePost(post().replace('published: true', 'published: false'), 'draft.md'), null);
  assert.equal(parsePost(post().replace('published: true', 'published: "true"'), 'draft.md'), null);
});
test('rejects traversal and invalid dates before generating paths', () => {
  assert.throws(() => parsePost(post().replace('test-post', '../private'), 'bad.md'), /slug/);
  assert.throws(() => parsePost(post().replace('2026-10-27', '2026-02-30'), 'bad.md'), /date/);
});
test('renders Markdown and strips executable HTML', () => {
  const result = parsePost(post('', '# 标题\n\n**加粗**\n\n<script>alert(1)</script>\n\n[危险](javascript:alert%281%29)'), 'good.md');
  assert.match(result.html, /<strong>加粗<\/strong>/);
  assert.doesNotMatch(result.html, /<script|href="javascript:/);
  assert.equal(result.date, '2026-10-27');
});
test('duplicate slugs cannot silently overwrite an article', () => {
  assert.throws(() => collectPosts([{name:'a.md', text:post()}, {name:'b.md', text:post()}]), /Duplicate/);
});
