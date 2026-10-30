import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFeed, buildSitemap } from '../scripts/feed.mjs';

const site = {name:'Meihao', url:'https://example.test', description:'简介。'};
const post = html => ({title:'标题 & 符号', slug:'a-post', date:'2026-10-27', summary:'摘要', html});

test('feed carries the full article, with absolute links', () => {
  const xml = buildFeed([post('<p>正文 <a href="/writing/b/">另一篇</a></p>')], site);
  assert.match(xml, /<content:encoded><!\[CDATA\[<p>正文 <a href="https:\/\/example\.test\/writing\/b\/">/);
  assert.match(xml, /<title>标题 &amp; 符号<\/title>/);
  assert.match(xml, /<title>Meihao 的文章<\/title>/);
});
test('sitemap dates articles by publish date and the index pages by the newest article', () => {
  const xml = buildSitemap([{slug:'new', date:'2026-10-30'}, {slug:'old', date:'2026-01-02'}], site);
  assert.match(xml, /<loc>https:\/\/example\.test\/<\/loc><lastmod>2026-10-30<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/example\.test\/writing\/old\/<\/loc><lastmod>2026-01-02<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/example\.test\/about\/<\/loc><\/url>/);
});
test('"]]>" in an article cannot end the CDATA section early', () => {
  const xml = buildFeed([post('<p>a ]]> b</p>')], site);
  assert.match(xml, /<content:encoded><!\[CDATA\[<p>a \]\]\]\]><!\[CDATA\[> b<\/p>\]\]><\/content:encoded>/);
});
