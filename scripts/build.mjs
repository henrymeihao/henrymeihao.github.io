import { readdir, readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { collectPosts, escapeHtml as e } from './content.mjs';
import { home, writing, about, article, notFound, site } from './templates.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const contentPath = path.join(root,'content/posts');
await mkdir(contentPath,{recursive:true});
const names = (await readdir(contentPath)).filter(n=>n.endsWith('.md'));
const files = await Promise.all(names.map(async name=>({name,text:await readFile(path.join(contentPath,name),'utf8')})));
const posts = collectPosts(files);
// Only these generated directories are removed, after validating all article metadata.
for (const name of ['writing','about','assets']) {
  const target = path.resolve(root,name);
  if (path.dirname(target)!==path.resolve(root)) throw new Error('Unsafe output path');
  await rm(target,{recursive:true,force:true});
  await mkdir(target,{recursive:true});
}
await cp(path.join(root,'src/assets'),path.join(root,'assets'),{recursive:true});
await writeFile(path.join(root,'index.html'),home(posts));
await writeFile(path.join(root,'writing/index.html'),writing(posts));
await writeFile(path.join(root,'about/index.html'),about(posts));
await writeFile(path.join(root,'404.html'),notFound(posts));
for (const post of posts) {
  const folder = path.join(root,'writing',post.slug);
  await mkdir(folder,{recursive:true});
  await writeFile(path.join(folder,'index.html'),article(post,posts));
}
const rssItems = posts.map(p=>`<item><title>${e(p.title)}</title><link>${site.url}/writing/${p.slug}/</link><guid>${site.url}/writing/${p.slug}/</guid><pubDate>${new Date(p.date+'T00:00:00+08:00').toUTCString()}</pubDate><description>${e(p.summary)}</description></item>`).join('');
await writeFile(path.join(root,'feed.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>MEIHAO 的文章</title><link>${site.url}/</link><description>${e(site.description)}</description><language>zh-CN</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${rssItems}</channel></rss>`);
const urls = ['/', '/writing/', '/about/', ...posts.map(p=>`/writing/${p.slug}/`)];
await writeFile(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p=>`<url><loc>${site.url}${p}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${posts.length} published articles + home, writing, about, 404 and RSS.`);
