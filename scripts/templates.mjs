import { escapeHtml as e } from './content.mjs';
import { relatedPosts } from './related.mjs';

export const site = {name:'Meihao', url:'https://mbr000.github.io', description:'关于 AI、产品与生活的个人写作。', homeLimit:20};
const icon = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons = {
  panel: icon('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>'),
  home: icon('<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>'),
  search: icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'),
  about: icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>'),
  down: icon('<path d="m7 10 5 5 5-5"/>'),
  sun: icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'),
  link: icon('<path d="m10 13 4-4m-6 6-2 2a3.5 3.5 0 0 1-5-5l5-5a3.5 3.5 0 0 1 5 0m2 1 2-2a3.5 3.5 0 0 1 5 5l-5 5a3.5 3.5 0 0 1-5 0"/>'),
  close: icon('<path d="m6 6 12 12M6 18 18 6"/>'),
};
const articleLinks = (posts,path) => posts.map(p=>`<a class="article-nav-link" href="/writing/${p.slug}/" ${path===`/writing/${p.slug}/`?'aria-current="page"':''}><span class="article-dot" aria-hidden="true">◦</span><span>${e(p.title)}</span></a>`).join('');

function searchDialog(posts) {
  return `<dialog class="search-dialog" aria-label="搜索文章"><div class="search-dialog-header">${icons.search}<input id="dialog-search" type="search" role="combobox" aria-label="搜索文章" aria-autocomplete="list" aria-expanded="true" aria-controls="search-results" placeholder="搜索文章…" autocomplete="off"><button class="search-close icon-button" type="button" aria-label="关闭搜索">${icons.close}</button></div><div class="search-dialog-body"><p class="search-caption" id="search-caption" role="status">全部文章</p><div id="search-results" role="listbox" aria-label="搜索结果">${posts.map((p,i)=>`<a class="search-result" id="search-result-${i}" role="option" aria-selected="false" href="/writing/${p.slug}/" data-search="${e([p.title,p.summary,...p.tags,p.html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')].join(' ').toLowerCase())}">${icons.about}<span class="result-title">${e(p.title)}</span><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><span class="result-enter" aria-hidden="true">↵</span></a>`).join('')}</div><p class="search-no-results" hidden>没有找到相关文章，试试其他关键词。</p></div></dialog>`;
}

export function page({title,fullTitle,description=site.description,path='/',body,posts=[],articlePage=false}) {
  const docTitle = fullTitle ?? `${title} · ${site.name}`;
  const topTitle = articlePage
    ? `<details class="title-menu"><summary><span>${e(title)}</span>${icons.down}</summary><nav aria-label="切换文章">${articleLinks(posts,path)}</nav></details>`
    : `<span class="page-name">${e(title)}</span>`;
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#ffffff"><title>${e(docTitle)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${site.url}${path}"><meta property="og:type" content="${articlePage?'article':'website'}"><meta property="og:title" content="${e(docTitle)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${site.url}${path}"><meta property="og:locale" content="zh_CN"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="alternate" type="application/rss+xml" title="Meihao 的文章" href="/feed.xml"><script src="/assets/theme.js"></script><link rel="stylesheet" href="/assets/style.css?v=20261028-8"><script defer src="/assets/app.js"></script><script defer src="/assets/reading.js?v=20261028-5"></script></head>
<body class="${articlePage?'article-page':'plain-page'}" data-page="${path}"><a class="skip-link" href="#main">跳到内容</a>
<details class="drawer" open><summary aria-label="打开导航" aria-controls="sidebar">${icons.panel}</summary><div class="drawer-backdrop" aria-hidden="true"></div>
<aside id="sidebar" aria-label="网站导航"><div class="sidebar-head"><a class="wordmark" href="/">Meihao</a><button class="drawer-close icon-button" type="button" aria-label="关闭导航" hidden>${icons.panel}</button></div>
<div class="sidebar-scroll"><nav class="primary-nav" aria-label="主导航"><a href="/" ${path==='/'?'aria-current="page"':''}>${icons.home}<span>阅读全部</span></a><a href="/writing/" data-open-search ${path==='/writing/'?'aria-current="page"':''}>${icons.search}<span>搜索文章</span></a><a href="/about/" ${path==='/about/'?'aria-current="page"':''}>${icons.about}<span>关于</span></a></nav>
<details class="sidebar-articles" open><summary>文章 ${icons.down}</summary><nav aria-label="文章目录">${articleLinks(posts,path)}</nav></details></div>
<div class="sidebar-bottom"><a href="https://github.com/MBR000" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/feed.xml">RSS</a><button class="theme-toggle icon-button" type="button" aria-label="切换深色模式" hidden>${icons.sun}</button></div></aside></details>
<div class="content-frame">${articlePage?`<header class="page-toolbar">${topTitle}</header>`:''}<div class="shell"><main id="main">${body}</main><footer class="footer">© ${new Date().getUTCFullYear()} Meihao</footer></div></div>${searchDialog(posts)}</body></html>`;
}

function related(post, posts) {
  const matches = relatedPosts(post, posts);
  if (!matches.length) return '';
  return `<nav class="related-reading" aria-label="相关阅读"><h2>接着读</h2>${matches.map(p => `<a href="/writing/${p.slug}/"><div class="related-title">${e(p.title)} <span aria-hidden="true">↗</span></div><p class="related-note">${e(p.note)}</p></a>`).join('')}</nav>`;
}
// On the home feed each article title is an <h2>, so headings inside articles move one level down.
export const shiftHeadings = html => html.replace(/<(\/?)h([1-6])(?=[\s>])/g, (_, slash, n) => `<${slash}h${Math.min(6, Number(n) + 1)}`);
function rows(posts) {
  return posts.map(p=>`<article class="flow-article" id="${p.slug}" data-post data-search="${e([p.title,p.summary,...p.tags].join(' ').toLowerCase())}"><div class="flow-stick" aria-hidden="true"><div class="flow-title"><a href="/writing/${p.slug}/" tabindex="-1">${e(p.title)}</a></div></div><h2 class="flow-heading"><a href="/writing/${p.slug}/">${e(p.title)}</a></h2><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><div class="prose">${shiftHeadings(p.html)}</div></article>`).join('');
}
function list(posts,searchable=false) {
  return `<section class="post-list" aria-label="文章列表"><h1 class="sr-only">文章</h1>${searchable?'<label class="search-label" hidden data-search-ui><span class="sr-only">搜索文章</span><input type="search" id="search" placeholder="搜索标题、摘要或标签" autocomplete="off"></label>':''}${posts.length?rows(posts):'<p class="empty-state">文章整理中。</p>'}<p class="search-empty" id="search-empty" role="status" hidden>没有找到相关文章。</p></section>`;
}
export function home(posts) {
  const shown = posts.slice(0, site.homeLimit);
  const more = posts.length > shown.length ? '<p class="more-posts"><a class="read-link" href="/writing/">更早的文章 →</a></p>' : '';
  return page({title:'阅读全部',fullTitle:`${site.name} · ${site.description.replace(/。$/,'')}`,posts,body:list(shown)+more});
}
export function writing(posts) { return page({title:'搜索文章',path:'/writing/',posts,body:`<section class="search-fallback"><h1>文章</h1><button type="button" class="search-launch" data-open-search hidden>${icons.search}搜索文章</button><nav aria-label="全部文章">${articleLinks(posts,'/writing/')}</nav></section>`}); }
export function about(posts=[]) { return page({title:'关于',path:'/about/',posts,body:'<section class="about"><h1>关于</h1><p>我是 Meihao。在这里写 AI、产品，以及生活中的观察。</p><p>文章会陆续更新。</p></section>'}); }
export function article(post,posts=[]) {
  return page({title:post.title,description:post.summary,path:`/writing/${post.slug}/`,articlePage:true,posts,body:`<article class="single-article"><h1 class="article-heading">${e(post.title)}</h1><time class="article-date" datetime="${post.date}">${post.date.replaceAll('-','.')}</time><div class="prose">${post.html}</div><div class="article-actions"><button class="copy-link icon-button" type="button" aria-label="复制文章链接" data-url="${site.url}/writing/${post.slug}/" hidden>${icons.link}</button><span class="copy-status" role="status"></span></div>${related(post,posts)}</article>`});
}
export function notFound(posts=[]) { return page({title:'页面不存在',path:'/404.html',posts,body:'<section class="about"><h1>页面不存在</h1><p>这篇文章可能已被移除。</p><a class="read-link" href="/">← 回到阅读全部</a></section>'}); }
