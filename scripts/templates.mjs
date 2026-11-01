import { escapeHtml as e, categories } from './content.mjs';
import { relatedPosts } from './related.mjs';

export const site = {name:'Henry Mei', url:'https://henrymeihao.github.io', description:'关于 AI、产品与生活的个人写作。', homeLimit:20, cover:{path:'/assets/og-cover.png', width:1200, height:630, alt:'Henry Mei：关于 AI、产品与生活的个人写作'}};
const aboutDescription = '梅皓（Henry Mei）的个人博客。全栈工程师，在北京开发 C 端 Agent 应用，也写文章：AI 如何改变工作、收入分配与普通人的生活。';
// "<" is escaped so article text can never close the surrounding <script>.
const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`;
const icon = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons = {
  panel: icon('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>'),
  home: icon('<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>'),
  search: icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'),
  about: icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>'),
  down: icon('<path d="m7 10 5 5 5-5"/>'),
  caret: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9.5h10l-5 6z" fill="currentColor"/></svg>',
  sun: icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'),
  link: icon('<path d="m10 13 4-4m-6 6-2 2a3.5 3.5 0 0 1-5-5l5-5a3.5 3.5 0 0 1 5 0m2 1 2-2a3.5 3.5 0 0 1 5 5l-5 5a3.5 3.5 0 0 1-5 0"/>'),
  close: icon('<path d="m6 6 12 12M6 18 18 6"/>'),
};
const articleLinks = (posts,path) => posts.map(p=>`<a class="article-nav-link" href="/writing/${p.slug}/" ${path===`/writing/${p.slug}/`?'aria-current="page"':''}><span class="article-dot" aria-hidden="true">◦</span><span>${e(p.title)}</span></a>`).join('');
// One collapsible folder per category, all open by default.
function articleFolders(posts,path) {
  return categories.map(c=>[c, posts.filter(p=>p.category===c)]).filter(([,items])=>items.length)
    .map(([c,items])=>`<details class="sidebar-folder" data-category="${e(c)}" open><summary>${e(c)}${icons.caret}</summary><nav aria-label="${e(c)}">${articleLinks(items,path)}</nav></details>`).join('');
}

const shortSearchText = p => [p.title,p.summary,...p.tags].join(' ').toLowerCase();
// Full article text lives in /search.json and is fetched when search first opens, so every page does not carry the whole site.
export const searchIndex = posts => JSON.stringify(Object.fromEntries(posts.map(p => [`/writing/${p.slug}/`, [shortSearchText(p), p.html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase()].join(' ')])));
function searchDialog(posts) {
  return `<dialog class="search-dialog" aria-label="搜索文章"><div class="search-dialog-header">${icons.search}<input id="dialog-search" type="search" role="combobox" aria-label="搜索文章" aria-autocomplete="list" aria-expanded="true" aria-controls="search-results" placeholder="搜索文章…" autocomplete="off"><button class="search-close icon-button" type="button" aria-label="关闭搜索">${icons.close}</button></div><div class="search-dialog-body"><p class="search-caption" id="search-caption" role="status">全部文章</p><div id="search-results" role="listbox" aria-label="搜索结果">${posts.map((p,i)=>`<a class="search-result" id="search-result-${i}" role="option" aria-selected="false" href="/writing/${p.slug}/" data-search="${e(shortSearchText(p))}">${icons.about}<span class="result-title">${e(p.title)}</span><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><span class="result-enter" aria-hidden="true">↵</span></a>`).join('')}</div><p class="search-no-results" hidden>没有找到相关文章，试试其他关键词。</p></div></dialog>`;
}

export function page({title,fullTitle,description=site.description,path='/',body,posts=[],articlePage=false,extraHead=''}) {
  const docTitle = fullTitle ?? `${title} · ${site.name}`;
  const topTitle = articlePage
    ? `<details class="title-menu"><summary><span>${e(title)}</span>${icons.down}</summary><nav aria-label="切换文章">${articleLinks(posts,path)}</nav></details>`
    : `<span class="page-name">${e(title)}</span>`;
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#ffffff"><title>${e(docTitle)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${site.url}${path}"><meta property="og:type" content="${articlePage?'article':'website'}"><meta property="og:site_name" content="${e(site.name)}"><meta property="og:title" content="${e(docTitle)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${site.url}${path}"><meta property="og:image" content="${site.url}${site.cover.path}"><meta property="og:image:width" content="${site.cover.width}"><meta property="og:image:height" content="${site.cover.height}"><meta property="og:image:alt" content="${e(site.cover.alt)}"><meta property="og:locale" content="zh_CN"><meta name="twitter:card" content="summary_large_image">${extraHead}<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="alternate" type="application/rss+xml" title="${e(site.name)} 的文章" href="/feed.xml"><script src="/assets/theme.js"></script><link rel="stylesheet" href="/assets/style.css?v=20261101-2"><script defer src="/assets/app.js?v=20261101-2"></script><script defer src="/assets/reading.js?v=20261028-5"></script></head>
<body class="${articlePage?'article-page':'plain-page'}" data-page="${path}"><a class="skip-link" href="#main">跳到内容</a>
<details class="drawer" open><summary aria-label="打开导航" aria-controls="sidebar">${icons.panel}</summary><div class="drawer-backdrop" aria-hidden="true"></div>
<aside id="sidebar" aria-label="网站导航"><div class="sidebar-head"><a class="wordmark" href="/">Henry Mei</a><button class="drawer-close icon-button" type="button" aria-label="关闭导航" hidden>${icons.panel}</button></div>
<div class="sidebar-scroll"><nav class="primary-nav" aria-label="主导航"><a href="/" ${path==='/'?'aria-current="page"':''}>${icons.home}<span>阅读全部</span></a><a href="/writing/" data-open-search ${path==='/writing/'?'aria-current="page"':''}>${icons.search}<span>搜索文章</span></a><a href="/about/" ${path==='/about/'?'aria-current="page"':''}>${icons.about}<span>关于</span></a></nav>
<div class="sidebar-articles">${articleFolders(posts,path)}</div></div>
<div class="sidebar-bottom"><a href="https://github.com/henrymeihao" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/feed.xml">RSS</a><button class="theme-toggle icon-button" type="button" aria-label="切换深色模式" hidden>${icons.sun}</button></div></aside></details>
<div class="content-frame">${articlePage?`<header class="page-toolbar">${topTitle}</header>`:''}<div class="shell"><main id="main">${body}</main><footer class="footer">© ${new Date().getUTCFullYear()} ${e(site.name)}</footer></div></div>${searchDialog(posts)}</body></html>`;
}

function related(post, posts) {
  const matches = relatedPosts(post, posts);
  if (!matches.length) return '';
  return `<nav class="related-reading" aria-label="相关阅读"><h2>接着读</h2>${matches.map(p => `<a href="/writing/${p.slug}/"><div class="related-title">${e(p.title)} <span aria-hidden="true">↗</span></div><p class="related-note">${e(p.note)}</p></a>`).join('')}</nav>`;
}
// On the home feed each article title is an <h2>, so headings inside articles move one level down.
export const shiftHeadings = html => html.replace(/<(\/?)h([1-6])(?=[\s>])/g, (_, slash, n) => `<${slash}h${Math.min(6, Number(n) + 1)}`);
function rows(posts) {
  return posts.map(p=>`<article class="flow-article" id="${p.slug}" data-post data-search="${e(shortSearchText(p))}"><div class="flow-stick" aria-hidden="true"><div class="flow-title"><a href="/writing/${p.slug}/" tabindex="-1">${e(p.title)}</a></div></div><h2 class="flow-heading"><a href="/writing/${p.slug}/">${e(p.title)}</a></h2><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><div class="prose">${shiftHeadings(p.html)}</div></article>`).join('');
}
function list(posts,searchable=false) {
  return `<section class="post-list" aria-label="文章列表"><h1 class="sr-only">文章</h1>${searchable?'<label class="search-label" hidden data-search-ui><span class="sr-only">搜索文章</span><input type="search" id="search" placeholder="搜索标题、摘要或标签" autocomplete="off"></label>':''}${posts.length?rows(posts):'<p class="empty-state">文章整理中。</p>'}<p class="search-empty" id="search-empty" role="status" hidden>没有找到相关文章。</p></section>`;
}
export function home(posts) {
  const shown = posts.slice(0, site.homeLimit);
  const more = posts.length > shown.length ? '<p class="more-posts"><a class="read-link" href="/writing/">更早的文章 →</a></p>' : '';
  return page({title:'阅读全部',fullTitle:`${site.name} · ${site.description.replace(/。$/,'')}`,posts,body:list(shown)+more});
}
export function writing(posts) { return page({title:'全部文章',path:'/writing/',description:`${site.name} 的全部 ${posts.length} 篇文章，关于 AI、产品与生活，可按标题和正文搜索。`,posts,body:`<section class="search-fallback"><h1>文章</h1><button type="button" class="search-launch" data-open-search hidden>${icons.search}搜索文章</button><nav aria-label="全部文章">${articleLinks(posts,'/writing/')}</nav></section>`}); }
export function about(posts=[]) { return page({title:'关于',path:'/about/',description:aboutDescription,posts,body:'<section class="about"><h1>关于</h1><p>我是梅皓（Henry Mei），一名全栈工程师，现在在北京一家互联网大厂开发 C 端 Agent 应用。在此之前，我校招进入阿里巴巴，工作了两年多，负责天猫超市 C 端的前端开发。</p><p>我于 2024 年本科毕业于北京邮电大学计算机科学与技术专业，在校期间，先后在 Momenta 和微软实习。</p><h2>build</h2><p>我喜欢用 AI 把想法做成真正能用的东西，也一直在摸索怎样在开发中把 AI 用得更好。</p><ul><li><a href="https://henrymeihao.github.io/life-simulation-lab/">人生模拟实验室</a>：用 Codex 跑了 23.5 万次模拟，看不同选择在一个小世界里会带来什么。</li><li><a href="https://github.com/henrymeihao/verify-protected-region" target="_blank" rel="noopener noreferrer">verify-protected-region</a>：在使用 AI 编辑图片时，保护重要区域的像素不被重绘。</li></ul><h2>write</h2><p>这里的文章会分享我在工作内外做项目的经历，以及我对 AI 前沿的思考。在技术之外，我也极为关注 AI 对社会的影响：它怎样改变工作，怎样改变收入和分配，又怎样改变普通人的生活方式。这里也写读书、电影，和生活里的反思。</p><ul><li><a href="/writing/ai-junior-delivery-and-growth/">《AI 让新人交付得更快，却不一定成长得更快》</a></li><li><a href="/writing/life-simulation-experiment/">《那些做出另一种选择的我，现在过得怎么样？》</a></li><li><a href="/writing/ai-and-distribution/">《需要适应AI的不是工人，而是旧世界的分配逻辑》</a></li></ul><p>可以在 <a href="https://github.com/henrymeihao" target="_blank" rel="noopener noreferrer">GitHub</a> 和 <a href="https://www.linkedin.com/in/henrymeihao/" target="_blank" rel="noopener noreferrer">LinkedIn</a> 找到我，也欢迎用 <a href="/feed.xml">RSS</a> 订阅更新。</p></section>'}); }
export function article(post,posts=[]) {
  const url = `${site.url}/writing/${post.slug}/`;
  const published = `${post.date}T00:00:00+08:00`;
  const extraHead = `<meta property="article:published_time" content="${published}">${post.tags.map(t=>`<meta property="article:tag" content="${e(t)}">`).join('')}${jsonLd({'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.summary,datePublished:published,inLanguage:'zh-CN',url,mainEntityOfPage:url,image:`${site.url}${site.cover.path}`,author:{'@type':'Person',name:site.name,url:`${site.url}/about/`},publisher:{'@type':'Person',name:site.name,url:`${site.url}/`},...(post.tags.length?{keywords:post.tags.join(', ')}:{})})}`;
  return page({title:post.title,description:post.summary,path:`/writing/${post.slug}/`,articlePage:true,posts,extraHead,body:`<article class="single-article"><h1 class="article-heading">${e(post.title)}</h1><time class="article-date" datetime="${post.date}">${post.date.replaceAll('-','.')}</time><div class="prose">${post.html}</div><div class="article-actions"><button class="copy-link icon-button" type="button" aria-label="复制文章链接" data-url="${url}" hidden>${icons.link}</button><span class="copy-status" role="status"></span></div>${related(post,posts)}</article>`});
}
export function notFound(posts=[]) { return page({title:'页面不存在',path:'/404.html',posts,body:'<section class="about"><h1>页面不存在</h1><p>这篇文章可能已被移除。</p><a class="read-link" href="/">← 回到阅读全部</a></section>'}); }
