import test from 'node:test';
import assert from 'node:assert/strict';
import { home, article, about, searchIndex, shiftHeadings, site } from '../scripts/templates.mjs';

const make = n => Array.from({length: n}, (_, i) => ({title:`文章${i}`, slug:`post-${i}`, date:'2026-10-27', category:'工作', summary:'摘要', excerpt:'正文开头节选。', wordCount:1350, minutes:3, tags:[], html:'<h2>小节</h2><p>正文后半部分</p>'}));

test('sidebar groups articles into category folders, all open', () => {
  const posts = make(6);
  const categoryOrder = ['实践', '行业', '工作', '社会', '生活', '文化'];
  posts.forEach((post, i) => { post.category = categoryOrder[i]; });
  const folders = html => [...html.matchAll(/<details class="sidebar-folder" data-category="([^"]+)"( open)?>/g)].map(m => m[1] + (m[2] ? ':open' : ''));
  assert.deepEqual(folders(home(posts)), categoryOrder.map(c => `${c}:open`));
  assert.deepEqual(folders(article(posts[0], posts)), categoryOrder.map(c => `${c}:open`));
});
test('headings inside articles move down one level and stop at h6', () => {
  assert.equal(shiftHeadings('<h1>a</h1><h2 id="x">b</h2><h6>c</h6><p>h2</p>'), '<h2>a</h2><h3 id="x">b</h3><h6>c</h6><p>h2</p>');
});
test('home shows escaped excerpts and full-article links; article pages retain full text', () => {
  const posts = make(2);
  posts[0].excerpt = '节选含 <标签> & 文字。';
  const html = home(posts);
  assert.equal((html.match(/<h2 class="flow-heading">/g) || []).length, 2);
  assert.match(html, /节选含 &lt;标签&gt; &amp; 文字。/);
  assert.doesNotMatch(html, /正文后半部分|<h2>小节/);
  assert.equal((html.match(/>阅读全文 →<\/a>/g) || []).length, 2);
  assert.match(html, /href="\/writing\/post-0\/" aria-label="阅读全文：文章0"/);
  assert.match(article(posts[0], posts), /<h2>小节<\/h2><p>正文后半部分<\/p>/);
  for (const output of [html, article(posts[0], posts)]) {
    assert.match(output, /1,350 字/);
    assert.match(output, /预计阅读 3 分钟/);
  }
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
  assert.match(home(make(1)), /<link rel="apple-touch-icon" href="\/assets\/apple-touch-icon\.png">/);
});
test('analytics scripts and the footer visit count appear only when configured', () => {
  const [post] = make(1);
  const thirdParty = /goatcounter|cloudflareinsights/;
  const saved = {...site.analytics};
  try {
    Object.assign(site.analytics, {goatcounter:'', cloudflareToken:''});
    assert.doesNotMatch(home([post]), thirdParty);
    Object.assign(site.analytics, {goatcounter:'example', cloudflareToken:'abc123'});
    for (const html of [home([post]), article(post, [post])]) {
      assert.match(html, /<footer class="footer">© \d{4} <a href="https:\/\/github\.com\/henrymeihao"[^>]*>Henry Mei<\/a> · All rights reserved<span class="visit-count" data-visit-count="https:\/\/example\.goatcounter\.com\/counter\/TOTAL\.json" hidden><\/span><\/footer>/);
      assert.match(html, /<script data-goatcounter="https:\/\/example\.goatcounter\.com\/count" async src="\/assets\/goatcounter-count\.js\?v=478f026"><\/script>/);
      assert.match(html, /data-cf-beacon="\{&quot;token&quot;:&quot;abc123&quot;\}"/);
    }
  } finally {
    Object.assign(site.analytics, saved);
  }
});
test('about page and article pages carry hidden comment threads, and every sidebar links to the guestbook, only when configured', () => {
  const [post] = make(1);
  const saved = {...site.guestbook};
  try {
    Object.assign(site.guestbook, {url:'https://example.supabase.co', key:'sb_publishable_test'});
    const thread = (html, id, page) => assert.match(html, new RegExp(`<section class="comments" id="${id}" aria-labelledby="${id}-title" data-comments="https://example\\.supabase\\.co" data-comments-key="sb_publishable_test" data-comments-page="${page}" hidden>`));
    thread(about([post]), 'guestbook', '/about/');
    thread(article(post, [post]), 'comments', '/writing/post-0/');
    for(const html of [about([post]),article(post,[post])]){
      assert.match(html, /class="comments-load-status" role="status"/);
      assert.match(html, /class="comments-retry" type="button" hidden>重新加载留言/);
    }
    assert.match(article(post, [post]), /<\/article><section class="comments"/);
    for (const html of [home([post]), article(post, [post]), about([post])]) assert.match(html, /<a href="\/about\/#guestbook">/);
    assert.doesNotMatch(home([post]), /data-comments=/);
    Object.assign(site.guestbook, {url:'', key:''});
    assert.doesNotMatch(about([post]) + article(post, [post]), /data-comments|#guestbook/);
  } finally {
    Object.assign(site.guestbook, saved);
  }
});
test('articles with four or more sections list them under the title; shorter ones do not', () => {
  const [post] = make(1);
  post.toc = [1,2,3,4].map(n => ({id:`section-${n}`, text:`第 ${n} 节 <b>`}));
  const long = article(post, [post]);
  assert.match(long, /<\/div><nav class="toc" aria-labelledby="toc-title"><p id="toc-title">目录<\/p><ol><li><a href="#section-1">第 1 节 &lt;b&gt;<\/a><\/li>/);
  assert.equal((long.match(/<li><a href="#section-/g) || []).length, 4);
  post.toc = post.toc.slice(0, 3);
  assert.doesNotMatch(article(post, [post]), /class="toc"/);
  assert.match(article(post, [post]), /<p class="article-next">喜欢这篇的话，可以用 <a href="\/feed\.xml">RSS<\/a> 订阅新文章/);
});
