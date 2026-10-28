import { readdir, readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { collectPosts, escapeHtml as e } from './content.mjs';
import { home, writing, about, article, notFound, site } from './templates.mjs';
import { buildFeed } from './feed.mjs';

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
await writeFile(path.join(root,'feed.xml'),buildFeed(posts,site));
const urls = ['/', '/writing/', '/about/', ...posts.map(p=>`/writing/${p.slug}/`)];
await writeFile(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p=>`<url><loc>${site.url}${p}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${posts.length} published articles + home, writing, about, 404 and RSS.`);
